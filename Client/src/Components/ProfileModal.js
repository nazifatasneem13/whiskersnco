import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ProfileModal = ({ open, onClose, profileData }) => {
  const { username, email, reviewsAsAdopter, reviewsAsDonator } = profileData;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "8px",
          position: "relative",
        },
      }}
    >
      {/* Modal Header */}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">User Profile</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Modal Content */}
      <DialogContent
        dividers
        sx={{ maxHeight: "500px", overflowY: "auto", padding: 2 }}
      >
        {/* User Information */}
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="subtitle1">
            <strong>Username:</strong> {username || "N/A"}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Email:</strong> {email || "N/A"}
          </Typography>
        </Box>

        <Divider sx={{ marginBottom: 2 }} />

        {/* Reviews Section */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Reviews
          </Typography>

          {/* Reviews as Adopter */}
          <Typography variant="subtitle2" sx={{ marginBottom: 1 }}>
            <strong>As Adopter:</strong>
          </Typography>
          <List dense>
            {reviewsAsAdopter && reviewsAsAdopter.length > 0 ? (
              reviewsAsAdopter.map((review, index) => (
                <ListItem key={index} sx={{ paddingLeft: 0 }}>
                  <ListItemText
                    primary={review.content}
                    secondary={`Pet: ${
                      review.petName || "N/A"
                    } | Reviewed By: ${
                      review.reviewedBy || "Unknown"
                    } | ${new Date(review.timestamp).toLocaleDateString()}`}
                  />
                </ListItem>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No reviews as an adopter.
              </Typography>
            )}
          </List>

          <Divider sx={{ marginY: 2 }} />

          {/* Reviews as Donator */}
          <Typography variant="subtitle2" sx={{ marginBottom: 1 }}>
            <strong>As Donator:</strong>
          </Typography>
          <List dense>
            {reviewsAsDonator && reviewsAsDonator.length > 0 ? (
              reviewsAsDonator.map((review, index) => (
                <ListItem key={index} sx={{ paddingLeft: 0 }}>
                  <ListItemText
                    primary={review.content}
                    secondary={`Pet: ${review.petName || "N/A"} | Reviewer: ${
                      review.reviewer || "Unknown"
                    } | ${new Date(review.timestamp).toLocaleDateString()}`}
                  />
                </ListItem>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No reviews as a donator.
              </Typography>
            )}
          </List>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
