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
import { TrackChanges as TrackChangesIcon } from "@mui/icons-material";
import { Checkbox } from "@mui/material";

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

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userEmail = currentUser ? currentUser.email : null;

  const [openProgressTracker, setOpenProgressTracker] = useState(false);
  const [progressGuide, setProgressGuide] = useState(null);
  const [showGenerateNewGuide, setShowGenerateNewGuide] = useState(false);
  const [archivedGuides, setArchivedGuides] = useState([]);

  const [openArchivedGuides, setOpenArchivedGuides] = useState(false);

  useEffect(() => {
    const fetchArchivedGuides = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:4000/train/archived-guides?email=${encodeURIComponent(
            userEmail
          )}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "Failed to fetch archived guides."
          );
        }

        const data = await response.json();
        setArchivedGuides(data.archivedGuides);
      } catch (err) {
        setSnackbar({
          open: true,
          message: err.message || "Failed to fetch archived guides.",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    if (openArchivedGuides) {
      fetchArchivedGuides();
    }
  }, [openArchivedGuides, userEmail]);

  const openTracker = (guide) => {
    setProgressGuide(guide);
    setOpenProgressTracker(true);
  };

  const closeTracker = () => {
    setOpenProgressTracker(false);
    setProgressGuide(null);
  };

  const initializeProgress = () => {
    if (!progressGuide?.progress || progressGuide.progress.length === 0) {
      const initialProgress = Array.from({ length: 4 }, (_, index) => ({
        week: index + 1,
        completed: false,
      }));
      setProgressGuide((prev) => ({
        ...prev,
        progress: initialProgress,
      }));
    }
  };
  const handleGenerateNewGuide = async () => {
    if (!age || isNaN(age) || Number(age) < 0) {
      setSnackbar({
        open: true,
        message: "Please enter a valid non-negative number for age in months.",
        severity: "error",
      });
      return;
    }

    setLoading(true);
    try {
      // Archive the current guide
      if (progressGuide) {
        await fetch(`http://localhost:4000/train/archive-guide`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: progressGuide.trainId }),
        });
      }

      // Generate a new guide
      const payload = {
        petName: progressGuide.petName,
        type: progressGuide.type,
        breed: progressGuide.breed,
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

      const newGuide = await response.json();
      setTrainingGuides([newGuide, ...trainingGuides]);
      setFilteredGuides([newGuide, ...trainingGuides]);
      setSnackbar({
        open: true,
        message: "New training guide generated successfully!",
        severity: "success",
      });
      setShowGenerateNewGuide(false);
      handleToggleProgress(4);
      closeTracker();
      window.location.reload();
    } catch (err) {
      console.error("Error generating new guide:", err);
      setSnackbar({
        open: true,
        message: err.message || "Failed to generate new guide.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleProgress = (week) => {
    const updatedProgress = [...(progressGuide?.progress || [])];

    // Find the task's index in the progress array
    const taskIndex = updatedProgress.findIndex((p) => p.week === week);

    // Prevent toggling future tasks until the current task is completed
    if (taskIndex > 0 && !updatedProgress[taskIndex - 1]?.completed) {
      setSnackbar({
        open: true,
        message: `Complete Week ${week - 1} before updating Week ${week}.`,
        severity: "warning",
      });
      return;
    }

    // Prevent unchecking tasks that are already completed
    if (updatedProgress[taskIndex]?.completed) {
      return;
    }

    // Mark the task as completed
    if (taskIndex >= 0) {
      updatedProgress[taskIndex].completed = true;
    } else {
      updatedProgress.push({ week, completed: true });
    }

    setProgressGuide((prev) => ({ ...prev, progress: updatedProgress }));
  };

  const saveProgressChanges = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:4000/train/training-guide/progress`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: progressGuide.trainId,
            progress: progressGuide.progress,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update progress.");
      }

      const updatedGuide = await response.json();
      setProgressGuide(updatedGuide);
      setSnackbar({
        open: true,
        message: "Progress saved successfully!",
        severity: "success",
      });

      // Check if all progress tasks are completed
      if (updatedGuide.progress.every((task) => task.completed)) {
        setSnackbar({
          open: true,
          message: "All tasks completed! You can now generate a new guide.",
          severity: "success",
        });
        setShowGenerateNewGuide(true); // Show option to generate a new guide
      } else {
        setSnackbar({
          open: true,
          message: "Progress saved successfully!",
          severity: "success",
        });
      }
      closeTracker();
      window.location.reload();
    } catch (err) {
      console.error("Error saving progress:", err);
      setSnackbar({
        open: true,
        message: err.message || "Failed to save progress.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Call this when opening the tracker
  useEffect(() => {
    if (openProgressTracker) initializeProgress();
  }, [openProgressTracker, initializeProgress]);

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

  // Reset Filters Function
  const resetFilters = () => {
    setSearchTerm("");
    setFilterType("");
    setFilterBreed("");
    setSortOption("");
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          maxWidth: "flex",
          margin: "0 auto",
          padding: 4,
          fontFamily: "'Poppins', sans-serif", // Modern font family
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          marginBottom={3}
          sx={{
            color: "#19275c",
            fontFamily: "'Poppins', sans-serif",
            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
          }}
        >
          Generate Your Pet's Training Guide
        </Typography>

        <Grid container spacing={4}>
          {/* Form Section */}
          <Grid item xs={12} md={6}>
            <Box
              component="form"
              onSubmit={handleGenerateGuide}
              noValidate
              sx={{
                backgroundColor: "white",
                padding: 4,
                borderRadius: 4,
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                border: "1px solid #e0e0e0",
              }}
            >
              <Typography
                variant="h5"
                fontWeight="bold"
                textAlign="center"
                gutterBottom
                sx={{ color: "#19275c" }}
              >
                Create a New Guide
              </Typography>
              <TextField
                label="Pet Name"
                fullWidth
                variant="outlined"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                margin="normal"
                required
                sx={{
                  "& .MuiInputLabel-root": { color: "#19275c" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#19275c" },
                    "&:hover fieldset": { borderColor: "#1b3a79" },
                    "&.Mui-focused fieldset": { borderColor: "#1b3a79" },
                  },
                }}
              />
              <FormControl
                fullWidth
                variant="outlined"
                margin="normal"
                required
              >
                <InputLabel
                  id="pet-type-label"
                  sx={{ color: "#19275c", fontFamily: "'Poppins', sans-serif" }}
                >
                  Pet Type
                </InputLabel>
                <Select
                  labelId="pet-type-label"
                  value={type}
                  onChange={(e) => {
                    setType(e.target.value);
                    setBreed(""); // Reset breed when type changes
                  }}
                  label="Pet Type"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#19275c" },
                      "&:hover fieldset": { borderColor: "#1b3a79" },
                      "&.Mui-focused fieldset": { borderColor: "#1b3a79" },
                    },
                  }}
                >
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
                <InputLabel
                  id="breed-label"
                  sx={{ color: "#19275c", fontFamily: "'Poppins', sans-serif" }}
                >
                  {type ? "Select Breed" : "Select Pet Type first"}
                </InputLabel>
                <Select
                  labelId="breed-label"
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  label={type ? "Select Breed" : "Select Pet Type first"}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#19275c" },
                      "&:hover fieldset": { borderColor: "#1b3a79" },
                      "&.Mui-focused fieldset": { borderColor: "#1b3a79" },
                    },
                  }}
                >
                  {type &&
                    petData[type]?.map((b) => (
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
                sx={{
                  "& .MuiInputLabel-root": { color: "#19275c" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#19275c" },
                    "&:hover fieldset": { borderColor: "#1b3a79" },
                    "&.Mui-focused fieldset": { borderColor: "#1b3a79" },
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 3,
                  mb: 2,
                  background: "linear-gradient(90deg, #19275c, #1b3a79)",
                  color: "white",
                  fontWeight: "bold",
                  "&:hover": {
                    background: "linear-gradient(90deg, #1b3a79, #19275c)",
                  },
                }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Generate Guide"}
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              {/* Search, Filter, Sort Section */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    mb: 3,
                    backgroundColor: "#f9f9f9",
                    padding: 3,
                    borderRadius: 4,
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    gutterBottom
                    sx={{
                      color: "#19275c",
                      textAlign: "center",
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    Search & Manage Your Training Guides
                  </Typography>
                  <Grid container spacing={2} alignItems="center">
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
                              <SearchIcon sx={{ color: "#19275c" }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": { borderColor: "#19275c" },
                            "&:hover fieldset": { borderColor: "#1b3a79" },
                            "&.Mui-focused fieldset": {
                              borderColor: "#1b3a79",
                            },
                          },
                        }}
                      />
                    </Grid>

                    {/* Filter by Type */}
                    <Grid item xs={6} sm={3}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel
                          id="filter-type-label"
                          sx={{
                            color: "#19275c",
                            fontFamily: "'Poppins', sans-serif",
                          }}
                        >
                          Filter by Type
                        </InputLabel>
                        <Select
                          labelId="filter-type-label"
                          value={filterType}
                          onChange={(e) => {
                            setFilterType(e.target.value);
                            setFilterBreed(""); // Reset breed when filter type changes
                          }}
                          label="Filter by Type"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": { borderColor: "#19275c" },
                              "&:hover fieldset": { borderColor: "#1b3a79" },
                              "&.Mui-focused fieldset": {
                                borderColor: "#1b3a79",
                              },
                            },
                          }}
                        >
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
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": { borderColor: "#19275c" },
                            "&:hover fieldset": { borderColor: "#1b3a79" },
                            "&.Mui-focused fieldset": {
                              borderColor: "#1b3a79",
                            },
                          },
                        }}
                      >
                        <InputLabel
                          id="filter-breed-label"
                          sx={{
                            color: "#19275c",
                            fontFamily: "'Poppins', sans-serif",
                          }}
                        >
                          Filter by Breed
                        </InputLabel>
                        <Select
                          labelId="filter-breed-label"
                          value={filterBreed}
                          onChange={(e) => setFilterBreed(e.target.value)}
                          label="Filter by Breed"
                        >
                          {/* Removed "All Breeds" MenuItem */}
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
                        <InputLabel
                          id="sort-label"
                          sx={{
                            color: "#19275c",
                            fontFamily: "'Poppins', sans-serif",
                          }}
                        >
                          Sort Guides
                        </InputLabel>
                        <Select
                          labelId="sort-label"
                          value={sortOption}
                          onChange={(e) => setSortOption(e.target.value)}
                          label="Sort Guides"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": { borderColor: "#19275c" },
                              "&:hover fieldset": { borderColor: "#1b3a79" },
                              "&.Mui-focused fieldset": {
                                borderColor: "#1b3a79",
                              },
                            },
                          }}
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

                    {/* Reset Filters Button */}
                    <Grid item xs={12} sm={6}>
                      <Button
                        variant="contained"
                        onClick={resetFilters}
                        fullWidth
                        sx={{
                          background:
                            "linear-gradient(90deg, #19275c, #1b3a79)",
                          color: "white",
                          fontWeight: "bold",
                          "&:hover": {
                            background:
                              "linear-gradient(90deg, #1b3a79, #19275c)",
                          },
                        }}
                      >
                        Reset Filters
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => setOpenArchivedGuides(true)}
                        fullWidth
                        sx={{
                          mt: 2,
                          borderColor: "#19275c",
                          color: "#19275c",
                          fontWeight: "bold",
                          "&:hover": {
                            backgroundColor: "#f1f1f1",
                            borderColor: "#1b3a79",
                          },
                        }}
                      >
                        See Archived Guides
                      </Button>
                    </Grid>
                  </Grid>
                </Box>

                <Box
                  sx={{
                    maxHeight: 400,
                    overflowY: "auto",
                    padding: 2,
                    backgroundColor: "#f9f9f9",
                    borderRadius: 4,
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {loading ? (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                      }}
                    >
                      <CircularProgress sx={{ color: "#19275c" }} />
                    </Box>
                  ) : filteredGuides.length === 0 ? (
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      sx={{
                        textAlign: "center",
                        fontFamily: "'Poppins', sans-serif",
                        color: "#19275c",
                        padding: 2,
                      }}
                    >
                      No guides available. Generate a guide to get started!
                    </Typography>
                  ) : (
                    <Grid container spacing={2}>
                      {filteredGuides.map((guide) => (
                        <Grid item xs={12} sm={6} md={4} key={guide.trainId}>
                          <Card
                            sx={{
                              borderRadius: 4,
                              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                              transition: "transform 0.2s, box-shadow 0.2s",
                              "&:hover": {
                                transform: "scale(1.02)",
                                boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.2)",
                              },
                            }}
                          >
                            <CardContent
                              sx={{
                                padding: 3,
                                textAlign: "center",
                                backgroundColor: "#ffffff",
                                borderBottom: "2px solid #19275c",
                              }}
                            >
                              <Typography
                                variant="h6"
                                fontWeight="bold"
                                sx={{
                                  color: "#19275c",
                                  fontFamily: "'Poppins', sans-serif",
                                }}
                              >
                                {guide.petName} ({guide.type})
                              </Typography>
                              <Typography
                                variant="body2"
                                color="textSecondary"
                                sx={{
                                  marginY: 1,
                                  fontFamily: "'Poppins', sans-serif",
                                }}
                              >
                                <strong>Breed:</strong> {guide.breed}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="textSecondary"
                                sx={{
                                  fontFamily: "'Poppins', sans-serif",
                                  marginBottom: 1,
                                }}
                              >
                                <strong>Age:</strong> {guide.age} months
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontFamily: "'Poppins', sans-serif",
                                  color: "#707070",
                                }}
                              >
                                <strong>Generated on:</strong>{" "}
                                {dayjs(guide.createdAt).format("MM/DD/YYYY")}
                              </Typography>
                            </CardContent>
                            <CardActions
                              sx={{
                                justifyContent: "center",
                                padding: 2,
                              }}
                            >
                              <Tooltip title="View Training Guide">
                                <IconButton
                                  size="medium"
                                  onClick={() => handleSelectGuide(guide)}
                                  sx={{
                                    color: "#19275c",
                                    "&:hover": {
                                      backgroundColor: "#e3e7f1",
                                      color: "#1b3a79",
                                    },
                                  }}
                                >
                                  <Info />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Export as PDF">
                                <IconButton
                                  size="medium"
                                  onClick={() => exportGuideAsPDF(guide)}
                                  sx={{
                                    color: "#19275c",
                                    "&:hover": {
                                      backgroundColor: "#e3e7f1",
                                      color: "#1b3a79",
                                    },
                                  }}
                                >
                                  <DownloadIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete Training Guide">
                                <IconButton
                                  size="medium"
                                  onClick={() => handleDeleteGuide(guide._id)}
                                  sx={{
                                    color: "#e53935",
                                    "&:hover": {
                                      backgroundColor: "#fdecea",
                                      color: "#c62828",
                                    },
                                  }}
                                >
                                  <Delete />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Track Progress">
                                <IconButton
                                  size="medium"
                                  onClick={() => openTracker(guide)}
                                  sx={{
                                    color: "#43a047",
                                    "&:hover": {
                                      backgroundColor: "#e8f5e9",
                                      color: "#388e3c",
                                    },
                                  }}
                                >
                                  <TrackChangesIcon />
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

      <Dialog
        open={openArchivedGuides}
        onClose={() => setOpenArchivedGuides(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Archived Guides
          <IconButton
            size="small"
            onClick={() => setOpenArchivedGuides(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {loading ? (
            <CircularProgress />
          ) : archivedGuides.length === 0 ? (
            <Typography>No archived guides available.</Typography>
          ) : (
            <Grid container spacing={2}>
              {archivedGuides.map((guide) => (
                <Grid item xs={12} sm={6} md={4} key={guide.trainId}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{guide.petName}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        Breed: {guide.breed}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Age: {guide.age} months
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Archived on:{" "}
                        {dayjs(guide.updatedAt).format("MM/DD/YYYY")}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Tooltip title="View Guide">
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
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={openProgressTracker}
        onClose={closeTracker}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {progressGuide?.petName}'s Training Roadmap
          <IconButton
            size="small"
            onClick={closeTracker}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {/* Task Progress */}
          {Array.from({ length: 4 }, (_, index) => {
            const week = index + 1;
            const isCompleted = progressGuide?.progress?.find(
              (p) => p.week === week
            )?.completed;

            const isDisabled =
              index > 0 &&
              !progressGuide?.progress?.find((p) => p.week === week - 1)
                ?.completed;

            return (
              <Box
                key={week}
                display="flex"
                flexDirection="column"
                p={2}
                mb={2}
                sx={{
                  border: "1px solid",
                  borderColor: isCompleted ? "green" : "grey.300",
                  borderRadius: 2,
                  backgroundColor: isCompleted
                    ? "rgba(0, 128, 0, 0.1)"
                    : "white",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Week {week}: Task {week}
                </Typography>

                <Checkbox
                  checked={!!isCompleted}
                  onChange={() => handleToggleProgress(week)}
                  disabled={isCompleted || isDisabled} // Prevent unchecking and disabling based on conditions
                  sx={{ ml: "auto" }}
                />
              </Box>
            );
          })}
          <Button
            onClick={saveProgressChanges}
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{
              backgroundColor: "#121858", // Midnight Blue
              color: "white",
              "&:hover": {
                backgroundColor: "#0f144d",
              },
            }}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
          {/* Display current age after updates */}
          {progressGuide?.progress?.every((task) => task.completed) && (
            <Box mt={3} textAlign="center">
              <Typography variant="h6">
                Current Age of {progressGuide?.petName}: {progressGuide?.age}{" "}
                months
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          {/* Generate New Guide Button (after all tasks are saved) */}
          {progressGuide?.progress?.every((task) => task.completed) && (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              width="100%"
              p={2}
            >
              <Typography variant="body1" gutterBottom>
                All tasks are complete! Would you like to generate a new guide
                for {progressGuide?.petName}?
              </Typography>
              <TextField
                label="Current Age in Months"
                fullWidth
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                margin="normal"
                required
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleGenerateNewGuide}
                disabled={loading}
                sx={{
                  backgroundColor: "#121858", // Midnight Blue
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#0f144d",
                  },
                }}
              >
                {loading ? "Generating..." : "Generate New Guide"}
              </Button>
            </Box>
          )}
          <Button onClick={closeTracker} color="secondary">
            Close
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
