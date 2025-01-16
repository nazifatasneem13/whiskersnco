import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Paper,
  Snackbar,
  Alert,
  Avatar,
  IconButton,
} from "@mui/material";
import {
  Email,
  Phone,
  Pets,
  Home,
  FamilyRestroom,
  Close,
} from "@mui/icons-material";

function AdoptForm({ pet, closeForm }) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [email] = useState(currentUser ? currentUser.email : "");
  const [phoneNo, setPhoneNo] = useState("");
  const [livingSituation, setLivingSituation] = useState("");
  const [previousExperience, setPreviousExperience] = useState("");
  const [familyComposition, setFamilyComposition] = useState("");
  const [formError, setFormError] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // To store the timeout ID so that it can be cleared if needed
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    // Cleanup the timeout when the component unmounts
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !phoneNo ||
      !livingSituation ||
      !previousExperience ||
      !familyComposition
    ) {
      setFormError(true);
      setSnackbar({
        open: true,
        message: "Please fill out all fields.",
        severity: "error",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch("http://localhost:4000/form/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          phoneNo,
          livingSituation,
          previousExperience,
          familyComposition,
          petId: pet._id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit the form.");
      }

      setSnackbar({
        open: true,
        message: `Adoption form for ${pet.name} submitted successfully!`,
        severity: "success",
      });
      setPhoneNo("");
      setLivingSituation("");
      setPreviousExperience("");
      setFamilyComposition("");

      // Set a timeout to close the form after the Snackbar is visible
      const id = setTimeout(() => {
        closeForm();
      }, 3000); // 3 seconds delay
      setTimeoutId(id);
    } catch (error) {
      setSnackbar({ open: true, message: error.message, severity: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper
      elevation={6}
      sx={{
        maxWidth: "1100px", // Increased width to 1100px
        width: "100%",
        margin: "0.7rem auto",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        position: "relative", // Added for proper positioning of the close button
        fontFamily: "'Roboto', sans-serif", // Changed font
      }}
    >
      {/* Close Button */}
      <IconButton
        aria-label="close"
        onClick={closeForm}
        sx={{
          position: "absolute",
          top: "10px",
          right: "10px",
          color: "#757575",
        }}
      >
        <Close />
      </IconButton>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        {/* Left Side: Pet Image */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f9f9f9",
            padding: "1rem",
            minWidth: "auto",
            maxWidth: "auto", // Ensures minimum width for the image
          }}
        >
          <Avatar
            src={pet.cloudinaryUrl || pet.filename}
            alt={pet.name}
            sx={{
              width: "490px", // Larger square image
              height: "400px",
              borderRadius: "8px", // Makes the image square with slightly rounded corners
            }}
          />
        </Box>

        {/* Right Side: Pet Info and Form */}
        <Box
          sx={{
            flex: 1,
            padding: "2rem",
            minWidth: "auto",
            maxWidth: "auto",
          }}
        >
          {/* Header */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "#1a237e", // Updated color
              marginBottom: "1rem",
            }}
          >
            Adopt {pet.name}
          </Typography>

          {/* Pet Info */}
          <Box sx={{ marginBottom: "1.5rem" }}>
            <Typography
              variant="body1"
              sx={{ color: "#424242", fontFamily: "'Roboto', sans-serif" }}
            >
              <b>Type:</b> {pet.type}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "#424242", fontFamily: "'Roboto', sans-serif" }}
            >
              <b>Breed:</b> {pet.breed}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "#424242", fontFamily: "'Roboto', sans-serif" }}
            >
              <b>Age:</b> {pet.age} months
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "#424242", fontFamily: "'Roboto', sans-serif" }}
            >
              <b>Location:</b> {pet.area}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "#424242", fontFamily: "'Roboto', sans-serif" }}
            >
              <b>Division:</b> {pet.division}
            </Typography>
          </Box>

          {/* Form */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              label="Email"
              value={email}
              InputProps={{
                readOnly: true,
                startAdornment: <Email sx={{ color: "#757575", mr: 1 }} />,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "#f9f9f9",
                },
              }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Phone Number"
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
              InputProps={{
                startAdornment: <Phone sx={{ color: "#757575", mr: 1 }} />,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "#f9f9f9",
                },
              }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Living Situation"
              value={livingSituation}
              onChange={(e) => setLivingSituation(e.target.value)}
              InputProps={{
                startAdornment: <Home sx={{ color: "#757575", mr: 1 }} />,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "#f9f9f9",
                },
              }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Previous Pet Experience"
              value={previousExperience}
              onChange={(e) => setPreviousExperience(e.target.value)}
              InputProps={{
                startAdornment: <Pets sx={{ color: "#757575", mr: 1 }} />,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "#f9f9f9",
                },
              }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Family Composition"
              value={familyComposition}
              onChange={(e) => setFamilyComposition(e.target.value)}
              InputProps={{
                startAdornment: (
                  <FamilyRestroom sx={{ color: "#757575", mr: 1 }} />
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "#f9f9f9",
                },
              }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                padding: "10px 0",
                fontSize: "20px",
                borderRadius: "8px",
                backgroundColor: "#1a237e", // Updated color
                color: "#ffffff", // Ensure button text color contrasts well
                "&:hover": {
                  backgroundColor: "#3949ab", // Slightly lighter shade for hover effect
                },
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}

export default AdoptForm;
