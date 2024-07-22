import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationService } from 'src/auth/auth.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [UserController],
  providers: [UserService, AuthenticationService],
})
export class UserModule {}
