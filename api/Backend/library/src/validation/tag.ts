import { object, string, optional, size } from 'superstruct';

export const TagCreationData = object({
    name: size(string(), 1, 50)
});

export const TagUpdateData = object({
    name: optional(size(string(), 1, 50))
});
