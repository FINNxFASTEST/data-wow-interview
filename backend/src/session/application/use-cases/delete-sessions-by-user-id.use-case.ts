import { Injectable } from '@nestjs/common';
import { SessionRepository } from '../../infrastructure/persistence/session.repository';
import { User } from '../../../users/domain/user';

@Injectable()
export class DeleteSessionsByUserIdUseCase {
  constructor(private readonly sessionRepository: SessionRepository) {}

  execute(conditions: { userId: User['id'] }): Promise<void> {
    return this.sessionRepository.deleteByUserId(conditions);
  }
}
