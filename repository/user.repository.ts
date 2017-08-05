import { IUser } from '../entities/user.entity';
import { User } from '../mongoModels/user.model';
import { PasswordHash} from '../share/password-hash/password.hash';

export interface IUserRepository {
    getUserById(userId): Promise<IUser>;
    createUser(user: IUser): Promise<IUser>;
    getUserByUsername(username: string): Promise<IUser>;

}

export class UserRepository implements IUserRepository {

    public getUserById(userId): Promise<IUser> {
        return new Promise((resolve, reject) => {
            User.findById(userId, (err, userModel) => {
                if (err) {
                    reject(err);
                }
                const user: IUser = userModel;
                resolve(user);
            });
        });
    }

   public getUserByUsername(username: string): Promise<IUser> {
        return new Promise((resolve, reject) => {
            const query = { username: username  };
            User.findOne(query, ((err, userModel) => {
                if (err) {
                    reject(err);
                }
                const user: IUser = userModel;
                resolve(user);
            }));
        });
    }

   public createUser(user: IUser): Promise<IUser> {
       const newUser: IUser = user;
       newUser.password = PasswordHash.hashing(user.password);
       return new Promise((resolve, reject) => {
            User.create(newUser, (err, userModel) => {
                if (err) {
                    reject(err);
                }
                const user: IUser = userModel;
                resolve(user);
            });
        });
    }

}
