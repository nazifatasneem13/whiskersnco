import React, { useState } from "react";
import girlHoldingADog from "./images/girlHoldingADog.jpeg";
import homepageDog from "./images/homepageDog.jpeg";
import footPrint from "./images/footPrint.png";
import PetsOutlinedIcon from "@mui/icons-material/PetsOutlined";
import MessageModal from "../MessageModal/MessageModal";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Typography, Button, Modal } from "@mui/material";
import { motion } from "framer-motion";

const HomeLandingContainer = (props) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  const handleAdoptClick = () => {
    if (currentUser) {
      navigate("/pets");
      scrollToTop();
    } else {
      setIsModalOpen(true);
    }
  };

  const handleServicesClick = () => {
    if (currentUser) {
      navigate("/services");
      scrollToTop();
    } else {
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    navigate("/login");
    setIsModalOpen(false);
  };

  const close = () => {
    setIsModalOpen(false);
  };

  return (
    <Box
      sx={{
        ml: "2%",
        display: "flex",
        padding: "2rem",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Grid container spacing={4} alignItems="center">
        {/* Left Section */}
        <Grid item md={6}>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h1"
              sx={{
                fontWeight: "bold",
                marginBottom: "1rem",
                fontSize: { xs: "2rem", md: "3.5rem" },
                color: "#121858",
              }}
            >
              Your Pets
              <br />
              Are Always
              <br />
              Our Top Priority
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "#666", marginBottom: "2rem" }}
            >
              {props.description}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Adopt Button */}
              <Button
                variant="contained"
                size="large"
                onClick={handleAdoptClick}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.85rem 2rem",
                  fontWeight: "bold",
                  backgroundColor: "#121858",
                  fontSize: "1.1rem",
                  textTransform: "none",
                  borderRadius: "30px",
                  boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#0e1142",
                    transform: "scale(1.05)",
                  },
                }}
              >
                <img
                  src={footPrint}
                  alt="footprint"
                  style={{ width: "20px" }}
                />
                Adopt a Pet
              </Button>

              {/* Services Button */}
              <Button
                variant="outlined"
                size="large"
                onClick={handleServicesClick}
                sx={{
                  padding: "0.85rem 2rem",
                  fontWeight: "bold",
                  borderColor: "#121858",
                  color: "#121858",
                  fontSize: "1.1rem",
                  textTransform: "none",
                  borderRadius: "30px",
                  boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "#0e1142",
                    backgroundColor: "#f0f4ff",
                    transform: "scale(1.05)",
                  },
                }}
                startIcon={<PetsOutlinedIcon />}
              >
                Give a Pet
              </Button>
            </Box>
          </motion.div>
        </Grid>

        {/* Right Section */}
        <Grid item xs={12} md={6} display={"flex"}>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Box sx={{ textAlign: "center" }}>
              <img
                src={girlHoldingADog}
                alt="Girl holding a dog"
                style={{
                  width: "100%",
                  maxWidth: "500px",
                  borderRadius: "8px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                }}
              />
            </Box>
          </motion.div>
        </Grid>
      </Grid>

      {/* Modal */}
      <Modal open={isModalOpen} onClose={close}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: "8px",
            boxShadow: 24,
            p: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Please log in to adopt a pet.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={closeModal}
            sx={{
              marginTop: "1rem",
              width: "100%",
              backgroundColor: "#121858",
              fontSize: "1rem",
              fontWeight: "bold",
              textTransform: "none",
              borderRadius: "30px",
              boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)",
              "&:hover": {
                backgroundColor: "#0e1142",
                transform: "scale(1.05)",
              },
            }}
          >
            Go to Login
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default HomeLandingContainer;
