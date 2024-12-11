import { updateCartQuantity } from "../data/cart.js";
import { renderOrderSummary } from "./renderOrderSummary.js";
import { formatCurrency } from "./utils/money.js";

let cartItems = [];
let deliveryOptions = [];
let totalCents = 0;

// Fetch cart items and delivery options
async function fetchCartData() {
  try {
    const response = await fetch("/api/cart/get-cart", {
      credentials: "include",
    });
    if (response.ok) {
      const { cart, deliveryOptions: options } = await response.json();
      cartItems = cart || [];
      deliveryOptions = options || [];
    } else {
      console.warn("Failed to fetch cart data.");
    }
  } catch (error) {
    console.error("Error fetching cart data:", error);
  }
}

// Render the payment summary
async function renderPaymentSummary() {
  const productTotalCents = calculateProductTotal(cartItems);
  const shippingTotalCents = calculateShippingTotal(cartItems, deliveryOptions);
  const totalBeforeTaxCents = productTotalCents + shippingTotalCents;
  const estimatedTaxCents = Math.round(totalBeforeTaxCents * 0.1); // Assuming 10% tax
  totalCents = totalBeforeTaxCents + estimatedTaxCents;

  const paymentSummaryContainer = document.querySelector(".js-payment-summary");
  paymentSummaryContainer.innerHTML = `
    <div class="text-lg font-bold">Order Summary</div>
    <div class="flex justify-between">
      <span>Items (${cartItems.length}):</span>
      <span>Ksh ${formatCurrency(productTotalCents)}</span>
    </div>
    <div class="flex justify-between">
      <span>Shipping:</span>
      <span>Ksh ${formatCurrency(shippingTotalCents)}</span>
    </div>
    <div class="flex justify-between font-semibold">
      <span>Tax (10%):</span>
      <span>Ksh ${formatCurrency(estimatedTaxCents)}</span>
    </div>
    <div class="flex justify-between text-xl font-bold mt-4">
      <span>Total:</span>
      <span>Ksh ${formatCurrency(totalCents)}</span>
    </div>
    <button class="bg-blue-500 text-white px-4 py-2 mt-6 rounded place-order-button">
      Place Order
    </button>
  `;
}

// Calculate total product price in cart
function calculateProductTotal(cart) {
  return cart.reduce(
    (total, item) => total + item.priceCents * item.quantity,
    0
  );
}

// Calculate total shipping cost
function calculateShippingTotal(cart, options) {
  return cart.reduce((total, item) => {
    const selectedOption = options.find(
      (option) => option.id === item.selectedDeliveryOption
    );
    return total + (selectedOption?.priceCents || 0);
  }, 0);
}

// Prefill user details in the form
async function prefillOrderForm() {
  try {
    const response = await fetch("/api/users/profile", {
      credentials: "include",
    });
    if (response.ok) {
      const { name, email } = await response.json();
      document.getElementById("name").value = name || "";
      document.getElementById("email").value = email || "";
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
  }
}

// Submit the order
async function submitOrder() {
  const formData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    address: document.getElementById("address").value,
    paymentMethod: "Cash on Delivery",
    items: cartItems,
    totalCents,
  };

  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      document.getElementById("orderDetailsModal").style.display = "none";
      document.getElementById("confirmationModal").style.display = "block";
    } else {
      console.error("Error placing order:", await response.json());
    }
  } catch (error) {
    console.error("Error submitting order:", error);
  }
}

// Initialize the page
document.addEventListener("DOMContentLoaded", async () => {
  await fetchCartData();
  renderOrderSummary(cartItems, deliveryOptions); // Render order details
  await renderPaymentSummary();
  updateCartQuantity(); // Update cart quantity in header
  prefillOrderForm();
});
