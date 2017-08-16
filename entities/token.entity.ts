export interface IIdToken {
    nbf: number;
    exp: number;
    iss: string;
    aud: string;
    nonce: string;
    iat: number;
    at_hash: string;
    sid: string;
    sub: string;
    auth_time: number;
}

export interface IAccessToken {
    nbf: number;
    exp: number;
    iss: string;
    aud: string;
    client_id: string;
    sub: string;
    auth_time: number;
    scope: string;
    iat?: number;
    [key: string]: any;
}
