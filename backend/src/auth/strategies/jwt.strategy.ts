import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { OrNeverType } from '../../utils/types/or-never.type';
import { JwtPayloadType } from './types/jwt-payload.type';
import { AllConfigType } from '../../config/config.type';
import { FindSessionByIdUseCase } from '../../session/application/use-cases/find-session-by-id.use-case';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        configService: ConfigService<AllConfigType>,
        private readonly findSessionById: FindSessionByIdUseCase,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.getOrThrow('auth.secret', { infer: true }),
        });
    }

    public async validate(payload: JwtPayloadType): Promise<OrNeverType<JwtPayloadType>> {
        if (!payload.id || !payload.sessionId) {
            throw new UnauthorizedException();
        }

        const session = await this.findSessionById.execute(payload.sessionId);
        if (!session || session.user?.id !== payload.id) {
            throw new UnauthorizedException();
        }

        return payload;
    }
}
