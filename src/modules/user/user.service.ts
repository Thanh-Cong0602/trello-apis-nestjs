import {
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { RegisterDto } from '~/auth/dto/register.dto';
import { CloudinaryProvider } from '~/providers/Cloudinary.provider';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { UserDBType } from './types/user.type';
import { UserMapper } from './user.mapper';

@Injectable()
export class UserService {
  @InjectModel(User.name) private userModel: Model<User>;
  constructor(private readonly userMapper: UserMapper) {}

  async create(registerDto: RegisterDto) {
    const { email, password } = registerDto;
    const existUser = await this.findByEmail(email);
    if (existUser) throw new ConflictException('Email already exists!');

    const nameFromEmail = email.split('@')[0];

    const newUser = {
      email: email,
      password: bcrypt.hashSync(password, 8),
      username: nameFromEmail,
      displayName: nameFromEmail,
      verifyToken: uuidv4()
    };

    const createdUser = await this.userModel.create(newUser);

    return this.userMapper.mapEntityToDto(createdUser);
  }

  async findByEmail(email: string): Promise<UserDBType | null> {
    return await this.userModel.findOne({ email });
  }
  async findOneById(_userId: string): Promise<UserDBType | null> {
    return await this.userModel.findOne({ _id: _userId });
  }

  async update(
    _userId: string,
    updateUserDto: UpdateUserDto,
    userAvatarFile?: Express.Multer.File
  ) {
    const existUser = await this.findOneById(_userId);
    if (!existUser) throw new NotFoundException('Account not found!');
    if (!existUser.isActive) throw new NotAcceptableException('Your account is not active!');

    let updatedUser: UserDBType | null = null;

    /* TH1: Change Password */
    if (updateUserDto.current_password && updateUserDto.new_password) {
      if (!bcrypt.compareSync(updateUserDto.current_password, existUser.password)) {
        throw new NotAcceptableException('Your current password is incorrect!');
      }

      updatedUser = await this.updateUser(_userId, {
        password: bcrypt.hashSync(updateUserDto.new_password, 8)
      });
    } else if (userAvatarFile) {
      /* Trường hợp upload file lên Cloud Storage, cụ thể là Cloudinary */
      const uploadResult = await CloudinaryProvider.streamUpload(userAvatarFile.buffer, 'users');

      /* Lưu lại secure_url của cái file ảnh vào trong Database */
      updatedUser = await this.updateUser(_userId, { avatar: uploadResult.secure_url });
    } else {
      updatedUser = await this.updateUser(_userId, updateUserDto);
    }

    return this.userMapper.mapEntityToDto(updatedUser as UserDBType);
  }

  async updateUser(
    _userId: string,
    updatedUser: Partial<UpdateUserDto>
  ): Promise<UserDBType | null> {
    const INVALID_UPDATE_FIELDS = ['_id', 'email', 'username', 'createdAt'];
    Object.keys(updatedUser).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) delete updatedUser[fieldName];
    });

    return await this.userModel.findOneAndUpdate(
      { _id: _userId },
      { $set: updatedUser },
      { returnDocument: 'after' }
    );
  }
}
