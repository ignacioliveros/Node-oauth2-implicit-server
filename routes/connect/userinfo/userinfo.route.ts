import { NextFunction, Request, Response, Router } from 'express';
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import { IAccessToken} from '../../../entities/token.entity';
import {IInfoUser } from '../../../entities/userInfo.entity';
import { ClientRepository, IClientRepository } from '../../../repository/client.repostory';
import { IUserRepository, UserRepository } from '../../../repository/user.repository';
import { TokenProcesor } from '../../../share/token/token.processor';

export class UserinfoRoute {

    private userRepository: IUserRepository;
    private clientRepository: IClientRepository;
    private tokeProcessor = new TokenProcesor();
    private userInfo: IInfoUser = {};

    constructor(private userinfoRouter: Router) {
        this.routesSet();
        this.userRepository = new UserRepository();
        this.clientRepository = new ClientRepository();

    }
    public routesSet() {
        this.userinfoRouter.route('/')
            .get((req: Request, res: Response) => {
                if (req.header('Authorization')) {
                    this.reqProcess(req.header('Authorization'))
                        .then((userInfo) => {
                            res.json(userInfo);
                        }).catch((err) => {
                           // res.status(400).json(err);
                            console.log(err);
                        });
                } else {
                    res.status(400).json({ message: 'bad request' });
                }
            });
    }

    private async reqProcess(bearer: string): Promise<IInfoUser> {
        const accessToken = await this.tokeProcessor.bearerTokenDecoder(bearer);
        const client = await this.clientRepository.getClientByClienId(accessToken.client_id);
        const user = await this.userRepository.getUserBySubjectId(accessToken.sub);

        const array = accessToken.scope.split(',');
        this.userInfo.username = user.preferred_username;
        this.userInfo.sub = user.subjectId;

        for (const item of array) {
            console.log(item);
            const claim = user.claims.find((x) => x.type === item);
            if (claim) {
                console.log(claim.value);
                this.userInfo[item] = claim.value;
           }

        }
        console.log(this.userInfo);
        return this.userInfo;
   }
}
