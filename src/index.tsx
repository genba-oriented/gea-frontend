import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import ReactDOM from "react-dom/client";

import { StrictMode } from 'react';
import "./index.css";
import { AppRoutes } from "./pages/AppRoutes";



const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <StrictMode>
    <AppRoutes />
  </StrictMode>
);