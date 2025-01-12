import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Grid,
  Paper,
  Snackbar,
  Alert,
  Avatar,
} from "@mui/material";
import { Email, Phone, Pets, Home, FamilyRestroom } from "@mui/icons-material";

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
    <Box
      component={Paper}
      elevation={4}
      sx={{
        padding: 4,
        maxWidth: 500,
        maxHeight: 500,
        overflowY: "auto",
        margin: "auto",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#1976d2", textAlign: "center" }}
      >
        Adopt {pet.name}
      </Typography>

      <Grid container spacing={2} alignItems="flex-start">
        <Grid item xs={12} sm={4} textAlign="center">
          <Avatar
            src={pet.cloudinaryUrl || pet.filename}
            alt={pet.name}
            sx={{ width: 120, height: 120, margin: "auto" }}
          />
        </Grid>
        <Grid item xs={12} sm={8}>
          <Typography variant="h6" gutterBottom>
            {pet.name}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <b>Type:</b> {pet.type}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <b>Age:</b> {pet.age} months
          </Typography>
          <Typography variant="body2" gutterBottom>
            <b>Location:</b> {pet.area}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <b>Division:</b> {pet.division}
          </Typography>
        </Grid>
      </Grid>

      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Email"
          value={email}
          InputProps={{
            readOnly: true,
            startAdornment: <Email sx={{ mr: 1 }} />,
          }}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          variant="outlined"
          label="Phone Number"
          value={phoneNo}
          onChange={(e) => setPhoneNo(e.target.value)}
          InputProps={{ startAdornment: <Phone sx={{ mr: 1 }} /> }}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          variant="outlined"
          label="Living Situation"
          value={livingSituation}
          onChange={(e) => setLivingSituation(e.target.value)}
          InputProps={{ startAdornment: <Home sx={{ mr: 1 }} /> }}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          variant="outlined"
          label="Previous Pet Experience"
          value={previousExperience}
          onChange={(e) => setPreviousExperience(e.target.value)}
          InputProps={{ startAdornment: <Pets sx={{ mr: 1 }} /> }}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          variant="outlined"
          label="Family Composition"
          value={familyComposition}
          onChange={(e) => setFamilyComposition(e.target.value)}
          InputProps={{ startAdornment: <FamilyRestroom sx={{ mr: 1 }} /> }}
          sx={{ mb: 2 }}
        />

        <Button
          fullWidth
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          sx={{ textTransform: "none", fontWeight: "bold" }}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>

        {formError && (
          <Typography color="error" sx={{ mt: 2, textAlign: "center" }}>
            Please fill out all fields.
          </Typography>
        )}
      </Box>

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
    </Box>
  );
}

export default AdoptForm;
