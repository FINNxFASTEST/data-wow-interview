import { Injectable } from '@nestjs/common';
import { SessionRepository } from '../../infrastructure/persistence/session.repository';
import { Session } from '../../domain/session';

@Injectable()
export class UpdateSessionUseCase {
  constructor(private readonly sessionRepository: SessionRepository) {}

  execute(
    id: Session['id'],
    payload: Partial<
      Omit<Session, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
    >,
  ): Promise<Session | null> {
    return this.sessionRepository.update(id, payload);
  }
}
