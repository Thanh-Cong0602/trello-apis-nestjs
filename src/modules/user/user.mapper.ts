import { Injectable } from '@nestjs/common';
import { UserDBType, UserResponseType } from './types/user.type';

@Injectable()
export class UserMapper {
  constructor() {}

  mapEntityToDto(user: UserDBType): UserResponseType {
    return {
      _id: user._id,
      email: user.email,
      username: user.username,
      displayName: user.displayName,
      avatar: user.avatar,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
}
