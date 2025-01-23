import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import axios from "axios";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const fetchWishlistDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:4000/wishlist/wishlist/details",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setWishlist(response.data);
      } catch (err) {
        console.error("Failed to fetch wishlist details:", err);
      }
    };

    fetchWishlistDetails();
  }, []);

  const handleRemoveFromWishlist = async (petId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:4000/wishlist/wishlistremove",
        { petId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setWishlist((prev) => prev.filter((pet) => pet._id !== petId));
      }
    } catch (err) {
      console.error("Failed to remove pet from wishlist:", err);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Wishlist
      </Typography>
      <Grid container spacing={3}>
        {wishlist.length > 0 ? (
          wishlist.map((pet) => (
            <Grid item xs={12} sm={6} md={4} key={pet._id}>
              <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={pet.filename}
                  alt={pet.name}
                />
                <CardContent>
                  <Typography variant="h6">{pet.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    <b>Type:</b> {pet.type}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <b>Breed:</b> {pet.breed}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <b>Location:</b> {pet.area}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    startIcon={<Delete />}
                    color="error"
                    onClick={() => handleRemoveFromWishlist(pet._id)}
                  >
                    Remove
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body1" color="textSecondary">
                No pets in your wishlist.
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Wishlist;
