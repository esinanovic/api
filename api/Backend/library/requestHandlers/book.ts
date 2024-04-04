import express, { Request, Response, NextFunction } from 'express';
import { prisma } from '../src/db';
import { Prisma } from '@prisma/client';
import {BookCreationData, BookUpdateData} from "../src/validation/book";
import {assert} from "superstruct";
import {HttpError} from "../src/error";

// GETTERS
export async function get_all(req: Request, res: Response) {
    const { title, include, skip, take } = req.query;
    const filter: Prisma.BookWhereInput = {};
    if (title) {
        filter.title = { contains: String(title) };
    }
    const assoc: Prisma.BookInclude = {};
    if (include === 'author') {
        assoc.author = { select: { id: true, firstname: true, lastname: true } };
    }
    const books = await prisma.book.findMany({
        where: filter,
        include: assoc,
        orderBy: { title: 'asc' },
        skip: skip ? Number(skip) : undefined,
        take: take ? Number(take) : undefined
    });
    const bookCount = await prisma.book.count({ where: filter });
    res.header('X-Total-Count', String(bookCount));
    res.json(books);
};

export async function get_one(req: Request, res: Response){
    const book = await prisma.book.findUnique({
        where: {
            id: Number(req.params.book_id)
        }
    });
    if (!book) {
        res.status(404);
        res.send({ error: 'Book not found' });
        return;
    }
    res.status(200)
    res.json(book);
};

export async function get_all_of_author(req: Request, res: Response){
    const title = req.query.title as string;
    const books = await prisma.book.findMany({
        where: {
            authorId: Number(req.params.author_id),
            title: {
                contains: title
            }
        },
        orderBy: {
            title: 'asc'
        }
    });
    res.json(books);
};

// POSTERS
export async function create_one_of_author(req: Request, res: Response) {
    assert(req.body, BookCreationData);
    const book = await prisma.book.create({
        data: {
            ...req.body,
            author: {
                connect: {
                    id: Number(req.params.author_id)
                }
            }
        }
    });
    res.status(201).json(book);
};


// PATCHERS
export async function update_one(req: Request, res: Response) {
    assert(req.body, BookUpdateData);
    try {
        const book = await prisma.book.update({
            where: {
                id: Number(req.params.book_id)
            },
            data: req.body
        });
        res.json(book);
    }
    catch (err) {
        throw new HttpError('Book not found', 404);
    }
};


// DELETERS
export async function delete_one(req: Request, res: Response) {
    const deletedAuthor = await prisma.author.delete({
        where: {
            id: parseInt(req.params.book_id)
        }
    });
    if (deletedAuthor) {
        res.status(200).send("Book deleted");
    } else {
        res.status(404).send("Book not found");
    }
}
