import React from "react";
import { Box, Typography } from "@mui/material";
import HomeDarkCardLeftPic from "./images/HomeDarkCardLeftPic.jpeg";
import HomeDarkCardRightPic from "./images/HomeDarkCardRightPic.jpeg";

const CardBelowHome = () => {
  return (
    <Box
      sx={{
        justifyContent: "center",
        maxWidth: "100%",
        backgroundColor: "rgb(20, 20, 81)",
        width: "80%",
        minheight: "50vh",
        margin: "auto",
        padding: "10px",
        marginTop: "30px",
        borderRadius: "40px 50px 20px 20px",
        display: "flex",

        alignItems: "center",
        color: "aliceblue",
      }}
    >
      {/* Left Image (corresponds to .left-pic) */}
      <Box
        sx={{
          position: "relative",
          bottom: "50px",
          width: "16vw",
        }}
      >
        <Box
          component="img"
          src={HomeDarkCardLeftPic}
          alt="Playful cat"
          sx={{
            height: 220,
            marginLeft: "30px",
          }}
        />
      </Box>

      {/* Middle Text (corresponds to .right-para / .we-do) */}
      <Box
        sx={{
          minwidth: "flex",
          ml: 1,

          // If you had a custom CSS variable for --textGrey, replace it with your desired color
          color: "var(--textGrey)",

          paddingRight: "30px",
          paddingLeft: "150px",
        }}
      >
        <Box
          sx={{
            minwidth: "flex",
            ml: 1,

            // If you had a custom CSS variable for --textGrey, replace it with your desired color
            color: "var(--textGrey)",
            fontSize: "22px",
            fontWeight: 500,
            fontFamily: '"Montserrat", sans-serif',
            lineHeight: 1.2,
            textAlign: "left",
            paddingRight: "30px",
            paddingLeft: "10px",
          }}
        >
          <Typography
            sx={{
              fontSize: "28px",
              fontWeight: 500,
              color: "#ffffff", // or "aliceblue"
              marginBottom: "10px",
            }}
          >
            OUR MISSION
          </Typography>
        </Box>
        <Box
          sx={{
            minwidth: "flex",
            ml: 1,

            // If you had a custom CSS variable for --textGrey, replace it with your desired color
            color: "var(--textGrey)",
            fontSize: "22px",
            fontWeight: 500,
            fontFamily: '"Montserrat", sans-serif',
            lineHeight: 1.2,
            textAlign: "left",
            paddingRight: "30px",
            paddingLeft: "10px",
          }}
        >
          We specialize in connecting the perfect pet with their forever home,
          ensuring a seamless adoption process to spread joy and cultivate love.
        </Box>
      </Box>
      {/* Right Image (corresponds to .right-pic) */}
      <Box
        sx={{
          "& img": {
            height: "200px",
            position: "relative",
            bottom: "15px",
          },
        }}
      >
        <img src={HomeDarkCardRightPic} alt="Happy rabbit" />
      </Box>
    </Box>
  );
};

export default CardBelowHome;
