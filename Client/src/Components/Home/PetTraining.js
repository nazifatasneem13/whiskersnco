import React from "react";
import footPrint from "./images/footPrint.png";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Container } from "@mui/material";
import { motion } from "framer-motion"; // Import framer-motion

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

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const buttonVariants = {
    hover: {
      scale: 1.1,
      transition: { duration: 0.3 },
    },
    tap: { scale: 0.9 },
  };

  const textVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1, delay: 0.5 } },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
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
        <motion.div variants={textVariants}>
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
        </motion.div>
        <motion.div variants={textVariants}>
          <Typography
            variant="body1"
            sx={{
              marginBottom: "2rem",
              color: "#666",
            }}
          >
            Train your pet with the help of our specialized assistant. Whether
            it’s basic obedience or advanced skills, we’re here to guide you
            every step of the way.
          </Typography>
        </motion.div>
        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
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
        </motion.div>
      </Container>
    </motion.div>
  );
};

export default PetTraining;
