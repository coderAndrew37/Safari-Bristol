import { baseUrl } from "./constants.js";

document.addEventListener("DOMContentLoaded", () => {
  const authButton = document.querySelector(".js-auth-button");

  // Check if the user is authenticated
  async function isAuthenticated() {
    try {
      const response = await fetch(`${baseUrl}/api/users/is-authenticated`, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        return data.authenticated;
      }
    } catch (error) {
      console.error("Error checking authentication status:", error);
    }
    return false;
  }

  // Log the user out
  async function logout() {
    try {
      const response = await fetch(`${baseUrl}/api/users/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }

  // Update the auth button text and functionality
  async function updateAuthButton() {
    const loggedIn = await isAuthenticated();
    authButton.textContent = loggedIn ? "Logout" : "Login";
    authButton.onclick = loggedIn ? handleLogout : handleLogin;

    // Set the button's appearance dynamically
    authButton.style.backgroundColor = loggedIn ? "red" : "blue";
    authButton.style.color = "white"; // Ensure text color is always visible
    authButton.style.padding = "10px 15px";
    authButton.style.border = "none";
    authButton.style.borderRadius = "5px";
    authButton.style.cursor = "pointer";
  }

  // Redirect to the login page
  function handleLogin() {
    window.location.href = "/login.html";
  }

  // Handle logout and refresh the button state
  async function handleLogout() {
    await logout();
    await updateAuthButton();
    window.location.href = "/"; // Redirect to the homepage after logout
  }

  // Initialize the button on page load
  updateAuthButton();
});
