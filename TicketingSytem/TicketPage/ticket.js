// Check if the user is logged in
if (!localStorage.getItem("loggedIn")) {
    window.location.href = "../LoginPage/index.html"; // Redirect to login page if not logged in
}

// Get references to DOM elements
const ticketForm = document.getElementById("ticket-form");
const ticketTitle = document.getElementById("ticket-title");
const ticketDescription = document.getElementById("ticket-description");
const ticketPriority = document.getElementById("ticket-priority");
const ticketList = document.getElementById("ticket-items");
const searchBar = document.getElementById("search-bar");
const searchButton = document.getElementById("search-button");

// Track the current ticket being edited
let editingTicketIndex = -1; 

// Load tickets from localStorage
let tickets = JSON.parse(localStorage.getItem("tickets")) || [];

// Function to render tickets in the UI
function renderTickets(ticketArray) {
    ticketList.innerHTML = ""; // Clear the current list

    if (ticketArray.length === 0) {
        ticketList.innerHTML = "<p class='text-center text-gray-500'>No tickets found.</p>";
        return;
    }

    // Render each ticket as a card
    ticketArray.forEach((ticket, index) => {
        const ticketCard = document.createElement("div");
        ticketCard.classList.add("ticket-card", "bg-gray-700", "p-4", "rounded-lg", "shadow-lg");

        ticketCard.innerHTML = `
            <h3 class="font-semibold text-xl text-gray-100">${ticket.title}</h3>
            <p class="text-gray-400 mt-2">${ticket.description}</p>
            <div class="mt-4 flex justify-between items-center">
                <span class="text-sm text-gray-500">Priority: 
                    <span class="font-bold text-${ticket.priority === 'low' ? 'green' : ticket.priority === 'medium' ? 'yellow' : 'red'}-500">${ticket.priority}</span>
                </span>
                <span class="text-sm text-${ticket.resolved ? 'green' : 'red'}-500 font-semibold">
                    ${ticket.resolved ? "Resolved" : "Unresolved"}
                </span>
                <div class="flex space-x-2">
                    <button class="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700" onclick="editTicket(${index})">Edit</button>
                    <button class="px-3 py-1 text-sm bg-${ticket.resolved ? 'green' : 'red'}-600 text-white rounded-lg hover:bg-${ticket.resolved ? 'green' : 'red'}-700" onclick="toggleResolved(${index})">
                        ${ticket.resolved ? "Mark as Unresolved" : "Mark as Resolved"}
                    </button>
                    <button class="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700" onclick="deleteTicket(${index})">Delete</button>
                </div>
            </div>
        `;

        ticketList.appendChild(ticketCard);
    });
}

// Save tickets to localStorage
function saveTickets() {
    localStorage.setItem("tickets", JSON.stringify(tickets));
}

// Function to handle ticket form submission
function handleTicketSubmit(event) {
    event.preventDefault(); // Prevent default form submission

    const title = ticketTitle.value.trim();
    const description = ticketDescription.value.trim();
    const priority = ticketPriority.value.trim();

    if (!title || !description || !priority) {
        alert("Please fill in all fields.");
        return;
    }

    // If we are editing an existing ticket
    if (editingTicketIndex > -1) {
        // Update the existing ticket
        tickets[editingTicketIndex] = {
            title,
            description,
            priority,
            resolved: tickets[editingTicketIndex].resolved, // Keep resolved status
        };

        // Reset the editing index
        editingTicketIndex = -1;
    } else {
        // Create new ticket object
        const newTicket = {
            title,
            description,
            priority,
            resolved: false, // New tickets are unresolved by default
        };

        // Add new ticket to the tickets array
        tickets.push(newTicket);
    }

    // Save updated tickets to localStorage and render
    saveTickets();
    renderTickets(tickets);

    // Reset form fields
    ticketTitle.value = "";
    ticketDescription.value = "";
    ticketPriority.value = "";
    document.getElementById("ticket-submit").innerText = "Create Ticket"; // Reset the button text
}

// Function to handle deleting a ticket
function deleteTicket(index) {
    tickets.splice(index, 1);
    saveTickets();
    renderTickets(tickets);
}

// Function to handle search when the icon is clicked
function handleSearchClick() {
    const query = searchBar.value.toLowerCase();

    // Filter tickets based on title or description matching the search query
    const filteredTickets = tickets.filter(ticket =>
        ticket.title.toLowerCase().includes(query) ||
        ticket.description.toLowerCase().includes(query)
    );

    renderTickets(filteredTickets);
}

// Function to handle search as user types (real-time filtering)
searchBar.addEventListener("input", handleSearchClick);

// Event listener for form submission
ticketForm.addEventListener("submit", handleTicketSubmit);

// Function to toggle the resolved status of a ticket
function toggleResolved(index) {
    // Toggle the resolved status
    tickets[index].resolved = !tickets[index].resolved;

    // Save updated tickets to localStorage and re-render
    saveTickets();
    renderTickets(tickets);
}

// Function to handle editing a ticket
function editTicket(index) {
    const ticket = tickets[index];
    ticketTitle.value = ticket.title;
    ticketDescription.value = ticket.description;
    ticketPriority.value = ticket.priority;

    // Update the submit button text to "Save Changes"
    document.getElementById("ticket-submit").innerText = "Save Changes";

    // Set the editingTicketIndex to track which ticket is being edited
    editingTicketIndex = index;
}

// Initial render of tickets
renderTickets(tickets);
