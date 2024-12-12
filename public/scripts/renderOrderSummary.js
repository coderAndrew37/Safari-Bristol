import { formatCurrency } from "./utils/money.js";
import { renderPaymentSummary } from "./renderPaymentSummary.js";
import {
  updateCart,
  removeFromCart,
  updateCartQuantity,
} from "../data/cart.js";

export function renderOrderSummary(cartItems = [], deliveryOptions = []) {
  const orderSummaryContainer = document.querySelector(".js-order-summary");

  const orderItemsHTML = cartItems
    .map((item) => {
      const currentDeliveryOption =
        deliveryOptions.find(
          (option) => option.id === item.selectedDeliveryOption
        ) || deliveryOptions[0];

      return `
        <div class="border p-4 rounded-xl mb-4 shadow-sm">
          <div class="text-idcPrimary text-sm mb-2">
            Estimated Delivery: <span class="font-semibold">${calculateDeliveryDate(
              currentDeliveryOption.deliveryDays
            )}</span>
          </div>
          <div class="flex gap-4">
            <img src="${
              item.image
            }" class="w-20 h-20 object-cover rounded" alt="${item.name}" />
            <div>
              <h3 class="text-xl font-semibold">${item.name}</h3>
              <p class="text-idcPrimary text-lg">Ksh ${formatCurrency(
                item.priceCents
              )}</p>
              <div class="mt-2">
                <label class="text-idcText text-sm font-medium">Quantity:</label>
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
              <h4 class="font-semibold text-idcText">Delivery Options:</h4>
              ${deliveryOptions
                .map(
                  (option) => `
                  <label class="flex items-center mt-2">
                    <input
                      type="radio"
                      name="delivery-option-${item.productId}"
                      value="${option.id}"
                      class="mr-2 accent-idcPrimary"
                      ${option.id === currentDeliveryOption.id ? "checked" : ""}
                    />
                    <span class="text-idcText">${
                      option.deliveryDays
                    } days (Ksh ${formatCurrency(option.priceCents)})</span>
                  </label>
                `
                )
                .join("")}
            </div>
            <div class="flex gap-4">
              <button class="text-idcPrimary hover:underline font-medium js-update-item" data-product-id="${
                item.productId
              }">
                Update
              </button>
              <button class="text-red-500 hover:underline font-medium js-delete-item" data-product-id="${
                item.productId
              }">
                Delete
              </button>
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  orderSummaryContainer.innerHTML = `
    <h2 class="text-2xl font-bold mb-4 text-idcText">Order Summary</h2>
    ${orderItemsHTML}
  `;

  attachEventListeners(cartItems, deliveryOptions);
}

function attachEventListeners(cartItems, deliveryOptions) {
  document.querySelectorAll(".js-update-item").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const productId = event.target.dataset.productId;
      const quantitySelect = document.querySelector(`#quantity-${productId}`);
      const newQuantity = parseInt(quantitySelect.value, 10);

      const success = await updateCart(productId, newQuantity);
      if (success) {
        const itemIndex = cartItems.findIndex(
          (item) => item.productId === productId
        );
        if (itemIndex !== -1) cartItems[itemIndex].quantity = newQuantity;

        renderOrderSummary(cartItems, deliveryOptions);
        renderPaymentSummary(cartItems, deliveryOptions); // Update payment summary
      }
    });
  });

  document.querySelectorAll(".js-delete-item").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const productId = event.target.dataset.productId;
      const success = await removeFromCart(productId);
      if (success) {
        const itemIndex = cartItems.findIndex(
          (item) => item.productId === productId
        );
        if (itemIndex !== -1) cartItems.splice(itemIndex, 1);

        renderOrderSummary(cartItems, deliveryOptions);
        renderPaymentSummary(cartItems, deliveryOptions); // Update payment summary
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
