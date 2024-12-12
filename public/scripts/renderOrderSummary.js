import { formatCurrency } from "./utils/money.js";
import {
  updateCart,
  removeFromCart,
  updateCartQuantity,
} from "../data/cart.js";

export function renderOrderSummary(cartItems = [], deliveryOptions = []) {
  const orderSummaryContainer = document.querySelector(".js-order-summary");

  if (!orderSummaryContainer) {
    console.error("Order summary container not found.");
    return;
  }

  const orderItemsHTML = cartItems
    .map((item) => {
      const currentDeliveryOption =
        deliveryOptions.find(
          (option) => option.id === item.selectedDeliveryOption
        ) || deliveryOptions[0];

      return `
        <div class="border p-4 rounded mb-4 shadow-sm">
          <div class="text-green-600 text-sm mb-2">
            Estimated Delivery: <span class="font-semibold">${calculateDeliveryDate(
              currentDeliveryOption.deliveryDays
            )}</span>
          </div>
          <div class="flex gap-4">
            <img
              src="${item.image}"
              class="w-20 h-20 object-cover rounded"
              alt="${item.name}"
            />
            <div>
              <h3 class="text-lg font-semibold">${item.name}</h3>
              <p class="text-green-600 text-sm">Ksh ${formatCurrency(
                item.priceCents
              )}</p>
              <div class="mt-2">
                <label class="text-sm font-medium">Quantity:</label>
                <select
                  id="quantity-${item.productId}"
                  class="border rounded px-2 py-1 mt-1 js-quantity-select"
                  data-product-id="${item.productId}"
                >
                  ${[1, 2, 3, 4, 5]
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
          <div class="mt-4 flex justify-between items-center">
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
                    <span class="text-green-600">${
                      option.deliveryDays
                    } days (Ksh ${formatCurrency(option.priceCents)})</span>
                  </label>
                `
                )
                .join("")}
            </div>
            <div class="flex gap-4">
              <button
                class="text-blue-500 hover:underline font-medium js-update-item"
                data-product-id="${item.productId}"
              >
                Update
              </button>
              <button
                class="text-red-500 hover:underline font-medium js-delete-item"
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
  `;

  attachEventListeners(cartItems);
}

function attachEventListeners(cartItems) {
  document.querySelectorAll(".js-update-item").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const productId = event.target.dataset.productId;
      const quantitySelect = document.querySelector(`#quantity-${productId}`);
      const newQuantity = parseInt(quantitySelect.value, 10);

      const success = await updateCart(productId, newQuantity);
      if (success) {
        // Update the item quantity locally
        const itemIndex = cartItems.findIndex(
          (item) => item.productId === productId
        );
        if (itemIndex !== -1) cartItems[itemIndex].quantity = newQuantity;

        // Re-render the summary
        renderOrderSummary(cartItems, deliveryOptions);
      }
    });
  });

  document.querySelectorAll(".js-delete-item").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const productId = event.target.dataset.productId;
      const success = await removeFromCart(productId);
      if (success) {
        // Remove the item locally
        const itemIndex = cartItems.findIndex(
          (item) => item.productId === productId
        );
        if (itemIndex !== -1) cartItems.splice(itemIndex, 1);

        // Re-render the summary
        renderOrderSummary(cartItems, deliveryOptions);
      }
    });
  });
}

function calculateDeliveryDate(days) {
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + days);
  return deliveryDate.toLocaleDateString("en-KE", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}
