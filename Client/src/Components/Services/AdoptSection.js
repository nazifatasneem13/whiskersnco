import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Collapse,
  Card,
  CardContent,
  IconButton,
  Grid,
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { Heart, HelpCircle, Home } from "lucide-react";
import adoptPet from "./images/adoptPet.jpeg";
import { Link } from "react-router-dom";

const AdoptSection = () => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <Box
      sx={{
        maxWidth: "auto",
        margin: "2rem auto",
        padding: "2rem",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        boxShadow: 3,
      }}
    >
      <Typography
        variant="h4"
        sx={{ textAlign: "center", fontWeight: "bold", mb: 3 }}
      >
        Adopt a Pet
      </Typography>
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <img
          src={adoptPet}
          alt="Happy Pet"
          style={{
            width: "auto",
            maxHeight: "auto",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
      </Box>
      <Typography variant="body1" sx={{ mb: 3, textAlign: "center" }}>
        Discover the joys of adopting a pet with our dedicated program.
        Embracing a pet into your home fills it with laughter and love.
      </Typography>

      {/* Questions Section */}
      <Grid container spacing={3}>
        {/* Why Adopt */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() => toggleSection("whyAdopt")}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Heart color="#121858" />
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Why Adopt?
                  </Typography>
                </Box>
                <IconButton>
                  {openSection === "whyAdopt" ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </Box>
              <Collapse in={openSection === "whyAdopt"}>
                <Box sx={{ mt: 2 }}>
                  <ul>
                    <li>Give a forever home to a pet that needs you</li>
                    <li>
                      Gain a loyal companion who will bring endless affection
                    </li>
                    <li>
                      Forge unforgettable bonds and make heartwarming memories
                    </li>
                  </ul>
                </Box>
              </Collapse>
            </CardContent>
          </Card>
        </Grid>

        {/* How to Adopt */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() => toggleSection("howToAdopt")}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <HelpCircle color="#121858" />
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    How to Adopt
                  </Typography>
                </Box>
                <IconButton>
                  {openSection === "howToAdopt" ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  )}
                </IconButton>
              </Box>
              <Collapse in={openSection === "howToAdopt"}>
                <Box sx={{ mt: 2 }}>
                  <ol>
                    <li>Submit your application for adoption</li>
                    <li>Visit with your potential new companion</li>
                    <li>Finalize the adoption with our support</li>
                  </ol>
                </Box>
              </Collapse>
            </CardContent>
          </Card>
        </Grid>

        {/* What It Means to Be a Pet Owner */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() => toggleSection("petOwner")}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Home color="#121858" />
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    What It Means to Be a Pet Owner
                  </Typography>
                </Box>
                <IconButton>
                  {openSection === "petOwner" ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </Box>
              <Collapse in={openSection === "petOwner"}>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1">
                    Being a pet owner is a rewarding commitment that includes
                    caring for your pet's everyday needs, such as nutrition,
                    grooming, exercise, and health care.
                  </Typography>
                </Box>
              </Collapse>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Find Your Perfect Pet Button */}
      <Box sx={{ textAlign: "center", mt: 3 }}>
        <Link to="/pets" style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={scrollToTop}
            sx={{
              padding: "10px 20px",
              fontWeight: "bold",
              fontSize: "1rem",
              backgroundColor: "#121858",
              "&:hover": { backgroundColor: "#474f97" },
            }}
          >
            Find Your Perfect Pet
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default AdoptSection;
