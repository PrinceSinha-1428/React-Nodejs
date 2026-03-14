import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthcontextProvider } from "./context/Authcontext.tsx";
import { ThemeProvider } from "./context/Themecontext.tsx";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthcontextProvider>
          <App />
          <Toaster />
        </AuthcontextProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
