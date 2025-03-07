import { BaseRepositoryInterface } from '~/repositories/base/base.interface.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserDocument } from '../schemas/user.schema';

export interface UserRepositoryInterface
  extends BaseRepositoryInterface<UserDocument, CreateUserDto, UpdateUserDto> {
  findByEmail(email: string): Promise<UserDocument | null>;
}
