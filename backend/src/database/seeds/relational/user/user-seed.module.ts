import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { UserSeedService } from './user-seed.service';

@Module({
    imports: [SequelizeModule.forFeature([UserEntity])],
    providers: [UserSeedService],
    exports: [UserSeedService],
})
export class UserSeedModule {}
