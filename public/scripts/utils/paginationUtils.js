export function generatePagination(currentPage, totalPages, fetchData) {
  const paginationContainer = document.querySelector(".pagination");
  paginationContainer.innerHTML = "";

  const createPageItem = (page, isActive = false, isDisabled = false) => `
    <li class="page-item ${isActive ? "active" : ""} ${
    isDisabled ? "disabled" : ""
  }">
      <a class="page-link" href="#" data-page="${page}">${page}</a>
    </li>
  `;

  // Add "Previous" button
  paginationContainer.innerHTML += createPageItem(
    currentPage - 1,
    false,
    currentPage === 1
  );

  // Add page numbers
  for (let i = 1; i <= totalPages; i++) {
    paginationContainer.innerHTML += createPageItem(i, i === currentPage);
  }

  // Add "Next" button
  paginationContainer.innerHTML += createPageItem(
    currentPage + 1,
    false,
    currentPage === totalPages
  );

  // Add click event listeners
  paginationContainer.querySelectorAll(".page-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const page = parseInt(link.getAttribute("data-page"), 10);
      if (!isNaN(page)) {
        fetchData(page);
      }
    });
  });
}
