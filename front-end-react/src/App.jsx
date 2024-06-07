import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";

//pages
import HomePage from "./pages/HomePage/HomePage";
import Products from "./pages/ProductsPage/Products";
import About from "./pages/AboutPage/About";
import ProductView from "./pages/ProductViewPage/ProductView";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";

//components
import Navigation from "./components/Navigation";

function App() {
  const [productData, setProductData] = useState({});

  function productDataHandler(img, name, color, price) {
    setProductData({ img, name, color, price });
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navigation />,
      errorElement: (
        <>
          <Navigation />
          <NotFoundPage />
        </>
      ),
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "/products",
          element: <Products productDataHandler={productDataHandler} />,
        },
        {
          path: "/products/:productId",
          element: <ProductView productData={productData} />,
        },
        {
          path: "/about",
          element: <About />,
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
