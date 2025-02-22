import { PartialType } from '@nestjs/mapped-types';
import { IsString, Matches } from 'class-validator';
import { PASSWORD_RULE, PASSWORD_RULE_MESSAGE } from '~/utils/validators';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  dipslayName: string;

  @IsString()
  @Matches(PASSWORD_RULE, { message: PASSWORD_RULE_MESSAGE })
  current_password: string;

  @IsString()
  avatar: string;

  @IsString()
  @Matches(PASSWORD_RULE, { message: PASSWORD_RULE_MESSAGE })
  new_password: string;
}
