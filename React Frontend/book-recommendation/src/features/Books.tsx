import { useEffect, useState } from "react";
import bookService from "../services/bookService";
import { Book } from "../models/book.model";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  Grow,
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
      setError("Failed to fetch Books");
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
      }, 10000);

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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "25px 25px 0px 25px",
          height: "50vh",
        }}
      >
        <Typography
          noWrap
          variant="h4"
          component="div"
          sx={{
            color: "#f44336",
            fontWeight: "bold",
            fontFamily: "Manrope, sans-serif",
            marginBottom: "20px", // Space between the title and search bar
          }}
        >
          Find yourself a Good Book
        </Typography>
        <CustomSearchBar
          searchQuery={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={handleClearSearch}
          placeholder="ඔබට අවශ්‍ය කිනම් අකාරයක පොතක් දැයි සිංහලෙන් සදහන් කරන්න..."
          // placeholder="ඔබ කැමති මොන වගේ පොත් වලටද?"
        />
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {books.map((book, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={book.Book}>
              <Grow in={true} timeout={index * 500}>
                <Card sx={{ height: "100%" }}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      image="assets/placeholderBook.png"
                      alt="Book Cover"
                      sx={{
                        objectFit: "cover",
                        objectPosition: "center",
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
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Books;
