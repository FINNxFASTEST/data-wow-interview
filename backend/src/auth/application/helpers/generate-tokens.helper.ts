import ms from 'ms';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../../../config/config.type';
import { User } from '../../../users/domain/user';
import { Session } from '../../../session/domain/session';

export async function generateTokens(
  jwtService: JwtService,
  configService: ConfigService<AllConfigType>,
  data: {
    id: User['id'];
    role: User['role'];
    sessionId: Session['id'];
    hash: Session['hash'];
  },
): Promise<{ token: string; refreshToken: string; tokenExpires: number }> {
  const tokenExpiresIn = configService.getOrThrow('auth.expires', {
    infer: true,
  });
  const tokenExpires = Date.now() + ms(tokenExpiresIn);

  const [token, refreshToken] = await Promise.all([
    jwtService.signAsync(
      { id: data.id, role: data.role, sessionId: data.sessionId },
      {
        secret: configService.getOrThrow('auth.secret', { infer: true }),
        expiresIn: tokenExpiresIn,
      },
    ),
    jwtService.signAsync(
      { sessionId: data.sessionId, hash: data.hash },
      {
        secret: configService.getOrThrow('auth.refreshSecret', { infer: true }),
        expiresIn: configService.getOrThrow('auth.refreshExpires', {
          infer: true,
        }),
      },
    ),
  ]);

  return { token, refreshToken, tokenExpires };
}
