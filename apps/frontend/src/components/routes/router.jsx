import { createBrowserRouter } from "react-router-dom";
import App from "../../App.jsx";
import ProtectedRoute from "../ProtectedRoute.jsx";
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
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "teams",
        element: (
          <ProtectedRoute>
            <Team />
          </ProtectedRoute>
        ),
      },
      {
        path: "matchs",
        element: (
          <ProtectedRoute>
            <Matchs />
          </ProtectedRoute>
        ),
      },
      {
        path: "announces",
        element: (
          <ProtectedRoute>
            <Scrims />
          </ProtectedRoute>
        ),
      },
      {
        path: "notifications",
        element: (
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        ),
      },
      {
        path: "profil",
        element: (
          <ProtectedRoute>
            <Profil />
          </ProtectedRoute>
        ),
      },
      {
        path: "other-teams",
        element: (
          <ProtectedRoute>
            <OtherTeams />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
