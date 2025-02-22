import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { AuthService } from '~/auth/auth.service';
import { JwtInfoDto } from '~/auth/dto/jwt-info';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardType } from './types/update-card.type';

@Controller('cards')
export class CardController {
  constructor(
    private readonly cardService: CardService,
    private readonly authService: AuthService
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCardDto: CreateCardDto) {
    return this.cardService.create(createCardDto);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('cardCoverFile'))
  @HttpCode(HttpStatus.OK)
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateCardBody: UpdateCardType,
    @UploadedFile() cardCoverFile?: Express.Multer.File
  ) {
    const userInfo: JwtInfoDto = this.authService.getUserFromToken(req);
    return this.cardService.update(id, updateCardBody, userInfo, cardCoverFile);
  }
}
