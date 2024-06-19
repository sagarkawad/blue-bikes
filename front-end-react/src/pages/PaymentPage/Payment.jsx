import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

const Payment = ({ cart, setCart }) => {
  console.log(cart);
  if (cart.length == 0) {
    return <Navigate to="/products" />;
  }

  const navigate = useNavigate();

  async function setPaymentHandler() {
    try {
      const response = await axios.post("http://localhost:3000/payment", {
        cart: cart,
        token: localStorage.getItem("authToken"),
      });
      console.log("Data submitted successfully", response.data);
      alert("Order Successfully Placed!");
      navigate("/products");
    } catch (error) {
      console.error("Error submitting data", error);
      alert("Order could not be placed: ", error);
    }
  }

  async function setUserCart() {
    try {
      axios.post("http://localhost:3000/addtocart", {
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
          }}
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Payment;
