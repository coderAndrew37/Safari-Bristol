export function renderProductCard(product) {
  return `
    <div class="shadow-lg rounded-lg overflow-hidden bg-white">
      <img src="${product.image}" alt="${
    product.name
  }" class="w-full h-48 object-cover" />
      <div class="p-4">
        <h2 class="text-xl font-bold text-idcPrimary">${product.name}</h2>
        <p class="text-gray-700 mt-2">${product.description}</p>
        <h3 class="mt-4 text-lg font-semibold">${product.formattedPrice}</h3>

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
}
