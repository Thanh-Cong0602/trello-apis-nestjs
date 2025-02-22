import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Request } from 'express';
import { UserResponseType } from '~/modules/user/types/user.type';
import { UserMapper } from '~/modules/user/user.mapper';
import { UserService } from '~/modules/user/user.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private readonly userMapper: UserMapper,
    private readonly configService: ConfigService
  ) {}

  login(userData: UserResponseType) {
    const userInfo = { _id: userData._id, email: userData.email };
    return {
      accessToken: this.jwtService.sign(userInfo),
      refreshToken: this.jwtService.sign(userInfo, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET_SIGNATURE'),
        expiresIn: this.configService.get<string>('REFRESH_TOKEN_LIFE')
      }),
      userData
    };
  }

  async validateUser(email: string, password: string): Promise<UserResponseType | null> {
    const existUser = await this.userService.findByEmail(email);

    if (!existUser) throw new NotFoundException('Account not found!');

    if (!existUser.isActive) throw new NotAcceptableException('Your account is not active!');

    if (!bcrypt.compareSync(password, existUser.password))
      throw new NotAcceptableException('Your email or password is incorrect!');

    return this.userMapper.mapEntityToDto(existUser);
  }

  register(registerAuthDto: RegisterDto) {
    return this.userService.create(registerAuthDto);
  }

  refreshToken(clientRefreshToken: string) {
    const payload = this.jwtService.verify(clientRefreshToken, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET_SIGNATURE')
    });

    if (!payload || !clientRefreshToken)
      throw new UnauthorizedException('Please Sign In! (Error from refresh token)');

    const userInfo = { _id: payload._id, email: payload.email };
    return {
      accessToken: this.jwtService.sign(userInfo),
      refreshToken: this.jwtService.sign(userInfo, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET_SIGNATURE'),
        expiresIn: this.configService.get<string>('REFRESH_TOKEN_LIFE')
      })
    };
  }

  getUserFromToken(req: Request): { _id: string; email: string } {
    const token = req.cookies['accessToken'] as string;

    if (!token) throw new UnauthorizedException('Token not found');

    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET_SIGNATURE')
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
