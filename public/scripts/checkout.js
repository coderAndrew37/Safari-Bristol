import { updateCartQuantity } from "../data/cart.js";
import { renderOrderSummary } from "./renderOrderSummary.js";
import { formatCurrency } from "./utils/money.js";

let cartItems = [];
let deliveryOptions = [];
let totalCents = 0;

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
    } else {
      console.warn("Failed to fetch cart data.");
    }
  } catch (error) {
    console.error("Error fetching cart data:", error);
  }
}

// Render the payment summary
function renderPaymentSummary() {
  const productTotalCents = calculateProductTotal(cartItems);
  const shippingTotalCents = calculateShippingTotal(cartItems, deliveryOptions);
  const totalBeforeTaxCents = productTotalCents + shippingTotalCents;
  const estimatedTaxCents = Math.round(totalBeforeTaxCents * 0.1); // Assuming 10% tax
  totalCents = totalBeforeTaxCents + estimatedTaxCents;

  const paymentSummaryContainer = document.querySelector(".js-payment-summary");
  paymentSummaryContainer.innerHTML = `
    <div class="text-lg font-bold">Payment Summary</div>
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

// Initialize the page
document.addEventListener("DOMContentLoaded", async () => {
  await fetchCartData();
  renderOrderSummary(cartItems, deliveryOptions);
  renderPaymentSummary();
  updateCartQuantity(); // Update cart quantity in header
});
