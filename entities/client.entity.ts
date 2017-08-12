export interface IClient {
    _id: any;
    clientId: string;
    clientName: string;
    grantType: string;
    allowedScopes: string[];
    identityTokenLifetime: number;
    accessTokenLifetime: number;
    redirectUris: string[];
    postLogoutRedirectUris: string[];
}
