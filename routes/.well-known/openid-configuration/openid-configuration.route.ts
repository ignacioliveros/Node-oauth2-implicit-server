import { NextFunction, Request, Response, Router } from 'express';

export class OpenIdConfigurationRoute {
    constructor(private openIdConfigurationRouter: Router) {
        this.routesSet();
    }
    public routesSet() {
        this.openIdConfigurationRouter.route('/')
            .get((req: Request, res: Response) => {
                res.json({
                    issuer: "http://localhost:4000",
                    jwks_uri: "http://localhost:4000/.well-known/openid-configuration/jwks",
                    authorization_endpoint: "http://localhost:4000/connect/authorize",
                    token_endpoint: "http://localhost:4000/connect/token",
                    userinfo_endpoint: "http://localhost:4000/connect/userinfo",
                    end_session_endpoint: "http://localhost:4000/connect/endsession",
                    check_session_iframe: "http://localhost:4000/connect/checksession",
                    revocation_endpoint: "http://localhost:4000/connect/revocation",
                    introspection_endpoint: "http://localhost:4000/connect/introspect",
                    frontchannel_logout_supported: true,
                    frontchannel_logout_session_supported: true,
                    scopes_supported: [
                        "openid",
                        "profile",
                        "email",
                    ],
                    claims_supported: [
                        "sub",
                        "name",
                        "family_name",
                        "given_name",
                        "middle_name",
                        "nickname",
                        "preferred_username",
                        "profile",
                        "picture",
                        "website",
                        "gender",
                        "birthdate",
                        "zoneinfo",
                        "locale",
                        "updated_at",
                        "email",
                        "email_verified",
                        "role",
                    ],
                    grant_types_supported: [
                        "implicit",
                    ],
                    response_types_supported: [
                        "id_token token",
                    ],
                    response_modes_supported: [
                        "form_post",
                        "query",
                        "fragment",
                    ],
                    token_endpoint_auth_methods_supported: [
                        "client_secret_basic",
                        "client_secret_post",
                        "private_key_jwt",
                    ],
                    subject_types_supported: [
                        "public",
                    ],
                    id_token_signing_alg_values_supported: [
                        "RS256",
                    ],
                    code_challenge_methods_supported: [
                        "plain",
                        "S256",
                    ],
                });
            });
    }
}
