import { Injectable } from '@nestjs/common';
import { UserDocument } from './schemas/user.schema';
import { UserResponseType } from './types/user.type';

@Injectable()
export class UserMapper {
  constructor() {}

  mapEntityToDto(user: UserDocument): UserResponseType {
    return {
      _id: user._id.toString(),
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
