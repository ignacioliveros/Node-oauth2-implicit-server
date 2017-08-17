import { IIdToken } from '../../entities/token.entity';
import { IUser } from '../../entities/user.entity';
import { IClientRepository } from '../../repository/client.repostory';
import { IUserRepository } from '../../repository/user.repository';

export class EndSessionProcess {

    constructor(private clientRepository: IClientRepository, private userRepository: IUserRepository) {

    }

    public async checkBeforeLogout(idToken: IIdToken, redirecUri: string): Promise<IUser> {
        const client = await this.clientRepository.getClientByClienId(idToken.aud);
        if (client.postLogoutRedirectUris.some((x) => x === redirecUri)) {
            return await this.userRepository.getUserBySubjectId(idToken.sub);
        }
    }
}
