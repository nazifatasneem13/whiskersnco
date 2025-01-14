import React, { useEffect, useState } from "react";
import PetsViewer from "./PetsViewer";
import {
  Box,
  Grid,
  Select,
  MenuItem,
  TextField,
  Typography,
  Container,
} from "@mui/material";

const Pets = () => {
  const [filter, setFilter] = useState("all");
  const [breed, setBreed] = useState("");
  const [petsData, setPetsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userEmail = currentUser ? currentUser.email : null;

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch("http://localhost:4000/approvedPets");
        if (!response.ok) {
          throw new Error("An error occurred");
        }
        const data = await response.json();
        setPetsData(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const filteredPets = petsData
    .filter((pet) => pet.email !== userEmail)
    .filter((pet) => (filter === "all" ? true : pet.type === filter))
    .filter((pet) =>
      breed === ""
        ? true
        : pet.breed.toLowerCase().includes(breed.toLowerCase())
    );

  return (
    <Container maxWidth="auto" sx={{ mt: 4, mb: 30 }}>
      <Box sx={{ padding: 4 }}>
        <Typography variant="h4" textAlign="center" marginBottom={3}>
          Available Pets
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 3,
          }}
        >
          <Select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            displayEmpty
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="all">All Pets</MenuItem>
            <MenuItem value="Dog">Dogs</MenuItem>
            <MenuItem value="Cat">Cats</MenuItem>
            <MenuItem value="Rabbit">Rabbits</MenuItem>
            <MenuItem value="Bird">Birds</MenuItem>
            <MenuItem value="Fish">Fish</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>

          <TextField
            placeholder="Search by breed"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            variant="outlined"
            sx={{ minWidth: 300 }}
          />
        </Box>

        <Grid container spacing={3}>
          {loading ? (
            <Typography variant="body1" textAlign="center" width="100%">
              Loading...
            </Typography>
          ) : filteredPets.length > 0 ? (
            filteredPets.map((petDetail, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <PetsViewer pet={petDetail} />
              </Grid>
            ))
          ) : (
            <Typography variant="body1" textAlign="center" width="100%">
              Oops!... No pets available
            </Typography>
          )}
        </Grid>
      </Box>
    </Container>
  );
};

export default Pets;
