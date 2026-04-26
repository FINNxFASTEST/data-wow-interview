import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import crypto from 'crypto';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../../../config/config.type';
import { AuthProvidersEnum } from '../../auth-providers.enum';
import { AuthEmailLoginDto } from '../../dto/auth-email-login.dto';
import { LoginResponseDto } from '../../dto/login-response.dto';
import { FindUserByEmailUseCase } from '../../../users/application/use-cases/find-user-by-email.use-case';
import { CreateSessionUseCase } from '../../../session/application/use-cases/create-session.use-case';
import { generateTokens } from '../helpers/generate-tokens.helper';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<AllConfigType>,
    private readonly findUserByEmail: FindUserByEmailUseCase,
    private readonly createSession: CreateSessionUseCase,
  ) {}

  async execute(loginDto: AuthEmailLoginDto): Promise<LoginResponseDto> {
    const user = await this.findUserByEmail.execute(loginDto.email);

    if (!user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: { email: 'notFound' },
      });
    }

    if (user.provider !== AuthProvidersEnum.email) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: { email: `needLoginViaProvider:${user.provider}` },
      });
    }

    if (!user.password) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: { password: 'incorrectPassword' },
      });
    }

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isValidPassword) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: { password: 'incorrectPassword' },
      });
    }

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
