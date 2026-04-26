import { Injectable } from '@nestjs/common';
import { SessionRepository } from '../../infrastructure/persistence/session.repository';
import { Session } from '../../domain/session';

@Injectable()
export class CreateSessionUseCase {
  constructor(private readonly sessionRepository: SessionRepository) {}

  execute(
    data: Omit<Session, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<Session> {
    return this.sessionRepository.create(data);
  }
}
