export type UserDBType = {
  _id: string;

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
