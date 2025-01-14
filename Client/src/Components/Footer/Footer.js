import React from "react";
import { Link } from "react-router-dom";
import { Box, Typography, IconButton, Container, Divider } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import logo from "./images/logo.jpeg";

const Footer = (props) => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#19275c", // Midnight blue background
        color: "#fff",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <Container maxWidth="md">
        {/* Logo and Title */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{ marginBottom: "1.5rem" }}
        >
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <Box display="flex" alignItems="center" gap={1}>
              <img
                src={logo}
                alt="Whiskers&Co Logo"
                style={{ width: "50px", borderRadius: "50%" }}
              />
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", fontSize: "20px" }}
              >
                {props.title || "Whiskers&Co"}
              </Typography>
            </Box>
          </Link>
        </Box>

        <Divider sx={{ marginBottom: "1.5rem", backgroundColor: "#fff" }} />

        {/* Footer Text */}
        <Typography
          variant="body2"
          sx={{
            fontSize: "0.875rem",
            color: "#ccc",
          }}
        >
          &copy; {new Date().getFullYear()} Whiskers&Co. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
