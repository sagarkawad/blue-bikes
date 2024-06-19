import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

const Payment = ({ cart, setCart }) => {
  console.log(cart);
  if (cart.length == 0) {
    return <Navigate to="/products" />;
  }

  const navigate = useNavigate();

  return (
    <div>
      <h1>Choose your preferred way to pay</h1>
      <div>Online</div>
      <div>
        <h2>Pay on Delivery</h2>
        <button
          onClick={async () => {
            console.log(cart);
            try {
              const response = await axios.post(
                "http://localhost:3000/payment",
                { cart: cart, token: localStorage.getItem("authToken") }
              );
              console.log("Data submitted successfully", response.data);
              alert("Order Successfully Placed!");
              setCart([]);
              navigate("/products");
            } catch (error) {
              console.error("Error submitting data", error);
              alert("Order could not be placed: ", error);
            }
          }}
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Payment;
