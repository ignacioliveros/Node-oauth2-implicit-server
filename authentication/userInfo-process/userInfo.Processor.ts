import { IInfoUser } from '../../entities/userInfo.entity';
import { IClientRepository } from '../../repository/client.repostory';
import { IUserRepository } from '../../repository/user.repository';
import { TokenProcesor } from '../../share/token/token.processor';

export class UserInfoProcess {

    private tokenProcessor = new TokenProcesor();
    private userInfo: IInfoUser = {};

    constructor(private clientRepository: IClientRepository, private userRepository: IUserRepository) {

    }

    public async UserInfoRequestProcessor(bearer: string): Promise<IInfoUser> {
        const accessToken = await this.tokenProcessor.bearerTokenDecoder(bearer);
        const client = await this.clientRepository.getClientByClienId(accessToken.client_id);
        const user = await this.userRepository.getUserBySubjectId(accessToken.sub);
        const array = accessToken.scope.split(',');
        this.userInfo.username = user.preferred_username;
        this.userInfo.sub = user.subjectId;

        for (const item of array) {
            const claim = user.claims.find((x) => x.type === item);
            if (claim) {
                this.userInfo[item] = claim.value;
            }
        }
        return this.userInfo;
    }
}
