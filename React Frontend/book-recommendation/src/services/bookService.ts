import axios from "axios";
import { Book } from "../models/book.model";

const BASE_URL = "http://127.0.0.1:8000/recommendations";

const getRecommendedBooks = async (
  userPreference: string = ""
): Promise<{ content: Book[] }> => {
  try {
    const url = `${BASE_URL}/recommend?preference=${encodeURIComponent(
      userPreference
    )}`;
    const response = await axios.get(url);
    const bookData: Book[] = response.data.recommendations.map(
      (book: any) => new Book(book)
    );
    return {
      content: bookData,
    };
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    throw error;
  }
};

const booksService = {
  getRecommendedBooks,
};

export default booksService;
