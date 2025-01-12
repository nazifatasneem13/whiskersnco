import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
  Button,
  FormGroup,
  CircularProgress,
} from "@mui/material";
import { Check } from "lucide-react";

const Preferences = () => {
  const [preferences, setPreferences] = useState({
    petTypes: [],
    areas: [],
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkPreferences = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await newRequest.get(
          "http://localhost:4000/users/preferences",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data && res.data.areas.length > 0) {
          navigate("/");
        }
      } catch (err) {
        console.error("Failed to fetch existing preferences:", err);
      }
    };

    checkPreferences();
  }, [navigate]);

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    setPreferences((prev) => {
      const selected = prev[name];
      if (checked) {
        return { ...prev, [name]: [...selected, value] };
      } else {
        return { ...prev, [name]: selected.filter((item) => item !== value) };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await newRequest.post(
        "http://localhost:4000/users/preferences",
        preferences,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccessMessage("Preferences saved successfully!");
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/");
      }, 3000);
    } catch (err) {
      console.error("Failed to save preferences:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f4f4f4",
        padding: "2rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          maxWidth: "800px",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          boxShadow: 3,
          padding: "2rem",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: 600 }}
        >
          Select Your Preferences
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Pet Types Section */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontWeight: 500, marginTop: "1rem" }}
              >
                Pet Types
              </Typography>
              <FormGroup>
                {["Dog", "Cat", "Bird", "Fish", "Rabbit", "Other"].map(
                  (type) => (
                    <FormControlLabel
                      key={type}
                      control={
                        <Checkbox
                          name="petTypes"
                          value={type}
                          onChange={handleCheckboxChange}
                        />
                      }
                      label={type}
                    />
                  )
                )}
              </FormGroup>
            </Grid>

            {/* Preferred Areas Section */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontWeight: 500, marginTop: "1rem" }}
              >
                Preferred Areas
              </Typography>
              <FormGroup>
                {[
                  "Dhaka",
                  "Khulna",
                  "Chattogram",
                  "Barishal",
                  "Mymensingh",
                  "Rajshahi",
                  "Rangpur",
                  "Sylhet",
                ].map((area) => (
                  <FormControlLabel
                    key={area}
                    control={
                      <Checkbox
                        name="areas"
                        value={area}
                        onChange={handleCheckboxChange}
                      />
                    }
                    label={area}
                  />
                ))}
              </FormGroup>
            </Grid>
          </Grid>

          {/* Save Preferences Button */}
          <Box sx={{ textAlign: "center", marginTop: "2rem" }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{
                padding: "0.75rem 2rem",
                fontSize: "1rem",
                fontWeight: 600,
              }}
              startIcon={loading ? <CircularProgress size={20} /> : <Check />}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Preferences"}
            </Button>
          </Box>
        </form>
        {successMessage && (
          <Typography
            variant="body1"
            color="success.main"
            align="center"
            sx={{ marginTop: "1rem" }}
          >
            {successMessage}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Preferences;
