import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../infrastructure/persistence/user.repository';
import { User } from '../../domain/user';

@Injectable()
export class RemoveUserUseCase {
  constructor(private readonly usersRepository: UserRepository) {}

  execute(id: User['id']): Promise<void> {
    return this.usersRepository.remove(id);
  }
}
