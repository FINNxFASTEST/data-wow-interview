import { InjectModel } from '@nestjs/sequelize';
import { Injectable } from '@nestjs/common';
import { Op, Order, WhereOptions } from 'sequelize';

import { DeepPartial } from '../../../../../utils/types/deep-partial.type';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { FilterUserDto, SortUserDto } from '../../../../presentation/dto/query-user.dto';
import { User } from '../../../../domain/user';
import { UserRepository } from '../../user.repository';
import { UserEntity } from '../entities/user.entity';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UserRelationalRepository implements UserRepository {
    constructor(
        @InjectModel(UserEntity)
        private readonly userModel: typeof UserEntity,
    ) {}

    async create(data: Omit<User, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>): Promise<User> {
        const created = await this.userModel.create(
            UserMapper.toPersistence(data as User) as Parameters<typeof this.userModel.create>[0],
        );
        return UserMapper.toDomain(created);
    }

    async findManyWithPagination({
        filterOptions,
        sortOptions,
        paginationOptions,
    }: {
        filterOptions?: FilterUserDto | null;
        sortOptions?: SortUserDto[] | null;
        paginationOptions: IPaginationOptions;
    }): Promise<User[]> {
        const where: WhereOptions<UserEntity> = {};

        if (filterOptions?.roles?.length) {
            (where as Record<string, unknown>)['roleId'] = {
                [Op.in]: filterOptions.roles.map((role) =>
                    typeof role.id === 'string' ? parseInt(String(role.id), 10) : role.id,
                ),
            };
        }

        const order: Order = (sortOptions ?? []).map((sort) => [
            this.resolveOrderColumn(sort.orderBy),
            sort.order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC',
        ]);

        if (order.length === 0) {
            order.push(['id', 'ASC']);
        }

        const rows = await this.userModel.findAll({
            where,
            order,
            limit: paginationOptions.limit,
            offset: (paginationOptions.page - 1) * paginationOptions.limit,
        });

        return rows.map((row) => UserMapper.toDomain(row));
    }

    async findById(id: User['id']): Promise<NullableType<User>> {
        const row = await this.userModel.findByPk(id);
        return row ? UserMapper.toDomain(row) : null;
    }

    async findByIds(ids: User['id'][]): Promise<User[]> {
        if (!ids.length) {
            return [];
        }
        const rows = await this.userModel.findAll({ where: { id: { [Op.in]: ids } } });
        return rows.map((row) => UserMapper.toDomain(row));
    }

    async findByEmail(email: User['email']): Promise<NullableType<User>> {
        if (!email) {
            return null;
        }
        const row = await this.userModel.findOne({ where: { email } });
        return row ? UserMapper.toDomain(row) : null;
    }

    async update(id: User['id'], payload: DeepPartial<User>): Promise<User | null> {
        const row = await this.userModel.findByPk(id);
        if (!row) {
            return null;
        }
        const current = UserMapper.toDomain(row);
        const merged = { ...current, ...payload, id: current.id } as User;
        await row.update(UserMapper.toPersistence(merged) as Parameters<UserEntity['update']>[0]);
        await row.reload();
        return UserMapper.toDomain(row);
    }

    async remove(id: User['id']): Promise<void> {
        const row = await this.userModel.findByPk(id);
        if (row) {
            await row.destroy();
        }
    }

    private resolveOrderColumn(orderBy: SortUserDto['orderBy']): keyof UserEntity {
        const key = orderBy as string;
        if (key === 'id') {
            return 'id';
        }
        if (key === 'role') {
            return 'roleId';
        }
        if (key === 'status') {
            return 'statusId';
        }
        if (
            key === 'email' ||
            key === 'password' ||
            key === 'provider' ||
            key === 'firstName' ||
            key === 'lastName' ||
            key === 'createdAt' ||
            key === 'updatedAt' ||
            key === 'deletedAt'
        ) {
            return key;
        }
        return 'id';
    }
}
