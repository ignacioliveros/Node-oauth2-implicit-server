import { NextFunction, Request, Response, Router } from 'express';

export class HomeRoute {
    constructor(private homeRouter: Router) {
        this.routesSet();
    }
    public routesSet() {
        this.homeRouter.route('/')
            .get((req: Request, res: Response) => {
                res.render('home');
            });
    }
}
