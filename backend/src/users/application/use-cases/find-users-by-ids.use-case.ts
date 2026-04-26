import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../infrastructure/persistence/user.repository';
import { User } from '../../domain/user';

@Injectable()
export class FindUsersByIdsUseCase {
  constructor(private readonly usersRepository: UserRepository) {}

  execute(ids: User['id'][]): Promise<User[]> {
    return this.usersRepository.findByIds(ids);
  }
}
