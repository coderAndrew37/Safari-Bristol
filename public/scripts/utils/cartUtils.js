import { baseUrl } from "../constants.js";
import { addToCart, updateCartQuantity } from "../../data/cart.js";

/**
 * Check if the user is authenticated.
 * @returns {Promise<boolean>} - Whether the user is authenticated.
 */
export async function isAuthenticated() {
  try {
    const response = await fetch(`${baseUrl}/api/users/is-authenticated`, {
      method: "GET",
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      return data.authenticated;
    }
  } catch (error) {
    console.error("Authentication check failed:", error);
  }
  return false;
}

/**
 * Initialize Add to Cart buttons.
 */
/**
 * Initialize Add to Cart buttons.
 */
export function initAddToCartListeners() {
  const buttons = document.querySelectorAll(".js-add-to-cart");

  buttons.forEach((button) => {
    button.addEventListener("click", async () => {
      button.disabled = true; // Prevent multiple clicks

      const productId = button.dataset.productId;
      if (!productId) {
        console.error("Missing productId for Add to Cart button.");
        button.disabled = false;
        return;
      }

      // Retrieve the selected quantity from the dropdown
      const quantitySelector = button
        .closest(".p-4") // Adjust this selector to locate the product container
        .querySelector(".js-quantity-selector");
      const quantity = quantitySelector
        ? parseInt(quantitySelector.value, 10)
        : 1;

      // Check if the user is authenticated
      const authenticated = await isAuthenticated();
      if (!authenticated) {
        if (confirm("You must log in to add items to your cart. Log in now?")) {
          window.location.href = "/login.html";
        }
        button.disabled = false;
        return;
      }

      // Add the product with the selected quantity
      await addToCart(productId, quantity);
      button.disabled = false; // Re-enable button
    });
  });
}
