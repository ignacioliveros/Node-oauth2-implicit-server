import { IIdToken } from '../../entities/token.entity';
import { IUser } from '../../entities/user.entity';
import { IClientRepository } from '../../repository/client.repostory';
import { IUserRepository } from '../../repository/user.repository';
import { TokenProcesor } from '../../share/token/token.processor';

export class EndSessionProcess {

    private tokenProcessor = new TokenProcesor();

    constructor(private clientRepository: IClientRepository, private userRepository: IUserRepository) {

    }

    public async checkBeforeLogout(idToken: string, redirecUri: string): Promise<IUser> {
        const idTokeDecode = await this.tokenProcessor.idTokenHintDecoder(idToken);
        const client = await this.clientRepository.getClientByClienId(idTokeDecode.aud);
        if (client.postLogoutRedirectUris.some((x) => x === redirecUri)) {
            return await this.userRepository.getUserBySubjectId(idTokeDecode.sub);
        }
    }
}
