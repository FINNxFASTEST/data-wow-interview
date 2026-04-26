import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionSchema, SessionSchemaClass } from './persistence/session.schema';
import { SessionRepository } from './persistence/session.repository';
import { SessionDocumentRepository } from './persistence/session.document-repository';
import { SessionCacheService } from './cache/session-cache.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: SessionSchemaClass.name, schema: SessionSchema }]),
    ],
    providers: [
        SessionCacheService,
        {
            provide: SessionRepository,
            useClass: SessionDocumentRepository,
        },
    ],
    exports: [SessionRepository],
})
export class SessionPersistenceModule {}
