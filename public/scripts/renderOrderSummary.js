import { renderPaymentSummary } from "./renderPaymentSummary.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { formatCurrency } from "./utils/money.js";

/**
 * Renders the order summary dynamically.
 * @param {Array} cartItems - List of items in the cart.
 * @param {Array} deliveryOptions - Available delivery options.
 */
export function renderOrderSummary(cartItems = [], deliveryOptions = []) {
  const orderSummaryContainer = document.querySelector(".js-order-summary");

  const orderItemsHTML = cartItems
    .map((item) => {
      const currentDeliveryOption =
        deliveryOptions.find(
          (option) => option.id === item.selectedDeliveryOption
        ) || deliveryOptions.find((option) => option.id === "3"); // Default to 7 days

      return `
        <div class="border p-4 rounded-xl mb-4 shadow-sm">
          <div class="text-idcPrimary text-sm mb-2">
            Estimated Delivery: <span class="font-semibold js-delivery-date-${
              item.productId
            }">${calculateDeliveryDate(
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
                <h4 class="text-idcText text-sm font-medium mb-2">Delivery Options:</h4>
                ${deliveryOptions
                  .map(
                    (option) => `
                    <label class="flex items-center mt-1">
                      <input
                        type="radio"
                        name="delivery-option-${item.productId}"
                        value="${option.id}"
                        class="mr-2 accent-idcPrimary js-delivery-option"
                        data-product-id="${item.productId}"
                        data-delivery-days="${option.deliveryDays}"
                        ${
                          option.id === currentDeliveryOption.id
                            ? "checked"
                            : ""
                        }
                      />
                      <span>${option.deliveryDays} days (Ksh ${formatCurrency(
                      option.priceCents
                    )})</span>
                    </label>
                  `
                  )
                  .join("")}
              </div>
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

  attachDeliveryEventListeners(cartItems, deliveryOptions);
}

/**
 * Attach event listeners to delivery option radio buttons.
 * @param {Array} cartItems - List of items in the cart.
 * @param {Array} deliveryOptions - Available delivery options.
 */
function attachDeliveryEventListeners(cartItems, deliveryOptions) {
  document.querySelectorAll(".js-delivery-option").forEach((radioButton) => {
    radioButton.addEventListener("change", (event) => {
      const productId = event.target.dataset.productId;
      const deliveryDays = parseInt(event.target.dataset.deliveryDays, 10);
      const deliveryOptionId = event.target.value;

      // Update the selected delivery option in cartItems
      const cartItem = cartItems.find((item) => item.productId === productId);
      if (cartItem) {
        cartItem.selectedDeliveryOption = deliveryOptionId;
      }

      // Update the delivery date for the product
      const deliveryDateElement = document.querySelector(
        `.js-delivery-date-${productId}`
      );
      if (deliveryDateElement) {
        deliveryDateElement.textContent = calculateDeliveryDate(deliveryDays);
      }

      // Re-render the payment summary to reflect the changes
      renderPaymentSummary(cartItems, deliveryOptions);
    });
  });
}

/**
 * Calculate the estimated delivery date based on the current day.
 * @param {number} days - Number of delivery days.
 * @returns {string} - Formatted delivery date.
 */
function calculateDeliveryDate(days) {
  return dayjs().add(days, "day").format("dddd, MMMM D, YYYY");
}
