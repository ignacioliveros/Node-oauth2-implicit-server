import { NextFunction, Request, Response, Router } from 'express';
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import { IAccessToken} from '../../../entities/token.entity';
import { IUserRepository, UserRepository } from '../../../repository/user.repository';
import { TokenProcesor} from '../../../share/token/token.processor';

export class UserinfoRoute {

    private userRepository: IUserRepository;
    private tokeProcessor = new TokenProcesor();

    constructor(private userinfoRouter: Router) {
        this.routesSet();
        this.userRepository = new UserRepository();

    }
    public routesSet() {
        this.userinfoRouter.route('/')
            .get((req: Request, res: Response) => {
                if (req.header('Authorization')) {
                    this.reqProcess(req.header('Authorization'))
                        .then((userInfo) => {
                            res.json(userInfo);
                        }).catch((err) => {
                            res.status(400).json(err);
                        });
                } else {
                    res.status(400).json({ message: 'bad request' });
                }
            });
    }

    private async reqProcess(bearer: string) {
        const accessToken = await this.tokeProcessor.bearerTokenDecoder(bearer);
        const user = await this.userRepository.getUserBySubjectId(accessToken.sub);
        const userInfo = {
            username: user.username,
            sub: user.subjectId,
            email: user.claims[0].name,
            claims: 'email',
        };
        return userInfo;
   }
}
