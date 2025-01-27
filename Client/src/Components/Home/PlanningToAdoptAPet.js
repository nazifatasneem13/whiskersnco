import React from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  Container,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Heart, Smile, Book } from "lucide-react"; // Import Lucide icons

const PlanningToAdoptAPet = () => {
  const faqData = [
    {
      title: "The Joy of Welcoming a Pet",
      description:
        "Introducing a pet into your life enriches it in unique ways, offering joy and unconditional love. Adopting a pet means giving them a forever home and experiencing the special bond that forms when you care for an animal.",
      icon: <Heart style={{ marginRight: "8px", color: "#FF6F61" }} />, // Lucide icon
    },
    {
      title: "Your Pet Adoption Journey",
      description:
        "Ready to expand your family with a pet? Adopting is a heartwarming decision with significant considerations. This journey requires understanding, patience, and commitment, but it results in a rewarding relationship that lasts a lifetime.",
      icon: <Book style={{ marginRight: "8px", color: "#3F51B5" }} />, // Lucide icon
    },
    {
      title: "Healing Benefits of Pets",
      description:
        "Pets bring more than just joy; they provide remarkable health benefits. Their presence can lessen stress, improve heart health, and elevate our overall happiness. The connection with a pet is not only enjoyable but also healing.",
      icon: <Smile style={{ marginRight: "8px", color: "#4CAF50" }} />, // Lucide icon
    },
  ];

  return (
    <Container sx={{ width: "90%", justifyContent: "center" }}>
      <Box
        sx={{
          padding: "2rem",
          maxWidth: "100%",
          margin: "0 auto",
          textAlign: "center",
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
          boxShadow: 3,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            marginBottom: "1rem",
            display: "flex",
            justifyContent: "center",
            color: "#121858",
          }}
        >
          Frequently Asked Questions
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          {faqData.map((faq, index) => (
            <Accordion
              key={index}
              sx={{
                marginBottom: "1rem",
                "&:before": {
                  display: "none", // Remove the default MUI accordion line
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index + 1}-content`}
                id={`panel${index + 1}-header`}
                maxWidth="flex"
                justifyContent="center"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  fontWeight: "bold",
                  color: "#333",
                }}
              >
                {faq.icon}
                {faq.title}
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1" sx={{ color: "#666" }}>
                  {faq.description}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default PlanningToAdoptAPet;
