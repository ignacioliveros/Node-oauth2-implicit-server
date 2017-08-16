import { Document, model, Mongoose, Schema, Types } from 'mongoose';

import {IClaim, IUser } from '../entities/user.entity';

interface IclaimModel extends IClaim, Types.Subdocument { }

interface IUserModel extends IUser, Document { }

const ClaimSchema = new Schema({
    type: { type: String, required: true },
    value: { type: String, required: true },
});

const UserSchema = new Schema({
    subjectId: { type: String, unique: true, default: () => new Types.ObjectId() },
    name: { type: String, required: true },
    preferred_username: { type: String, unique: true , required: true, lowercase: true},
    password: { type: String, required: true },
    claims: [ClaimSchema],
});

export const User = model<IUserModel>('User', UserSchema);
