import { NextFunction, Request, Response, Router } from 'express';
import * as passport from 'passport';

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
                res.render('login');
            })
            .post(passport.authenticate('local', {
                successRedirect: '/',
                failureRedirect: '/login',
                failureFlash: true,
            }), (req: Request, res: Response) => {
                res.redirect('/');
            });
    }
}
