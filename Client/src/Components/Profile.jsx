import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Divider,
  Tabs,
  Tab,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Delete, Settings } from "@mui/icons-material";
import axios from "axios";
import upload from "../utils/upload.js";
import fetchUserProfile from "../utils/fetchUserProfile";

const Profile = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    img: "",
  });
  const [wishlist, setWishlist] = useState([]);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(""); // For preview
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await fetchUserProfile();
        setUser(data);
        await fetchWishlistDetails();
      } catch (err) {
        console.error(err);
        setMessage("Session expired. Please log in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");
        window.location.href = "/login";
      }
    };

    const fetchWishlistDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:4000/wishlist/wishlist/details",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setWishlist(response.data);
      } catch (err) {
        console.error("Failed to fetch wishlist details:", err);
      }
    };

    fetchUser();
  }, []);

  const handleRemoveFromWishlist = async (petId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:4000/wishlist/wishlistremove",
        { petId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setWishlist((prev) => prev.filter((pet) => pet._id !== petId));
      }
    } catch (err) {
      console.error("Failed to remove pet from wishlist:", err);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSettingsOpen = () => setSettingsOpen(true);
  const handleSettingsClose = () => {
    setSettingsOpen(false);
    setPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setProfileImage(null);
    setImagePreview(""); // Clear preview
    setMessage("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file)); // Generate a preview URL
    }
  };

  const handleSettingsSave = async () => {
    if (!password) {
      setMessage("Please enter your current password to confirm changes.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setMessage("New passwords do not match.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      let imageUrl = user.img;
      if (profileImage) {
        imageUrl = await upload(profileImage); // Upload the new image
      }

      const updateData = {
        img: imageUrl,
        password,
        newPassword: newPassword || undefined,
      };

      const response = await axios.put(
        "http://localhost:4000/users/update",
        updateData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUser(response.data);
      setMessage("Profile updated successfully.");
      handleSettingsClose();
    } catch (err) {
      console.error(err);
      setMessage(
        err.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 20 }}>
      {/* Profile Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 5,
        }}
      >
        <Avatar
          alt="Profile"
          src={imagePreview || user.img || "/default-pfp.png"} // Use preview if available
          sx={{ width: 120, height: 120, mb: 2 }}
        />
        <Typography variant="h4" fontWeight="bold">
          {user.username || "Your Name"}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {user.email}
        </Typography>
        <IconButton onClick={handleSettingsOpen} sx={{ mt: 2 }} color="primary">
          <Settings />
        </IconButton>
      </Box>

      {/* Tabs */}
      <Tabs value={activeTab} onChange={handleTabChange} centered>
        <Tab label="User Details" />
        <Tab label="Wishlist" />
      </Tabs>

      {/* Tab Content */}
      <Divider sx={{ my: 4 }} />
      {activeTab === 0 && (
        <Box>
          {/* User Details */}
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            User Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Username"
                fullWidth
                variant="outlined"
                value={user.username}
                InputProps={{ readOnly: true }}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                fullWidth
                variant="outlined"
                value={user.email}
                InputProps={{ readOnly: true }}
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>
        </Box>
      )}

      {activeTab === 1 && (
        <Box>
          {/* Wishlist Section */}
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Wishlist
          </Typography>
          <Grid container spacing={3}>
            {wishlist.length > 0 ? (
              wishlist.map((pet) => (
                <Grid item xs={12} sm={6} md={4} key={pet._id}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="200"
                      image={pet.filename}
                      alt={pet.name}
                    />
                    <CardContent>
                      <Typography variant="h6">{pet.name}</Typography>
                      <Typography variant="body2">
                        <b>Type:</b> {pet.type}
                      </Typography>
                      <Typography variant="body2">
                        <b>Breed:</b> {pet.breed}
                      </Typography>
                      <Typography variant="body2">
                        <b>Location:</b> {pet.area}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        startIcon={<Delete />}
                        color="error"
                        onClick={() => handleRemoveFromWishlist(pet._id)}
                      >
                        Remove
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography
                variant="body1"
                color="textSecondary"
                sx={{ width: "100%", textAlign: "center", mt: 3 }}
              >
                No pets in your wishlist.
              </Typography>
            )}
          </Grid>
        </Box>
      )}

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onClose={handleSettingsClose}>
        <DialogTitle>Update Profile</DialogTitle>
        <DialogContent>
          {message && (
            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
              {message}
            </Typography>
          )}
          <Button
            variant="outlined"
            component="label"
            sx={{
              mt: 3,
              mb: 2,
              backgroundColor: "#121858", // Midnight Blue
              color: "white", // Ensure text color contrasts well
              "&:hover": {
                backgroundColor: "#0f144d", // Slightly darker shade for hover effect
              },
            }}
          >
            Upload New Picture
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange} // Handle file selection
            />
          </Button>
          {imagePreview && (
            <Box sx={{ mb: 2 }}>
              <img
                src={imagePreview}
                alt="Preview"
                style={{ width: "100%", borderRadius: "8px" }}
              />
            </Box>
          )}
          <TextField
            label="Current Password"
            fullWidth
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="New Password"
            fullWidth
            variant="outlined"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Confirm New Password"
            fullWidth
            variant="outlined"
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSettingsClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSettingsSave} color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;
