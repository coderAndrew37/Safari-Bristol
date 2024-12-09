// Navbar Elements
const mobileMenuButton = document.getElementById("mobile-menu");
const mobileNav = document.getElementById("mobile-nav");

// Menu toggle functionality with smooth transition
mobileMenuButton.addEventListener("click", () => {
  if (mobileNav.classList.contains("hidden")) {
    mobileNav.classList.remove("hidden");
    mobileNav.style.maxHeight = mobileNav.scrollHeight + "px";
  } else {
    mobileNav.style.maxHeight = "0px";
    setTimeout(() => mobileNav.classList.add("hidden"), 300);
  }
});

// Prevent navbar items from disappearing on large screens
window.addEventListener("resize", () => {
  if (window.innerWidth >= 768) {
    mobileNav.classList.remove("hidden");
    mobileNav.style.maxHeight = "none";
  } else if (!mobileNav.classList.contains("hidden")) {
    mobileNav.style.maxHeight = mobileNav.scrollHeight + "px";
  }
});

// Close menu when a link is clicked (mobile only)
const navLinks = document.querySelectorAll("#mobile-nav a");
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth < 768) {
      mobileNav.style.maxHeight = "0px";
      setTimeout(() => mobileNav.classList.add("hidden"), 300);
    }
  });
});
