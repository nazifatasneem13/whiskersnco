import React from "react";
import footPrint from "./images/footPrint.png";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Container } from "@mui/material";

const PetTraining = () => {
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const handleClick = () => {
    if (currentUser) {
      navigate("/trainpets");
      scrollToTop();
    } else {
      alert("Please log in to train your pet!");
    }
  };

  return (
    <Container
      maxWidth="auto"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        minHeight: "70vh",
        padding: "2rem",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        boxShadow: 3,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          marginBottom: "1.5rem",
          color: "#333",
        }}
      >
        Our Assistant to Train Your Beloved Pet
      </Typography>
      <Typography
        variant="body1"
        sx={{
          marginBottom: "2rem",
          color: "#666",
        }}
      >
        Train your pet with the help of our specialized assistant. Whether it’s
        basic obedience or advanced skills, we’re here to guide you every step
        of the way.
      </Typography>
      <Button
        variant="contained"
        size="large"
        onClick={handleClick}
        sx={{
          padding: "0.75rem 2rem",
          fontWeight: "bold",
          fontSize: "1rem",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          backgroundColor: "#121858",
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#474f97",
          },
        }}
      >
        Train Now
        <img
          src={footPrint}
          alt="footprint"
          style={{
            width: "24px",
          }}
        />
      </Button>
    </Container>
  );
};

export default PetTraining;
