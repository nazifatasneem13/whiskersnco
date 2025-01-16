import React from "react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
} from "@mui/material";

const CarouselPetViewer = ({ pet }) => {
  // Retrieve the logged-in user's email from localStorage
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userEmail = currentUser ? currentUser.email : null;

  const navigate = useNavigate();

  const handleViewPet = () => {
    // Prompt the user with a confirmation dialog
    const userConfirmed = window.confirm(
      "Please check out our available pets to adopt."
    );

    if (userConfirmed) {
      // Navigate to the /pets page with the selected pet's ID
      navigate("/pets", { state: { petName: pet.name } });
    }
  };

  const formatTimeAgo = (updatedAt) => {
    const date = new Date(updatedAt);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <Card
      sx={{
        maxWidth: 300,
        borderRadius: "16px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        margin: "1rem",
        backgroundColor: "#ffffff",
        cursor: "pointer",
        "&:hover": { boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.3)" },
      }}
      onClick={handleViewPet}
    >
      {/* Pet Image */}
      <CardMedia
        component="img"
        height="200"
        image={pet.filename} // Cloudinary URL for the pet image
        alt={pet.name}
        sx={{ borderRadius: "16px 16px 0 0" }}
      />

      {/* Pet Details */}
      <CardContent sx={{ textAlign: "center", padding: "1rem" }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", color: "black", marginBottom: "0.5rem" }}
        >
          {pet.name}
        </Typography>

        <Box
          sx={{
            backgroundColor: "#f4f4f4",
            padding: "0.5rem",
            borderRadius: "12px",
            display: "inline-block",
            color: "black",
            fontSize: "0.8rem",
          }}
        >
          Breed: {pet.breed || "Unknown"}
        </Box>
      </CardContent>
    </Card>
  );
};

export default CarouselPetViewer;
