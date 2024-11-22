export class Book {
  Book: string;
  Author: string;
  Blurb: string;

  constructor(json?: any) {
    this.Book = json?.Book || "";
    this.Author = json?.Author || "";
    this.Blurb = json?.Blurb || "";
  }
}
