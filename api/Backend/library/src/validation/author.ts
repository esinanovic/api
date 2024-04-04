import {object, string, optional, size, refine, integer} from 'superstruct';
export const AuthorCreationData = object({
    firstname: size(string(), 1, 50),
    lastname: size(string(), 1, 50),
});
export const AuthorUpdateData = object({
    firstname: optional(size(string(), 1, 50)),
    lastname: optional(size(string(), 1, 50)),
});
export const AuthorGetAllQuery = object({
    lastname: optional(string()),
    hasBooks: optional(refine(string(), 'true', (value) => value === 'true')),
    include: optional(refine(string(), 'include', (value) => value === 'books')),
    skip: optional(refine(string(), 'int', (value) => integer())),
    take: optional(refine(string(), 'int', (value) => integer())),
});