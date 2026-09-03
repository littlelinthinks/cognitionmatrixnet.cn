import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { routes } from "./routes";
import { LangProvider } from "./i18n/LangContext";
import { PaymentStateProvider } from "./lib/paymentState";
import { ErrorBoundary } from "./components/common/ErrorBoundary";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <LangProvider>
        <PaymentStateProvider>
          <ErrorBoundary>
            <RouterProvider router={createBrowserRouter(routes)} />
          </ErrorBoundary>
        </PaymentStateProvider>
      </LangProvider>
    </HelmetProvider>
  </StrictMode>,
);
