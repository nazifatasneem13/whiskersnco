import React from "react";
import { Box, Typography, Link, Avatar, Container } from "@mui/material";
import {
  Email as EmailIcon,
  GitHub as GitHubIcon,
  Margin,
} from "@mui/icons-material";
import developerPng from "./images/developer-png.jpeg";

const Contact = () => {
  return (
    <Container
      maxWidth="auto"
      sx={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      {/* Avatar Section */}
      <Box sx={{ marginBottom: 3, marginRight: 1 }}>
        <Avatar
          src={developerPng}
          alt="Profile"
          sx={{
            width: 400,
            height: 350,
            borderRadius: 8,
          }}
          // Rectangle image
        />
      </Box>
      {/* Contact Details Section */}
      <Box
        sx={{
          margin: 5,
          display: "flex",
          flexDirection: "row",
          gap: 2,
          width: "70%",
          minHeight: "30vh",
          justifyContent: "space-between",
        }}
      >
        {[
          {
            id: "210042111",
            name: "Nabila Islam",
            email: "nabilaislam21@iut-dhaka.edu",
            github: "https://github.com/nabila-sheona",
          },
          {
            id: "210042114",
            name: "Nazifa Tasneem",
            email: "nazifatasneem@iut-dhaka.edu",
            github: "https://github.com/nazifatasneem13",
          },
          {
            id: "210042124",
            name: "Tasnia Anwer",
            email: "tasniaanwer@iut-dhaka.edu",
            github: "https://github.com/tasniaanwer",
          },
        ].map((contact, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              padding: 4,
              border: "1px solid #ccc",
              borderRadius: 4,
              width: "35%",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                marginBottom: 2,
                marginTop: 5,
                color: "#121858",
              }}
            >
              ID: {contact.id}
            </Typography>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", marginBottom: 3, color: "#121858" }}
            >
              Name: {contact.name}
            </Typography>
            <Box
              sx={{ display: "flex", alignItems: "center", marginBottom: 3 }}
            >
              <EmailIcon sx={{ marginRight: 1, fontSize: 34 }} />
              <Link
                href={`mailto:${contact.email}`}
                underline="hover"
                sx={{ fontWeight: "bold", fontSize: 17, color: "#121858" }}
              >
                {contact.email}
              </Link>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <GitHubIcon sx={{ marginRight: 1, fontSize: 34 }} />
              <Link
                href={contact.github}
                underline="hover"
                target="_blank"
                sx={{ fontWeight: "bold", fontSize: 17, color: "#121858" }}
              >
                {contact.github.split("https://github.com/")[1]}
              </Link>
            </Box>
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default Contact;
