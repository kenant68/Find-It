import './App.css'
import Home from "./pages/home/Home.jsx";
import {Outlet} from "react-router-dom";

function App() {


  return (
    <>
        <Outlet/>
    </>
  )
}

export default App
