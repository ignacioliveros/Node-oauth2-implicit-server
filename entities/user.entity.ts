export interface IUser {
    _id: any;
    name: string;
    preferred_username: string;
    password: string;
    subjectId?: string;
    claims: IClaim[];
}

export interface IClaim {
    type: string;
    value: string;
}
