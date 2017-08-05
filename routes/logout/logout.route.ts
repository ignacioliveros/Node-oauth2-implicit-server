import { NextFunction, Request, Response, Router } from 'express';

export class LogoutRoute {
    constructor(private logoutRouter: Router) {
        this.routesSet();
    }
    public routesSet() {
        this.logoutRouter.route('/')
            .get((req: Request, res: Response) => {
                req.logout();
                req.flash('success_msg', 'You are logged out');
                res.redirect('/login');
            });
    }
}
