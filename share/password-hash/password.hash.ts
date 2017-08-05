import * as bcrypt from 'bcryptjs';

export class PasswordHash {

    public static hashing(password: string): string {
       const salt = bcrypt.genSaltSync(10);
       const hash = bcrypt.hashSync(password, salt);
       return hash;
    }
    public static comparePassword(candidatePassword: string, hash: string): boolean {
        const isMatch: boolean = bcrypt.compareSync(candidatePassword, hash);
        return isMatch;
    }

}
