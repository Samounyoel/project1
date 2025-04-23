document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      alert("Login successful!");

      // ✅ Store the user with correct key for all other scripts
      localStorage.setItem("loggedInUser", JSON.stringify(user));

      // ✅ Redirect to the home page
      window.location.href = "home.html";
    } else {
      alert("Invalid email or password.");
    }
  });
});