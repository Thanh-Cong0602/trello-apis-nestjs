import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from '~/modules/user/dto/create-user.dto';
import { UpdateUserDto } from '~/modules/user/dto/update-user.dto';
import { UserRepositoryInterface } from '~/modules/user/interfaces/user.interface';
import { User, UserDocument } from '~/modules/user/schemas/user.schema';
import { BaseRepositoryAbstract } from './base/base.abstract.repository';

@Injectable()
export class UsersRepository
  extends BaseRepositoryAbstract<UserDocument, CreateUserDto, UpdateUserDto>
  implements UserRepositoryInterface
{
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>
  ) {
    super(userModel);
  }

  async update(id: string, updateDto: Partial<UpdateUserDto>) {
    const INVALID_UPDATE_FIELDS = ['_id', 'email', 'username', 'createdAt'];

    const filteredUpdate = { ...updateDto };
    INVALID_UPDATE_FIELDS.forEach(field => delete filteredUpdate[field]);

    return super.update(id, filteredUpdate);
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email });
  }
}
