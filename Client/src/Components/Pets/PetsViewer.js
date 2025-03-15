import React, { useEffect, useState } from "react";
import AdoptForm from "../AdoptForm/AdoptForm";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import { Favorite, FavoriteBorder, Email } from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";

const PetsViewer = (props) => {
  const [showPopup, setShowPopup] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [wishlist, setWishlist] = useState([]);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userEmail = currentUser ? currentUser.email : null;

  // Fetch wishlist details from the backend
  useEffect(() => {
    const fetchWishlistDetails = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/wishlist/wishlist/details",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setWishlist(data.map((pet) => pet._id)); // Extract pet IDs
        } else {
          console.error("Failed to fetch wishlist details.");
        }
      } catch (error) {
        console.error("Error fetching wishlist details:", error);
      }
    };

    fetchWishlistDetails();
  }, []);

  // Check if the current pet is in the wishlist
  useEffect(() => {
    setIsFavorited(wishlist.includes(props.pet._id));
  }, [wishlist, props.pet._id]);

  const togglePopup = () => setShowPopup(!showPopup);

  const handleFavoriteToggle = async () => {
    try {
      const url = isFavorited
        ? `http://localhost:4000/wishlist/wishlistremove`
        : `http://localhost:4000/users/wishlist`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ petId: props.pet._id }),
      });

      if (response.ok) {
        setWishlist(
          (prev) =>
            isFavorited
              ? prev.filter((id) => id !== props.pet._id) // Remove pet from wishlist
              : [...prev, props.pet._id] // Add pet to wishlist
        );
        setIsFavorited(!isFavorited);
      } else {
        console.error("Failed to toggle wishlist.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatTimeAgo = (updatedAt) => {
    const date = new Date(updatedAt);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <Card sx={{ maxWidth: 340, margin: "15px", boxShadow: 3 }}>
      <CardMedia
        component="img"
        height="200"
        image={props.pet.filename}
        alt={props.pet.name}
      />
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {props.pet.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Type:</b> {props.pet.type}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Breed:</b> {props.pet.breed}
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
        {props.pet.email !== userEmail && (
          <Typography variant="body2" color="text.secondary">
            <b>Email:</b> <Email fontSize="small" /> {props.pet.email}
          </Typography>
        )}
        <Typography variant="caption" display="block" gutterBottom>
          {formatTimeAgo(props.pet.updatedAt)}
        </Typography>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {props.pet.email !== userEmail && (
            <Button
              variant="contained"
              color="primary"
              onClick={togglePopup}
              sx={{
                marginTop: "10px",
                backgroundColor: "#121858", // Midnight Blue
                color: "white", // Ensure text color contrasts well
                "&:hover": {
                  backgroundColor: "#0f144d", // Slightly darker shade for hover effect
                },
              }}
            >
              Show Interest <i className="fa fa-paw"></i>
            </Button>
          )}
          <IconButton onClick={handleFavoriteToggle}>
            {isFavorited ? (
              <Favorite color="error" /> // Red heart for favorited pets
            ) : (
              <FavoriteBorder />
            )}
          </IconButton>
        </div>
      </CardContent>

      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              width: "90%",
              maxWidth: "1100px",
              maxHeight: "90vh",
              overflowY: "auto",
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "2rem",
              position: "relative",
            }}
          >
            <AdoptForm closeForm={togglePopup} pet={props.pet} />
          </div>
        </div>
      )}
    </Card>
  );
};

export default PetsViewer;
