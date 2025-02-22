import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { AuthService } from '~/auth/auth.service';
import { JwtAuthGuard } from '~/auth/passport/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard) // 🔒 Private API
  @Put('update')
  @UseInterceptors(FileInterceptor('userAvatarFile'))
  @HttpCode(HttpStatus.OK)
  update(
    @Req() req: Request,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() userAvatarFile?: Express.Multer.File
  ) {
    const { _id: userId } = this.authService.getUserFromToken(req);
    return this.userService.update(userId, updateUserDto, userAvatarFile);
  }
}
