import * as bodyParser from 'body-parser';
import flash = require('connect-flash');
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as handlebars from 'express-handlebars';
import * as session from 'express-session';
import * as  expressValidator from 'express-validator';
import * as http from 'http';
import * as path from 'path';

import { MongoConnection} from './dbConnection/mongoConnection';
import { PassportAuth} from './passport/passportAuth';
import { Routes } from './router/router';

export class Server {
    public app: express.Application;
    private port = process.env.PORT || 4000;
    private server: http.Server;

    constructor() {
        this.app = express();
        this.bootstrap();
        this.initExpressMiddleWare();
        this.router();
        this.dbConnection();
    }

    private bootstrap() {
        this.server = http.createServer(this.app);
        this.server.listen(this.port);
        this.server.on('listening', (error: Error) => {
            if (error) {
                console.log(error);
            }
            console.log(`Listening on port ` + this.port);
        });
    }

    private dbConnection() {
        const database = new MongoConnection();

        database.connecting((err, isConnected) => {
            if (err) {
                console.log(err);
            }
        });

    }

    public initExpressMiddleWare() {
        this.app.set('views', path.join(__dirname, 'views'));
        this.app.engine('.hbs', handlebars({ defaultLayout: 'layout', extname: '.hbs' }));
        this.app.set('view engine', '.hbs');
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(cookieParser('secret'));
        this.app.use(express.static(path.join(__dirname, 'public')));
        this.app.use(expressValidator({
            errorFormatter: (param: string, msg: string, value) => {
                const namespace = param.split('.');
                const root = namespace.shift();
                let formParam = root;

                while (namespace.length) {
                    formParam += '[' + namespace.shift() + ']';
                }
                return {
                    param: formParam,
                    msg: { msg },
                    value: {value},
                };
            },
        }));

        this.app.use(session({
            resave: false,
            secret: 'secret',
            saveUninitialized: false,
            cookie: { httpOnly: true, maxAge: 60 * 60 * 720 },
        }));

        const passportAuth = new PassportAuth(this.app);
        this.app.use(flash());
        this.app.use((req, res, next) => {
            res.locals.success_msg = req.flash('success_msg');
            res.locals.error_msg = req.flash('error_msg');
            res.locals.error_msg = req.flash('error');
            res.locals.user = req.user || null;
            next();
        });
    }

    private router(): void {
        const router = new Routes();
        router.load(this.app, './routes');
    }
}
const server = new Server();
