import { useState, useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import axios from "axios";

//pages
import HomePage from "./pages/HomePage/HomePage";
import Products from "./pages/ProductsPage/Products";
import About from "./pages/AboutPage/About";
import ProductView from "./pages/ProductViewPage/ProductView";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import Cart from "./pages/CartPage/Cart";
import SignIn from "./pages/SignInPage/SignIn";
import SignUp from "./pages/SignUpPage/SignUp";
import Address from "./pages/AddressPage/Address";
import Payment from "./pages/PaymentPage/Payment";

//components
import Navigation from "./components/Navigation";

function App() {
  const [productData, setProductData] = useState({});
  const [openCart, setOpenCart] = useState(false);
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);

  // const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/products")
      .then((response) => {
        console.log(response.data);
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  async function cartHandler(pData) {
    console.log(cart);
    console.log(pData);
    // if (cart.includes(pData)) {
    //   return;
    // }

    if (!localStorage.getItem("authToken")) {
      // navigate("/signin");
      return;
    }

    setCart((prevCart) => {
      for (let el of prevCart) {
        if (el.id == pData.id) {
          return prevCart;
        }
      }
      console.log("out of the check");
      axios.post("http://localhost:3000/addtocart", {
        products: [...prevCart, pData],
        token: localStorage.getItem("authToken"),
      });
      // console.log("resp: ", response);

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
      path: "/signup",
      element: <SignUp />,
    },
    {
      path: "/signin",
      element: <SignIn />,
    },
    {
      path: "/address",
      element: <Address />,
    },
    {
      path: "/payment",
      element: <Payment cart={cart} />,
    },
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
          element: (
            <Products
              productDataHandler={productDataHandler}
              products={products}
            />
          ),
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
