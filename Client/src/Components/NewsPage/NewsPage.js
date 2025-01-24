import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Stack,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  CircularProgress,
  CardActionArea,
  Pagination,
} from "@mui/material";

const NewsPage = () => {
  const [articles, setArticles] = useState([]); // Initialize as an array
  const [loading, setLoading] = useState(true); // Loading state
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [articlesPerPage] = useState(12); // Number of articles per page

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/news");
        setArticles(Array.isArray(response.data) ? response.data : []); // Ensure the response is an array
      } catch (err) {
        console.error("Failed to fetch news:", err);
        setArticles([]); // Handle error by setting articles to an empty array
      } finally {
        setLoading(false); // Set loading to false once the API call is complete
      }
    };

    fetchNews();
  }, []);

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const paginatedArticles = articles.slice(
    (currentPage - 1) * articlesPerPage,
    currentPage * articlesPerPage
  );

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (articles.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="80vh"
      >
        <Typography variant="h6" color="textSecondary">
          No articles found right now. Please try again later.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      padding={5}
      sx={{
        display: "lg",
        marginLeft: "2%",
        backgroundColor: "#f9f9f9",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#19275c", marginBottom: 4 }}
      >
        Get All Your Pet-Related News and Articles In One Place!
      </Typography>
      <Grid container spacing={7}>
        {paginatedArticles.map((article, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                height: "auto",
                display: "lg",
                borderRadius: 5,
                flexDirection: "column",
                boxShadow: 3,
                "&:hover": {
                  transform: "scale(1.03)",
                  transition: "transform 0.3s ease",
                },
              }}
            >
              <CardActionArea
                onClick={() => window.open(article.url, "_blank")}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={
                    article.urlToImage || "https://via.placeholder.com/300"
                  }
                  alt={article.title}
                />
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      marginBottom: 1,
                      marginLeft: 1,
                      marginRight: 1,
                    }}
                  >
                    {article.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      marginLeft: 1,
                      marginRight: 1,
                    }}
                  >
                    {article.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  padding: "0 16px 16px",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => window.open(article.url, "_blank")}
                  sx={{ textTransform: "none", backgroundColor: "#19275c" }}
                >
                  Read More
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Stack spacing={2} alignItems="center" justifyContent="center" mt={5}>
        <Pagination
          count={Math.ceil(articles.length / articlesPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          sx={{
            "& .MuiPagination-ul": {
              justifyContent: "center",
            },
          }}
        />
      </Stack>
    </Box>
  );
};

export default NewsPage;
