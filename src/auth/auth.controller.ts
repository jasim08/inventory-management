import {
  Controller,
  HttpStatus,
  HttpCode,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { signInDTO } from './dtos/signIndto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UsePipes(new ValidationPipe())
  signIn(@Body() signInDto: signInDTO) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }
}
