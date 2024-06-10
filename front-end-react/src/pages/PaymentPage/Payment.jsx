import React from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const Payment = (cart) => {
  if (!cart) {
    <Navigate to="/products" />;
  }

  return (
    <div>
      <h1>Choose your preferred way to pay</h1>
      <div>Online</div>
      <div>
        <h2>Pay on Delivery</h2>
        <button
          onClick={async () => {
            try {
              const response = await axios.post(
                "http://localhost:3000/payment",
                { cart, token: localStorage.getItem("authToken") }
              );
              console.log("Data submitted successfully", response.data);
              alert("Order Successfully Placed!");
              <Navigate to="/products" />;
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
