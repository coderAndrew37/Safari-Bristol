import { formatCurrency } from "./utils/money.js";
import { updateCartQuantity, removeFromCart } from "../data/cart.js";

/**
 * Renders the order summary dynamically in the checkout page.
 * @param {Array} cartItems - List of items in the cart.
 * @param {Array} deliveryOptions - Available delivery options.
 */
export function renderOrderSummary(cartItems = [], deliveryOptions = []) {
  const orderSummaryContainer = document.querySelector(".js-order-summary");

  if (!orderSummaryContainer) {
    console.error("Order summary container not found.");
    return;
  }

  // Generate order summary HTML for each cart item
  const orderItemsHTML = cartItems
    .map((item) => {
      const currentDeliveryOption =
        deliveryOptions.find(
          (option) => option.id === item.selectedDeliveryOption
        ) || deliveryOptions[0];

      return `
        <div class="border p-4 rounded mb-4 shadow-sm">
          <!-- Delivery Date -->
          <div class="text-gray-700 text-sm mb-2">
            Estimated Delivery: <span class="font-semibold">${calculateDeliveryDate(
              currentDeliveryOption.deliveryDays
            )}</span>
          </div>

          <!-- Product Details -->
          <div class="flex gap-4">
            <img
              src="${item.image || "/images/default-product.png"}"
              class="w-20 h-20 object-cover rounded"
              alt="${item.name}"
            />
            <div>
              <h3 class="text-lg font-semibold">${item.name}</h3>
              <p class="text-sm text-gray-600">Ksh ${formatCurrency(
                item.priceCents
              )}</p>
              <div class="mt-2">
                <label for="quantity-${
                  item.productId
                }" class="text-sm font-medium">Quantity:</label>
                <select
                  id="quantity-${item.productId}"
                  class="border rounded px-2 py-1 mt-1 js-quantity-select"
                  data-product-id="${item.productId}"
                >
                  ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                    .map(
                      (qty) =>
                        `<option value="${qty}" ${
                          qty === item.quantity ? "selected" : ""
                        }>${qty}</option>`
                    )
                    .join("")}
                </select>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="mt-4 flex justify-between items-center">
            <!-- Delivery Options -->
            <div class="text-sm">
              <h4 class="font-semibold text-gray-700">Delivery Options:</h4>
              ${deliveryOptions
                .map(
                  (option) => `
                  <label class="flex items-center mt-2">
                    <input
                      type="radio"
                      name="delivery-option-${item.productId}"
                      value="${option.id}"
                      class="mr-2"
                      ${option.id === currentDeliveryOption.id ? "checked" : ""}
                    />
                    <span>${option.deliveryDays} days (Ksh ${formatCurrency(
                    option.priceCents
                  )})</span>
                  </label>
                `
                )
                .join("")}
            </div>

            <!-- Update/Delete Links -->
            <div class="flex gap-4">
              <button
                class="text-green-500 hover:underline font-medium js-update-item"
                data-product-id="${item.productId}"
              >
                Update
              </button>
              <button
                class="text-green-500 hover:underline font-medium js-delete-item"
                data-product-id="${item.productId}"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  orderSummaryContainer.innerHTML = `
    <h2 class="text-xl font-bold mb-4">Order Summary</h2>
    ${orderItemsHTML}
    <div class="text-right mt-4">
      <button class="bg-blue-500 text-white px-4 py-2 rounded js-clear-cart">
        Clear Cart
      </button>
    </div>
  `;

  attachEventListeners(cartItems);
}

/**
 * Calculate the delivery date based on the number of days.
 * @param {number} days - Number of delivery days.
 * @returns {string} - Formatted delivery date.
 */
function calculateDeliveryDate(days) {
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + days);
  return deliveryDate.toLocaleDateString("en-KE", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

/**
 * Attach event listeners for cart interactions.
 * @param {Array} cartItems - List of items in the cart.
 */
function attachEventListeners(cartItems) {
  // Update quantity handler
  document.querySelectorAll(".js-update-item").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const productId = event.target.dataset.productId;
      const quantitySelect = document.querySelector(`#quantity-${productId}`);
      const newQuantity = parseInt(quantitySelect.value, 10);
      await updateCart(productId, newQuantity);
      await renderOrderSummary(cartItems); // Re-render the order summary
    });
  });

  // Remove item handler
  document.querySelectorAll(".js-delete-item").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const productId = event.target.dataset.productId;
      await removeFromCart(productId);
      await renderOrderSummary(cartItems); // Re-render the order summary
    });
  });

  // Clear cart handler
  document
    .querySelector(".js-clear-cart")
    .addEventListener("click", async () => {
      if (confirm("Are you sure you want to clear the cart?")) {
        await clearCart();
      }
    });
}
