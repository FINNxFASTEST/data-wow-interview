import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AnonymousStrategy } from './strategies/anonymous.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { SessionModule } from '../session/session.module';
import { UsersModule } from '../users/users.module';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { GetMeUseCase } from './application/use-cases/get-me.use-case';
import { UpdateMeUseCase } from './application/use-cases/update-me.use-case';
import { RefreshTokenUseCase } from './application/use-cases/refresh-token.use-case';
import { LogoutUseCase } from './application/use-cases/logout.use-case';
import { SoftDeleteUserUseCase } from './application/use-cases/soft-delete-user.use-case';

@Module({
  imports: [UsersModule, SessionModule, PassportModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    JwtRefreshStrategy,
    AnonymousStrategy,
    LoginUseCase,
    RegisterUseCase,
    GetMeUseCase,
    UpdateMeUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,
    SoftDeleteUserUseCase,
  ],
})
export class AuthModule {}
