import {
    BelongsTo,
    Column,
    CreatedAt,
    DataType,
    Default,
    ForeignKey,
    Model,
    Table,
    UpdatedAt,
} from 'sequelize-typescript';

import { ConcertEntity } from '../../../../../concerts/infrastructure/persistence/relational/entities/concert.entity';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

@Table({ tableName: 'reservations' })
export class ReservationEntity extends Model {
    @Default(DataType.UUIDV4)
    @Column({ type: DataType.UUID, primaryKey: true })
    id!: string;

    @ForeignKey(() => UserEntity)
    @Column({ type: DataType.UUID, allowNull: false })
    userId!: string;

    @ForeignKey(() => ConcertEntity)
    @Column({ type: DataType.UUID, allowNull: false })
    concertId!: string;

    @Column({ type: DataType.STRING(20), allowNull: false })
    status!: string;

    @CreatedAt
    createdAt!: Date;

    @UpdatedAt
    updatedAt!: Date;

    @BelongsTo(() => UserEntity, { onDelete: 'CASCADE' })
    user?: UserEntity;

    @BelongsTo(() => ConcertEntity, { onDelete: 'CASCADE' })
    concert?: ConcertEntity;
}
