import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";

const AdoptedCards = (props) => {
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showApproved, setShowApproved] = useState(false);
  const [showDeletedSuccess, setShowDeletedSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const formatTimeAgo = (updatedAt) => {
    const date = new Date(updatedAt);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const handleReject = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(
        `http://localhost:4000/delete/${props.pet._id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        setShowErrorPopup(true);
        throw new Error("Failed to delete pet");
      } else {
        setShowDeletedSuccess(true);
      }
    } catch (err) {
      setShowErrorPopup(true);
      console.error("Error deleting pet:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card
      sx={{
        backgroundColor: "#ffffff",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        borderRadius: 2,
        padding: 2,
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={props.pet.filename}
        alt={props.pet.name}
      />

      <CardContent>
        <Typography
          variant="h6"
          component="div"
          sx={{ fontWeight: "bold", color: "#1e3c72" }} // Dark blue text
        >
          {props.pet.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Type:</b> {props.pet.type}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>New Owner Email:</b> {props.pet.email}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>New Owner Phone:</b> {props.pet.phone}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Adopted:</b> {formatTimeAgo(props.pet.updatedAt)}
        </Typography>
        <Button
          variant="contained"
          color="error"
          fullWidth
          onClick={handleReject}
          disabled={isDeleting}
          sx={{
            marginTop: 2,
            backgroundColor: "#d32f2f",
            "&:hover": { backgroundColor: "#b71c1c" },
          }}
        >
          {isDeleting ? "Deleting..." : props.deleteBtnText}
        </Button>
      </CardContent>

      {showErrorPopup && (
        <Box sx={{ padding: 2, backgroundColor: "#f8d7da", borderRadius: 1 }}>
          <Typography color="error">Oops!... Connection Error</Typography>
          <Button onClick={() => setShowErrorPopup(false)}>Close</Button>
        </Box>
      )}

      {showApproved && (
        <Box sx={{ padding: 2, backgroundColor: "#d1e7dd", borderRadius: 1 }}>
          <Typography>Approval Successful...</Typography>
          <Typography>
            Please contact the customer at{" "}
            <a href={`mailto:${props.pet.email}`}>{props.pet.email}</a> or{" "}
            <a href={`tel:${props.pet.phone}`}>{props.pet.phone}</a> to arrange
            the transfer of the pet.
          </Typography>
          <Button
            onClick={() => {
              setShowApproved(false);
              props.updateCards();
            }}
          >
            Close
          </Button>
        </Box>
      )}

      {showDeletedSuccess && (
        <Box sx={{ padding: 2, backgroundColor: "#d1e7dd", borderRadius: 1 }}>
          <Typography>Deleted Successfully from Database...</Typography>
          <Button
            onClick={() => {
              setShowDeletedSuccess(false);
              props.updateCards();
            }}
          >
            Close
          </Button>
        </Box>
      )}
    </Card>
  );
};

export default AdoptedCards;
