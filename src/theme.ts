import { createTheme } from "@mantine/core";

export const theme = createTheme({
  colors: {
    // Define your color palette here
    brand: [
      "#f0f0f0",
      "#e0e0e0",
      "#d0d0d0",
      "#c0c0c0",
      "#b0b0b0",
      "#a0a0a0",
      "#909090",
      "#808080",
      "#707070",
      "#606060",
    ],
    // Add other colors if necessary
  },
  primaryColor: "brand", // Use the 'brand' colors defined above as primary
  fontFamily: '"Bebas Neue", sans-serif', // Choose a modern, readable font
  // Define other theme properties like shadows, radius, spacing, etc.
  shadows: {
    md: "0 4px 20px rgba(0, 0, 0, 0.1)",
    xl: "0 8px 30px rgba(0, 0, 0, 0.1)",
  },
  radius: {
    md: "8px", // Rounded corners for elements like buttons, input fields, etc.
  },
});
