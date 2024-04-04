import { object, string, integer, optional, size } from 'superstruct';

export const BookCreationData = object({
    title: size(string(), 1, 50),
    publication_year: optional(integer())
});

export const BookUpdateData = object({
    title: optional(size(string(), 1, 100)),
    publication_year: optional(integer())
});
