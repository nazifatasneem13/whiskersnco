import React, { useEffect } from "react";
import { Box, Divider, Typography } from "@mui/material";
import HomeLandingContainer from "./HomeLandingContainer";
import CardBelowHome from "./CardBelowHome";
import PlanningToAdoptAPet from "./PlanningToAdoptAPet";
import PreferredPetsCarousel from "./PreferredPetsCarousel";
import PetTraining from "./PetTraining";

const Home = (props) => {
  useEffect(() => {
    // Configuring the chat bubble
    window.embeddedChatbotConfig = {
      chatbotId: "f003Qmsfvl9wpxdNr8CZD",
      domain: "www.chatbase.co",
    };

    // Creating the script element for chat bubble
    const script = document.createElement("script");
    script.src = "https://www.chatbase.co/embed.min.js";
    script.async = true;
    script.setAttribute("chatbotId", "f003Qmsfvl9wpxdNr8CZD");
    script.setAttribute("domain", "www.chatbase.co");
    document.body.appendChild(script);

    // Clean up the script when component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <Box
      sx={{
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
