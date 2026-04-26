import { Injectable } from '@nestjs/common';
import { User } from '../../../users/domain/user';
import { RemoveUserUseCase } from '../../../users/application/use-cases/remove-user.use-case';

@Injectable()
export class SoftDeleteUserUseCase {
  constructor(private readonly removeUser: RemoveUserUseCase) {}

  execute(user: User): Promise<void> {
    return this.removeUser.execute(user.id);
  }
}
