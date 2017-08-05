export interface IUser {
    _id: any;
    fullName: string;
    username: string;
    password: string;
    subjectId?: string;
    claims: Iclaim[];
}

export interface Iclaim {
    type: string;
    name: string;
}
