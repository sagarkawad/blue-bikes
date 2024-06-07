import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";

//pages
import HomePage from "./pages/HomePage/HomePage";
import Products from "./pages/ProductsPage/Products";
import About from "./pages/AboutPage/About";

//components
import Navigation from "./components/Navigation";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigation />,
    errorElement: (
      <>
        <Navigation />
        <p>404: Page Not Found</p>
      </>
    ),
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/products",
        element: <Products />,
      },
      {
        path: "/about",
        element: <About />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
