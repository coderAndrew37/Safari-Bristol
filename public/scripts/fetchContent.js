import {
  menuData,
  reviewData,
  teamData,
  galleryData,
  faqData,
  categoriesData,
} from "../data/data.js";
import { generatePagination } from "./utils/paginationUtils.js";
import { initAddToCartListeners } from "./utils/cartUtils.js";

export function generateCategoriesContent() {
  const categoriesContainer = document.querySelector(".categories_box");
  categoriesContainer.innerHTML = ""; // Clear existing content

  categoriesData.forEach((category) => {
    const categoryCard = `
      <a
        href="${category.link}"
        class="block bg-white shadow-md hover:shadow-lg rounded-lg p-6 text-center"
      >
        <img
          src="${category.image}"
          alt="${category.name}"
          class="w-full h-32 object-cover rounded-md"
        />
        <h2 class="mt-4 text-xl font-bold">${category.name}</h2>
        <p class="mt-2 text-gray-600">${category.description}</p>
      </a>
    `;

    categoriesContainer.innerHTML += categoryCard;
  });
}

export async function generateMenuContent(page = 1) {
  const menuContainer = document.querySelector(".menu_box");
  menuContainer.innerHTML = ""; // Clear existing content

  try {
    const response = await fetch(`/api/products?page=${page}`);
    const { products, currentPage, totalPages } = await response.json();

    menuContainer.innerHTML = ""; // Clear previous content

    products.forEach((product) => {
      const menuCard = `
        <div class="shadow-lg rounded-lg overflow-hidden bg-white">
          <img src="${product.image}" alt="${
        product.name
      }" class="w-full h-48 object-cover" />
          <div class="p-4">
            <h2 class="text-xl font-bold text-idcPrimary">${product.name}</h2>
            <p class="text-gray-700 mt-2">${product.description}</p>
            <h3 class="mt-4 text-lg font-semibold">${
              product.formattedPrice
            }</h3>

            <!-- Quantity Dropdown Selector -->
            <div class="flex items-center mt-4 gap-2">
              <label for="quantity-${
                product._id
              }" class="text-gray-700">Qty:</label>
              <select 
                id="quantity-${product._id}" 
                class="js-quantity-selector px-2 py-1 border rounded-lg">
                ${Array.from(
                  { length: 10 },
                  (_, i) => `<option value="${i + 1}">${i + 1}</option>`
                ).join("")}
              </select>
            </div>

            <!-- Add to Cart Button -->
            <button 
              class="menu_btn bg-black text-white py-2 px-4 rounded-lg mt-4 hover:bg-gray-800 js-add-to-cart" 
              data-product-id="${product._id}">
              Add to Cart
            </button>
          </div>
        </div>
      `;
      menuContainer.innerHTML += menuCard;
    });

    // Generate pagination
    generatePagination(currentPage, totalPages, generateMenuContent);

    // Initialize Add to Cart listeners
    initAddToCartListeners();
  } catch (error) {
    console.error("Error fetching menu content:", error);
    menuContainer.innerHTML = `<p class="text-center text-red-500">Failed to load products. Please try again later.</p>`;
  }
}

