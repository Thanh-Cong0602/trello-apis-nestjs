import { Types } from 'mongoose';

export type UserDBType = {
  _id: Types.ObjectId;

  email: string;

  password: string;

  username: string;

  displayName: string;

  avatar?: string;

  role: string;

  isActive: boolean;

  createdAt: Date;

  updatedAt: Date;
};

export type UserResponseType = Omit<UserDBType, 'password'>;
