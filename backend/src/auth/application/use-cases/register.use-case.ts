import { Injectable } from '@nestjs/common';
import crypto from 'crypto';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../../../config/config.type';
import { AuthRegisterLoginDto } from '../../dto/auth-register-login.dto';
import { LoginResponseDto } from '../../dto/login-response.dto';
import { RoleEnum } from '../../../roles/roles.enum';
import { StatusEnum } from '../../../statuses/statuses.enum';
import { CreateUserUseCase } from '../../../users/application/use-cases/create-user.use-case';
import { CreateSessionUseCase } from '../../../session/application/use-cases/create-session.use-case';
import { generateTokens } from '../helpers/generate-tokens.helper';

@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<AllConfigType>,
    private readonly createUser: CreateUserUseCase,
    private readonly createSession: CreateSessionUseCase,
  ) {}

  async execute(dto: AuthRegisterLoginDto): Promise<LoginResponseDto> {
    const user = await this.createUser.execute({
      ...dto,
      email: dto.email,
      role: { id: RoleEnum.customer },
      status: { id: StatusEnum.active },
    });

    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    const session = await this.createSession.execute({ user, hash });

    const { token, refreshToken, tokenExpires } = await generateTokens(
      this.jwtService,
      this.configService,
      { id: user.id, role: user.role, sessionId: session.id, hash },
    );

    return { refreshToken, token, tokenExpires, user };
  }
}
