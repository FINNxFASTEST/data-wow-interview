import { Injectable } from '@nestjs/common';
import { SessionRepository } from '../../infrastructure/persistence/session.repository';
import { User } from '../../../users/domain/user';
import { Session } from '../../domain/session';

@Injectable()
export class DeleteSessionsByUserIdExcludingUseCase {
  constructor(private readonly sessionRepository: SessionRepository) {}

  execute(conditions: {
    userId: User['id'];
    excludeSessionId: Session['id'];
  }): Promise<void> {
    return this.sessionRepository.deleteByUserIdWithExclude(conditions);
  }
}
