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
                            const user: IUser = {_id: null, username: '', fullName: '', password: '' , claims: [] };
                            user.fullName = req.body.fullname;
                            user.username = req.body.username;
                            user.password = req.body.password;
                            user.claims = [{ type: 'email', name: req.body.email }];
                            this.userRepo.createUser(user)
                                .then((user) => {
                                    console.log(user);
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
                                }); // catch
                        }
                     });
                });
    }
}
