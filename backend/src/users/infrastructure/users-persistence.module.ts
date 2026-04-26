import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserEntity } from './persistence/relational/entities/user.entity';
import { UserRepository } from './persistence/user.repository';
import { UserRelationalRepository } from './persistence/relational/repositories/user.relational.repository';

@Module({
    imports: [SequelizeModule.forFeature([UserEntity])],
    providers: [
        {
            provide: UserRepository,
            useClass: UserRelationalRepository,
        },
    ],
    exports: [UserRepository],
})
export class UsersPersistenceModule {}
