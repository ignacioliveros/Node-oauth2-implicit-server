import { NextFunction, Request, Response, Router } from 'express';
import * as queryString from 'querystring';

import { AuthReqProcessor } from '../../../authentication/auth-process/authReqProcessor';
import { ClientRepository, IClientRepository } from '../../../repository/client.repostory';
import { IUserRepository, UserRepository } from '../../../repository/user.repository';

export class AuthorizeRoute {

    private userRepository: IUserRepository;
    private clientRepository: IClientRepository;
    private authProcess: AuthReqProcessor;

    constructor(private authorizeRouter: Router) {
        this.routesSet();
        this.userRepository = new UserRepository();
        this.clientRepository = new ClientRepository();
        this.authProcess = new AuthReqProcessor(this.clientRepository, this.userRepository);
    }

    public routesSet() {
        this.authorizeRouter.route('/')
            .get((req: Request, res: Response) => {
                if (req.isAuthenticated()) {
                    if (!req.query.client_id) {
                        res.status(400).json({ message: 'bad request' });
                    }
                    if (req.query.client_id) {
                        this.authProcess.createResponse(req.query, req.user._id)
                            .then((response) => {
                                console.log(req.user.preferred_username + ' is loged in');
                                res.redirect(response);
                            }).catch((err) => {
                                res.status(400).json(err);
                            });

                    } else {
                        res.status(400).json({ message: 'bad request' });
                    }
                }
                if (!req.isAuthenticated()) {
                    if (req.query.client_id) {
                        this.authProcess.createResponse(req.query)
                            .then((response) => {
                                res.redirect('/login' + '?' + queryString.stringify(req.query));

                            }).catch((err) => {
                                res.status(400).json(err);
                            });
                    } else {
                        res.redirect('/login');
                    }
                }
            });
    }
}
