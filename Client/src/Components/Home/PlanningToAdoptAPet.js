import React from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  Container,
  AccordionDetails,
  Card,
  CardContent,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Heart, Smile, Book } from "lucide-react";

const PlanningToAdoptAPet = () => {
  const faqData = [
    {
      title: "How does the pet adoption process work?",
      description:
        "Our adoption process is simple! Browse available pets, submit an adoption application, and wait for admin to approve. After that you can communicate with the donator. Same process is also for giving away a pet.",
      icon: <Book size={20} style={{ marginRight: "8px", color: "#1976D2" }} />,
    },
    {
      title: "Are all pets vaccinated and spayed/neutered?",
      description:
        "Yes! All our pets receive vaccinations, health checkups, and are spayed/neutered before adoption to ensure their well-being and prevent overpopulation.",
      icon: (
        <Smile size={20} style={{ marginRight: "8px", color: "#388E3C" }} />
      ),
    },
    {
      title: "Can I return a pet if it's not a good fit?",
      description:
        "We understand that sometimes adoptions don't work out. You can communicate with the donator within a certain timeframe to ensure the best fit for both you and the pet.",
      icon: (
        <Heart size={20} style={{ marginRight: "8px", color: "#D81B60" }} />
      ),
    },
    {
      title: "What should I prepare before bringing my new pet home?",
      description:
        "Make sure you have essential supplies like food, water bowls, a bed, toys, and a safe space. Gradual introductions to your home help pets settle in comfortably.",
      icon: <Book size={20} style={{ marginRight: "8px", color: "#1976D2" }} />,
    },
  ];

  return (
    <Container maxWidth="md">
      <Card
        sx={{
          padding: "2rem",
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: 4,
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              marginBottom: "1rem",
              textAlign: "center",
              color: "#121858",
            }}
          >
            Frequently Asked Questions
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {faqData.map((faq, index) => (
              <Accordion
                key={index}
                sx={{
                  backgroundColor: "#f5f5f5",
                  borderRadius: "8px",
                  boxShadow: "none",
                  "&:before": { display: "none" },
                  "&:hover": { backgroundColor: "#e8e8e8" },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: "#555" }} />}
                  aria-controls={`panel${index + 1}-content`}
                  id={`panel${index + 1}-header`}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    fontWeight: "bold",
                    color: "#333",
                  }}
                >
                  {faq.icon}
                  <Typography variant="h6">{faq.title}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" sx={{ color: "#666" }}>
                    {faq.description}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default PlanningToAdoptAPet;
