// renderPaymentSummary.js
import { formatCurrency } from "./utils/money.js";

/**
 * Renders the payment summary dynamically.
 * @param {Array} cartItems - List of items in the cart.
 * @param {Array} deliveryOptions - Available delivery options.
 */
export function renderPaymentSummary(cartItems = [], deliveryOptions = []) {
  const productTotalCents = calculateProductTotal(cartItems);
  const shippingTotalCents = calculateShippingTotal(cartItems, deliveryOptions);
  const totalBeforeTaxCents = productTotalCents + shippingTotalCents;
  const estimatedTaxCents = Math.round(totalBeforeTaxCents * 0.1); // Assuming 10% tax
  const totalCents = totalBeforeTaxCents + estimatedTaxCents;

  const paymentSummaryContainer = document.querySelector(".js-payment-summary");
  if (!paymentSummaryContainer) {
    console.error("Payment summary container not found.");
    return;
  }

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

/**
 * Calculate total product price in cart.
 * @param {Array} cart - List of cart items.
 * @returns {number} Total product price in cents.
 */
function calculateProductTotal(cart) {
  return cart.reduce(
    (total, item) => total + item.priceCents * item.quantity,
    0
  );
}

/**
 * Calculate total shipping cost.
 * @param {Array} cart - List of cart items.
 * @param {Array} options - Delivery options.
 * @returns {number} Total shipping cost in cents.
 */
function calculateShippingTotal(cart, options) {
  return cart.reduce((total, item) => {
    const selectedOption = options.find(
      (option) => option.id === item.selectedDeliveryOption
    );
    return total + (selectedOption?.priceCents || 0);
  }, 0);
}
