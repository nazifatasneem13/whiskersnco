import React, { useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";

const FormCard = (props) => {
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showApproved, setShowApproved] = useState(false);
  const [showDeletedSuccess, setShowDeletedSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);

  const formatTimeAgo = (updatedAt) => {
    const date = new Date(updatedAt);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      const response = await fetch(
        `http://localhost:4000/approvingadopt/${props.form.petId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            email: props.form.email,
            phone: props.form.phoneNo,
            status: "Adopted",
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        setShowErrorPopup(true);
      } else {
        setShowApproved(true);
      }
    } catch (err) {
      setShowErrorPopup(true);
    }
  };

  const handleReject = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(
        `http://localhost:4000/form/reject/${props.form._id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        setShowErrorPopup(true);
        throw new Error("Failed to delete form");
      } else {
        setShowDeletedSuccess(true);
      }
    } catch (err) {
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
        maxWidth: 290,
      }}
    >
      <CardContent>
        <Typography
          variant="body1"
          sx={{ fontWeight: "bold", color: "#1e3c72" }}
        >
          Email: {props.form.email}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Phone Number: {props.form.phoneNo}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Living Situation: {props.form.livingSituation}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Previous Pet Experience: {props.form.previousExperience}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Family composition: {props.form.familyComposition}
        </Typography>
        <Typography variant="caption" display="block" gutterBottom>
          {formatTimeAgo(props.form.updatedAt)}
        </Typography>

        <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
          <Button
            variant="contained"
            color="error"
            onClick={handleReject}
            disabled={isDeleting || isApproving}
          >
            {isDeleting ? "Deleting..." : props.deleteBtnText}
          </Button>

          {props.approveBtn && (
            <Button
              variant="contained"
              color="success"
              onClick={handleApprove}
              disabled={isDeleting || isApproving}
            >
              {isApproving ? "Approving..." : "Approve"}
            </Button>
          )}
        </Box>
      </CardContent>

      {/* Dialogs for Popups */}
      <Dialog
        open={showDetailsPopup}
        onClose={() => setShowDetailsPopup(false)}
      >
        <DialogTitle>Form Details</DialogTitle>
        <DialogContent>
          <Typography variant="body2">Email: {props.form.email}</Typography>
          <Typography variant="body2">
            Phone Number: {props.form.phoneNo}
          </Typography>
          <Typography variant="body2">
            Living Situation: {props.form.livingSituation}
          </Typography>
          <Typography variant="body2">
            Previous Pet Experience: {props.form.previousExperience}
          </Typography>
          <Typography variant="body2">
            Having Other Pets? {props.form.familyComposition}
          </Typography>
          <Typography variant="caption" display="block">
            {formatTimeAgo(props.form.updatedAt)}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDetailsPopup(false)}>Close</Button>
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

      <Dialog open={showApproved} onClose={() => setShowApproved(false)}>
        <DialogTitle>Approval Successful</DialogTitle>
        <DialogContent>
          <Typography>
            Please contact the adopter at{" "}
            <a href={`mailto:${props.form.email}`}>{props.form.email}</a> or{" "}
            <a href={`tel:${props.form.phoneNo}`}>{props.form.phoneNo}</a> to
            arrange the transfer of the pet.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              props.updateCards();
              setShowApproved(false);
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showDeletedSuccess}
        onClose={() => setShowDeletedSuccess(false)}
      >
        <DialogTitle>Request Rejected Successfully</DialogTitle>
        <DialogActions>
          <Button
            onClick={() => {
              setShowDeletedSuccess(false);
              props.updateCards();
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default FormCard;
