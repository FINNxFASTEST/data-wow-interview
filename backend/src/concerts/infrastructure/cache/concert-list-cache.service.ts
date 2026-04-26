import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

import { AllConfigType } from '../../../config/config.type';
import { Concert } from '../../domain/concert';
import { ConcertListView } from '../../application/use-cases/find-all-concerts.use-case';

type SerializedConcert = {
    id: string;
    name: string;
    description: string;
    totalSeats: number;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
};

type SerializedConcertListView = {
    concert: SerializedConcert;
    reservedCount: number;
    soldOut: boolean;
    remainingSeats: number;
};

@Injectable()
export class ConcertListCacheService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(ConcertListCacheService.name);
    private client: RedisClientType | null = null;
    private readonly redisEnabled: boolean;
    private readonly keyPrefix: string;
    private readonly ttlSeconds: number;

    constructor(private readonly configService: ConfigService<AllConfigType>) {
        this.redisEnabled = this.configService.get('redis.enabled', { infer: true }) ?? false;
        this.keyPrefix =
            this.configService.get('redis.concertCacheKeyPrefix', { infer: true }) ?? 'concerts';
        this.ttlSeconds =
            this.configService.get('redis.concertCacheTtlSeconds', { infer: true }) ?? 60;
    }

    async onModuleInit(): Promise<void> {
        if (!this.redisEnabled) {
            return;
        }

        const url = this.configService.get('redis.url', { infer: true });
        const host = this.configService.get('redis.host', { infer: true });
        const port = this.configService.get('redis.port', { infer: true });
        const password = this.configService.get('redis.password', { infer: true });
        const db = this.configService.get('redis.db', { infer: true });

        this.client = createClient({
            ...(url ? { url } : {}),
            ...(host
                ? {
                      socket: {
                          host,
                          port: port ?? 6379,
                          connectTimeout: 5000,
                      },
                  }
                : {}),
            ...(password ? { password } : {}),
            ...(typeof db === 'number' ? { database: db } : {}),
        });

        this.client.on('error', (error) => {
            this.logger.error(`Redis concert cache error: ${error.message}`);
        });

        try {
            await this.client.connect();
            this.logger.log('Redis concert cache is connected');
        } catch {
            this.logger.warn('Redis unavailable, concert list responses are not cached');
            this.client = null;
        }
    }

    async onModuleDestroy(): Promise<void> {
        if (this.client && this.client.isOpen) {
            await this.client.quit();
        }
    }

    async getList(): Promise<ConcertListView[] | null> {
        const client = this.clientIfReady();
        if (!client) {
            return null;
        }
        try {
            const raw = await client.get(this.listKey());
            if (!raw) {
                return null;
            }
            const parsed = JSON.parse(raw) as SerializedConcertListView[];
            return parsed.map((row) => this.deserialize(row));
        } catch (error) {
            this.logger.warn(`Failed to read concert list cache: ${String(error)}`);
            return null;
        }
    }

    async setList(views: ConcertListView[]): Promise<void> {
        const client = this.clientIfReady();
        if (!client) {
            return;
        }
        try {
            const payload = views.map((v) => this.serialize(v));
            await client.set(this.listKey(), JSON.stringify(payload), { EX: this.ttlSeconds });
        } catch (error) {
            this.logger.warn(`Failed to write concert list cache: ${String(error)}`);
        }
    }

    async getById(id: string): Promise<ConcertListView | null> {
        const client = this.clientIfReady();
        if (!client) {
            return null;
        }
        try {
            const raw = await client.get(this.viewKey(id));
            if (!raw) {
                return null;
            }
            const row = JSON.parse(raw) as SerializedConcertListView;
            return this.deserialize(row);
        } catch (error) {
            this.logger.warn(`Failed to read concert cache for ${id}: ${String(error)}`);
            return null;
        }
    }

    async setById(id: string, view: ConcertListView): Promise<void> {
        const client = this.clientIfReady();
        if (!client) {
            return;
        }
        try {
            const payload = this.serialize(view);
            await client.set(this.viewKey(id), JSON.stringify(payload), { EX: this.ttlSeconds });
        } catch (error) {
            this.logger.warn(`Failed to write concert cache for ${id}: ${String(error)}`);
        }
    }

    async invalidateList(): Promise<void> {
        const client = this.clientIfReady();
        if (!client) {
            return;
        }
        try {
            await client.del(this.listKey());
        } catch (error) {
            this.logger.warn(`Failed to invalidate concert list cache: ${String(error)}`);
        }
    }

    async invalidateConcertAndList(concertId: string): Promise<void> {
        const client = this.clientIfReady();
        if (!client) {
            return;
        }
        try {
            await client.del([this.viewKey(concertId), this.listKey()]);
        } catch (error) {
            this.logger.warn(`Failed to invalidate concert cache: ${String(error)}`);
        }
    }

    private listKey(): string {
        return `${this.keyPrefix}:list`;
    }

    private viewKey(id: string): string {
        return `${this.keyPrefix}:view:${id}`;
    }

    private clientIfReady(): RedisClientType | null {
        if (!this.client || !this.client.isReady) {
            return null;
        }
        return this.client;
    }

    private serialize(view: ConcertListView): SerializedConcertListView {
        const c = view.concert;
        return {
            concert: {
                id: c.id,
                name: c.name,
                description: c.description,
                totalSeats: c.totalSeats,
                createdBy: c.createdBy,
                createdAt: c.createdAt.toISOString(),
                updatedAt: c.updatedAt.toISOString(),
            },
            reservedCount: view.reservedCount,
            soldOut: view.soldOut,
            remainingSeats: view.remainingSeats,
        };
    }

    private deserialize(row: SerializedConcertListView): ConcertListView {
        const c = new Concert();
        c.id = row.concert.id;
        c.name = row.concert.name;
        c.description = row.concert.description;
        c.totalSeats = row.concert.totalSeats;
        c.createdBy = row.concert.createdBy;
        c.createdAt = new Date(row.concert.createdAt);
        c.updatedAt = new Date(row.concert.updatedAt);
        return {
            concert: c,
            reservedCount: row.reservedCount,
            soldOut: row.soldOut,
            remainingSeats: row.remainingSeats,
        };
    }
}
