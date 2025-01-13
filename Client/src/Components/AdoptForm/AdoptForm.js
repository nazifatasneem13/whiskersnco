import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Paper,
  Snackbar,
  Alert,
  Avatar,
  Divider,
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
      closeForm();
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
        width: "100%", // Responsive width
        margin: "0.7rem auto",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        position: "relative", // Added for proper positioning of the close button
      }}
    >
      {/* Close Button */}
      <IconButton
        aria-label="close"
        onClick={closeForm}
        sx={{
          position: "absolute",
          top: "10px", // Positioned at the top
          right: "10px", // Positioned at the right
          color: "#757575",
          zIndex: 1, // Ensures it stays on top of other elements
        }}
      >
        <Close />
      </IconButton>
      {/* Content */}
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
            minWidth: "300px", // Ensures minimum width for the image
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
          }}
        >
          {/* Header */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "#1976d2",
              marginBottom: "1rem",
            }}
          >
            Adopt {pet.name}
          </Typography>

          {/* Pet Info */}
          <Box sx={{ marginBottom: "1.5rem" }}>
            <Typography variant="body1" sx={{ color: "#424242" }}>
              <b>Type:</b> {pet.type}
            </Typography>
            <Typography variant="body1" sx={{ color: "#424242" }}>
              <b>Age:</b> {pet.age} months
            </Typography>
            <Typography variant="body1" sx={{ color: "#424242" }}>
              <b>Location:</b> {pet.area}
            </Typography>
            <Typography variant="body1" sx={{ color: "#424242" }}>
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
              color="primary"
              disabled={isSubmitting}
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                padding: "10px 0",
                fontSize: "15px",
                borderRadius: "8px",
              }}
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
