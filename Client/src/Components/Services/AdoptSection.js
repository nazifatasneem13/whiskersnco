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
import adoptPet from "./images/logo3.png";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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
        marginLeft: "7%",
        maxWidth: "auto",
        margin: "4rem",
        padding: "4rem",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        boxShadow: 3,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            mb: 3,
            color: "#121858",
          }}
        >
          Adopt a Pet
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: "center", marginBottom: "1rem" }}
      >
        <img
          src={adoptPet}
          sx={{
            width: "5px",
            borderRadius: "5%",
            cursor: "pointer",
            objectFit: "cover",

            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          }}
          alt="Happy Pet"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Typography
          variant="body1"
          sx={{ mb: 3, textAlign: "center", color: "#555" }}
        >
          Discover the joys of adopting a pet with our dedicated program.
          Embracing a pet into your home fills it with laughter and love.
        </Typography>
      </motion.div>

      {/* Questions Section */}
      <Grid container spacing={3}>
        {/* Why Adopt */}
        <Grid item xs={12} md={4}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Card
              sx={{
                backgroundColor: "#ffffff",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                borderRadius: 2,
              }}
            >
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
                    {openSection === "whyAdopt" ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )}
                  </IconButton>
                </Box>
                <Collapse in={openSection === "whyAdopt"}>
                  <Box sx={{ mt: 2, color: "#555" }}>
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
          </motion.div>
        </Grid>

        {/* How to Adopt */}
        <Grid item xs={12} md={4}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Card
              sx={{
                backgroundColor: "#ffffff",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                borderRadius: 2,
              }}
            >
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
                  <Box sx={{ mt: 2, color: "#555" }}>
                    <ol>
                      <li>Submit your application for adoption</li>
                      <li>Visit with your potential new companion</li>
                      <li>Finalize the adoption with our support</li>
                    </ol>
                  </Box>
                </Collapse>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* What It Means to Be a Pet Owner */}
        <Grid item xs={12} md={4}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Card
              sx={{
                backgroundColor: "#ffffff",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                borderRadius: 2,
              }}
            >
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
                    {openSection === "petOwner" ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )}
                  </IconButton>
                </Box>
                <Collapse in={openSection === "petOwner"}>
                  <Box sx={{ mt: 2, color: "#555" }}>
                    <Typography variant="body1">
                      Being a pet owner is a rewarding commitment that includes
                      caring for your pet's everyday needs, such as nutrition,
                      grooming, exercise, and health care.
                    </Typography>
                  </Box>
                </Collapse>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Find Your Perfect Pet Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        style={{ textAlign: "center", marginTop: "3rem" }}
      >
        <Link to="/pets" style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={scrollToTop}
            sx={{
              padding: "12px 30px", // increased padding for a bigger button
              fontWeight: "bold",
              fontSize: "1.1rem", // slightly larger text
              background: "linear-gradient(45deg, #121858 30%, #474f97 90%)", // gradient background
              borderRadius: "50px", // fully rounded corners
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)", // subtle shadow
              textTransform: "none", // keeps the text uncapitalized
              transition: "all 0.3s ease", // smooth transition for hover effects
              "&:hover": {
                background: "linear-gradient(45deg, #474f97 30%, #121858 90%)", // hover gradient change
                boxShadow: "0 6px 18px rgba(0, 0, 0, 0.2)", // stronger shadow on hover
                transform: "scale(1.05)", // slight scale effect on hover
              },
            }}
          >
            Find Your Perfect Pet
          </Button>
        </Link>
      </motion.div>
    </Box>
  );
};

export default AdoptSection;
