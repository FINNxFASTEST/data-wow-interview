import { Injectable } from '@nestjs/common';
import { SessionRepository } from '../../infrastructure/persistence/session.repository';
import { Session } from '../../domain/session';

@Injectable()
export class UpdateSessionByHashUseCase {
  constructor(private readonly sessionRepository: SessionRepository) {}

  execute(
    conditions: { id: Session['id']; hash: Session['hash'] },
    payload: Partial<
      Omit<Session, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
    >,
  ): Promise<Session | null> {
    return this.sessionRepository.updateByHash(conditions, payload);
  }
}
