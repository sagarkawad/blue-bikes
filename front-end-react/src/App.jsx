import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";

//pages
import HomePage from "./pages/HomePage/HomePage";
import Products from "./pages/ProductsPage/Products";
import About from "./pages/AboutPage/About";
import ProductView from "./pages/ProductViewPage/ProductView";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import Cart from "./pages/CartPage/Cart";

//components
import Navigation from "./components/Navigation";

function App() {
  const [productData, setProductData] = useState({});
  const [openCart, setOpenCart] = useState(false);
  const [cart, setCart] = useState([]);

  function cartHandler(pData) {
    console.log(cart);
    console.log(pData);
    // if (cart.includes(pData)) {
    //   return;
    // }
    setCart((prevCart) => {
      for (let el of prevCart) {
        if (el.id == pData.id) {
          return prevCart;
        }
      }
      console.log("out of the check");
      return [...prevCart, pData];
    });
  }

  function cartRemoveHandler(pid) {
    //removes the data from the cart
    setCart((prevCart) => {
      return prevCart.filter((el) => el.id != pid);
    });
  }

  function openCartHandler(st) {
    setOpenCart(st);
  }

  function productDataHandler(id, img, name, color, price) {
    setProductData({ id, img, name, color, price });
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <Navigation openCartHandler={openCartHandler} />
          <Cart
            openCart={openCart}
            openCartHandler={openCartHandler}
            setOpenCart={setOpenCart}
            cart={cart}
            cartRemoveHandler={cartRemoveHandler}
          />
        </>
      ),
      errorElement: <NotFoundPage />,
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
          element: (
            <ProductView productData={productData} cartHandler={cartHandler} />
          ),
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
