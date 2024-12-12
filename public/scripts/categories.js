import { initAddToCartListeners } from "./utils/cartUtils.js";
import { renderProductCard } from "./utils/productCardUtils.js";
import { updateCartQuantity } from "../data/cart.js";
import "./authButton.js";

// Get slug from URL
const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");

// Update category title
document.getElementById("category-title").textContent = slug.replace("-", " ");

document.addEventListener("DOMContentLoaded", () => {
  // Fetch and render category items
  const categoryContent = document.getElementById("category-content");
  async function fetchAndRenderCategoryProducts() {
    try {
      const response = await fetch(`/api/products?category=${slug}`);
      const { products } = await response.json();

      categoryContent.innerHTML = ""; // Clear existing content
      products.forEach((product) => {
        categoryContent.innerHTML += renderProductCard(product);
      });

      // Initialize Add to Cart listeners
      initAddToCartListeners();
    } catch (error) {
      console.error("Error fetching category products:", error);
      categoryContent.innerHTML = `<p class="text-center text-red-500">Failed to load category products. Please try again later.</p>`;
    }
  }

  // Initialize
  fetchAndRenderCategoryProducts();
  updateCartQuantity(); // Initialize cart quantity
});
