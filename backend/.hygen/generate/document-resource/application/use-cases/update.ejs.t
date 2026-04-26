---
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/application/use-cases/update-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.use-case.ts
---
import { Injectable, NotFoundException } from '@nestjs/common';
import { <%= name %>Repository } from '../../infrastructure/persistence/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.repository';
import { <%= name %> } from '../../domain/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>';
import { Update<%= name %>Dto } from '../../presentation/dto/update-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.dto';

@Injectable()
export class Update<%= name %>UseCase {
  constructor(private readonly <%= h.inflection.camelize(name, true) %>Repository: <%= name %>Repository) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(id: string, dto: Update<%= name %>Dto): Promise<<%= name %>> {
    const existing = await this.<%= h.inflection.camelize(name, true) %>Repository.findById(id);
    if (!existing) {
      throw new NotFoundException('<%= name %> not found');
    }

    // Do not remove comment below.
    // <updating-property />
    const updated = await this.<%= h.inflection.camelize(name, true) %>Repository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
    return updated ?? existing;
  }
}
