import { menuData } from "../data/data.js";

// Get slug from URL
const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");

// Get category data
const categoryData = menuData.filter((item) => item.slug === slug);

// Update category title
document.getElementById("category-title").textContent = slug.replace("-", " ");

// Inject category items
const categoryContent = document.getElementById("category-content");
categoryData.forEach((item) => {
  const itemCard = `
    <div class="shadow-lg rounded-lg overflow-hidden bg-white">
      <img src="${item.image}" alt="${item.name}" class="w-full h-48 object-cover" />
      <div class="p-4">
        <h2 class="text-xl font-bold text-idcPrimary">${item.name}</h2>
        <p class="text-gray-700 mt-2">${item.description}</p>
        <h3 class="mt-4 text-lg font-semibold">${item.price}</h3>
        <a href="#" class="block bg-idcPrimary text-white py-2 px-4 rounded-lg mt-4 text-center">
          Order Now
        </a>
      </div>
    </div>
  `;
  categoryContent.innerHTML += itemCard;
});
