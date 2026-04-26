import { Module } from '@nestjs/common';
import { UsersPersistenceModule } from './infrastructure/users-persistence.module';
import { UsersController } from './presentation/users.controller';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { FindUsersUseCase } from './application/use-cases/find-users.use-case';
import { FindUserByIdUseCase } from './application/use-cases/find-user-by-id.use-case';
import { FindUsersByIdsUseCase } from './application/use-cases/find-users-by-ids.use-case';
import { FindUserByEmailUseCase } from './application/use-cases/find-user-by-email.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';
import { RemoveUserUseCase } from './application/use-cases/remove-user.use-case';

@Module({
  imports: [UsersPersistenceModule],
  controllers: [UsersController],
  providers: [
    CreateUserUseCase,
    FindUsersUseCase,
    FindUserByIdUseCase,
    FindUsersByIdsUseCase,
    FindUserByEmailUseCase,
    UpdateUserUseCase,
    RemoveUserUseCase,
  ],
  exports: [
    CreateUserUseCase,
    FindUsersUseCase,
    FindUserByIdUseCase,
    FindUsersByIdsUseCase,
    FindUserByEmailUseCase,
    UpdateUserUseCase,
    RemoveUserUseCase,
    UsersPersistenceModule,
  ],
})
export class UsersModule {}
