import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import axios from "axios";

const MyPets = () => {
  const [userPets, setUserPets] = useState([]);

  useEffect(() => {
    const fetchUserPets = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:4000/profile/get", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserPets(response.data);
      } catch (err) {
        console.error("Error fetching user's pets:", err);
      }
    };

    fetchUserPets();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        My Pets
      </Typography>
      <Grid container spacing={3}>
        {userPets.length > 0 ? (
          userPets.map((pet) => (
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
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body1" color="textSecondary">
                No pets found.
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default MyPets;
