import React, { useState, useEffect } from "react";
import PetCards from "./PetCards";
import { Box, Grid, CircularProgress, Typography } from "@mui/material";

const PostingPets = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const response = await fetch("http://localhost:4000/requests");
      if (!response.ok) {
        throw new Error("An error occurred");
      }
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: "#f5f8fc",
        p: 3,
        borderRadius: 2,
        /* Fix the component's height so it remains the same even if empty */
        height: "80vh",
        overflowY: "scroll",
      }}
    >
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
        >
          <CircularProgress />
        </Box>
      ) : requests.length > 0 ? (
        <Grid container spacing={2}>
          {requests.map((request) => (
            <Grid item xs={12} sm={6} md={4} key={request._id}>
              <PetCards
                pet={request}
                updateCards={fetchRequests}
                deleteBtnText="Reject"
                approveBtn={true}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box textAlign="center" mt={4}>
          <Typography variant="h6" color="text.secondary">
            No requests available
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default PostingPets;
