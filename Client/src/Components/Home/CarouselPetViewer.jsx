import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardMedia,
  CardContent,
  Typography,
} from "@mui/material";

const CarouselPetViewer = ({ pet }) => {
  const navigate = useNavigate();

  const handleViewPet = () => {
    navigate("/pets", { state: { petName: pet.name } });
  };

  return (
    <Card
      sx={{
        maxWidth: 350,
        maxHeight: 400,

        borderRadius: "16px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        margin: "1rem",
        backgroundColor: "#ffffff",
        cursor: "pointer",
        position: "relative",
        transition: "transform 0.3s ease, background-color 0.3s ease",
        "&:hover, &:focus-within": {
          transform: "scale(1.1)", // Slightly enlarge the card
          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.4)", // Stronger shadow on hover/touch
          backgroundColor: "#121858", // Midnight blue background
        },
      }}
    >
      {/* Pet Details */}
      <CardContent
        sx={{
          textAlign: "center",
          padding: "1rem",
          color: "black", // Name text turns white on hover
          "&:hover": {
            color: "white", // Ensure hover keeps text white
          },
        }}
      >
        {" "}
        {/* Pet Image */}
        <CardMedia
          component="img"
          height="200"
          image={pet.filename} // Replace with your image URL
          alt={pet.name}
          sx={{
            borderRadius: "16px 16px 0 0",
            transition: "opacity 0.3s ease",
            "&:hover": {
              opacity: 0.9, // Slightly dim image
            },
          }}
        />
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            marginBottom: "0.5rem",
            color: "inherit", // Inherit color from parent
            transition: "color 0.3s ease",
          }}
        >
          {pet.name}
        </Typography>
        <Box
          sx={{
            backgroundColor: "#f4f4f4", // Light gray background
            padding: "0.5rem",
            borderRadius: "12px",
            display: "inline-block",
            fontSize: "0.8rem",
            color: "black", // Explicitly set text color to black
            transition: "background-color 0.3s ease",
            "&:hover": {
              backgroundColor: "#e0e0e0", // Slightly darker gray on hover
            },
          }}
        >
          Breed: {pet.breed || "Unknown"}
        </Box>
        <Box>
          <Button
            type="button"
            variant="outlined"
            color="secondary"
            onClick={handleViewPet}
            sx={{
              mt: 3,
              color: "#ce93d8",
              fontWeight: "bold",
              "&:hover": {
                background: "linear-gradient(90deg, #1b3a79, #19275c)",
                color: "white",
              },
            }}
          >
            View
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CarouselPetViewer;
