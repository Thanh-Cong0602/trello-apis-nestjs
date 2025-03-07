import {
  ConflictException,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException
} from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { RegisterDto } from '~/auth/dto/register.dto';
import { CloudinaryProvider } from '~/providers/Cloudinary.provider';
import { BaseServiceAbstract } from '~/services/base.abstract.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepositoryInterface } from './interfaces/user.interface';
import { User, UserDocument } from './schemas/user.schema';
import { UserResponseType } from './types/user.type';
import { UserMapper } from './user.mapper';

@Injectable()
export class UserService extends BaseServiceAbstract<User> {
  constructor(
    @Inject('UsersRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
    private readonly userMapper: UserMapper
  ) {
    super(userRepository);
  }

  async createUser(registerDto: RegisterDto): Promise<UserResponseType> {
    const { email, password } = registerDto;
    const existUser = await this.userRepository.findByEmail(email);

    if (existUser) throw new ConflictException('Email already exists!');

    const nameFromEmail = email.split('@')[0];

    const newUser = {
      email: email,
      password: bcrypt.hashSync(password, 8),
      username: nameFromEmail,
      displayName: nameFromEmail,
      verifyToken: uuidv4()
    };

    const createdUser = await this.userRepository.create(newUser);

    return this.userMapper.mapEntityToDto(createdUser);
  }

  async updateUser(
    _userId: string,
    updateUserDto: Partial<UpdateUserDto>,
    userAvatarFile?: Express.Multer.File
  ) {
    const existUser = await this.userRepository.findOneById(_userId);

    if (!existUser) throw new NotFoundException('Account not found!');

    if (!existUser.isActive) throw new NotAcceptableException('Your account is not active!');

    let updatedUser: UserDocument | null = null;

    /* Case 1: Change Password */
    if (updateUserDto.current_password && updateUserDto.new_password) {
      if (!bcrypt.compareSync(updateUserDto.current_password, existUser.password)) {
        throw new NotAcceptableException('Your current password is incorrect!');
      }

      updatedUser = await this.userRepository.update(_userId, {
        password: bcrypt.hashSync(updateUserDto.new_password, 8)
      });
    } else if (userAvatarFile) {
      /* Trường hợp upload file lên Cloud Storage, cụ thể là Cloudinary */
      const uploadResult = await CloudinaryProvider.streamUpload(userAvatarFile.buffer, 'users');

      /* Lưu lại secure_url của cái file ảnh vào trong Database */
      updatedUser = await this.userRepository.update(_userId, { avatar: uploadResult.secure_url });
    } else {
      updatedUser = await this.userRepository.update(_userId, updateUserDto);
    }

    return this.userMapper.mapEntityToDto(updatedUser as UserDocument);
  }
  async findByEmail(email: string): Promise<UserDocument | null> {
    return await this.userRepository.findByEmail(email);
  }

  // async updateUser(
  //   _userId: string,
  //   updatedUser: Partial<UpdateUserDto>
  // ): Promise<UserDBType | null> {
  //   const INVALID_UPDATE_FIELDS = ['_id', 'email', 'username', 'createdAt'];
  //   Object.keys(updatedUser).forEach(fieldName => {
  //     if (INVALID_UPDATE_FIELDS.includes(fieldName)) delete updatedUser[fieldName];
  //   });

  //   return await this.userModel.findOneAndUpdate(
  //     { _id: _userId },
  //     { $set: updatedUser },
  //     { returnDocument: 'after' }
  //   );
  // }

  async findOneById(_userId: string): Promise<UserDocument | null> {
    return await this.userRepository.findOneById(_userId);
  }
}
