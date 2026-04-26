import {
    Column,
    CreatedAt,
    DataType,
    Default,
    DeletedAt,
    Index,
    Model,
    Table,
    UpdatedAt,
} from 'sequelize-typescript';

import { AuthProvidersEnum } from '../../../../../auth/auth-providers.enum';

@Table({ tableName: 'users', paranoid: true })
export class UserEntity extends Model {
    @Default(DataType.UUIDV4)
    @Column({ type: DataType.UUID, primaryKey: true })
    id!: string;

    @Index({ unique: true })
    @Column({ type: DataType.STRING, allowNull: true })
    email!: string | null;

    @Column({ type: DataType.STRING, allowNull: true })
    password?: string;

    @Default(AuthProvidersEnum.email)
    @Column({ type: DataType.STRING, allowNull: false })
    provider!: string;

    @Column({ type: DataType.STRING, allowNull: true })
    firstName!: string | null;

    @Column({ type: DataType.STRING, allowNull: true })
    lastName!: string | null;

    @Column({ type: DataType.INTEGER, allowNull: true })
    roleId!: number | null;

    @Column({ type: DataType.INTEGER, allowNull: true })
    statusId!: number | null;

    @CreatedAt
    createdAt!: Date;

    @UpdatedAt
    updatedAt!: Date;

    @DeletedAt
    deletedAt?: Date;
}
