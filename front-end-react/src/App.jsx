import { useState } from "react";
import "./App.css";

//pages
import HomePage from "./pages/HomePage/HomePage";

//components
import Navigation from "./components/Navigation";

function App() {
  return (
    <>
      <Navigation />
      <HomePage />
    </>
  );
}

export default App;
