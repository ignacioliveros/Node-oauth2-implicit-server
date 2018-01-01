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
            .post((req: Request, res: Response, next: NextFunction) => {
                passport.authenticate('local', {
                failureFlash: true,
            }, (err, user, info) => {
                if (user) {
                    console.log(req.authInfo);
                    if (req.body.query) {
                            res.redirect('/connect/authorize' + '?' + req.body.query);
                        } else {
                            req.user = user;
                            res.redirect('/');
                        }
                    } else {
                        res.redirect('/login' + '?' + req.body.query);
                    }
                })(req, res, next);
            });
            // .post(passport.authenticate('local', {
            //     // successRedirect: '/connect/authorize',
            //      failureRedirect: '/login',
            //     failureFlash: true,
            // }), (req: Request, res: Response) => {
            //     if (req.body.query) {
            //         res.redirect('/connect/authorize' + '?' + req.body.query);
            //     } else {
            //         res.redirect('/');
            //     }
            // });
    }
}

// check this out
// app.get('/login', function (req, res, next) {
//     passport.authenticate('local', function (err, user, info) {
//         if (err) { return next(err); }
//         if (!user) { return res.redirect('/login'); }
//         req.logIn(user, function (err) {
//             if (err) { return next(err); }
//             return res.redirect('/users/' + user.username);
//         });
//     })(req, res, next);
// });
