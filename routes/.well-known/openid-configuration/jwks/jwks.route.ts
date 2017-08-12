import { NextFunction, Request, Response, Router } from 'express';
import * as fs from 'fs';
import * as pem2jwk from 'pem-jwk';

export class JwksRoute {

    private puk;
    constructor(private jwksRouter: Router) {
        this.routesSet();
        this.puk = fs.readFileSync('./cert/pubkey.pem', 'ascii');
    }
    public routesSet() {
        this.jwksRouter.route('/')
            .get((req: Request, res: Response) => {
                const jwkt = { keys: [pem2jwk.pem2jwk(this.puk)] };
                res.json(jwkt);
            });
    }
}
