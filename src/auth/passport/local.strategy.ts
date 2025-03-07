import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserResponseType } from '~/modules/user/types/user.type';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password'
    });
  }

  async validate(username: string, password: string): Promise<UserResponseType | null> {
    const user = await this.authService.validateUser(username, password);

    if (!user) throw new UnauthorizedException('Your email or password is incorrect!');

    return user;
  }
}
