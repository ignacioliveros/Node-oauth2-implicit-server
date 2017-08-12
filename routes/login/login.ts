import { NextFunction, Request, Response, Router } from 'express';
import * as passport from 'passport';
import * as queryString from 'query-string';

import { IUser } from '../../entities/user.entity';
import { IUserRepository, UserRepository } from '../../repository/user.repository';

export class RegisterRoute {

    private userRepo: IUserRepository = new UserRepository();

    constructor(private loginRouter: Router) {
        this.routesSet();

    }

    public routesSet() {
        this.loginRouter.route('/')
            .get((req: Request, res: Response) => {
                res.locals.query = queryString.stringify(req.query);
                res.render('login');
            })
            .post(passport.authenticate('local', {
                // successRedirect: '/connect/authorize',
                failureRedirect: '/login',
                failureFlash: true,
            }), (req: Request, res: Response) => {
                if (req.body.query) {
                    res.redirect('/connect/authorize' + '?' + req.body.query);
                } else {
                    res.redirect('/');
                }
            });
    }
}
