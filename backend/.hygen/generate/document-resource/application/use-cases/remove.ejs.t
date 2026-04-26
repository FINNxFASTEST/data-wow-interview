---
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/application/use-cases/remove-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.use-case.ts
---
import { Injectable } from '@nestjs/common';
import { <%= name %>Repository } from '../../infrastructure/persistence/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.repository';
import { <%= name %> } from '../../domain/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>';

@Injectable()
export class Remove<%= name %>UseCase {
  constructor(private readonly <%= h.inflection.camelize(name, true) %>Repository: <%= name %>Repository) {}

  execute(id: <%= name %>['id']): Promise<void> {
    return this.<%= h.inflection.camelize(name, true) %>Repository.remove(id);
  }
}
