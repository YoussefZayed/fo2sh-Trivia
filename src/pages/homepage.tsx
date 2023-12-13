import React from "react";
import { AppShell, Text, Button, useMantineTheme, Group } from "@mantine/core";
import { Link } from "react-router-dom";
import homepageBackground from "../imgs/homepageBackground.jpg";
import homepageBackgroundlong from "../imgs/homepageBackgroundlong.jpg";

export default function Homepage() {
  const theme = useMantineTheme();

  const inlineStyles = {
    mainContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-end", // Align content to the bottom of the page
      height: "100vh",
      paddingBottom: "5%", // Add some padding at the bottom
      backgroundImage: `url(${
        window.innerWidth > 768 ? homepageBackgroundlong : homepageBackground
      })`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      transition: "background-image 0.3s ease-in-out", // Smooth transition for background change
    },
    headerText: {
      fontSize: "4rem", // Even larger font size for a more bombastic look
      fontWeight: "700", // Bold font weight
      fontFamily: '"Bebas Neue", sans-serif', // Google Font Family
      color: theme.white,
      textShadow: "3px 3px 6px rgba(0, 0, 0, 0.6)", // More pronounced text shadow for contrast
      margin: "0 0 2rem 0",
      animation: "fadeInUp 1s ease-in-out",
    },
    linkButton: {
      fontSize: "1.5rem",
      padding: "1rem 3rem",
      margin: "1rem",
      background: `linear-gradient(135deg, ${theme.colors.blue[5]} 0%, ${theme.colors.cyan[5]} 100%)`, // Gradient background
      color: theme.white,
      border: 0,
      borderRadius: "50px", // Rounded borders
      opacity: 0.9, // Semi-opaque
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Subtle shadow for depth
      transition: "all 0.3s ease",
      "&:hover": {
        opacity: 1, // Full color on hover
        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)", // Increased shadow on hover
        transform: "translateY(-2px)", // Slight lift effect
      },
      "&:active": {
        opacity: 0.85, // Slightly more opaque on click
        boxShadow: "0 3px 6px rgba(0, 0, 0, 0.2)", // Decreased shadow to mimic depth on click
        transform: "translateY(-1px)", // Mimic button press effect
      },
      animation: "fadeInUp 1s ease-in-out 0.2s",
      animationFillMode: "both",
    },
  };

  return (
    <AppShell styles={{ main: { background: "none" } }}>
      <div style={inlineStyles.mainContainer}>
        <Text style={inlineStyles.headerText}>Fo2sh Trivia</Text>
        <Group position="center">
          <Button
            size="xl"
            component={Link}
            to="/play"
            style={inlineStyles.linkButton}
          >
            PLAYER
          </Button>
          <Button
            size="2xl"
            component={Link}
            to="/tv"
            style={inlineStyles.linkButton}
          >
            TV
          </Button>
        </Group>
      </div>
    </AppShell>
  );
}
