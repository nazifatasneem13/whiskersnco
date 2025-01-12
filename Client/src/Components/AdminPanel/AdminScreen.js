import React, { useState } from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import {
  Pets as PetsIcon,
  CheckCircle as CheckCircleIcon,
  Assignment as AssignmentIcon,
  History as HistoryIcon,
} from "@mui/icons-material";
import PostingPets from "./PostingPets";
import AdoptingRequests from "./AdoptingRequests";
import AdoptedHistory from "./AdoptedHistory";
import ApprovedRequests from "./ApprovedRequests";

const AdminScreen = () => {
  const [screen, setScreen] = useState("postingPet");

  // Navigation items with icons
  const navItems = [
    { label: "Post Pet Requests", icon: <PetsIcon />, value: "postingPet" },
    {
      label: "Approved Pets",
      icon: <CheckCircleIcon />,
      value: "approvedRequests",
    },
    {
      label: "Adoption Requests",
      icon: <AssignmentIcon />,
      value: "adoptingPet",
    },
    {
      label: "Adopted History",
      icon: <HistoryIcon />,
      value: "adoptedHistory",
    },
  ];

  // Content rendering based on selected screen
  const renderContent = () => {
    switch (screen) {
      case "postingPet":
        return <PostingPets />;
      case "approvedRequests":
        return <ApprovedRequests />;
      case "adoptingPet":
        return <AdoptingRequests />;
      case "adoptedHistory":
        return <AdoptedHistory />;
      default:
        return <PostingPets />;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        padding: "50px 30px",
        backgroundColor: "#f1f1f1",
        height: "100vh",
      }}
    >
      {/* Left Navigation Panel */}
      <Box
        sx={{
          width: "240px",
          backgroundColor: "#121858", // Midnight Blue for the sidebar
          color: "#ffffff",
          borderRadius: "10px",
          padding: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          marginRight: "20px",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            padding: "10px 0",
            textAlign: "center",
            fontWeight: "bold",
            borderBottom: "1px solid #ffffff",
          }}
        >
          Admin Panel
        </Typography>
        <List>
          {navItems.map((item) => (
            <ListItemButton
              key={item.value}
              selected={screen === item.value}
              onClick={() => setScreen(item.value)}
              sx={{
                backgroundColor: screen === item.value ? "#1e3c72" : "inherit",
                color: screen === item.value ? "#ffffff" : "inherit",
                "&:hover": { backgroundColor: "#1e3c72", color: "#ffffff" },
                borderRadius: "8px",
                margin: "5px 0",
              }}
            >
              {item.icon && (
                <Box sx={{ marginRight: "10px", color: "inherit" }}>
                  {item.icon}
                </Box>
              )}
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Box>

      {/* Right Content Section */}
      <Box
        sx={{
          flex: 1,
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          padding: "20px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          overflowY: "auto", // Allow scrolling if content overflows
        }}
      >
        {renderContent()}
      </Box>
    </Box>
  );
};

export default AdminScreen;
