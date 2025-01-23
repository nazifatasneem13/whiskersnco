import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import {
  Box,
  FormControlLabel,
  Grid,
  Typography,
  Button,
  FormGroup,
  CircularProgress,
  Paper,
  styled,
  useTheme,
  Switch,
} from "@mui/material";
import { Check } from "lucide-react";

const CustomSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase": {
    color: theme.palette.grey[300], // Color when OFF
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.easeInOut,
    }),
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.1)", // Light hover background effect
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: "#2196F3", // Set blue color when ON
    transform: "translateX(20px)", // Ensures thumb moves smoothly
    "& + .MuiSwitch-track": {
      backgroundColor: "#2196F3", // Set track to blue color when ON
      opacity: 1,
    },
  },
  "& .MuiSwitch-track": {
    backgroundColor: theme.palette.grey[400], // Track color when OFF
    opacity: 0.5,
  },
}));

const Preferences = () => {
  const theme = useTheme();
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

  const handleSwitchChange = (e) => {
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
        minWidth: "100vw",
        m: 0,
        p: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "50vw",
          maxWidth: "1200px",
          p: theme.spacing(7),
          backgroundColor: "#F5F5F4",
          borderRadius: theme.shape.borderRadius,
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{
            fontWeight: 600,
            mb: theme.spacing(4),
            color: theme.palette.text.primary,
          }}
        >
          Customize Your Preferences
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={theme.spacing(5)}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ fontWeight: 500, mb: 3 }}>
                Pet Types
              </Typography>
              <FormGroup>
                {["Dog", "Cat", "Bird", "Fish", "Rabbit", "Other"].map(
                  (type) => (
                    <FormControlLabel
                      key={type}
                      control={
                        <CustomSwitch
                          name="petTypes"
                          value={type}
                          checked={preferences.petTypes.includes(type)}
                          onChange={handleSwitchChange}
                        />
                      }
                      label={type}
                      sx={{ mb: 2 }}
                    />
                  )
                )}
              </FormGroup>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>
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
                      <CustomSwitch
                        name="areas"
                        value={area}
                        checked={preferences.areas.includes(area)}
                        onChange={handleSwitchChange}
                      />
                    }
                    label={area}
                    sx={{ mb: 1 }}
                  />
                ))}
              </FormGroup>
            </Grid>
          </Grid>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 3,
              width: "100%",
            }}
          >
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{
                px: 4,
                py: 1,
                fontSize: "1rem",
                fontWeight: 500,
                background:
                  "linear-gradient(45deg, #19275c 30%,rgb(14, 47, 176) 90%)", // Updated gradient with #19275c
                boxShadow: "0 3px 5px 2px rgba(25, 39, 92, .3)", // Shadow with color from the gradient
                borderRadius: "10px",
                border: "1px solid transparent", // Clean border, can adjust color if needed
                "&:hover": {
                  boxShadow: "0 5px 7px 3px rgba(33, 105, 243, .3)", // Enhanced shadow on hover
                },
                transition:
                  "background 0.3s, box-shadow 0.3s, border-color 0.3s", // Smooth transitions for properties
              }}
              startIcon={
                loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <Check />
                )
              }
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
            sx={{ mt: 2 }}
          >
            {successMessage}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default Preferences;
