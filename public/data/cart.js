import { baseUrl } from "../scripts/constants.js";

/**
 * Fetch the user's cart data and update the cart quantity in the UI.
 */
export async function updateCartQuantity() {
  try {
    const response = await fetch(`${baseUrl}/api/cart/get-cart`, {
      method: "GET",
      credentials: "include", // Authenticated request
    });

    if (!response.ok) {
      console.error("Failed to fetch cart data");
      return;
    }

    const data = await response.json();
    const cart = data.cart || [];

    // Calculate total items in the cart
    const cartQuantity = cart.reduce((total, item) => total + item.quantity, 0);

    // Update cart quantity in the header
    const cartQuantityElement = document.querySelector(".js-cart-quantity");
    if (cartQuantityElement) {
      cartQuantityElement.textContent = cartQuantity;
    }
  } catch (error) {
    console.error("Error fetching cart data:", error);
  }
}

/**
 * Add a product to the cart.
 * @param {string} productId - The product ID to add.
 * @param {number} quantity - Quantity to add (default: 1).
 */
export async function addToCart(productId, quantity = 1) {
  try {
    const response = await fetch(`${baseUrl}/api/cart/add-to-cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity }),
      credentials: "include", // Authenticated request
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(errorData.message || "Failed to add product to cart.");
      return;
    }

    await updateCartQuantity(); // Refresh cart quantity
    alert("Product added to cart!");
  } catch (error) {
    console.error("Error adding product to cart:", error);
    alert("An error occurred while adding to cart.");
  }
}

/**
 * Remove a product from the cart.
 * @param {string} productId - The product ID to remove.
 */
export async function removeFromCart(productId) {
  try {
    const response = await fetch(
      `${baseUrl}/api/cart/remove-from-cart/${productId}`,
      {
        method: "DELETE",
        credentials: "include", // Authenticated request
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      alert(errorData.message || "Failed to remove product from cart.");
      return;
    }

    await updateCartQuantity(); // Refresh cart quantity
    alert("Product removed from cart!");
  } catch (error) {
    console.error("Error removing product from cart:", error);
    alert("An error occurred while removing from cart.");
  }
}

/**
 * Clear all items from the cart.
 */
export async function clearCart() {
  try {
    const response = await fetch(`${baseUrl}/api/cart/clear-cart`, {
      method: "DELETE",
      credentials: "include", // Authenticated request
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(errorData.message || "Failed to clear the cart.");
      return;
    }

    await updateCartQuantity(); // Refresh cart quantity
    alert("Cart cleared!");
  } catch (error) {
    console.error("Error clearing the cart:", error);
    alert("An error occurred while clearing the cart.");
  }
}