export function generateReviewContent() {
  const reviewContainer = document.querySelector(".review_box");
  reviewContainer.innerHTML = ""; // Clear existing content

  reviewData.forEach((review) => {
    const starsHTML = `
      ${'<i class="fa-solid fa-star text-yellow-500"></i>'.repeat(
        Math.floor(review.rating)
      )}
      ${
        review.rating % 1 > 0
          ? '<i class="fa-solid fa-star-half-stroke text-yellow-500"></i>'
          : ""
      }
    `;

    const reviewCard = `
      <div class="review_card shadow-lg rounded-lg overflow-hidden bg-white p-4">
        <div class="review_profile flex items-center justify-center mb-4">
          <img src="${review.image}" alt="${review.name}" class="w-24 h-24 rounded-full border-4 border-gray-300 object-cover">
        </div>
        <div class="review_text text-center">
          <h2 class="name text-xl font-bold text-idcPrimary">${review.name}</h2>
          <div class="review_icon mt-2">${starsHTML}</div>
          <div class="review_social flex justify-center gap-2 mt-3">
            <a href="${review.socialLinks.facebook}" target="_blank" class="hover:text-blue-600"><i class="fa-brands fa-facebook-f"></i></a>
            <a href="${review.socialLinks.instagram}" target="_blank" class="hover:text-pink-500"><i class="fa-brands fa-instagram"></i></a>
            <a href="${review.socialLinks.twitter}" target="_blank" class="hover:text-blue-400"><i class="fa-brands fa-twitter"></i></a>
            <a href="${review.socialLinks.linkedin}" target="_blank" class="hover:text-blue-700"><i class="fa-brands fa-linkedin-in"></i></a>
          </div>
          <p class="text-sm text-gray-600 mt-3">${review.review}</p>
        </div>
      </div>
    `;

    reviewContainer.innerHTML += reviewCard;
  });
}

export function generateTeamContent() {
  const teamContainer = document.querySelector(".team_box");
  teamContainer.innerHTML = ""; // Clear any existing content

  teamData.forEach((member) => {
    const teamCard = `
      <div class="profile shadow-lg rounded-lg overflow-hidden bg-white text-center">
        <div class="relative">
          <img src="${member.image}" alt="${member.name}" class="w-32 h-32 rounded-full mx-auto mt-4 border-4 border-gray-300 object-cover">
        </div>
        <div class="info p-4">
          <h2 class="name text-lg font-bold text-idcPrimary">${member.name}</h2>
          <p class="bio text-gray-700 mt-2">${member.bio}</p>
          <div class="team_icon flex justify-center gap-3 mt-4">
            <a href="${member.socialLinks.facebook}" target="_blank" class="hover:text-blue-600"><i class="fa-brands fa-facebook-f"></i></a>
            <a href="${member.socialLinks.twitter}" target="_blank" class="hover:text-blue-400"><i class="fa-brands fa-twitter"></i></a>
            <a href="${member.socialLinks.instagram}" target="_blank" class="hover:text-pink-500"><i class="fa-brands fa-instagram"></i></a>
          </div>
        </div>
      </div>
    `;

    teamContainer.innerHTML += teamCard;
  });
}

export function generateGalleryContent() {
  const galleryContainer = document.querySelector(".gallary_image_box");
  galleryContainer.innerHTML = ""; // Clear existing content

  galleryData.forEach((item) => {
    const galleryCard = `
      <div class="gallary_image bg-black relative group overflow-hidden">
        <img src="${item.image}" alt="${item.title}" class="w-full h-56 object-cover group-hover:opacity-50 transition-opacity">
        <div class="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <h3 class="text-xl font-bold text-idcPrimary">${item.title}</h3>
          <p class="text-white text-center mt-2">${item.description}</p>
          <a href="${item.link}" class="gallary_btn bg-idcPrimary text-white mt-4 px-6 py-2 rounded-lg">Order Now</a>
        </div>
      </div>
    `;

    galleryContainer.innerHTML += galleryCard;
  });
}

export function generateFaqContent() {
  const faqContainer = document.querySelector("#faqAccordion");
  faqContainer.innerHTML = ""; // Clear existing content

  faqData.forEach((faq, index) => {
    const faqCard = `
      <div class="accordion-item">
        <h2 class="accordion-header" id="faqHeading${index}">
          <button
            class="accordion-button ${index === 0 ? "" : "collapsed"}"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#faq${index}"
            aria-expanded="${index === 0 ? "true" : "false"}"
            aria-controls="faq${index}"
          >
            ${faq.question}
          </button>
        </h2>
        <div
          id="faq${index}"
          class="accordion-collapse collapse ${index === 0 ? "show" : ""}"
          aria-labelledby="faqHeading${index}"
          data-bs-parent="#faqAccordion"
        >
          <div class="accordion-body">
            ${faq.answer}
          </div>
        </div>
      </div>
    `;
    faqContainer.innerHTML += faqCard;
  });
}
