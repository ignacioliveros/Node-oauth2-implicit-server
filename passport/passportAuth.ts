import { Application} from 'express';
import * as passport from 'passport';
import {Strategy} from 'passport-local';
import { IUser } from '../entities/user.entity';
import { IUserRepository, UserRepository } from '../repository/user.repository';
import { PasswordHash} from '../share/password-hash/password.hash';

export class PassportAuth {

    private userRepo: IUserRepository = new UserRepository();
    constructor(private app: Application) {
        this.app.use(passport.initialize());
        this.app.use(passport.session());

        passport.use(new Strategy((username, password, done) => {
            this.userRepo.getUserByUsername(username.toLowerCase())
                .then((user) => {
                    if (!user) {
                        return done(null, false, { message: 'Incorrect username.' });
                    }
                    const isMatch = PasswordHash.comparePassword(password, user.password);
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Invalid password' });
                    }
                }).catch((err) => {
                    console.log(err);
                });
        }));

        passport.serializeUser<IUser, IUser>((user, done) => {
            done(null, user._id);

        });

        passport.deserializeUser((id, done) => {
            this.userRepo.getUserById(id)
                .then((result) => {
                    done(null, result);
                }).catch((err) => {
                    done(err, null);
                });
           });
    }

 }
