import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./main.css";
import TVPage from "./pages/tvpage";
import PlayerPage from "./pages/playerpage";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/tv",
    element: (
      <MantineProvider theme={theme}>
        <TVPage />
      </MantineProvider>
    ),
  },
  {
    path: "/play",
    element: (
      <MantineProvider theme={theme}>
        <PlayerPage />
      </MantineProvider>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
