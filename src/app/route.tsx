import { createBrowserRouter } from "react-router";
import { HomePage } from "@/pages/home";
import { GamePage } from "@/pages/game";

export const createRouter = () =>
  createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/game",
      element: <GamePage />,
    },
  ]);
