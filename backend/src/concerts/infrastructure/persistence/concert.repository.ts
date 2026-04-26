import { Concert } from '../../domain/concert';

export type CreateConcertData = {
    name: string;
    description: string;
    totalSeats: number;
    createdBy: string;
};

export abstract class ConcertRepository {
    abstract create(data: CreateConcertData): Promise<Concert>;

    abstract findById(id: string): Promise<Concert | null>;

    abstract findAll(): Promise<Concert[]>;

    abstract remove(id: string): Promise<void>;
}
