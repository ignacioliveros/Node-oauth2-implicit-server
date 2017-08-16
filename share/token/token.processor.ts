import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import { IAccessToken , IIdToken } from '../../entities/token.entity';

export class TokenProcesor {
    private puk;
    constructor() {
        this.puk = fs.readFileSync('./cert/pubkey.pem', 'ascii');
    }

    public bearerTokenDecoder(bearer: string): Promise<IAccessToken> {
        return new Promise((resolve, reject) => {
            const accessToken = bearer.replace('Bearer ', '');
            jwt.verify(accessToken, this.puk, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data as IAccessToken);
                }
            });
        });
    }

    public idTokenHintDecoder(hint: string): IIdToken {
        const idToken = hint.replace('id_token_hint: ', '');
        const decode = jwt.verify(idToken, this.puk, { ignoreExpiration: true });
        if (typeof decode === 'object') {
            const tokenDeco: IIdToken = decode as IIdToken;
            return tokenDeco;
        }

    }
}
