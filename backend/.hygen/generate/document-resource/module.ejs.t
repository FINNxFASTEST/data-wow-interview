---
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>.module.ts
---
import { Module } from '@nestjs/common';
import { <%= h.inflection.transform(name, ['pluralize']) %>PersistenceModule } from './infrastructure/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>-persistence.module';
import { <%= h.inflection.transform(name, ['pluralize']) %>Controller } from './presentation/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>.controller';
import { Create<%= name %>UseCase } from './application/use-cases/create-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.use-case';
import { Find<%= h.inflection.transform(name, ['pluralize']) %>UseCase } from './application/use-cases/find-<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>.use-case';
import { Find<%= name %>ByIdUseCase } from './application/use-cases/find-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>-by-id.use-case';
import { Update<%= name %>UseCase } from './application/use-cases/update-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.use-case';
import { Remove<%= name %>UseCase } from './application/use-cases/remove-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.use-case';

@Module({
  imports: [
    // do not remove this comment
    <%= h.inflection.transform(name, ['pluralize']) %>PersistenceModule,
  ],
  controllers: [<%= h.inflection.transform(name, ['pluralize']) %>Controller],
  providers: [
    Create<%= name %>UseCase,
    Find<%= h.inflection.transform(name, ['pluralize']) %>UseCase,
    Find<%= name %>ByIdUseCase,
    Update<%= name %>UseCase,
    Remove<%= name %>UseCase,
  ],
  exports: [
    Find<%= name %>ByIdUseCase,
    <%= h.inflection.transform(name, ['pluralize']) %>PersistenceModule,
  ],
})
export class <%= h.inflection.transform(name, ['pluralize']) %>Module {}
