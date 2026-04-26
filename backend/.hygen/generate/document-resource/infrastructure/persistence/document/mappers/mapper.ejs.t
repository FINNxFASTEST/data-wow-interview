---
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/infrastructure/persistence/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.mapper.ts
---
import { <%= name %> } from '../../domain/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>';
import { <%= name %>SchemaClass } from './<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.schema';

export class <%= name %>Mapper {
  public static toDomain(raw: <%= name %>SchemaClass): <%= name %> {
    const domain = new <%= name %>();
    domain.id = raw._id.toString();
    // Map fields here
    domain.createdAt = raw.createdAt;
    domain.updatedAt = raw.updatedAt;
    return domain;
  }

  public static toPersistence(domain: <%= name %>): <%= name %>SchemaClass {
    const doc = new <%= name %>SchemaClass();
    if (domain.id) doc._id = domain.id;
    // Map fields here
    doc.createdAt = domain.createdAt;
    doc.updatedAt = domain.updatedAt;
    return doc;
  }
}
