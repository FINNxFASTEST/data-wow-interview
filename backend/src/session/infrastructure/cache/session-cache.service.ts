import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';
import { AllConfigType } from '../../../config/config.type';
import { Session } from '../../domain/session';
import { User } from '../../../users/domain/user';

type CachedSession = {
    id: string;
    userId: string;
    hash: string;
};

@Injectable()
export class SessionCacheService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(SessionCacheService.name);
    private client: RedisClientType | null = null;
    private readonly redisEnabled: boolean;
    private readonly sessionPrefix: string;
    private readonly sessionTtlSeconds: number;

    constructor(private readonly configService: ConfigService<AllConfigType>) {
        this.redisEnabled = this.configService.get('redis.enabled', { infer: true }) ?? false;
        this.sessionPrefix =
            this.configService.get('redis.sessionPrefix', { infer: true }) ?? 'auth';
        this.sessionTtlSeconds =
            this.configService.get('redis.sessionTtlSeconds', { infer: true }) ?? 60 * 60 * 24 * 30;
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
            this.logger.error(`Redis session cache error: ${error.message}`);
        });

        try {
            await this.client.connect();
            this.logger.log('Redis session cache is connected');
        } catch {
            this.logger.warn('Redis unavailable, falling back to MongoDB-only sessions');
            this.client = null;
        }
    }

    async onModuleDestroy(): Promise<void> {
        if (this.client && this.client.isOpen) {
            await this.client.quit();
        }
    }

    async get(sessionId: Session['id']): Promise<Session | null> {
        const client = this.clientIfReady();
        if (!client) {
            return null;
        }

        try {
            const raw = await client.get(this.sessionKey(sessionId));
            if (!raw) {
                return null;
            }

            const payload = JSON.parse(raw) as CachedSession;
            return this.toDomain(payload);
        } catch (error) {
            this.logger.warn(`Failed to read session cache: ${String(error)}`);
            return null;
        }
    }

    async set(session: Session): Promise<void> {
        const client = this.clientIfReady();
        if (!client || !session.user?.id) {
            return;
        }

        const payload: CachedSession = {
            id: session.id.toString(),
            userId: session.user.id.toString(),
            hash: session.hash,
        };

        const sessionKey = this.sessionKey(session.id);
        const userSessionsKey = this.userSessionsKey(payload.userId);

        try {
            await client
                .multi()
                .set(sessionKey, JSON.stringify(payload), {
                    EX: this.sessionTtlSeconds,
                })
                .sAdd(userSessionsKey, payload.id)
                .expire(userSessionsKey, this.sessionTtlSeconds)
                .exec();
        } catch (error) {
            this.logger.warn(`Failed to write session cache: ${String(error)}`);
        }
    }

    async deleteById(sessionId: Session['id'], userId?: User['id']): Promise<void> {
        const client = this.clientIfReady();
        if (!client) {
            return;
        }

        const resolvedUserId = userId?.toString() ?? (await this.resolveUserId(sessionId));
        const sessionKey = this.sessionKey(sessionId);

        try {
            if (resolvedUserId) {
                await client
                    .multi()
                    .del(sessionKey)
                    .sRem(this.userSessionsKey(resolvedUserId), sessionId.toString())
                    .exec();
                return;
            }

            await client.del(sessionKey);
        } catch (error) {
            this.logger.warn(`Failed to delete session cache: ${String(error)}`);
        }
    }

    async deleteByUserId(userId: User['id']): Promise<void> {
        const client = this.clientIfReady();
        if (!client) {
            return;
        }

        await this.deleteByUserIdInternal(userId.toString());
    }

    async deleteByUserIdWithExclude(
        userId: User['id'],
        excludeSessionId: Session['id'],
    ): Promise<void> {
        const client = this.clientIfReady();
        if (!client) {
            return;
        }

        const userSessionsKey = this.userSessionsKey(userId.toString());
        try {
            const sessionIds = await client.sMembers(userSessionsKey);
            const idsToDelete = sessionIds.filter((id) => id !== excludeSessionId.toString());

            if (idsToDelete.length > 0) {
                await client.del(idsToDelete.map((id) => this.sessionKey(id)));
            }
            if (idsToDelete.length > 0) {
                await client.sRem(userSessionsKey, idsToDelete);
            }
            await client.expire(userSessionsKey, this.sessionTtlSeconds);
        } catch (error) {
            this.logger.warn(`Failed to delete user sessions cache: ${String(error)}`);
        }
    }

    private async deleteByUserIdInternal(userId: string): Promise<void> {
        const client = this.clientIfReady();
        if (!client) {
            return;
        }

        const userSessionsKey = this.userSessionsKey(userId);
        try {
            const sessionIds = await client.sMembers(userSessionsKey);
            if (sessionIds.length > 0) {
                await client.del(sessionIds.map((id) => this.sessionKey(id)));
            }
            await client.del(userSessionsKey);
        } catch (error) {
            this.logger.warn(`Failed to remove all user session cache: ${String(error)}`);
        }
    }

    private async resolveUserId(sessionId: Session['id']): Promise<string | null> {
        const client = this.clientIfReady();
        if (!client) {
            return null;
        }

        try {
            const raw = await client.get(this.sessionKey(sessionId));
            if (!raw) {
                return null;
            }
            const payload = JSON.parse(raw) as CachedSession;
            return payload.userId;
        } catch {
            return null;
        }
    }

    private toDomain(payload: CachedSession): Session {
        const session = new Session();
        session.id = payload.id;
        session.hash = payload.hash;

        const user = new User();
        user.id = payload.userId;
        session.user = user;

        return session;
    }

    private sessionKey(sessionId: Session['id'] | string): string {
        return `${this.sessionPrefix}:session:${sessionId.toString()}`;
    }

    private userSessionsKey(userId: User['id'] | string): string {
        return `${this.sessionPrefix}:user-sessions:${userId.toString()}`;
    }

    private clientIfReady(): RedisClientType | null {
        if (!this.client || !this.client.isReady) {
            return null;
        }
        return this.client;
    }
}
