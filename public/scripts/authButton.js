import { baseUrl } from "./constants.js";

document.addEventListener("DOMContentLoaded", () => {
  const authButton = document.querySelector(".js-auth-button");

  if (!authButton) {
    console.error("Auth button not found in DOM.");
    return;
  }

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

    // Update button appearance dynamically
    authButton.className = `js-auth-button px-4 py-2 rounded ${
      loggedIn ? "bg-red-500 hover:bg-red-400" : "bg-blue-500 hover:bg-blue-400"
    } text-white transition-all`;
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
