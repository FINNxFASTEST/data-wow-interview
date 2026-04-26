import { Injectable } from '@nestjs/common';
import { JwtRefreshPayloadType } from '../../strategies/types/jwt-refresh-payload.type';
import { DeleteSessionByIdUseCase } from '../../../session/application/use-cases/delete-session-by-id.use-case';

@Injectable()
export class LogoutUseCase {
  constructor(private readonly deleteSessionById: DeleteSessionByIdUseCase) {}

  execute(data: Pick<JwtRefreshPayloadType, 'sessionId'>): Promise<void> {
    return this.deleteSessionById.execute(data.sessionId);
  }
}
