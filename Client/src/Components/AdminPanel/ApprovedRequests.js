import React, { useState, useEffect } from "react";
import { Typography, CircularProgress, Grid, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PetsIcon from "@mui/icons-material/Pets";
import PetCards from "./PetCards";

const ApprovedRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const response = await fetch("http://localhost:4000/approvedPets");
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
        padding: 3,
        maxHeight: "70vh",
        overflowY: "scroll",
        borderRadius: 2,
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
                deleteBtnText={
                  <>
                    <DeleteIcon sx={{ mr: 0.5 }} />
                    Delete Post
                  </>
                }
                approveBtn={false}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box textAlign="center" mt={4}>
          <Typography variant="body1" mt={4} textAlign="center">
            <PetsIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            No Approved Pets available
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ApprovedRequests;
