import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
  Version,
} from '@nestjs/common';
import { AuthenticationService } from './auth.service';
import { AuthenticationDto } from './dto';
import { Tokens } from './types';
import { RefreshTGuard } from 'src/common/guards';
import {
  GetCurrentUser,
  GetCurrentUserId,
  Public,
} from 'src/common/decorators';
import { Response } from 'express';

@Controller('auth')
export class AuthenticationController {
  constructor(private authService: AuthenticationService) {
    this.authService = authService;
  }

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signup(
    @Body() dto: AuthenticationDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Tokens> {
    return this.authService.signupL(dto, res);
  }

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signin(
    @Body() dto: AuthenticationDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Tokens> {
    return this.authService.signinL(dto, res);
  }

  @Post('signout')
  @HttpCode(HttpStatus.OK)
  signout(
    @GetCurrentUserId() userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signout(userId, res);
  }

  @Public()
  @UseGuards(RefreshTGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refreshTokens(userId, refreshToken, res);
  }
}
