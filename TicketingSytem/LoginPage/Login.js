// login.js

// Hardcoded credentials
const validUsername = "admin";
const validPassword = "123";

// Function to handle login
function handleLogin(event) {
  event.preventDefault();  // Prevent form submission

  // Get the username and password from the form
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Check if the credentials are correct
  if (username === validUsername && password === validPassword) {
    // Save login status to localStorage
    localStorage.setItem("loggedIn", "true");

    // Redirect to the ticketing page
    window.location.href = "../TicketListPage/view-tickets.html";  // Ensure path is correct
  } else {
    // Show error message if credentials are incorrect
    document.getElementById("error-message").classList.remove("hidden");
  }
}

// Attach event listener to the login form
document.getElementById("login-form").addEventListener("submit", handleLogin);
