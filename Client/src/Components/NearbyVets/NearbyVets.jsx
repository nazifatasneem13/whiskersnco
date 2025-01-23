import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Grid,
  InputAdornment,
} from "@mui/material";
import { Tooltip } from "@mui/material";
import { Search, LocationOn, MyLocation } from "@mui/icons-material";

const NearbyVets = () => {
  const [city, setCity] = useState("");
  const [vetClinics, setVetClinics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetchVets = async () => {
    if (!city) {
      setError("Please enter a city or place name.");
      return;
    }

    setError(null);
    setLoading(true);
    setVetClinics([]);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=veterinary+${city}`
      );

      if (!response.ok) throw new Error("Failed to fetch data.");

      const data = await response.json();

      const formattedData = data.map((place) => ({
        name: place.display_name,
        latitude: place.lat,
        longitude: place.lon,
        url: `https://www.google.com/maps?q=${place.display_name}`,
      }));

      setVetClinics(formattedData);
    } catch (err) {
      setError("Error fetching data. Try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleGetCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setError(null);
    setLoading(true);
    setVetClinics([]);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Reverse geocode to get the city/district
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );

          if (!response.ok)
            throw new Error("Failed to fetch location details.");

          const data = await response.json();
          const district =
            data.address.county || data.address.city || data.address.state;

          if (district) {
            setCity(district); // Update the city in state
            // Fetch vet clinics after location is determined
            const vetsResponse = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=veterinary+${district}`
            );

            if (!vetsResponse.ok)
              throw new Error("Failed to fetch vet clinics.");

            const vetsData = await vetsResponse.json();
            const formattedVets = vetsData.map((place) => ({
              name: place.display_name,
              latitude: place.lat,
              longitude: place.lon,
              url: `https://www.google.com/maps?q=${place.display_name}`,
            }));

            setVetClinics(formattedVets);
          } else {
            setError("Unable to determine your city or district.");
          }
        } catch (err) {
          setError("Error fetching location or vet clinics. Try again later.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setError("Unable to retrieve your location.");
        setLoading(false);
      }
    );
  };

  const handleGetCurrentLocationoption = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=veterinary&lat=LATITUDE&lon=LONGITUDE&radius=RADIUS_IN_METERS
`
          );

          if (!response.ok) throw new Error("Failed to fetch location.");

          const data = await response.json();
          setCity(data.display_name || `${latitude}, ${longitude}`);
          handleFetchVets(data.display_name);
        } catch (err) {
          setError("Error fetching location. Try again later.");
          console.error(err);
        }
      },
      () => {
        setError("Unable to retrieve your location.");
      }
    );
  };
  return (
    <Box
      sx={{
        maxWidth: "900px",
        margin: "2rem auto",
        padding: "2rem",
        borderRadius: "12px",
        boxShadow: 4,
        backgroundColor: "#ffffff",
        minHeight: "400px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          fontWeight: "700",
          mb: 4,
          color: "#1a237e",
        }}
      >
        Find Nearby Veterinary Clinics
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 4,
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Enter a city or place"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocationOn color="action" />
              </InputAdornment>
            ),
          }}
          sx={{
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
          }}
        />
        <Tooltip title="Current Location" arrow>
          <Button
            variant="contained"
            onClick={handleGetCurrentLocation}
            sx={{
              backgroundColor: "#1a237e",
              color: "#fff",
              paddingX: 2,
              paddingY: 1.5,
              "&:hover": { backgroundColor: "#1565c0" },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <MyLocation />
          </Button>
        </Tooltip>
        <Button
          variant="contained"
          startIcon={<Search />}
          onClick={handleFetchVets}
          sx={{
            backgroundColor: "#1a237e",
            color: "#fff",
            paddingX: 4,
            paddingY: 1.5,
            "&:hover": { backgroundColor: "#1565c0" },
            width: { xs: "100%", sm: "auto" },
          }}
        >
          Search
        </Button>
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <CircularProgress color="primary" />
        </Box>
      )}
      {error && (
        <Typography
          variant="body1"
          color="error"
          sx={{
            mb: 4,
            textAlign: "center",
          }}
        >
          {error}
        </Typography>
      )}

      <Grid container spacing={4}>
        {vetClinics.map((vet, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                borderRadius: "12px",
                boxShadow: 3,
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "scale(1.03)",
                  boxShadow: 6,
                },
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  fontWeight="600"
                  sx={{ color: "#1a237e", mb: 1 }}
                >
                  {vet.name.split(",")[0]}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {vet.name}
                </Typography>
              </CardContent>
              <CardActions sx={{ padding: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  href={vet.url}
                  target="_blank"
                  fullWidth
                  sx={{
                    textTransform: "none",
                    backgroundColor: "#1a237e",
                    "&:hover": { backgroundColor: "#3949ab" },
                  }}
                >
                  View on Map
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {!loading && vetClinics.length === 0 && !error && (
        <Typography
          variant="body1"
          sx={{
            textAlign: "center",
            width: "100%",
            color: "#757575",
            mt: 4,
          }}
        >
          Enter a location to find nearby veterinary clinics.
        </Typography>
      )}
    </Box>
  );
};

export default NearbyVets;
