import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE
} from '~/utils/validators';

export class CreateUserDto {
  @IsEmail({}, { message: EMAIL_RULE_MESSAGE })
  @IsNotEmpty()
  @IsString()
  @Matches(EMAIL_RULE, { message: EMAIL_RULE_MESSAGE })
  email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(PASSWORD_RULE, { message: PASSWORD_RULE_MESSAGE })
  password: string;
}
