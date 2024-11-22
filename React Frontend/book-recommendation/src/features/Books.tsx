import { useEffect, useState } from "react";
import bookService from "../services/bookService";
import { Book } from "../models/bookModel";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import CustomSearchBar from "../shared/components/common/CustomSearchBar";

const Books = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] =
    useState<string>(searchQuery);
  const [books, setBooks] = useState<Book[]>([]);

  const fetchBooks = async (query: string = "") => {
    try {
      setLoading(true);
      const data = await bookService.getRecommendedBooks(query);

      setBooks(data.content);
    } catch (error) {
      setError("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  // Debounce effect for search query
  useEffect(() => {
    if (searchQuery === "") {
      setDebouncedSearchQuery(""); // Immediately handle clearing the search field
      return;
    }
    if (searchQuery.length >= 2) {
      const handler = setTimeout(() => {
        setDebouncedSearchQuery(searchQuery);
      }, 1000);

      return () => {
        clearTimeout(handler);
      };
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchBooks(debouncedSearchQuery);
  }, [debouncedSearchQuery]);

  const handleClearSearch = () => {
    setSearchQuery(""); // Reset the search query to empty
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress
          color="inherit"
          size="100px"
          sx={{
            color: "#f44336",
          }}
        />
      </Box>
    );
  }

  return (
    <Box>
      <Typography
        noWrap
        variant="h4"
        component="div"
        sx={{
          padding: "25px 25px 15px 0px",
          color: "#f44336",
          fontWeight: "bold",
          fontFamily: "Manrope, sans-serif",
        }}
      >
        Search yourself a Good Book
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "25px 25px 55px 25px",
        }}
      >
        <CustomSearchBar
          searchQuery={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={handleClearSearch}
          placeholder="Search Project"
          width="1000px"
        />
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {books.map((book) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={book.Book}>
              <Card sx={{ height: "100%" }}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    image="assets/placeholderBook.png"
                    alt="Book Cover"
                    sx={{
                      objectFit: "cover", // Ensures the image covers the container
                      objectPosition: "center", // Centers the image
                    }}
                  />
                  <CardContent>
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{
                        fontWeight: "bold",
                        mb: 1,
                        fontFamily: "Manrope, sans-serif",
                      }}
                    >
                      {book.Book}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontStyle: "italic",
                        mb: 2,
                        color: "#f44336",
                        fontFamily: "Manrope, sans-serif",
                      }}
                    >
                      {book.Author}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        fontSize: "0.875rem",
                        fontFamily: "Manrope, sans-serif",
                      }}
                    >
                      {book.Blurb}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Books;
