import React from "react";
import {
  Box,
  Container,
  Typography,
  Divider,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Services = () => {
  const navigate = useNavigate();

  const navigateToPostPet = () => {
    navigate("/post-pet");
  };

  const navigateToAdoptPet = () => {
    navigate("/adopt-pet");
  };

  return (
    <Container maxWidth="flex" sx={{ mt: 4, mb: 10 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography
          variant="h2"
          fontWeight="bold"
          sx={{ textAlign: "center", mb: 4, color: "#121858" }}
        >
          Our Services
        </Typography>
        <Divider sx={{ mb: 6, borderColor: "#121858" }} />
      </motion.div>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
        }}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card
            sx={{
              maxWidth: 400,
              backgroundColor: "#f5f8fc",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            <CardContent>
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{ color: "#121858", mb: 2 }}
              >
                Post a Pet for Adoption
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, color: "#555" }}>
                Help a pet find a loving home by posting them for adoption.
              </Typography>
              <Button
                variant="contained"
                size="large"
                sx={{
                  py: 1.5,
                  px: 4,
                  backgroundColor: "#121858",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#0f144d",
                  },
                }}
                onClick={navigateToPostPet}
              >
                Get Started
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card
            sx={{
              maxWidth: 400,
              backgroundColor: "#f5f8fc",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            <CardContent>
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{ color: "#121858", mb: 2 }}
              >
                Learn More
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, color: "#555" }}>
                Looking for a furry friend? Find your perfect match here.
              </Typography>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  py: 1.5,
                  px: 4,
                  borderColor: "#121858",
                  color: "#121858",
                  "&:hover": {
                    backgroundColor: "#f0f4ff",
                    borderColor: "#0f144d",
                  },
                }}
                onClick={navigateToAdoptPet}
              >
                Explore
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    </Container>
  );
};

export default Services;
