import express, { Request, Response, NextFunction } from "express";
import * as author from "../requestHandlers/author";
import * as book from "../requestHandlers/book";
import * as tag from "../requestHandlers/tag";
import { StructError } from "superstruct";
import { delete_association_with_book } from "../requestHandlers/tag";

const app = express();
const port = 3000;
const cors = require("cors");

app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

// AUTHORS
app.get("/authors", author.get_all);
app.get("/authors/:author_id", author.get_one);
app.post("/authors", author.create_one);
app.patch("/authors/:author_id", author.update_one);
app.delete("/authors/:author_id", author.delete_one);

// BOOKS
app.get("/books", book.get_all);
app.get("/books/:book_id", book.get_one);
app.get("/authors/:author_id/books", book.get_all_of_author);
app.post("/authors/:author_id/books", book.create_one_of_author);
app.patch("/books/:book_id", book.update_one);
app.delete("/books/:book_id", book.delete_one);

// TAGS
app.get("/tags", tag.get_all);
app.get("/tags/:tag_id", tag.get_one);
app.get("/books/:book_id/tags", tag.get_all_of_book);
app.post("/tags", tag.create_one);
app.post("/books/:book_id/tags/:tag_id", tag.associate_tag_with_book);
app.patch("/tags/:tag_id", tag.update_one);
app.delete("/tags/:tag_id", tag.delete_one);
app.delete("/books/:book_id/tags/:tag_id", tag.delete_association_with_book);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

//http://localhost:3000/books/5/tags

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send(err.message);
  if (err instanceof StructError) {
    err.status = 400;
  }
});
