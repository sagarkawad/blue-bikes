import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

//environment variables
import { BACKEND } from "./../../constants.js";

const Payment = ({ cart, setCart, setOpenCart }) => {
  console.log(cart);
  if (cart.length == 0) {
    return <Navigate to="/products" />;
  }

  const navigate = useNavigate();

  async function setPaymentHandler() {
    try {
      const response = await axios.post(`${BACKEND}payment`, {
        cart: cart,
        token: localStorage.getItem("authToken"),
      });
      console.log("Data submitted successfully", response.data);
      alert("Order Successfully Placed!");
    } catch (error) {
      console.error("Error submitting data", error);
      alert("Order could not be placed: ", error);
    }
  }

  async function setUserCart() {
    try {
      axios.post(`${BACKEND}addtocart`, {
        products: [],
        token: localStorage.getItem("authToken"),
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <h1>Choose your preferred way to pay</h1>
      <div>Online</div>
      <div>
        <h2>Pay on Delivery</h2>
        <button
          onClick={() => {
            setPaymentHandler();
            setUserCart();
            setCart([]);
            setOpenCart(false);
            navigate("/products");
          }}
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Payment;
