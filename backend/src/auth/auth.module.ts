import { Module } from '@nestjs/common';
import { AuthenticationService } from './auth.service';
import { AuthenticationController } from './auth.controller';
import { AtStrategy, RtStrategy } from './strategies';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from 'src/users/users.service';

@Module({
  imports: [JwtModule.register({})],
  providers: [AuthenticationService, AtStrategy, RtStrategy, UserService],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
