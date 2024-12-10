import "./fetchContent.js";
import "./menuToggle.js";
import {
  generateMenuContent,
  generateReviewContent,
  generateTeamContent,
  generateGalleryContent,
  generateFaqContent, // Generate FAQ section
  generateCategoriesContent,
} from "./fetchContent.js";

document.addEventListener("DOMContentLoaded", () => {
  generateMenuContent();
  generateReviewContent();
  generateTeamContent();
  generateGalleryContent();
  generateFaqContent(); // Generate FAQ section
  generateCategoriesContent();

  // Smooth scroll effect
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
});
