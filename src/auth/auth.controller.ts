import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import ms from 'ms';
import { Public } from '~/decorator/customize';
import { UserResponseType } from '~/modules/user/types/user.type';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './passport/jwt-auth.guard';
import { LocalAuthGuard } from './passport/local-auth.guard';

@Controller('users')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  @Public()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  login(@Req() req: Request & { user: UserResponseType }, @Res() res: Response) {
    const { accessToken, refreshToken, userData } = this.authService.login(req.user);
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: this.configService.get<string>('NODE_ENV') === 'production' ? 'none' : 'lax',
      maxAge: ms('14 days')
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: this.configService.get<string>('NODE_ENV') === 'production' ? 'none' : 'lax',
      maxAge: ms('14 days')
    });
    return res.json(userData);
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() registerAuthDto: RegisterDto) {
    return this.authService.register(registerAuthDto);
  }

  @UseGuards(JwtAuthGuard) // 🔒 Private API
  @Delete('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res() res: Response) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.json({ message: 'Logged out successfully' });
  }

  @Public()
  @Get('refreshToken')
  @HttpCode(HttpStatus.OK)
  refreshToken(@Req() req: Request, @Res() res: Response) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const { accessToken, refreshToken } = this.authService.refreshToken(req.cookies?.refreshToken);
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: this.configService.get<string>('NODE_ENV') === 'production' ? 'none' : 'lax',
      maxAge: ms('14 days')
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: this.configService.get<string>('NODE_ENV') === 'production' ? 'none' : 'lax',
      maxAge: ms('14 days')
    });

    return res.json({ accessToken, refreshToken });
  }
}
