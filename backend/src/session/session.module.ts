import { Module } from '@nestjs/common';
import { SessionPersistenceModule } from './infrastructure/session-persistence.module';
import { CreateSessionUseCase } from './application/use-cases/create-session.use-case';
import { FindSessionByIdUseCase } from './application/use-cases/find-session-by-id.use-case';
import { UpdateSessionUseCase } from './application/use-cases/update-session.use-case';
import { UpdateSessionByHashUseCase } from './application/use-cases/update-session-by-hash.use-case';
import { DeleteSessionByIdUseCase } from './application/use-cases/delete-session-by-id.use-case';
import { DeleteSessionsByUserIdUseCase } from './application/use-cases/delete-sessions-by-user-id.use-case';
import { DeleteSessionsByUserIdExcludingUseCase } from './application/use-cases/delete-sessions-by-user-id-excluding.use-case';

@Module({
  imports: [SessionPersistenceModule],
  providers: [
    CreateSessionUseCase,
    FindSessionByIdUseCase,
    UpdateSessionUseCase,
    UpdateSessionByHashUseCase,
    DeleteSessionByIdUseCase,
    DeleteSessionsByUserIdUseCase,
    DeleteSessionsByUserIdExcludingUseCase,
  ],
  exports: [
    CreateSessionUseCase,
    FindSessionByIdUseCase,
    UpdateSessionUseCase,
    UpdateSessionByHashUseCase,
    DeleteSessionByIdUseCase,
    DeleteSessionsByUserIdUseCase,
    DeleteSessionsByUserIdExcludingUseCase,
    SessionPersistenceModule,
  ],
})
export class SessionModule {}
