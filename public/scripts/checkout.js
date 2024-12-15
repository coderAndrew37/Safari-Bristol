// checkout.js

import { updateCartQuantity } from "../data/cart.js";
import { renderOrderSummary } from "./renderOrderSummary.js";
import { renderPaymentSummary, getTotalCents } from "./renderPaymentSummary.js";
import { submitOrder } from "./orderPlacement.js";

let cartItems = [];
let deliveryOptions = [];

// Fetch cart items and product details
async function fetchCartData() {
  try {
    const response = await fetch("/api/cart/get-cart", {
      credentials: "include",
    });
    if (response.ok) {
      const { cart, deliveryOptions: options } = await response.json();
      const productIds = cart.map((item) => item.productId).join(",");
      const productResponse = await fetch(
        `/api/products/by-ids?ids=${productIds}`
      );
      const products = await productResponse.json();

      cartItems = cart.map((item) => {
        const product = products.find((p) => p._id === item.productId) || {};
        return {
          ...item,
          name: product.name || "Unknown Product",
          image: product.image || "/images/default-product.png",
          priceCents: product.priceCents || 0,
        };
      });

      deliveryOptions = options || [];
      console.log("cartItems populated:", cartItems); // Debugging
    } else {
      console.warn("Failed to fetch cart data.");
    }
  } catch (error) {
    console.error("Error fetching cart data:", error);
  }
}

// Re-render both summaries on any cart update
function updateUI() {
  renderOrderSummary(cartItems, deliveryOptions);
  renderPaymentSummary(cartItems, deliveryOptions);
}

// Initialize the page
document.addEventListener("DOMContentLoaded", async () => {
  await fetchCartData(); // Ensure cartItems is populated
  updateUI();
  updateCartQuantity();

  // Bind submitOrder after cartItems is populated
  const formElement = document.getElementById("orderDetailsForm");

  if (!formElement.hasAttribute("data-listener-added")) {
    formElement.addEventListener("submit", (e) => {
      const totalCents = getTotalCents(); // Fetch updated totalCents
      console.log("cartItems before submit:", cartItems); // Debugging
      console.log("totalCents before submit:", totalCents); // Debugging
      submitOrder(e, totalCents, cartItems); // Pass cartItems explicitly
    });
    formElement.setAttribute("data-listener-added", "true");
  }
});
