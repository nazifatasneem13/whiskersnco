import React, { useEffect, useState } from "react";
import axios from "axios";
import CarouselPetViewer from "./CarouselPetViewer"; // Ensure this path is correct
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  IconButton,
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos, Speed } from "@mui/icons-material"; // Import icons
import footPrint from "./images/footPrint.png";

const PreferredPetsCarousel = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [speedIndex, setSpeedIndex] = useState(1); // Default speed index
  const speedLevels = [50, 25, 15, 5]; // Speed levels in seconds for animation

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const fetchPets = async () => {
    try {
      setLoading(true);
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));

      if (currentUser) {
        // If the user is logged in, fetch the user's profile and preferred pets.
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          "http://localhost:4000/users/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const userId = data._id;
        const petsResponse = await axios.post(
          "http://localhost:4000/preferredPets",
          { userId }
        );
        setPets(petsResponse.data);
      } else {
        // If the user is not logged in, fetch all approved pets.
        const petsResponse = await axios.post(
          "http://localhost:4000/notpreferredPets"
        );
        setPets(petsResponse.data);
      }
    } catch (error) {
      console.error("Error fetching preferred pets or user ID:", error);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  // Create a duplicate list of pets for infinite scrolling
  const duplicatedPets = pets.concat(pets);

  const handleAdoptClick = () => {
    if (currentUser) {
      window.location.href = "/pets";
    } else {
      alert("Please log in to adopt a pet!");
    }
  };

  // Decrease speed when left button is clicked
  const decreaseSpeed = () => {
    setSpeedIndex((prevIndex) =>
      Math.min(prevIndex - 1, speedLevels.length + 1)
    );
  };

  // Increase speed when right button is clicked
  const increaseSpeed = () => {
    setSpeedIndex((prevIndex) => Math.max(prevIndex + 1, 0));
  };

  return (
    <Box sx={{ alignItems: "center", textAlign: "center", padding: "2rem" }}>
      <Typography
        variant="h2"
        sx={{
          fontWeight: "bold",
          marginBottom: "1rem",
          display: "flex",
          justifyContent: "center",
          color: "#121858",
        }}
      >
        You Might Be Interested...
      </Typography>
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}
      <Box
        sx={{
          marginTop: "2rem",
          display: "flex",
          justifyContent: "flex-end", // Aligns the button to the right
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleAdoptClick}
          sx={{
            padding: "10px 20px",
            fontWeight: "bold",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            backgroundColor: "#121858",
          }}
        >
          See All Pets
          <img
            src={footPrint}
            alt="footprint"
            style={{ marginLeft: "5px", width: "20px" }}
          />
        </Button>
      </Box>
      {pets.length > 0 ? (
        <Box>
          <Box
            sx={{
              position: "relative",
              overflow: "hidden",
              width: "100%",
              maxWidth: "1200px",
              margin: "0 auto",
            }}
          >
            {/* Left and Right Scroll Buttons */}
            <IconButton
              onClick={decreaseSpeed}
              sx={{
                position: "absolute",
                top: "50%",
                left: "10px",
                transform: "translateY(-50%)",
                zIndex: 10,
                backgroundColor: "#fff",
                "&:hover": { backgroundColor: "#ddd" },
              }}
            >
              <ArrowBackIos />
            </IconButton>
            <IconButton
              onClick={increaseSpeed}
              sx={{
                position: "absolute",
                top: "50%",
                right: "10px",
                transform: "translateY(-50%)",
                zIndex: 10,
                backgroundColor: "#fff",
                "&:hover": { backgroundColor: "#ddd" },
              }}
            >
              <ArrowForwardIos />
            </IconButton>

            {/* Carousel Track */}
            <Box
              sx={{
                display: "flex",
                animation: `scroll ${speedLevels[speedIndex]}s linear infinite`,
                "&:hover": { animationPlayState: "paused" },
              }}
            >
              {duplicatedPets.map((pet, index) => (
                <Box
                  key={index}
                  sx={{
                    flex: "0 0 auto",
                    width: "calc(100% / 5)", // Display 5 items at a time
                    padding: "8px",
                  }}
                >
                  <CarouselPetViewer pet={pet} />
                </Box>
              ))}
            </Box>
          </Box>
          {/* Speed Display */}
          <Box
            sx={{
              marginTop: "1rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Speed sx={{ color: "secondary.main" }} />
            <Typography
              variant="body1"
              sx={{ fontWeight: "bold" }}
            ></Typography>
          </Box>
        </Box>
      ) : (
        <Typography>No pets found matching your preferences.</Typography>
      )}
      {/* CSS for continuous scrolling */}
      <style>
        {`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}
      </style>
    </Box>
  );
};

export default PreferredPetsCarousel;
