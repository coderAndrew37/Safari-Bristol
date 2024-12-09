// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Hero Section Animation
function animateHero() {
  gsap.from("#hero h1", {
    duration: 1.2,
    opacity: 0,
    scale: 0.9,
    ease: "power3.out",
  });

  gsap.from("#hero p", {
    duration: 1.2,
    delay: 0.3,
    opacity: 0,
    y: 20,
    ease: "power3.out",
  });

  gsap.from("#hero a", {
    duration: 1.2,
    delay: 0.6,
    opacity: 0,
    y: 20,
    ease: "power3.out",
  });
}

// General Section Animation
function animateSections() {
  const sections = document.querySelectorAll("section");
  sections.forEach((section, index) => {
    gsap.from(section, {
      scrollTrigger: {
        trigger: section,
        start: "top 85%",
        toggleActions: "play none none none",
      },
      opacity: 0,
      scale: 0.95,
      duration: 1.2,
      ease: "power3.out",
    });
  });
}

// Staggered Animations for Grids
function animateGrids() {
  const staggerElements = document.querySelectorAll(
    "#services .grid, #projects .grid, #testimonials .grid"
  );
  staggerElements.forEach((grid) => {
    const items = grid.querySelectorAll("div");
    gsap.from(items, {
      scrollTrigger: {
        trigger: grid,
        start: "top 90%",
        toggleActions: "play none none none",
      },
      opacity: 0,
      y: 20,
      stagger: 0.3,
      duration: 1,
      ease: "power2.out",
    });
  });
}

// FAQs Accordion Animation
function animateFAQs() {
  gsap.from("#faqsAccordion .accordion-item", {
    scrollTrigger: {
      trigger: "#faqsAccordion",
      start: "top 85%",
      toggleActions: "play none none none",
    },
    opacity: 0,
    y: 10,
    stagger: 0.2,
    duration: 0.6,
    ease: "power2.out",
  });
}

// Reapply Animations for Dynamic Content
function reapplyAnimations() {
  animateSections();
  animateGrids();
  animateFAQs();
}

// Observer for Dynamic Content
function observeDynamicContent() {
  const observer = new MutationObserver(() => {
    reapplyAnimations();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

// Initialize All Animations
export function initAnimations() {
  animateHero();
  reapplyAnimations();
  observeDynamicContent();
}
