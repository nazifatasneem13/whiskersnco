// frontend/src/Components/Train/TrainYourPet.js

import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Snackbar,
  Alert,
  Tooltip,
} from "@mui/material";
import {
  Close,
  Delete,
  Info,
  Search as SearchIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import ReactMarkdown from "react-markdown";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import jsPDF from "jspdf"; // Importing jsPDF for PDF export

// Import dayjs and required plugins
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import localizedFormat from "dayjs/plugin/localizedFormat";
import weekOfYear from "dayjs/plugin/weekOfYear";
import customParseFormat from "dayjs/plugin/customParseFormat";
import advancedFormat from "dayjs/plugin/advancedFormat";

// Extend dayjs with plugins
dayjs.extend(isBetween);
dayjs.extend(localizedFormat);
dayjs.extend(weekOfYear);
dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);

const petData = {
  Dog: [
    "Labrador Retriever",
    "German Shepherd",
    "Golden Retriever",
    "Bulldog",
    "Beagle",
    "Poodle",
    "Rottweiler",
    "Yorkshire Terrier",
    "Boxer",
    "Dachshund",
  ],
  Cat: [
    "Siamese",
    "Persian",
    "Maine Coon",
    "Ragdoll",
    "Sphynx",
    "Bengal",
    "Siberian",
    "Birman",
    "Abyssinian",
    "Russian Blue",
  ],
  Rabbit: [
    "Holland Lop",
    "Netherland Dwarf",
    "Lionhead",
    "Mini Rex",
    "Flemish Giant",
    "English Angora",
    "French Lop",
    "Himalayan",
    "Dutch Rabbit",
    "Harlequin",
  ],
  Bird: [
    "Parakeet",
    "Canary",
    "Finch",
    "Cockatiel",
    "Macaw",
    "Parrot",
    "Lovebird",
    "Budgerigar",
    "Conure",
    "Cockatoo",
  ],
  Fish: [
    "Goldfish",
    "Betta",
    "Guppy",
    "Angelfish",
    "Neon Tetra",
    "Molly",
    "Cichlid",
    "Platy",
    "Swordtail",
    "Zebra Danio",
  ],
};

