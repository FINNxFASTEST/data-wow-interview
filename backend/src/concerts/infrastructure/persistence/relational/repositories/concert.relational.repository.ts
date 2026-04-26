import { InjectModel } from '@nestjs/sequelize';
import { Injectable } from '@nestjs/common';
import { Concert } from '../../../../domain/concert';
import { ConcertRepository, CreateConcertData } from '../../concert.repository';
import { ConcertEntity } from '../entities/concert.entity';
import { ConcertMapper } from '../mappers/concert.mapper';

@Injectable()
export class ConcertRelationalRepository implements ConcertRepository {
    constructor(
        @InjectModel(ConcertEntity)
        private readonly model: typeof ConcertEntity,
    ) {}

    async create(data: CreateConcertData): Promise<Concert> {
        const row = await this.model.create(
            ConcertMapper.toPersistence(data) as Parameters<typeof this.model.create>[0],
        );
        return ConcertMapper.toDomain(row);
    }

    async findById(id: string): Promise<Concert | null> {
        const row = await this.model.findByPk(id);
        return row ? ConcertMapper.toDomain(row) : null;
    }

    async findAll(): Promise<Concert[]> {
        const rows = await this.model.findAll({ order: [['createdAt', 'DESC']] });
        return rows.map((r) => ConcertMapper.toDomain(r));
    }

    async remove(id: string): Promise<void> {
        const row = await this.model.findByPk(id);
        if (row) {
            await row.destroy();
        }
    }
}
