import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import bcrypt from 'bcryptjs';

import { RoleEnum } from '../../../../roles/roles.enum';
import { StatusEnum } from '../../../../statuses/statuses.enum';
import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';

@Injectable()
export class UserSeedService {
    constructor(
        @InjectModel(UserEntity)
        private readonly userModel: typeof UserEntity,
    ) {}

    async run(): Promise<{
        admin: UserEntity;
        user: UserEntity;
    }> {
        const admin = await this.upsert({
            email: 'admin@example.com',
            firstName: 'Super',
            lastName: 'Admin',
            role: RoleEnum.admin,
        });

        const user = await this.upsert({
            email: 'user@example.com',
            firstName: 'Uma',
            lastName: 'User',
            role: RoleEnum.user,
        });

        return { admin, user };
    }

    findByEmail(email: string) {
        return this.userModel.findOne({ where: { email } });
    }

    private async upsert(input: {
        email: string;
        firstName: string;
        lastName: string;
        role: RoleEnum;
        password?: string;
    }): Promise<UserEntity> {
        const existing = await this.userModel.findOne({ where: { email: input.email } });
        if (existing) {
            return existing;
        }

        const salt = await bcrypt.genSalt();
        const password = await bcrypt.hash(input.password ?? 'secret', salt);

        return this.userModel.create({
            email: input.email,
            password,
            firstName: input.firstName,
            lastName: input.lastName,
            roleId: input.role,
            statusId: StatusEnum.active,
        } as Parameters<typeof this.userModel.create>[0]);
    }
}
