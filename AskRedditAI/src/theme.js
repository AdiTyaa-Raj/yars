import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#ff6b35",
      dark: "#cc4a1f",
      light: "#ff9368",
    },
    secondary: {
      main: "#127475",
      dark: "#0e5e5f",
      light: "#4d999a",
    },
    background: {
      default: "#f6f8fb",
      paper: "rgba(255, 255, 255, 0.9)",
    },
    text: {
      primary: "#122030",
      secondary: "#3f5369",
    },
  },
  typography: {
    fontFamily: '"Space Grotesk", "Segoe UI", sans-serif',
    h1: {
      fontFamily: '"Archivo", "Space Grotesk", sans-serif',
      fontWeight: 700,
      letterSpacing: "-0.04em",
    },
    h2: {
      fontFamily: '"Archivo", "Space Grotesk", sans-serif',
      fontWeight: 700,
      letterSpacing: "-0.03em",
    },
    h5: {
      fontWeight: 700,
      letterSpacing: "-0.01em",
    },
    button: {
      fontWeight: 700,
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 18,
  },
});

export default theme;