const TrainYourPet = () => {
  // Form State
  const [petName, setPetName] = useState("");
  const [type, setType] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");

  // Training Guides State
  const [trainingGuides, setTrainingGuides] = useState([]);
  const [filteredGuides, setFilteredGuides] = useState([]);

  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [openGuideDialog, setOpenGuideDialog] = useState(false);

  // Search, Filter, Sort
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterBreed, setFilterBreed] = useState("");
  const [sortOption, setSortOption] = useState("");

  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Confirmation Dialog
  const [confirmDelete, setConfirmDelete] = useState({
    open: false,
    id: null,
  });

  // Calendar State
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [guidesOnDate, setGuidesOnDate] = useState([]);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userEmail = currentUser ? currentUser.email : null;

  useEffect(() => {
    if (!userEmail) {
      setError("User not authenticated. Please log in.");
      return;
    }

    const fetchTrainingGuides = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:4000/train/training-guides?email=${encodeURIComponent(
            userEmail
          )}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "Failed to fetch training guides."
          );
        }

        const data = await response.json();
        setTrainingGuides(data.trainingGuides);
        setFilteredGuides(data.trainingGuides);
      } catch (err) {
        setError(err.message || "Failed to fetch training guides.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrainingGuides();
  }, [userEmail]);

  // Handle Search, Filter, Sort
  useEffect(() => {
    let guides = [...trainingGuides];

    // Search
    if (searchTerm) {
      guides = guides.filter(
        (guide) =>
          guide.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          guide.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by Type
    if (filterType) {
      guides = guides.filter((guide) => guide.type === filterType);
    }

    // Filter by Breed
    if (filterBreed) {
      guides = guides.filter((guide) => guide.breed === filterBreed);
    }

    // Sort
    if (sortOption === "date_desc") {
      guides.sort((a, b) => dayjs(b.createdAt) - dayjs(a.createdAt));
    } else if (sortOption === "date_asc") {
      guides.sort((a, b) => dayjs(a.createdAt) - dayjs(b.createdAt));
    } else if (sortOption === "name_asc") {
      guides.sort((a, b) => a.petName.localeCompare(b.petName));
    } else if (sortOption === "name_desc") {
      guides.sort((a, b) => b.petName.localeCompare(a.petName));
    }

    setFilteredGuides(guides);
  }, [searchTerm, filterType, filterBreed, sortOption, trainingGuides]);

  // Handle Calendar Date Selection
  useEffect(() => {
    const guidesForDate = trainingGuides.filter((guide) => {
      const guideDate = dayjs(guide.createdAt);
      return (
        guideDate.year() === selectedDate.year() &&
        guideDate.month() === selectedDate.month() &&
        guideDate.date() === selectedDate.date()
      );
    });

    setGuidesOnDate(guidesForDate);
  }, [selectedDate, trainingGuides]);

  const handleGenerateGuide = async (e) => {
    e.preventDefault();
    if (!petName || !type || !breed || age === "") {
      setSnackbar({
        open: true,
        message: "Please fill in all fields.",
        severity: "error",
      });
      return;
    }
    if (isNaN(age) || Number(age) < 0) {
      setSnackbar({
        open: true,
        message: "Please enter a valid non-negative number for age in months.",
        severity: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        petName: petName.trim(),
        type,
        breed,
        age: Number(age),
        email: userEmail,
      };

      const response = await fetch(
        `http://localhost:4000/train/training-guide`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Failed to generate training guide."
        );
      }

      const data = await response.json();
      setTrainingGuides([data, ...trainingGuides]);
      setFilteredGuides([data, ...trainingGuides]);
      setSnackbar({
        open: true,
        message: "Training guide generated successfully!",
        severity: "success",
      });
      setSelectedGuide(data);
      setOpenGuideDialog(true); // Open the dialog immediately
      setPetName("");
      setType("");
      setBreed("");
      setAge("");
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Failed to generate training guide.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectGuide = (guide) => {
    setSelectedGuide(guide);
    setOpenGuideDialog(true);
  };

  const handleCloseGuideDialog = () => setOpenGuideDialog(false);

  const handleDeleteGuide = (id) => {
    setConfirmDelete({ open: true, id });
  };

  const confirmDeleteGuide = async () => {
    const { id } = confirmDelete;
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:4000/train/training-guide/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete training guide.");
      }

      setTrainingGuides(trainingGuides.filter((guide) => guide._id !== id));
      setFilteredGuides(filteredGuides.filter((guide) => guide._id !== id));
      setSnackbar({
        open: true,
        message: "Training guide deleted successfully.",
        severity: "success",
      });
      if (selectedGuide && selectedGuide._id === id) {
        setSelectedGuide(null);
        setOpenGuideDialog(false);
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Failed to delete training guide.",
        severity: "error",
      });
    } finally {
      setLoading(false);
      setConfirmDelete({ open: false, id: null });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Training Guide Dialog Content
  const renderGuideContent = () => {
    if (!selectedGuide) return null;

    return (
      <ReactMarkdown
        children={selectedGuide.guide}
        components={{
          h1: ({ node, ...props }) => (
            <Typography variant="h4" gutterBottom {...props} />
          ),
          h2: ({ node, ...props }) => (
            <Typography variant="h5" gutterBottom {...props} />
          ),
          p: ({ node, ...props }) => (
            <Typography variant="body1" paragraph {...props} />
          ),
          li: ({ node, ...props }) => (
            <li>
              <Typography variant="body1" {...props} />
            </li>
          ),
        }}
      />
    );
  };

  // Export Guide as PDF
  const exportGuideAsPDF = (guide) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`${guide.petName}'s Training Guide`, 10, 10);
    doc.setFontSize(12);
    const lines = guide.guide.split("\n");
    let y = 20;
    lines.forEach((line) => {
      doc.text(line, 10, y);
      y += 10;
      if (y > 280) {
        doc.addPage();
        y = 10;
      }
    });
    doc.save(`${guide.petName}_Training_Guide.pdf`);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ maxWidth: 1400, margin: "0 auto", padding: 4 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          marginBottom={3}
        >
          Generate Your Pet's Training Guide
        </Typography>

        <Grid container spacing={4}>
          {/* Form Section */}
          <Grid item xs={12} md={6}>
            <Box component="form" onSubmit={handleGenerateGuide} noValidate>
              <TextField
                label="Pet Name"
                fullWidth
                variant="outlined"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                margin="normal"
                required
              />
              <FormControl
                fullWidth
                variant="outlined"
                margin="normal"
                required
              >
                <InputLabel id="pet-type-label">Pet Type</InputLabel>
                <Select
                  labelId="pet-type-label"
                  value={type}
                  onChange={(e) => {
                    setType(e.target.value);
                    setBreed(""); // Reset breed when type changes
                  }}
                  label="Pet Type"
                >
                  <MenuItem value="">
                    <em>Select Pet Type</em>
                  </MenuItem>
                  {Object.keys(petData).map((typeOption) => (
                    <MenuItem key={typeOption} value={typeOption}>
                      {typeOption}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl
                fullWidth
                variant="outlined"
                margin="normal"
                required
                disabled={!type}
              >
                <InputLabel id="breed-label">
                  {type ? "Select Breed" : "Select Pet Type first"}
                </InputLabel>
                <Select
                  labelId="breed-label"
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  label={type ? "Select Breed" : "Select Pet Type first"}
                >
                  <MenuItem value="">
                    <em>{type ? "Select Breed" : "Select Pet Type first"}</em>
                  </MenuItem>
                  {petData[type]?.map((b) => (
                    <MenuItem key={b} value={b}>
                      {b}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Age (Months)"
                fullWidth
                variant="outlined"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                margin="normal"
                required
                inputProps={{ min: 0 }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: "#121858", // Midnight Blue
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#0f144d",
                  },
                }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Generate Guide"}
              </Button>
            </Box>
          </Grid>

          {/* Calendar and Search, Filter, Sort Section */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              {/* Calendar Section */}
              <Grid item xs={12}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Training Schedule
                </Typography>
                <DatePicker
                  label="Select Date"
                  value={selectedDate}
                  onChange={(newValue) => setSelectedDate(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
                {guidesOnDate.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Guides on {selectedDate.format("MM/DD/YYYY")}:
                    </Typography>
                    {guidesOnDate.map((guide) => (
                      <Typography key={guide.trainId} variant="body2">
                        - {guide.petName} ({guide.type})
                      </Typography>
                    ))}
                  </Box>
                )}
              </Grid>

              {/* Search, Filter, Sort Section */}
              <Grid item xs={12}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Search & Manage Your Training Guides
                  </Typography>
                  <Grid container spacing={2}>
                    {/* Search Bar */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Search by Pet Name or Type"
                        variant="outlined"
                        fullWidth
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <SearchIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    {/* Filter by Type */}
                    <Grid item xs={6} sm={3}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel id="filter-type-label">
                          Filter by Type
                        </InputLabel>
                        <Select
                          labelId="filter-type-label"
                          value={filterType}
                          onChange={(e) => setFilterType(e.target.value)}
                          label="Filter by Type"
                        >
                          <MenuItem value="">
                            <em>All Types</em>
                          </MenuItem>
                          {Object.keys(petData).map((typeOption) => (
                            <MenuItem key={typeOption} value={typeOption}>
                              {typeOption}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Filter by Breed */}
                    <Grid item xs={6} sm={3}>
                      <FormControl
                        fullWidth
                        variant="outlined"
                        disabled={!filterType}
                      >
                        <InputLabel id="filter-breed-label">
                          Filter by Breed
                        </InputLabel>
                        <Select
                          labelId="filter-breed-label"
                          value={filterBreed}
                          onChange={(e) => setFilterBreed(e.target.value)}
                          label="Filter by Breed"
                        >
                          <MenuItem value="">
                            <em>All Breeds</em>
                          </MenuItem>
                          {filterType &&
                            petData[filterType]?.map((b) => (
                              <MenuItem key={b} value={b}>
                                {b}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Sort Options */}
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel id="sort-label">Sort Guides</InputLabel>
                        <Select
                          labelId="sort-label"
                          value={sortOption}
                          onChange={(e) => setSortOption(e.target.value)}
                          label="Sort Guides"
                        >
                          <MenuItem value="">
                            <em>No Sorting</em>
                          </MenuItem>
                          <MenuItem value="date_desc">Newest First</MenuItem>
                          <MenuItem value="date_asc">Oldest First</MenuItem>
                          <MenuItem value="name_asc">Name (A-Z)</MenuItem>
                          <MenuItem value="name_desc">Name (Z-A)</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>

                {/* Training Guides Display */}
                <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
                  {loading ? (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        mt: 4,
                      }}
                    >
                      <CircularProgress />
                    </Box>
                  ) : filteredGuides.length === 0 ? (
                    <Typography variant="body1" color="textSecondary">
                      No guides available. Generate a guide to get started!
                    </Typography>
                  ) : (
                    <Grid container spacing={2}>
                      {filteredGuides.map((guide) => (
                        <Grid item xs={12} sm={6} md={4} key={guide.trainId}>
                          <Card>
                            <CardContent>
                              <Typography variant="h6" fontWeight="bold">
                                {guide.petName} ({guide.type})
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Breed: {guide.breed}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Age: {guide.age} months
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Generated on:{" "}
                                {dayjs(guide.createdAt).format("MM/DD/YYYY")}
                              </Typography>
                            </CardContent>
                            <CardActions>
                              <Tooltip title="View Training Guide">
                                <IconButton
                                  size="small"
                                  onClick={() => handleSelectGuide(guide)}
                                  color="primary"
                                >
                                  <Info />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Export as PDF">
                                <IconButton
                                  size="small"
                                  onClick={() => exportGuideAsPDF(guide)}
                                  color="secondary"
                                >
                                  <DownloadIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete Training Guide">
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeleteGuide(guide._id)}
                                  color="error"
                                >
                                  <Delete />
                                </IconButton>
                              </Tooltip>
                            </CardActions>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>

      {/* Training Guide Dialog */}
      <Dialog
        open={openGuideDialog}
        onClose={handleCloseGuideDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {selectedGuide?.petName}'s Training Guide
          <IconButton
            size="small"
            onClick={handleCloseGuideDialog}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <ReactMarkdown
            children={selectedGuide?.guide || ""}
            components={{
              h1: ({ node, ...props }) => (
                <Typography variant="h4" gutterBottom {...props} />
              ),
              h2: ({ node, ...props }) => (
                <Typography variant="h5" gutterBottom {...props} />
              ),
              p: ({ node, ...props }) => (
                <Typography variant="body1" paragraph {...props} />
              ),
              li: ({ node, ...props }) => (
                <li>
                  <Typography variant="body1" {...props} />
                </li>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseGuideDialog} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog for Deletion */}
      <Dialog
        open={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, id: null })}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this training guide? This action
            cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDelete({ open: false, id: null })}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDeleteGuide}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

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
    </LocalizationProvider>
  );
};

export default TrainYourPet;
