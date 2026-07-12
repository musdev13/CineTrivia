import { createBrowserRouter } from "react-router";
import { HomePage } from "@/pages/home";
import { GamePage } from "@/pages/game";
import { BaseLayout } from "@/pages/layouts/BaseLayout";

export const createRouter = () =>
  createBrowserRouter([
    {
      path: "/",
      element: <BaseLayout />,
      children: [{
        index: true,
        element: <HomePage />
      }]
    },
    {
      path: "/game",
      element: <GamePage />,
    },
  ]);
