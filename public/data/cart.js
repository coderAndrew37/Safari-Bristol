import { baseUrl } from "../scripts/constants.js";

/**
 * Update the quantity of a product in the cart.
 * @param {string} productId - The product ID to update.
 * @param {number} quantity - The new quantity for the product.
 */
export async function updateCart(productId, quantity) {
  try {
    const response = await fetch(`${baseUrl}/api/cart/update-cart`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity }),
      credentials: "include", // Authenticated request
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to update product quantity:", errorData.message);
      return false;
    }

    console.log("Product quantity updated successfully.");
    return true;
  } catch (error) {
    console.error("Error updating product quantity:", error);
    return false;
  }
}

/**
 * Display a notification message.
 * @param {string} message - The message to display.
 */
function showNotification(message) {
  console.log("Notification triggered:", message); // Debug log

  const notification = document.createElement("div");
  notification.className =
    "fixed top-4 right-4 bg-idcPrimary text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50";
  notification.innerHTML = `<i class="fa-solid fa-check"></i> ${message}`;
  document.body.appendChild(notification);

  // Remove notification after 3 seconds
  setTimeout(() => {
    console.log("Notification removed");
    notification.remove();
  }, 3000);
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
      console.error("Failed to add product to cart:", errorData.message);
      return;
    }

    await updateCartQuantity(); // Refresh cart quantity
    showNotification("Added to cart!"); // Show success notification
  } catch (error) {
    console.error("Error adding product to cart:", error);
  }
}

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
      console.error("Failed to remove product from cart:", errorData.message);
      return false;
    }

    // Refresh cart quantity silently
    await updateCartQuantity();
    console.log("Product removed from cart successfully.");
    return true;
  } catch (error) {
    console.error("Error removing product from cart:", error);
    return false;
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
