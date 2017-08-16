import { IUser } from '../entities/user.entity';
import { User } from '../mongoModels/user.model';
import { PasswordHash} from '../share/password-hash/password.hash';

export interface IUserRepository {
    getUserById(userId): Promise<IUser>;
    createUser(user: IUser): Promise<IUser>;
    getUserByUsername(username: string): Promise<IUser>;
    getUserBySubjectId(subjectId: string): Promise<IUser>;

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
            const query = { preferred_username: username  };
            User.findOne(query, ((err, userModel) => {
                if (err) {
                    reject(err);
                }
                const user: IUser = userModel;
                resolve(user);
            }));
        });
    }

   public getUserBySubjectId(subjectId: string): Promise<IUser> {
       return new Promise((resolve, reject) => {
           const query = { subjectId: subjectId };
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
       user.password = PasswordHash.hashing(user.password);
       return new Promise((resolve, reject) => {
            User.create(user, (err, userModel) => {
                if (err) {
                    reject(err);
                }
                const user: IUser = userModel;
                console.log('The user ' + user.name + ' has been created ');
                resolve(user);
            });
        });
    }

}
