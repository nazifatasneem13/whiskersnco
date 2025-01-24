import React, { useEffect, useState } from "react";
import PetsViewer from "./PetsViewer";
import {
  Box,
  Grid,
  TextField,
  Typography,
  Container,
  Button,
  InputLabel,
  FormControl,
  MenuItem,
  Select,
  IconButton,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import { PhotoCamera, Close } from "@mui/icons-material";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Draggable from "react-draggable";

const Pets = () => {
  // General filter for overall pet type filtering
  const [generalFilter, setGeneralFilter] = useState("all");
  // Predict-specific filter for breed prediction
  const [predictFilter, setPredictFilter] = useState("all");

  const [searchTerm, setSearchTerm] = useState("");
  const [petsData, setPetsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userEmail = currentUser ? currentUser.email : null;
  const location = useLocation();

  // Fetch user profile and approved pets
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const { data } = await axios.get("http://localhost:4000/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userId = data._id;

      const petsResponse = await axios.post(
        "http://localhost:4000/approvedPetsDisplay",
        { userId }
      );

      setPetsData(petsResponse.data);
    } catch (error) {
      console.error("Error fetching preferred pets or user ID:", error);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location.state?.petName) {
      setSearchTerm(location.state.petName);
      // Clear location state after setting searchTerm
      window.history.replaceState({}, document.title);
    }
    fetchRequests();
  }, [location.state]);

  // Handle image upload
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setImage(selectedFile);
      setFileName(selectedFile.name);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
      setSearchTerm("");
    }
  };

  // Reset image upload and predict filter
  const handleReset = () => {
    setImage(null);
    setFileName("");
    setPreview(null);
    setSearchTerm("");
    setPredictFilter("all"); // Reset predict-specific filter
  };

  // Predict breed based on uploaded image
  const handlePredictBreed = async () => {
    if (!image || predictFilter === "all") {
      setSnackbar({
        open: true,
        message: "Please upload an image and select a pet type!",
        severity: "warning",
      });
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("type", predictFilter); // Use predictFilter

    try {
      const response = await axios.post(
        "http://localhost:4000/predict-breed",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!response.data.breed) {
        throw new Error("Failed to predict breed");
      }

      const { breed } = response.data;
      setSearchTerm(breed);
      setSnackbar({
        open: true,
        message: `Breed predicted: ${breed}`,
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

  // Filter pets based on generalFilter only
  const filteredPets = petsData
    .filter((pet) => pet.email !== userEmail)
    .filter((pet) =>
      generalFilter === "all" ? true : pet.type === generalFilter
    )
    .filter((pet) =>
      searchTerm === ""
        ? true
        : pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pet.breed.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const clearSearchOnInteraction = () => {
    if (location.state?.petName) {
      setSearchTerm("");
    }
  };

  return (
    <Container
      maxWidth="flex"
      sx={{
        mt: 4,
        mb: 10,
        padding: 4,
        backgroundColor: "#f9f9f9",
        borderRadius: 2,
        maxWidth: "flex",
        marginLeft: "2%",
      }}
    >
      <Typography
        variant="h4"
        textAlign="center"
        marginBottom={4}
        sx={{
          fontWeight: "bold",
          color: "#19275c",
          textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)",
        }}
      >
        Available Pets
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 5,
          flexWrap: "wrap",
          gap: 3,
          padding: 3,
          backgroundColor: "#f9f9f9",
          borderRadius: 4,
        }}
      >
        {/* General Filter */}
        <FormControl sx={{ minWidth: 220 }}>
          <InputLabel sx={{ color: "#19275c" }}>Pet Type</InputLabel>
          <Select
            value={generalFilter}
            onChange={(event) => {
              setGeneralFilter(event.target.value);
              setSearchTerm(""); // Reset search term when general filter changes
            }}
            label="Pet Type"
            sx={{
              borderColor: "#19275c",
              ".MuiOutlinedInput-notchedOutline": { borderColor: "#19275c" },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#1b3a79",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#1b3a79",
              },
            }}
          >
            <MenuItem value="all">All Pets</MenuItem>
            <MenuItem value="Dog">Dog</MenuItem>
            <MenuItem value="Cat">Cat</MenuItem>
            <MenuItem value="Rabbit">Rabbit</MenuItem>
            <MenuItem value="Bird">Bird</MenuItem>
            <MenuItem value="Fish">Fish</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>

        {/* Search and Predict Controls */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 3,
            flexGrow: 1,
            minWidth: 320,
          }}
        >
          <TextField
            placeholder="Search by name or breed"
            value={searchTerm}
            onChange={(e) => {
              if (generalFilter !== "all") {
                setGeneralFilter("all"); // Reset general filter when typing in the search box
              }
              setSearchTerm(e.target.value);
            }}
            variant="outlined"
            fullWidth
            sx={{
              maxWidth: 600,
              borderColor: "#19275c",
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#19275c" },
                "&:hover fieldset": { borderColor: "#1b3a79" },
                "&.Mui-focused fieldset": { borderColor: "#1b3a79" },
              },
            }}
          />

          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {/* Predict-specific Filter */}
            <FormControl sx={{ minWidth: 220 }}>
              <InputLabel sx={{ color: "#19275c" }}>
                Predict Pet Type
              </InputLabel>
              <Select
                value={predictFilter}
                onChange={(event) => {
                  setPredictFilter(event.target.value);
                }}
                label="Predict Pet Type"
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#19275c",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1b3a79",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1b3a79",
                  },
                }}
              >
                <MenuItem value="all">All Pets</MenuItem>
                <MenuItem value="Dog">Dog</MenuItem>
                <MenuItem value="Cat">Cat</MenuItem>
              </Select>
            </FormControl>

            {/* Upload Button */}
            <Button
              variant="outlined"
              color="primary"
              component="label"
              startIcon={<PhotoCamera />}
              sx={{
                borderColor: "#19275c",
                color: "#19275c",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#f0f4ff",
                  borderColor: "#1b3a79",
                },
              }}
            >
              Upload
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />
            </Button>

            {/* Find Button */}
            <Button
              variant="contained"
              color="secondary"
              onClick={handlePredictBreed}
              sx={{
                background: "linear-gradient(90deg, #19275c, #1b3a79)",
                color: "white",
                fontWeight: "bold",
                "&:hover": {
                  background: "linear-gradient(90deg, #1b3a79, #19275c)",
                },
              }}
            >
              Find
            </Button>

            {/* Reset Button */}
            <Button
              variant="outlined"
              color="error"
              onClick={handleReset}
              sx={{
                borderColor: "#e53935",
                color: "#e53935",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#fdecea",
                  borderColor: "#c62828",
                },
              }}
            >
              Reset
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Image Preview */}

      {preview && (
        <Draggable>
          <Paper
            elevation={3}
            sx={{
              position: "fixed",
              top: 100,
              right: 20,
              width: 320,
              padding: 3,
              borderRadius: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              zIndex: 10,
              backgroundColor: "#ffffff",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
            }}
          >
            <Box sx={{ position: "relative", width: "100%" }}>
              <IconButton
                onClick={handleReset}
                sx={{
                  position: "absolute",
                  top: -10,
                  right: -10,
                  backgroundColor: "#ffffff",
                  boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
                  color: "#e53935",
                  "&:hover": {
                    backgroundColor: "#fdecea",
                  },
                }}
              >
                <Close />
              </IconButton>
            </Box>
            <img
              src={preview}
              alt="Preview"
              style={{ maxWidth: "100%", borderRadius: 8 }}
            />
            <Typography
              variant="body2"
              sx={{ marginTop: 1, fontFamily: "'Poppins', sans-serif" }}
            >
              {fileName}
            </Typography>
          </Paper>
        </Draggable>
      )}

      {/* Pets Grid */}
      <Grid container spacing={1} sx={{ display: "flex" }}>
        {loading ? (
          <Typography variant="body1" textAlign="center" width="100%">
            Loading...
          </Typography>
        ) : error ? (
          <Typography variant="body1" textAlign="center" width="100%">
            {error}
          </Typography>
        ) : filteredPets.length > 0 ? (
          filteredPets.map((petDetail, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <PetsViewer pet={petDetail} />
            </Grid>
          ))
        ) : (
          <Typography variant="body1" textAlign="center" width="100%">
            Oops!... No pets available
          </Typography>
        )}
      </Grid>

      {/* Snackbar for Notifications */}
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
    </Container>
  );
};

export default Pets;
