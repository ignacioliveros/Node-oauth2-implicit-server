import { NextFunction, Request, Response, Router } from 'express';

export class LogoutRoute {
    constructor(private logoutRouter: Router) {
        this.routesSet();
    }
    public routesSet() {
        this.logoutRouter.route('/')
            .get((req: Request, res: Response) => {
                if (req.isAuthenticated()) {
                    req.logout();
                    req.flash('success_msg', 'You are logged out');
                    res.redirect('/login');

                } else if (req.query.post_logout_redirect_uri) {
                    res.locals.redirectUri = req.query.post_logout_redirect_uri;
                    res.locals.success_msg = 'You are logged out';
                    res.render('logout');
                } else if (req.query.wrong) {
                    res.locals.error_msg = 'You are logged out, ' + req.query.wrong;
                    res.render('logout');
                } else {
                    res.redirect('/login');
                }
            });
    }
}
