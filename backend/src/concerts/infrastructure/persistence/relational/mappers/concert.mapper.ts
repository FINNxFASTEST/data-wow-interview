import { Concert } from '../../../../domain/concert';
import { ConcertEntity } from '../entities/concert.entity';

export class ConcertMapper {
    static toDomain(raw: ConcertEntity): Concert {
        const c = new Concert();
        c.id = raw.id;
        c.name = raw.name;
        c.description = raw.description;
        c.totalSeats = raw.totalSeats;
        c.createdBy = raw.createdBy;
        c.createdAt = raw.createdAt;
        c.updatedAt = raw.updatedAt;
        return c;
    }

    static toPersistence(
        data: Pick<Concert, 'name' | 'description' | 'totalSeats' | 'createdBy'>,
    ): Partial<ConcertEntity> {
        return {
            name: data.name,
            description: data.description,
            totalSeats: data.totalSeats,
            createdBy: data.createdBy,
        };
    }
}
