export type RedisConfig = {
    enabled: boolean;
    url?: string;
    host?: string;
    port?: number;
    password?: string;
    db?: number;
    sessionPrefix: string;
    sessionTtlSeconds: number;
};
