import React from "react";
import { Box, Container, Typography, Divider, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Services = () => {
  const navigate = useNavigate();

  const navigateToPostPet = () => {
    navigate("/post-pet");
  };

  const navigateToAdoptPet = () => {
    navigate("/adopt-pet");
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 30 }}>
      <Typography
        variant="h2"
        fontWeight="bold"
        sx={{ textAlign: "center", mb: 10 }}
      >
        Our Services
      </Typography>
      <Divider sx={{ mb: 10 }} />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{
            width: "100%",
            maxWidth: 400,
            py: 2,
            backgroundColor: "#121858", // Midnight Blue
            color: "white", // Ensure text color contrasts well
            "&:hover": {
              backgroundColor: "#0f144d",
            },
          }}
          onClick={navigateToPostPet}
        >
          Post a Pet for Adoption
        </Button>
        <Button
          variant="outlined"
          color="primary"
          size="large"
          sx={{ width: "100%", maxWidth: 400, py: 2 }}
          onClick={navigateToAdoptPet}
        >
          Adopt a Pet
        </Button>
      </Box>
    </Container>
  );
};

export default Services;
