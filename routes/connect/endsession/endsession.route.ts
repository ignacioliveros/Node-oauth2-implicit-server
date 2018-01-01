import { NextFunction, Request, Response, Router } from 'express';

import { EndSessionProcess } from '../../../authentication/endSession-process/endSession.Processor';
import { ClientRepository, IClientRepository } from '../../../repository/client.repostory';
import { IUserRepository, UserRepository } from '../../../repository/user.repository';

export class EndSessionRoute {

    private userRepository: IUserRepository;
    private clientRepository: IClientRepository;
    private endUSerProcess: EndSessionProcess;
    private redirecUri: string;

    constructor(private endsessionRouter: Router) {
        this.routesSet();
        this.userRepository = new UserRepository();
        this.clientRepository = new ClientRepository();
        this.endUSerProcess = new EndSessionProcess(this.clientRepository, this.userRepository);
    }

    public routesSet() {
        this.endsessionRouter.route('/')
            .get((req: Request, res: Response) => {
                if (req.isAuthenticated()) {
                    this.redirecUri = req.query.post_logout_redirect_uri;
                    if (req.query.id_token_hint) {
                        this.endUSerProcess.checkBeforeLogout(req.query.id_token_hint, this.redirecUri)
                            .then((client) => {
                                if (client) {
                                    req.logout();
                                    res.redirect('/logout' + '?' + 'post_logout_redirect_uri=' + this.redirecUri);
                                } else {
                                    req.logout();
                                    res.redirect('/logout' + '?' + 'wrong= wrong post_logout_redirect_uri');
                                }
                            }).catch((err) => {
                                res.status(400).json(err);
                            });
                    } else {
                        res.status(400).json({ message: 'no id_token_hint' });
                    }
                } else if (req.query.id_token_hint) {
                    this.redirecUri = req.query.post_logout_redirect_uri;
                    res.redirect('/logout' + '?' + 'post_logout_redirect_uri=' + this.redirecUri);
                } else {
                    res.status(400).json({ message: 'no loged in' });
                }
            });
    }
}
