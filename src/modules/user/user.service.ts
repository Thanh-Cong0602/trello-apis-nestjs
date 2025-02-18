import {
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { LoginDto } from '~/auth/dto/login.dto';
import { RegisterDto } from '~/auth/dto/register.dto';
import { User } from './schemas/user.schema';
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

  async findOneByEmail(loginAuthDto: LoginDto) {
    const { email, password } = loginAuthDto;
    const existUser: User | null = await this.userModel.findOne({ email });
    if (!existUser) throw new NotFoundException('Account not found!');

    if (!existUser.isActive) throw new NotAcceptableException('Your account is not active!');

    if (!bcrypt.compareSync(password, existUser.password))
      throw new NotAcceptableException('Your email or password is incorrect!');

    return this.userMapper.mapEntityToDto(existUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email });
  }
}
