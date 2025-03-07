import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '~/auth/auth.module';
import { UsersRepository } from '~/repositories/user.repository';
import { User, UserSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { UserMapper } from './user.mapper';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),

    forwardRef(() => AuthModule)
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserMapper,
    { provide: 'UsersRepositoryInterface', useClass: UsersRepository }
  ],
  exports: [UserService, UserMapper, MongooseModule]
})
export class UserModule {}
