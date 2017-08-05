import { Document, model, Mongoose, Schema, Types } from 'mongoose';

import {Iclaim, IUser } from '../entities/user.entity';

interface IclaimModel extends Iclaim, Types.Subdocument { }

interface IUserModel extends IUser, Document { }

const ClaimSchema = new Schema({
    type: { type: String, required: true },
    name: { type: String, required: true },
});

const UserSchema = new Schema({
    subjectId: { type: String, unique: true, default: () => new Types.ObjectId() },
    fullName: { type: String, required: true },
    username: { type: String, unique: true , required: true, lowercase: true},
    password: { type: String, required: true },
    claims: [ClaimSchema],
});

export const User = model<IUserModel>('User', UserSchema);
