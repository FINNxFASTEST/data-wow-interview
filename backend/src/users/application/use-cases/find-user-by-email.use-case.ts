import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../infrastructure/persistence/user.repository';
import { User } from '../../domain/user';
import { NullableType } from '../../../utils/types/nullable.type';

@Injectable()
export class FindUserByEmailUseCase {
  constructor(private readonly usersRepository: UserRepository) {}

  execute(email: User['email']): Promise<NullableType<User>> {
    return this.usersRepository.findByEmail(email);
  }
}
