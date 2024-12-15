import { formatCurrency } from "./utils/money.js";
import { setupModalListeners } from "./orderPlacement.js"; // Ensure this is exported

// Declare totalCents as a module-level variable
let totalCents = 0;

export function renderPaymentSummary(cartItems = [], deliveryOptions = []) {
  const productTotalCents = calculateProductTotal(cartItems);
  const shippingTotalCents = calculateShippingTotal(cartItems, deliveryOptions);
  const totalBeforeTaxCents = productTotalCents + shippingTotalCents;
  const estimatedTaxCents = Math.round(totalBeforeTaxCents * 0.1);
  totalCents = totalBeforeTaxCents + estimatedTaxCents; // Update the declared variable

  const paymentSummaryContainer = document.querySelector(".js-payment-summary");
  if (!paymentSummaryContainer) {
    console.error("Payment summary container not found.");
    return;
  }

  paymentSummaryContainer.innerHTML = `
    <div class="text-2xl font-bold text-idcText mb-4">Payment Summary</div>
    <div class="flex justify-between text-idcText">
      <span>Items (${cartItems.length}):</span>
      <span>Ksh ${formatCurrency(productTotalCents)}</span>
    </div>
    <div class="flex justify-between text-idcText">
      <span>Shipping:</span>
      <span>Ksh ${formatCurrency(shippingTotalCents)}</span>
    </div>
    <div class="flex justify-between text-idcText font-semibold">
      <span>Tax (10%):</span>
      <span>Ksh ${formatCurrency(estimatedTaxCents)}</span>
    </div>
    <div class="flex justify-between text-xl font-bold mt-4 text-idcPrimary">
      <span>Total:</span>
      <span>Ksh ${formatCurrency(totalCents)}</span>
    </div>
    <button class="place-order-button bg-blue-500 text-white px-4 py-2 rounded-md">
      Place Order
    </button>
  `;

  // Re-bind modal event listeners after rendering
  setupModalListeners();
}

// Export totalCents for external use
export function getTotalCents() {
  return totalCents;
}

function calculateProductTotal(cart) {
  return cart.reduce(
    (total, item) => total + item.priceCents * item.quantity,
    0
  );
}

function calculateShippingTotal(cart, options) {
  return cart.reduce((total, item) => {
    const selectedOption = options.find(
      (option) => option.id === item.selectedDeliveryOption
    );
    return total + (selectedOption?.priceCents || 0);
  }, 0);
}
