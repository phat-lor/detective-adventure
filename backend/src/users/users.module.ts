import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UserCrudController } from './crud.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationService } from 'src/auth/auth.service';
import { UserMeController } from './own-user.controller';

@Module({
  imports: [JwtModule.register({})],
  controllers: [UserMeController, UserCrudController],
  providers: [UserService, AuthenticationService],
})
export class UserModule {}
