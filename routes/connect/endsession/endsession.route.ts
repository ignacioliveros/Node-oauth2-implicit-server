import { NextFunction, Request, Response, Router } from 'express';
import { IIdToken } from '../../../entities/token.entity';
import { IUser } from '../../../entities/user.entity';
import { ClientRepository, IClientRepository } from '../../../repository/client.repostory';
import { IUserRepository, UserRepository } from '../../../repository/user.repository';
import { TokenProcesor } from '../../../share/token/token.processor';

export class EndSessionRoute {

    private tokenProcessor = new TokenProcesor();
    private userRepository: IUserRepository;
    private clientRepository: IClientRepository;
    private redirecUri: string;

    constructor(private endsessionRouter: Router) {
        this.routesSet();
        this.userRepository = new UserRepository();
        this.clientRepository = new ClientRepository();
    }
    public routesSet() {
        this.endsessionRouter.route('/')
            .get((req: Request, res: Response) => {
                if (req.isAuthenticated()) {
                    if (req.query.id_token_hint) {
                        const idToken = this.tokenProcessor.idTokenHintDecoder(req.query.id_token_hint);
                        this.redirecUri = req.query.post_logout_redirect_uri;
                        this.checkBeforeLogout(idToken, this.redirecUri)
                            .then((client) => {
                                if (client) {
                                    req.logout();
                                    res.redirect('/logout' + '?' + 'post_logout_redirect_uri=' + this.redirecUri);
                                } else {
                                    req.logout();
                                    res.redirect('/logout' + '?' + 'wrong= wrong post_logout_redirect_uri');
                                }
                            });
                    } else {
                        res.status(400).json({ message: 'no id_token_hint' });
                    }
                } else if (req.query.id_token_hint) {
                    res.redirect('/logout' + '?' + 'post_logout_redirect_uri=' + this.redirecUri);
                } else {
                    res.status(400).json({ message: 'no loged in' });
                }
            });
    }

   private async checkBeforeLogout(idToken: IIdToken, redirecUri: string): Promise<IUser> {
       const client = await this.clientRepository.getClientByClienId(idToken.aud);
       if (client.postLogoutRedirectUris.some((x) => x === redirecUri)) {
           return await this.userRepository.getUserBySubjectId(idToken.sub);
       }
    }
}
