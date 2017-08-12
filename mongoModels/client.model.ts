import { Document, model, Mongoose, Schema, Types } from 'mongoose';
import * as mongoose from 'mongoose';

import { IClient } from '../entities/client.entity';

interface IClientModel extends IClient, Document { }

const ClientSchema = new Schema({
    clientId: { type: String, unique: true },
    clientName: { type: String, required: true },
    grantType: { type: String, required: true },
    allowedScopes: { type: String, required: true },
    identityTokenLifetime: { type: Number, required: true },
    accessTokenLifetime: { type: Number, required: true },
    redirectUris: [String],
    postLogoutRedirectUris: [String],
});

export const Client = model<IClientModel>('Client', ClientSchema);

export class DbSeeder {

    constructor() {
         this.init();
    }

    private client: IClient = {
        _id: null,
        accessTokenLifetime: 3600,
        allowedScopes: ['openid', 'email'],
        clientId: 'pepesApp-implicit',
        clientName: 'pepe',
        grantType: 'implicit',
        identityTokenLifetime: 300,
        redirectUris: ['http://localhost:4200/callback.html', 'http://localhost:4200/silent_renew.html'],
        postLogoutRedirectUris: ['http://localhost:4200'],
    };

    public init() {
        mongoose.connection.db.listCollections({ name: 'clients' })
            .next((err, collinfo) => {
                if (!collinfo) {
                    console.log('Starting dbSeeder...');
                    this.DbSeed();
                }
            });
         }

    public DbSeed() {
        console.log('Seeding data....');
        Client.create(this.client);
        console.log('inserted client: ' + this.client.clientName);
    }

}
