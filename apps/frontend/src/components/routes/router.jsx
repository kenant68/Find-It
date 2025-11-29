import { createBrowserRouter } from "react-router-dom";
import App from "../../App.jsx";
import Home from "../../pages/home/Home.jsx";
import Register from "../../pages/auth/Register.jsx";
import Login from "../../pages/auth/Login.jsx";
import Dashboard from "../../pages/dashboard/Dashboard.jsx";
import Notifications from "../../pages/notifications/Notifications.jsx";
import Matchs from "../../pages/matchs/Matchs.jsx";
import Scrims from "../../pages/scrims/Scrims.jsx";
import Team from "../../pages/team/Team.jsx";
import Profil from "../../pages/profil/Profil.jsx";
import OtherTeams from "../../pages/other-teams/OtherTeams.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "teams",
        element: <Team />,
      },
      {
        path: "matchs",
        element: <Matchs />,
      },
      {
        path: "announces",
        element: <Scrims />,
      },
      {
        path: "notifications",
        element: <Notifications />,
      },
      {
        path: "profil",
        element: <Profil />,
      },
      {
        path: "other-teams",
        element: <OtherTeams />,
      },
    ],
  },
]);
