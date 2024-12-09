import { menuData, reviewData, teamData, galleryData } from "../data/data.js";

export function generateMenuContent() {
  const menuContainer = document.querySelector(".menu_box");
  menuContainer.innerHTML = ""; // Clear any existing content

  menuData.forEach((item) => {
    const fullStars = Math.floor(item.rating);
    const halfStars = item.rating % 1 > 0 ? 1 : 0;

    const starsHTML = `
      ${'<i class="fa-solid fa-star text-yellow-500"></i>'.repeat(fullStars)}
      ${
        halfStars
          ? '<i class="fa-solid fa-star-half-stroke text-yellow-500"></i>'
          : ""
      }
    `;

    const menuCard = `
      <div class="shadow-lg rounded-lg overflow-hidden bg-white">
        <div class="menu_image">
          <img src="${item.image}" alt="${item.name}" class="w-full h-48 object-cover">
        </div>
        <div class="relative p-4">
          <div class="small_card absolute top-2 right-2 bg-gray-200 w-12 h-12 flex items-center justify-center rounded-full opacity-0 hover:opacity-100 transition-opacity">
            <i class="fa-solid fa-heart text-gray-600"></i>
          </div>
          <h2 class="text-xl font-bold text-idcPrimary">${item.name}</h2>
          <p class="text-gray-700 mt-2 text-sm">${item.description}</p>
          <h3 class="mt-4 text-lg font-semibold">${item.price}</h3>
          <div class="menu_icon mt-4">${starsHTML}</div>
          <a href="#" class="menu_btn mt-4 block bg-black text-white py-2 px-4 text-center rounded-lg hover:bg-gray-800 transition-colors">
            Order Now
          </a>
        </div>
      </div>
    `;

    menuContainer.innerHTML += menuCard;
  });
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
