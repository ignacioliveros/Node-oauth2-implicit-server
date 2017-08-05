import * as mongoose from 'mongoose';

export class MongoConnection {

    private connectionString = 'mongodb://localhost/LoginApp';
    private connection: mongoose.Connection;

    public open(callback: (err: any , isConnected: boolean) => void) {
        const options = {};
        mongoose.connect(this.connectionString, options, (err) => {
            if (err) {
                console.log('mongoose.connect() failed: ' + err);
            }
        });
        this.connection = mongoose.connection;

        mongoose.connection.on('error', (err) => {
            console.log('Error connecting to MongoDB: ' + err);
            callback(err, false);
        });

        mongoose.connection.once('open', () => {
            console.log('We have connected to mongodb');
            callback(null, true);
        });

    }
}
