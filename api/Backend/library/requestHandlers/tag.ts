import express, { Request, Response, NextFunction } from 'express';
import { prisma } from '../src/db';

// GETTERS
export async function get_all(req: Request, res: Response){
    const tags = await prisma.tag.findMany();
    res.json(tags);
};
export async function get_one(req: Request, res: Response){
    const tag = await prisma.tag.findUnique({
        where: {
            id: Number(req.params.tag_id)
        }
    });
    if (!tag) {
        res.status(404);
        res.send({ error: 'Tag not found' });
        return;
    }
    res.status(200)
    res.json(tag);
};

export async function get_all_of_book(req: Request, res: Response){
    const bookId = parseInt(req.params.book_id);
    const bookWithTags = await prisma.book.findUnique({
        where: { id: bookId },
        include: { tags: true },
    });

    if (!bookWithTags) {
        return res.status(404).json({ error: 'Book not found' });
    }
    res.json({ tags: bookWithTags.tags });
};

// POSTERS
export async function create_one(req: Request, res: Response){
    const { name, bookIds } = req.body;

    const tag = await prisma.tag.create({
        data: { name }
    });

    // If bookIds are provided, associate the tag with the specified books
    if (bookIds && bookIds.length > 0) {
        const books = await prisma.book.findMany({
            where: {
                id: { in: bookIds }
            }
        });

        // Connect the tag with each specified book
        await prisma.tag.update({
            where: { id: tag.id },
            data: {
                books: {
                    connect: books.map(book => ({ id: book.id }))
                }
            }
        });
    }

    res.status(201).json(tag);
};

export async function associate_tag_with_book(req: Request, res: Response){
    const tagId = parseInt(req.params.tag_id);
    const bookId = parseInt(req.params.book_id);

    const tag = await prisma.tag.findUnique({
        where: { id: tagId }
    });

    if (!tag) {
        return res.status(404).json({ error: 'Tag not found' });
    }

    const book = await prisma.book.findUnique({
        where: { id: bookId }
    });

    if (!book) {
        return res.status(404).json({ error: 'Book not found' });
    }

    // Connect the tag with the book
    await prisma.tag.update({
        where: { id: tagId },
        data: {
            books: {
                connect: { id: bookId }
            }
        }
    });

    res.json(tag);
};

// PATCHERS
export async function update_one(req: Request, res: Response){
    const { name, bookIds } = req.body;

    const tag = await prisma.tag.create({
        data: { name }
    });

    // If bookIds are provided, associate the tag with the specified books
    if (bookIds && bookIds.length > 0) {
        const books = await prisma.book.findMany({
            where: {
                id: { in: bookIds }
            }
        });

        // Connect the tag with each specified book
        await prisma.tag.update({
            where: { id: tag.id },
            data: {
                books: {
                    connect: books.map(book => ({ id: book.id }))
                }
            }
        });
    }

    res.status(201).json(tag);
};

// DELETERS
export async function delete_one(req: Request, res: Response){
    const tag = await prisma.tag.delete({
        where: {
            id: Number(req.params.tag_id)
        }
    });
    res.json(tag);
};

export async function delete_association_with_book(req: Request, res: Response){
    const tagId = parseInt(req.params.tag_id);
    const bookId = parseInt(req.params.book_id);

    await prisma.tag.update({
        where: { id: tagId },
        data: {
            books: {
                disconnect: { id: bookId }
            }
        }
    });

    res.json({ message: 'Association deleted' });
}