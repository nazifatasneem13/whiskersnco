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
  List,
  ListItem,
  ListItemText,
  Snackbar,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PetsIcon from "@mui/icons-material/Pets";
import HomeIcon from "@mui/icons-material/Home";

import { Delete, Settings } from "@mui/icons-material";
import axios from "axios";
import upload from "../../utils/upload.js";
//import fetchUserProfile from "../utils/fetchUserProfile";

const Profile = () => {
  const [blockedEmails, setBlockedEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar state
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
  const [imagePreview, setImagePreview] = useState("");
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [userPets, setUserPets] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [replyContent, setReplyContent] = useState("");
  const [replyError, setReplyError] = useState("");
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const userResponse = await axios.get(
          "http://localhost:4000/users/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(userResponse.data);

        // Fetch blocked users
        await fetchBlocked();
        await fetchWishlistDetails();
      } catch (err) {
        console.error(err);
        // Handle session expiry
      }
    };
    const fetchUserPets = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:4000/profile/get", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserPets(response.data);
      } catch (err) {
        console.error("Error fetching user's pets:", err);
      }
    };

    const fetchBlocked = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:4000/users/blocked/hasblocked",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Access the emails properly and update the state
        setBlockedEmails(response.data.blockedUserEmails || []);
      } catch (err) {
        console.error("Failed to fetch blocked details:", err);
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
    const fetchUserReviews = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:4000/profile/reviews",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserReviews(response.data);
      } catch (err) {
        console.error("Error fetching user reviews:", err);
      }
    };

    fetchUserReviews();
    fetchUser();
    fetchUserPets();
  }, []);
  const handleAddReply = async (reviewId) => {
    if (!replyContent.trim()) {
      setReplyError("Reply content cannot be empty.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:4000/profile/reply",
        { reviewId, content: replyContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update reviews with the new reply
      setUserReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === reviewId
            ? { ...review, replies: [...review.replies, response.data.reply] }
            : review
        )
      );

      setReplyContent(""); // Clear input
      setReplyError(""); // Clear error
    } catch (err) {
      console.error("Error adding reply:", err);
      setReplyError("Failed to add reply. Please try again.");
    }
  };

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
  const unblockUser = async (email) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:4000/users/unblock",
        { email },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update UI after unblocking
      setBlockedEmails(
        blockedEmails.filter((blockedEmail) => blockedEmail !== email)
      );
      setMessage(response.data.message || "User unblocked successfully.");
      window.location.reload();
    } catch (err) {
      console.error("Failed to unblock user:", err);
      setError("Error unblocking user.");
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
          sx={{ width: 135, height: 135, mb: 2 }}
        />
        <Typography variant="h4" fontWeight="bold">
          {user.username || "Your Name"}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {user.email}
        </Typography>
        <IconButton
          onClick={handleSettingsOpen}
          sx={{
            mt: 2,
            color: "primary",
            display: "flex",
            alignItems: "center",
            gap: 1, // Gap between the icon and the text
            transition: "transform 0.3s ease-in-out",
            "&:hover": {
              transform: "scale(1.05)", // Enlarge the button on hover for better feedback
              backgroundColor: "transparent", // Removes the default hover background color
            },
            "&:hover .MuiTouchRipple-root": {
              display: "none", // Disables the ripple effect on hover
            },
          }}
        >
          <Settings />
          <Typography variant="body2" color="textSecondary">
            Update Profile
          </Typography>
        </IconButton>
      </Box>

      {/* Tabs */}
      <Tabs value={activeTab} onChange={handleTabChange} centered>
        <Tab label="User Details" />
        <Tab label="Wishlist" />
        <Tab label="Block List" />
        <Tab label="My Pets" />
        <Tab label="My Reviews" />
      </Tabs>

      {/* Tab Content */}
      <Divider sx={{ my: 4 }} />
      {activeTab === 0 && (
        <Box
          sx={{
            padding: 3,
            backgroundColor: "#e8eaf6", // Light indigo background for a fresh look
            borderRadius: 2,
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)", // Soft shadow for depth
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            gutterBottom
            color="black"
            sx={{ fontSize: "1.7rem", fontFamily: "Arial" }}
          >
            User Details
          </Typography>

          <Grid container spacing={2}>
            {/* Username Display */}
            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2, // Increase gap for better spacing
                  padding: 2, // Padding for touch-friendly design
                  backgroundColor: "#fff", // White background for cards
                  borderRadius: 3, // Slightly rounded corners for card-like feel
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)", // Subtle shadow on each item
                }}
              >
                <AccountCircleIcon
                  color="primary"
                  sx={{ fontSize: "2.7rem" }}
                />
                <Box>
                  <Typography
                    variant="subtitle1"
                    color="textSecondary"
                    sx={{ fontSize: "1.1rem" }}
                  >
                    Username
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight="medium"
                    sx={{ fontSize: "1.1em" }}
                  >
                    {user.username}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Email Display */}
            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2, // Increase gap for better spacing
                  padding: 2, // Padding for touch-friendly design
                  backgroundColor: "#fff", // White background for cards
                  borderRadius: 3, // Slightly rounded corners for card-like feel
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)", // Subtle shadow on each item
                }}
              >
                <EmailIcon color="primary" sx={{ fontSize: "2.7rem" }} />
                <Box>
                  <Typography
                    variant="subtitle1"
                    color="textSecondary"
                    sx={{ fontSize: "1.1rem" }}
                  >
                    Email
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight="medium"
                    sx={{ fontSize: "1.1rem" }}
                  >
                    {user.email}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Area Display */}
            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2, // Increase gap for better spacing
                  padding: 2, // Padding for touch-friendly design
                  backgroundColor: "#fff", // White background for cards
                  borderRadius: 3, // Slightly rounded corners for card-like feel
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)", // Subtle shadow on each item
                }}
              >
                <LocationOnIcon color="primary" sx={{ fontSize: "2.7rem" }} />
                <Box>
                  <Typography
                    variant="subtitle1"
                    color="textSecondary"
                    sx={{ fontSize: "1.1rem" }}
                  >
                    Area(s)
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight="medium"
                    sx={{ fontSize: "1.1rem" }}
                  >
                    {user.areas && user.areas.join(", ")}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Number of Pets Adopted */}
            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2, // Increase gap for better spacing
                  padding: 2, // Padding for touch-friendly design
                  backgroundColor: "#fff", // White background for cards
                  borderRadius: 3, // Slightly rounded corners for card-like feel
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)", // Subtle shadow on each item
                }}
              >
                <PetsIcon color="primary" sx={{ fontSize: "2.7rem" }} />
                <Box>
                  <Typography
                    variant="subtitle1"
                    color="textSecondary"
                    sx={{ fontSize: "1.1rem" }}
                  >
                    Pets Adopted
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight="medium"
                    sx={{ fontSize: "1.1rem" }}
                  >
                    {userPets.length}
                  </Typography>
                </Box>
              </Box>
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

      {activeTab === 2 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5">Blocked Users</Typography>
          {error && <Typography color="error">{error}</Typography>}
          <List>
            {blockedEmails.map((email, index) => (
              <ListItem
                key={index}
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <ListItemText primary={email} />
                <IconButton
                  color="secondary"
                  onClick={() => unblockUser(email)}
                  aria-label="unblock"
                >
                  <Delete />
                </IconButton>
              </ListItem>
            ))}
          </List>

          <Snackbar
            open={openSnackbar}
            autoHideDuration={3000}
            onClose={() => setOpenSnackbar(false)}
            message={message}
          />
        </Box>
      )}
      {activeTab === 3 && (
        <Box>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            My Pets
          </Typography>
          <Grid container spacing={3}>
            {userPets.length > 0 ? (
              userPets.map((pet) => (
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
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography
                variant="body1"
                color="textSecondary"
                sx={{ width: "100%", textAlign: "center", mt: 3 }}
              >
                No pets found.
              </Typography>
            )}
          </Grid>
        </Box>
      )}
      {activeTab === 4 && (
        <Box sx={{ padding: 3 }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            gutterBottom
            sx={{ mb: 2 }}
          >
            {" "}
            My Reviews
          </Typography>
          <Grid container spacing={3}>
            {userReviews.length > 0 ? (
              userReviews.map((review) => (
                <Grid item xs={12} key={review._id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">
                        <b>Pet Name: </b>
                        {review.petId?.name || "Unknown Pet"}
                      </Typography>
                      <Typography variant="body2">
                        <b>Review:</b> {review.content}
                      </Typography>
                      <Typography variant="body2">
                        <b>Reviewer:</b>{" "}
                        {review.reviewerId?.username || "Anonymous"}
                      </Typography>
                      <Typography variant="body2">
                        <b>Reviewed By:</b> {review.status || "undefined"}
                      </Typography>
                      <Typography variant="body2">
                        <b>Timestamp:</b>{" "}
                        {new Date(review.timestamp).toLocaleString()}
                      </Typography>

                      {/* Display Replies */}
                      {Array.isArray(review.replies) &&
                      review.replies.length > 0 ? (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle2">Replies:</Typography>
                          {review.replies.map((reply, index) => (
                            <Typography
                              key={index}
                              variant="body2"
                              sx={{ marginLeft: 2, marginTop: 1 }}
                            >
                              {reply.content} -{" "}
                            </Typography>
                          ))}
                        </Box>
                      ) : (
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          sx={{ mt: 2 }}
                        >
                          No replies yet.
                        </Typography>
                      )}

                      {/* Add Reply Input */}
                      <Box sx={{ mt: 2 }}>
                        <TextField
                          size="small"
                          placeholder="Write a reply..."
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          error={!!replyError}
                          helperText={replyError}
                          fullWidth
                        />
                        <Button
                          variant="contained"
                          sx={{ mt: 1 }}
                          onClick={() => handleAddReply(review._id)}
                        >
                          Reply
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography
                  variant="body1"
                  color="textSecondary"
                  sx={{ mt: 2 }} // Increased margin-top for better visual separation from the header
                >
                  No reviews found.
                </Typography>
              </Grid>
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
