import React, { useEffect } from "react";
import { Box, Divider, Typography } from "@mui/material";
import HomeLandingContainer from "./HomeLandingContainer";
import CardBelowHome from "./CardBelowHome";
import PlanningToAdoptAPet from "./PlanningToAdoptAPet";
import PreferredPetsCarousel from "./PreferredPetsCarousel";
import PetTraining from "./PetTraining";

const Home = (props) => {
  return (
    <Box
      sx={{
        position: "center",
        maxWidth: "flex",
        backgroundColor: "background.default",
        color: "text.primary",
        minHeight: "100vh",
        px: 3,
        py: 2,
      }}
    >
      {/* Home Landing Section */}

      <HomeLandingContainer description={props.description} />
      <Divider sx={{ my: 3 }} />
      <PreferredPetsCarousel />
      <Divider sx={{ my: 3 }} />
      <CardBelowHome />
      <Divider sx={{ my: 3 }} />

      <PetTraining />

      <Divider sx={{ my: 3 }} />
      <PlanningToAdoptAPet />
    </Box>
  );
};

export default Home;
