import React, { useState, useEffect } from "react";
import FormCard from "./FormCard";
import {
  Box,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

const AdoptingRequests = () => {
  const [forms, setForms] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [petDetailsPopup, setPetDetailsPopup] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [selectedPetId, setSelectedPetId] = useState("");

  /** Fetch forms */
  const fetchForms = async () => {
    try {
      const response = await fetch("http://localhost:4000/form/getForms");
      if (!response.ok) {
        throw new Error("An error occurred");
      }
      const data = await response.json();
      setForms(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  /** Fetch approved pets */
  const fetchPets = async () => {
    try {
      const response = await fetch("http://localhost:4000/approvedPets");
      if (!response.ok) {
        throw new Error("An error occurred");
      }
      const data = await response.json();
      setPets(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchForms();
    fetchPets();
  }, []);

  /** Pets that have at least one form submitted */
  const petsWithRequests = pets.filter((pet) =>
    forms.some((form) => form.petId === pet._id)
  );

  /** Open pet details in a modal dialog */
  const displayPetDetails = (pet) => {
    setSelectedPet(pet);
    setPetDetailsPopup(true);
  };

  /** Close the dialog */
  const closePetDetailsPopup = () => {
    setPetDetailsPopup(false);
    setSelectedPet(null);
  };

  /** Handle dropdown filter by pet */
  const handlePetChange = (event) => {
    setSelectedPetId(event.target.value);
  };

  /** Filter the pets based on selected Pet ID */
  const filteredPets = selectedPetId
    ? petsWithRequests.filter((pet) => pet._id === selectedPetId)
    : petsWithRequests;

  return (
    <Box
      sx={{
        backgroundColor: "#f5f8fc",
        p: 3,
        borderRadius: 2,

        height: "70vh",
        overflowY: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mb: 3,
        }}
      >
        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel id="pet-filter-label">Filter by Pet</InputLabel>
          <Select
            labelId="pet-filter-label"
            id="pet-filter"
            label="Filter by Pet"
            value={selectedPetId}
            onChange={handlePetChange}
          >
            <MenuItem value="">All Requests</MenuItem>
            {petsWithRequests.map((pet) => (
              <MenuItem key={pet._id} value={pet._id}>
                {pet.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Loading or Requests */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : filteredPets.length > 0 ? (
        filteredPets.map((pet) => {
          const petForms = forms.filter((form) => form.petId === pet._id);
          return (
            <Box key={pet._id} sx={{ mb: 3 }}>
              <Typography
                variant="h6"
                sx={{ cursor: "pointer", fontWeight: "bold", mb: 1 }}
                onClick={() => displayPetDetails(pet)}
              >
                {pet.name}
              </Typography>
              {petForms.map((form) => (
                <FormCard
                  key={form._id}
                  form={form}
                  pet={pet}
                  updateCards={fetchForms}
                  deleteBtnText="Reject"
                  approveBtn={true}
                />
              ))}
            </Box>
          );
        })
      ) : (
        /* Even if empty, the Box still has a height of 70vh */
        <Typography variant="body1" mt={4} textAlign="center">
          No adoption requests available for any pet.
        </Typography>
      )}

      {/* Dialog (popup) for Pet Details */}
      <Dialog
        open={petDetailsPopup}
        onClose={closePetDetailsPopup}
        fullWidth
        maxWidth="sm"
      >
        {selectedPet && (
          <>
            <DialogTitle>{selectedPet.name}</DialogTitle>
            <DialogContent dividers>
              <Box sx={{ display: "flex", gap: 2 }}>
                {/* Pet Image */}
                <Box
                  component="img"
                  src={`http://localhost:4000/images/${selectedPet.filename}`}
                  alt={selectedPet.name}
                  sx={{
                    width: 150,
                    height: 150,
                    objectFit: "cover",
                    borderRadius: 2,
                  }}
                />
                {/* Pet Details */}
                <Box>
                  <Typography variant="subtitle1">
                    <strong>Type:</strong> {selectedPet.type}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Age:</strong> {selectedPet.age}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Location:</strong> {selectedPet.area}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Division:</strong> {selectedPet.division}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Owner Email:</strong> {selectedPet.email}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Owner Phone:</strong> {selectedPet.phone}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Justification:</strong> {selectedPet.justification}
                  </Typography>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={closePetDetailsPopup} variant="contained">
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default AdoptingRequests;
