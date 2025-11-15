 import {createBrowserRouter} from "react-router-dom";
import App from "../../App.jsx"
import Home from "../../pages/home/Home.jsx"
import Register from "../../pages/auth/Register.jsx";
import Login from "../../pages/auth/Login.jsx";

export const router = createBrowserRouter([

    {
        path: "/",
        element: (

            <App/>

        ),
        children: [
            {
                index: true,
                element: <Home/>
            },
            {
                path: "register",
                element: (
                    <Register/>
                )
            },
            {
                path: "login",
                element: (
                    <Login/>
                )
            },
            // {
            //     path: "teams",
            //     element: <Teams/>
            // },
            // {
            //     path: "matchs",
            //     element: <Matchs/>
            // },
            // {
            //     path: "announces",
            //     element: <Announces/>
            // },
            // {
            //     path: "notifications",
            //     element: <Notifications/>
            // }
        ]
    },
])