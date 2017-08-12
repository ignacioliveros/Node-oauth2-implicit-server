import { IClient } from '../entities/client.entity';
import { Client } from '../mongoModels/client.model';

export interface IClientRepository {
    getClientByClienId(clientId: string): Promise<IClient>;
}

export class ClientRepository implements IClientRepository {

    public getClientByClienId(clientId: string): Promise<IClient> {
        return new Promise((resolve, reject) => {
            const query = { clientId: clientId };
            Client.findOne(query, ((err, clientModel) => {
                if (err) {
                    reject(err);
                }
                const client: IClient = clientModel;
                resolve(client);
            }));
        });
    }

}
