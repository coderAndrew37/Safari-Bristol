export function generatePagination(currentPage, totalPages, fetchData) {
  const paginationContainer = document.querySelector(".pagination");
  paginationContainer.innerHTML = ""; // Clear previous pagination

  // Create Previous button
  paginationContainer.innerHTML += `
    <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
      <a class="page-link" href="#" data-page="${currentPage - 1}">Previous</a>
    </li>
  `;

  // Create page numbers
  for (let i = 1; i <= totalPages; i++) {
    paginationContainer.innerHTML += `
      <li class="page-item ${i === currentPage ? "active" : ""}">
        <a class="page-link" href="#" data-page="${i}">${i}</a>
      </li>
    `;
  }

  // Create Next button
  paginationContainer.innerHTML += `
    <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
      <a class="page-link" href="#" data-page="${currentPage + 1}">Next</a>
    </li>
  `;

  // Add event listeners for pagination
  paginationContainer.querySelectorAll(".page-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const page = parseInt(link.dataset.page, 10);
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        fetchData(page);
      }
    });
  });
}
