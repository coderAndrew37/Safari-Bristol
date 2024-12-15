async function prefillOrderForm() {
  try {
    const response = await fetch("/api/users/profile", {
      method: "GET",
      credentials: "include",
    });
    if (response.ok) {
      const userData = await response.json();
      // Safely handle missing properties
      document.getElementById("name").value = userData?.name || "";
      document.getElementById("email").value = userData?.email || "";
    } else {
      console.warn(
        "Could not fetch user profile. Server returned:",
        response.status
      );
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
  }
}

// Show confirmation modal
function showOrderDetailsModal() {
  const modal = document.getElementById("orderDetailsModal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

// Close modal
function closeOrderDetailsModal() {
  const modal = document.getElementById("orderDetailsModal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

// Validate phone number
function isValidPhoneNumber(phone) {
  return /^\+254\d{9}$/.test(phone);
}

// Submit order details form
export async function submitOrder(e, totalCents = 0, cartItems = []) {
  e.preventDefault();

  console.log("cartItems during submitOrder:", cartItems); // Debugging

  if (!cartItems.length) {
    alert("Your cart is empty. Please add items before placing an order.");
    console.warn("Cart is empty during submitOrder:", cartItems); // Debugging
    return;
  }

  const phone = document.getElementById("phone").value;
  if (!isValidPhoneNumber(phone)) {
    alert("Please enter a valid phone number in the format +254 712 345678");
    return;
  }

  const itemsForSubmission = cartItems.map(
    ({ productId, quantity, priceCents }) => ({
      productId,
      quantity,
      priceCents,
    })
  );

  const formData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone,
    address: document.getElementById("address").value,
    paymentMethod: "Cash on Delivery",
    items: itemsForSubmission,
    totalCents,
  };

  console.log("Form Data being submitted:", formData); // Debugging

  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Order submission error:", errorData);
      alert("Failed to place order. Please try again.");
      return;
    }

    alert("Order placed successfully!");
    closeOrderDetailsModal();
  } catch (error) {
    console.error("Error placing order:", error);
    alert("Could not place order. Please try again.");
  }
}

// Event listeners for opening and closing the modal
export function setupModalListeners() {
  const placeOrderButton = document.querySelector(".place-order-button");
  const closeButton = document.querySelector(".close-button");
  const modal = document.getElementById("orderDetailsModal");

  if (
    placeOrderButton &&
    !placeOrderButton.hasAttribute("data-listener-added")
  ) {
    placeOrderButton.addEventListener("click", async (e) => {
      e.preventDefault();
      await prefillOrderForm();
      showOrderDetailsModal();
    });
    placeOrderButton.setAttribute("data-listener-added", "true");
  }

  if (closeButton && !closeButton.hasAttribute("data-listener-added")) {
    closeButton.addEventListener("click", closeOrderDetailsModal);
    closeButton.setAttribute("data-listener-added", "true");
  }

  if (modal) {
    window.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeOrderDetailsModal();
      }
    });
  }
}

// Initialize modal listeners
setupModalListeners();
