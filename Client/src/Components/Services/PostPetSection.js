import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextareaAutosize,
  CircularProgress,
  Grid,
  Snackbar,
  Alert,
  Tooltip,
} from "@mui/material";
import {
  PhotoCamera,
  Pets,
  LocationOn,
  Email,
  Phone,
} from "@mui/icons-material";
import postPet from "./images/postpet.jpeg";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
const PostPetSection = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [area, setArea] = useState("");
  const [division, setDivision] = useState("None");
  const [justification, setJustification] = useState("");
  const [email, setEmail] = useState(currentUser ? currentUser.email : "");
  const [phone, setPhone] = useState("");
  const [breed, setBreed] = useState("");
  const [type, setType] = useState("None");
  const [picture, setPicture] = useState(null);
  const [fileName, setFileName] = useState("");
  const [formError, setFormError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  }); // Snackbar state

  const divisions = [
    "Barishal",
    "Chattogram",
    "Dhaka",
    "Khulna",
    "Mymensingh",
    "Rajshahi",
    "Rangpur",
    "Sylhet",
    "Others",
  ];

  useEffect(() => {
    if (!isSubmitting) {
      setFormError(false);
    }
  }, [isSubmitting]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setPicture(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  // Function to predict pet type using Groq
  const handlePredictPetType = async () => {
    if (!picture) {
      setSnackbar({
        open: true,
        message: "Please upload an image first!",
        severity: "warning",
      });
      return;
    }

    const formData = new FormData();
    formData.append("image", picture);

    try {
      const response = await fetch("http://localhost:4000/predict-pet-type", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to predict pet type");
      }

      const data = await response.json();
      console.log("API response:", data);

      const dropdownOptions = [
        "Dog",
        "Cat",
        "Fish",
        "Rabbit",
        "Birds",
        "Others",
      ];
      const matchedType = dropdownOptions.find((option) =>
        data.type.toLowerCase().includes(option.toLowerCase())
      );

      if (matchedType) {
        setType(matchedType); // Update the dropdown selection
        setSnackbar({
          open: true,
          message: `Pet type predicted: ${matchedType}`,
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: `Prediction (${data.type}) does not match any dropdown option.`,
          severity: "warning",
        });
      }
    } catch (error) {
      console.error("Error predicting pet type:", error);
      setSnackbar({
        open: true,
        message: "Error predicting pet type. Please try again.",
        severity: "error",
      });
    }
  };

  const handlePredictBreed = async () => {
    if (!picture || (type !== "Dog" && type !== "Cat")) {
      setSnackbar({
        open: true,
        message: "Please upload a picture and select a pet type!",
        severity: "warning",
      });
      return;
    }

    const formData = new FormData();
    formData.append("image", picture);
    formData.append("type", type);

    try {
      const response = await fetch("http://localhost:4000/predict-breed", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to predict breed");
      }

      const data = await response.json();
      setBreed(data.breed);
      setSnackbar({
        open: true,
        message: `Breed predicted: ${data.breed}`,
        severity: "success",
      });
    } catch (error) {
      console.error("Error predicting breed:", error);
      setSnackbar({
        open: true,
        message: "Error predicting breed. Please try again.",
        severity: "error",
      });
    }
  };
  useEffect(() => {
    console.log("Updated type:", type); // Log whenever `type` changes
  }, [type]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !name ||
      !age ||
      !area ||
      division === "None" ||
      !justification ||
      !email ||
      !phone ||
      !fileName ||
      type === "None"
    ) {
      setFormError(true);
      setSnackbar({
        open: true,
        message: "Please fill out all fields correctly.",
        severity: "error",
      });
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("age", age);
    formData.append("area", area);
    formData.append("division", division);
    formData.append("justification", justification);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("type", type);
    formData.append("breed", breed);

    if (picture) {
      formData.append("picture", picture);
    }

    try {
      const response = await fetch("http://localhost:4000/services", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      console.log("Form submitted successfully");
      setSnackbar({
        open: true,
        message:
          "Application submitted successfully! We'll get in touch with you soon.",
        severity: "success",
      });

      // Reset form fields
      setFormError(false);
      setName("");
      setAge("");
      setArea("");
      setDivision("None");
      setJustification("");
      setPhone("");
      setBreed("");
      setPicture(null);
      setFileName("");
    } catch (error) {
      console.error("Error submitting form:", error);
      setSnackbar({
        open: true,
        message: "Error submitting form. Please try again.",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box
      sx={{
        ml: 2,
        backgroundColor: "#f9f9f9",
        padding: "2rem",
        borderRadius: "8px",
        boxShadow: 3,
        maxWidth: "flex",
        margin: "2rem",
        maxHeight: "flex",
      }}
    >
      <Typography
        variant="h4"
        sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}
      >
        Post a Pet for Adoption
      </Typography>
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <img
          src={postPet}
          alt="Pet Looking for a Home"
          style={{
            width: "auto",
            maxHeight: "400px",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
      </Box>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Pet Name"
              fullWidth
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: <Pets sx={{ mr: 1 }} />,
              }}
            />

            <TextField
              label="Pet Age (in months)"
              fullWidth
              variant="outlined"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              sx={{ mb: 2 }}
              type="number"
            />

            <TextField
              label="Location"
              fullWidth
              variant="outlined"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: <LocationOn sx={{ mr: 1 }} />,
              }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Division</InputLabel>
              <Select
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                label="Division"
              >
                <MenuItem value="None">Select Division</MenuItem>
                {divisions.map((div, index) => (
                  <MenuItem key={index} value={div}>
                    {div}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ display: "flex", gap: 2 }}>
              <FormControl
                fullWidth
                sx={{
                  mb: 2,
                }}
              >
                <InputLabel>Type</InputLabel>
                <Select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  label="Type"
                >
                  <MenuItem value="None">Select Type</MenuItem>
                  <MenuItem value="Dog">Dog</MenuItem>
                  <MenuItem value="Cat">Cat</MenuItem>
                  <MenuItem value="Fish">Fish</MenuItem>
                  <MenuItem value="Rabbit">Rabbit</MenuItem>
                  <MenuItem value="Birds">Birds</MenuItem>
                  <MenuItem value="Others">Others</MenuItem>
                </Select>
              </FormControl>
              <Tooltip title="Upload image" arrow>
                <Button
                  variant="contained"
                  component="label"
                  fullWidth
                  sx={{
                    mb: 2,
                    backgroundColor: "#121858",
                    maxWidth: "12%",
                    height: "5vh",
                  }}
                >
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <PhotoCamera />
                </Button>
              </Tooltip>
              <Tooltip title="Predict Pet Type" arrow>
                <Box fullWidth sx={{ mb: 2, maxWidth: "10%", height: "5vh" }}>
                  <Button
                    type="button"
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    onClick={handlePredictPetType}
                    disabled={!picture}
                  >
                    <SearchRoundedIcon />
                  </Button>
                </Box>
              </Tooltip>
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Breed"
                fullWidth
                variant="outlined"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                sx={{ mb: 2 }}
              />

              {(type === "Dog" || type === "Cat") && (
                <Tooltip
                  title={
                    picture ? "Predict Breed" : "Please upload an image first"
                  }
                  arrow
                >
                  <Box
                    fullWidth
                    sx={{ mb: 2, maxWidth: "10%", maxHeight: "flex" }}
                  >
                    <Button
                      type="button"
                      variant="outlined"
                      color="secondary"
                      fullWidth
                      onClick={handlePredictBreed}
                      disabled={!picture}
                      sx={{
                        mb: 2,
                        height: "100%",
                        maxWidth: "12%",
                      }}
                    >
                      <Pets />
                    </Button>
                  </Box>
                </Tooltip>
              )}
            </Box>

            <Box>
              <Typography variant="body2" color="textSecondary">
                {fileName && (
                  <>
                    Selected file: {fileName}
                    <Box
                      sx={{
                        display: "inline-block",
                        marginLeft: 1,
                        verticalAlign: "middle",
                      }}
                    >
                      {picture && (
                        <img
                          src={URL.createObjectURL(picture)}
                          alt="Pet Preview"
                          style={{
                            maxWidth: "50px",
                            maxHeight: "50px",
                            borderRadius: "4px",
                            border: "1px solid #ccc",
                          }}
                        />
                      )}
                    </Box>
                  </>
                )}
              </Typography>
              {(type === "Dog" ||
                type === "Cats" ||
                type === "Rabbit" ||
                type === "Birds" ||
                type === "Fish" ||
                type === "Others") && (
                <Typography variant="body2" color="textSecondary">
                  Caution: Prediction maybe not always give correct result as it
                  is still in developement stage, specially in cases of mixed
                  breed pets, if you feel like the prediction is not correct,
                  you can always type out the correct breed!
                </Typography>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
              Justification for Giving a Pet
            </Typography>
            <TextareaAutosize
              minRows={6}
              placeholder="Write your justification here..."
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                borderColor: "#ccc",
                marginBottom: "1rem",
                resize: "vertical",
              }}
            />

            <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
              Contact Information
            </Typography>
            <TextField
              label="Email"
              fullWidth
              variant="outlined"
              value={email}
              disabled
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: <Email sx={{ mr: 1 }} />,
              }}
            />
            <TextField
              label="Phone Number"
              fullWidth
              variant="outlined"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: <Phone sx={{ mr: 1 }} />,
              }}
            />

            {formError && (
              <Typography color="error" sx={{ mb: 2 }}>
                Please fill out all fields correctly.
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isSubmitting}
              sx={{
                backgroundColor: "#121858",
                color: "white",
                "&:hover": {
                  backgroundColor: "#0f144d",
                },
              }}
              startIcon={
                isSubmitting && <CircularProgress size={20} color="inherit" />
              }
            >
              {isSubmitting ? "Submitting..." : "Submit Your Pet"}
            </Button>
          </Grid>
        </Grid>
      </form>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PostPetSection;
