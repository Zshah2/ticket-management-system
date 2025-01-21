// Load tickets from localStorage
const tickets = JSON.parse(localStorage.getItem("tickets")) || [];
let filteredTickets = [...tickets];  // Initially set to all tickets
let currentPage = 1;
const ticketsPerPage = 3;
const ticketItemsContainer = document.getElementById("ticket-items");

// Function to render tickets with pagination
function renderTickets() {
  ticketItemsContainer.innerHTML = ''; // Clear current list

  // Calculate start and end indices for pagination
  const start = (currentPage - 1) * ticketsPerPage;
  const end = currentPage * ticketsPerPage;
  const ticketsToRender = filteredTickets.slice(start, end);

  if (ticketsToRender.length === 0) {
    ticketItemsContainer.innerHTML = "<tr><td colspan='5' class='text-center text-gray-500'>No tickets found.</td></tr>";
    return;
  }

  ticketsToRender.forEach((ticket, index) => {
    const ticketRow = document.createElement('tr');
    ticketRow.classList.add('bg-gray-800', 'border-b', 'border-gray-600');

    ticketRow.innerHTML = `
      <td class="py-3 px-6">
        <input type="checkbox" class="ticket-checkbox" data-index="${index}" onclick="toggleBulkActionButtons()">
      </td>
      <td class="py-3 px-6">${ticket.title}</td>
      <td class="py-3 px-6">${ticket.description}</td>
      <td class="py-3 px-6 text-${ticket.priority === 'low' ? 'green' : ticket.priority === 'medium' ? 'yellow' : 'red'}-500">${ticket.priority}</td>
      <td class="py-3 px-6 text-${ticket.status === 'resolved' ? 'green' : 'red'}-500">${ticket.status}</td>
    `;

    ticketItemsContainer.appendChild(ticketRow);
  });

  updatePagination();
}

// Function to update pagination buttons
function updatePagination() {
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);
  const paginationContainer = document.getElementById("pagination");

  paginationContainer.innerHTML = '';

  // Previous button
  if (currentPage > 1) {
    paginationContainer.innerHTML += `<button onclick="goToPage(${currentPage - 1})">Previous</button>`;
  }

  // Page buttons
  for (let i = 1; i <= totalPages; i++) {
    paginationContainer.innerHTML += `<button onclick="goToPage(${i})">${i}</button>`;
  }

  // Next button
  if (currentPage < totalPages) {
    paginationContainer.innerHTML += `<button onclick="goToPage(${currentPage + 1})">Next</button>`;
  }
}

// Function to go to a specific page
function goToPage(page) {
  currentPage = page;
  renderTickets();
}

// Function to handle search
function handleSearch() {
  const query = document.getElementById("search-bar").value.toLowerCase();

  // Filter tickets based on search query
  filteredTickets = tickets.filter(ticket =>
    ticket.title.toLowerCase().includes(query) ||
    ticket.description.toLowerCase().includes(query)
  );

  currentPage = 1;  // Reset to the first page when search is performed
  renderTickets();
}

// Function to toggle the "select all" checkbox
function toggleSelectAll() {
  const selectAllCheckbox = document.getElementById("select-all");
  const checkboxes = document.querySelectorAll(".ticket-checkbox");
  checkboxes.forEach(checkbox => {
    checkbox.checked = selectAllCheckbox.checked;
  });

  toggleBulkActionButtons();
}

// Function to toggle the bulk action buttons based on selected tickets
function toggleBulkActionButtons() {
  const checkboxes = document.querySelectorAll(".ticket-checkbox");
  const selectedCheckboxes = document.querySelectorAll(".ticket-checkbox:checked");
  const resolveButton = document.getElementById("resolve-selected");
  const deleteButton = document.getElementById("delete-selected");

  if (selectedCheckboxes.length > 0) {
    resolveButton.disabled = false;
    deleteButton.disabled = false;
  } else {
    resolveButton.disabled = true;
    deleteButton.disabled = true;
  }
}

// Function to resolve selected tickets
function resolveSelected() {
  const selectedCheckboxes = document.querySelectorAll(".ticket-checkbox:checked");
  selectedCheckboxes.forEach(checkbox => {
    const ticketIndex = checkbox.getAttribute('data-index');
    tickets[ticketIndex].status = "resolved";
  });

  localStorage.setItem("tickets", JSON.stringify(tickets));
  renderTickets();
}

// Function to delete selected tickets
function deleteSelected() {
  const selectedCheckboxes = document.querySelectorAll(".ticket-checkbox:checked");
  const selectedIndexes = Array.from(selectedCheckboxes).map(checkbox => checkbox.getAttribute('data-index'));

  if (selectedIndexes.length > 0) {
    // Confirm deletion
    if (confirm("Are you sure you want to delete the selected tickets?")) {
      // Sort the selected indexes in descending order to delete from the end to avoid shifting problems
      selectedIndexes.sort((a, b) => b - a).forEach(index => {
        tickets.splice(index, 1);
      });

      localStorage.setItem("tickets", JSON.stringify(tickets));
      renderTickets();
    }
  }
}

// Logout function
function logout() {
  localStorage.removeItem("username");
  window.location.href = "../LoginPage/index.html"; // Redirect to login page
}

// Initial render of tickets
renderTickets();

// Event listener for search input
document.getElementById("search-bar").addEventListener("input", handleSearch);


// adding rows









