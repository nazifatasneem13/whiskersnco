import React, { useState, useEffect } from "react";
import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import AdoptedCards from "./AdoptedCards";

const AdoptedHistory = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdoptedPets = async () => {
    try {
      const response = await fetch("http://localhost:4000/adoptedPets");
      if (!response.ok) {
        throw new Error("An error occurred while fetching adopted pets");
      }
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching adopted pets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdoptedPets();
  }, []);

  return (
    <Box
      sx={{
        /* Gives a background and padding similar to your other components */
        backgroundColor: "#f5f8fc",
        p: 3,
        borderRadius: 2,
        /* Fixed height and scrolling */
        height: "70vh",
        overflowY: "scroll",
      }}
    >
      <Typography
        variant="h4"
        align="center"
        sx={{ fontWeight: "bold", mb: 3, color: "#1e3c72" }}
      >
        Adopted History
      </Typography>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50%", // or use a custom minHeight if desired
          }}
        >
          <CircularProgress />
        </Box>
      ) : requests.length > 0 ? (
        <Grid container spacing={3}>
          {requests.map((request) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={request._id}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <AdoptedCards
                pet={request}
                updateCards={fetchAdoptedPets}
                deleteBtnText="Delete History"
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography
          variant="body1"
          align="center"
          color="text.secondary"
          sx={{ mt: 4 }}
        >
          No Adopted Pets available
        </Typography>
      )}
    </Box>
  );
};

export default AdoptedHistory;
