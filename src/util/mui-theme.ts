import { createTheme } from "@mui/material";

export const theme = createTheme({
  typography: {
    button: {
      // 大文字になるのを防ぐ
      textTransform: "none"
    }
  }
});
