---
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/infrastructure/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>-persistence.module.ts
---
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  <%= name %>Schema,
  <%= name %>SchemaClass,
} from './persistence/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.schema';
import { <%= name %>Repository } from './persistence/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.repository';
import { <%= name %>DocumentRepository } from './persistence/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.document-repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: <%= name %>SchemaClass.name, schema: <%= name %>Schema },
    ]),
  ],
  providers: [
    {
      provide: <%= name %>Repository,
      useClass: <%= name %>DocumentRepository,
    },
  ],
  exports: [<%= name %>Repository],
})
export class <%= h.inflection.transform(name, ['pluralize']) %>PersistenceModule {}
