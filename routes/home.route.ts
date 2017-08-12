import { NextFunction, Request, Response, Router } from 'express';
import * as queryString from 'query-string';

export class HomeRoute {
    constructor(private homeRouter: Router) {
        this.routesSet();
    }
    public routesSet() {
        this.homeRouter.route('/')
            .get((req: Request, res: Response) => {
                if (res.locals.id_query) {
                    res.redirect('/authorize' + '#' + queryString.stringify(res.locals.id_query));
                } else {
                    res.render('home');
                }
            });
    }
}
