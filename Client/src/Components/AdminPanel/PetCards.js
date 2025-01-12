import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";

const PetCards = (props) => {
  const [showJustificationPopup, setShowJustificationPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showApproved, setShowApproved] = useState(false);
  const [showDeletedSuccess, setShowDeletedSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  const truncateText = (text, maxLength) =>
    text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;

  const maxLength = 40;

  const formatTimeAgo = (updatedAt) =>
    formatDistanceToNow(new Date(updatedAt), { addSuffix: true });

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      const response = await fetch(
        `http://localhost:4000/approving/${props.pet._id}`,
        {
          method: "PUT",
          body: JSON.stringify({ status: "Approved" }),
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        setShowErrorPopup(true);
      } else {
        setShowApproved(true);
      }
    } catch {
      setShowErrorPopup(true);
    } finally {
      setIsApproving(false);
    }
  };

  const deleteFormsAdoptedPet = async () => {
    setIsDeleting(true);
    try {
      const deleteResponses = await fetch(
        `http://localhost:4000/form/delete/many/${props.pet._id}`,
        { method: "DELETE" }
      );
      if (!deleteResponses.ok) {
        throw new Error("Failed to delete forms");
      }
    } catch {
    } finally {
      handleReject();
    }
  };

  const handleReject = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/delete/${props.pet._id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        setShowErrorPopup(true);
        throw new Error("Failed to delete pet");
      } else {
        setShowDeletedSuccess(true);
      }
    } catch {
      setShowErrorPopup(true);
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
        marginBottom: 2,
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={props.pet.filename}
        alt={props.pet.name}
        sx={{ borderRadius: 1 }}
      />
      <CardContent>
        <Typography
          variant="h6"
          component="div"
          sx={{ fontWeight: "bold", color: "#1e3c72" }}
        >
          {props.pet.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Type:</b> {props.pet.type}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Age:</b> {props.pet.age}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Location:</b> {props.pet.area}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Division:</b> {props.pet.division}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Owner Email:</b> {props.pet.email}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Owner Phone:</b> {props.pet.phone}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Justification:</b>{" "}
          <span>
            {truncateText(props.pet.justification, maxLength)}
            {props.pet.justification.length > maxLength && (
              <Button
                variant="text"
                size="small"
                onClick={() => setShowJustificationPopup(true)}
              >
                Read More
              </Button>
            )}
          </span>
        </Typography>
        <Typography variant="caption" display="block" gutterBottom>
          {formatTimeAgo(props.pet.updatedAt)}
        </Typography>
        <Box sx={{ display: "flex", gap: 1, marginTop: 2 }}>
          <Button
            variant="contained"
            color="error"
            fullWidth
            onClick={deleteFormsAdoptedPet}
            disabled={isDeleting || isApproving}
          >
            {isDeleting ? "Deleting..." : props.deleteBtnText}
          </Button>
          {props.approveBtn && (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleApprove}
              disabled={isDeleting || isApproving}
            >
              {isApproving ? "Approving..." : "Approve"}
            </Button>
          )}
        </Box>
      </CardContent>

      {/* Popups */}
      <Dialog
        open={showJustificationPopup}
        onClose={() => setShowJustificationPopup(false)}
      >
        <DialogTitle>Justification</DialogTitle>
        <DialogContent>
          <Typography>{props.pet.justification}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowJustificationPopup(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={showErrorPopup} onClose={() => setShowErrorPopup(false)}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Typography color="error">Oops!... Connection Error</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowErrorPopup(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={showApproved}
        onClose={() => {
          setShowApproved(false);
          props.updateCards();
        }}
      >
        <DialogTitle>Approval Successful</DialogTitle>
        <DialogContent>
          <Typography>
            Please contact the customer at{" "}
            <a href={`mailto:${props.pet.email}`}>{props.pet.email}</a> or{" "}
            <a href={`tel:${props.pet.phone}`}>{props.pet.phone}</a>.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowApproved(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={showDeletedSuccess}
        onClose={() => {
          setShowDeletedSuccess(false);
          props.updateCards();
        }}
      >
        <DialogTitle>Deletion Successful</DialogTitle>
        <DialogActions>
          <Button onClick={() => setShowDeletedSuccess(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default PetCards;
