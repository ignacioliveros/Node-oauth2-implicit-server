export interface IAuthReq {
    client_id: string;
    nonce: string;
    redirect_uri: string;
    response_type: string;
    scope: string;
    state: string;
}
