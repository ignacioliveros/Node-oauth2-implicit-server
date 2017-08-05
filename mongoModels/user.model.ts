import { Document, model, Mongoose, Schema, Types } from 'mongoose';

import {Iclaim, IUser } from '../entities/user.entity';

interface IclaimModel extends Iclaim, Types.Subdocument { }

interface IUserModel extends IUser, Document { }

const ClaimSchema = new Schema({
    type: { type: String, required: true },
    name: { type: String, required: true },
});

const UserSchema = new Schema({
    fullName: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    claims: [ClaimSchema],
});

export const User = model<IUserModel>('User', UserSchema);
