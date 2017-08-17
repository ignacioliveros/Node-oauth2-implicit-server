import { NextFunction, Request, Response, Router } from 'express';
import * as queryString from 'querystring';

import { AuthReqProcessor} from '../../../authentication/auth-process/authReqProcessor';

export class AuthorizeRoute {

    private authProcess = new AuthReqProcessor();

    constructor(private authorizeRouter: Router) {
        this.routesSet();
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
                        console.log(req.user);
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
