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
  const [user, setUser] = useState({});
  const [token, setToken] = useState(localStorage.getItem("authToken") || "");

  useEffect(() => {
    // Define the async function to fetch data
    const fetchUser = async () => {
      try {
        const response = await axios.post("http://localhost:3000/me", {
          token: token,
        });
        setUser(response.data);
        setCart(response.data.products || []);
      } catch (err) {
        console.log(err);
      }
    };

    // Call the fetch functions
    fetchUser();
  }, [token]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/products");
        setProducts(response.data);
      } catch (err) {
        console.error("Error fetching data: ", err);
      }
    };

    fetchProducts();
  }, []);

  async function cartHandler(pData) {
    if (!token) {
      return;
    }

    setCart((prevCart) => {
      let productAvailable = false;
      for (let el of prevCart) {
        if (el._id == pData._id) {
          productAvailable = true;
        }
      }

      if (productAvailable) {
        return [...prevCart];
      }

      axios.post("http://localhost:3000/addtocart", {
        products: [...prevCart, pData],
        token: localStorage.getItem("authToken"),
      });

      return [...prevCart, pData];
    });
  }

  function cartRemoveHandler(pid) {
    //removes the data from the cart
    setCart((prevCart) => {
      axios.post("http://localhost:3000/addtocart", {
        products: prevCart.filter((el) => el._id != pid),
        token: localStorage.getItem("authToken"),
      });
      return prevCart.filter((el) => el._id != pid);
    });
  }

  function openCartHandler(st) {
    setOpenCart(st);
  }

  function productDataHandler(_id, img, name, color, price) {
    setProductData({ _id, img, name, color, price });
  }

  const router = createBrowserRouter([
    {
      path: "/signup",
      element: <SignUp />,
    },
    {
      path: "/signin",
      element: <SignIn setToken={setToken} />,
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
          <Navigation
            openCartHandler={openCartHandler}
            isSigned={token}
            setIsSigned={setToken}
            loggedInUser={user}
          />
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
