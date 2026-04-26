import { Injectable } from '@nestjs/common';
import { SessionRepository } from '../../infrastructure/persistence/session.repository';
import { Session } from '../../domain/session';
import { NullableType } from '../../../utils/types/nullable.type';

@Injectable()
export class FindSessionByIdUseCase {
  constructor(private readonly sessionRepository: SessionRepository) {}

  execute(id: Session['id']): Promise<NullableType<Session>> {
    return this.sessionRepository.findById(id);
  }
}
