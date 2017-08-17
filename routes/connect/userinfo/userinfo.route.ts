import { NextFunction, Request, Response, Router } from 'express';
import { UserInfoProcess } from '../../../authentication/userInfo-process/userInfo.Processor';
import { ClientRepository, IClientRepository } from '../../../repository/client.repostory';
import { IUserRepository, UserRepository } from '../../../repository/user.repository';

export class UserinfoRoute {

    private clientRepository: IClientRepository;
    private userRepository: IUserRepository;
    private userInfoProcess: UserInfoProcess;

    constructor(private userinfoRouter: Router) {
        this.routesSet();
        this.clientRepository = new ClientRepository();
        this.userRepository = new UserRepository();
        this.userInfoProcess = new UserInfoProcess(this.clientRepository, this.userRepository);
    }

    public routesSet() {
        this.userinfoRouter.route('/')
            .get((req: Request, res: Response) => {
                if (req.header('Authorization')) {
                    this.userInfoProcess.UserInfoRequestProcessor(req.header('Authorization'))
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
}
