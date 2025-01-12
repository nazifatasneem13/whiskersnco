import React, { useState } from "react";
import girlHoldingADog from "./images/girlHoldingADog.jpeg";
import homepageDog from "./images/homepageDog.jpeg";
import footPrint from "./images/footPrint.png";
import PetsOutlinedIcon from "@mui/icons-material/PetsOutlined";
import MessageModal from "../MessageModal/MessageModal";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Typography, Button, Modal } from "@mui/material";

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
    <Box sx={{ padding: "2rem", backgroundColor: "#f9f9f9" }}>
      <Grid container spacing={4} alignItems="center">
        {/* Left Section */}
        <Grid item xs={12} md={6}>
          <Typography
            variant="h1" // Larger font size
            align="left" // Align text to the left
            sx={{
              fontWeight: "bold",
              marginBottom: "1rem",
              fontSize: { xs: "2rem", md: "3rem" }, // Responsive font size
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
              color="primary"
              size="large"
              onClick={handleAdoptClick}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.5rem",
                fontWeight: "bold",
                justifyContent: "center",
                backgroundColor: "#121858",
              }}
            >
              <img src={footPrint} alt="footprint" style={{ width: "20px" }} />
              Adopt a Pet
            </Button>

            {/* Services Button */}
            <Button
              variant="outlined"
              color="secondary"
              size="large"
              onClick={handleServicesClick}
              sx={{
                padding: "0.75rem 1.5rem",
                fontWeight: "bold",
                justifyContent: "center",
              }}
              startIcon={<PetsOutlinedIcon />}
            >
              Give a Pet
            </Button>
          </Box>
        </Grid>

        {/* Right Section */}
        <Grid item xs={12} md={6}>
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
          }}
        >
          <Typography variant="h6" gutterBottom>
            Please log in to adopt a pet.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={closeModal}
            sx={{ marginTop: "1rem", width: "100%" }}
            onClose={closeModal}
            close={close}
          >
            Go to Login
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default HomeLandingContainer;
