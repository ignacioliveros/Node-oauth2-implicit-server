import { NextFunction, Request, Response, Router } from 'express';

import {IUser } from '../../entities/user.entity';
import { IUserRepository, UserRepository } from '../../repository/user.repository';

export class RegisterRoute {

    private userRepo: IUserRepository = new UserRepository();

    constructor(private registerRouter: Router) {
        this.routesSet();
    }
    public routesSet() {
        this.registerRouter.route('/')
            .get((req: Request, res: Response) => {
                res.render('register');
            })
            .post((req: Request, res: Response) => {

                req.checkBody('fullname', 'Full Name is required').notEmpty();
                req.checkBody('username', 'Username is required').notEmpty();
                req.checkBody('email', 'Email is required').notEmpty();
                req.checkBody('email', 'Email is not valid').isEmail();
                req.checkBody('password', 'Password is required').notEmpty();
                req.checkBody('confirmPassword', 'Password is required').notEmpty();
                req.checkBody('confirmPassword', 'Password do not match').equals(req.body.password);

                req.getValidationResult()
                    .then((result) => {
                        if (!result.isEmpty()) {
                            res.render('register', {
                                errors: result.array(),
                                viewModel: req.body,
                            });
                        } else {
                            const user: IUser = {_id: null, preferred_username: '', name: '', password: '' , claims: [] };
                            user.name = req.body.fullname;
                            user.preferred_username = req.body.username;
                            user.password = req.body.password;
                            user.claims = [{ type: 'email', value: req.body.email }, { type: 'role', value: 'user' }];
                            this.userRepo.createUser(user)
                                .then((user) => {
                                    req.flash('success_msg', 'You are registered');
                                    res.redirect('/login');
                                }).catch((err) => {
                                    if (err.code === 11000) {
                                        console.log(err.toJSON());
                                        res.render('register', {
                                            errors: [{
                                                msg:
                                                { msg: 'Username already exist' },
                                            }],
                                            viewModel: req.body,
                                        });
                                   }
                                });
                        }
                     });
                });
    }
}
