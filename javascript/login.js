document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
  
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();
  
      // Get entered login values
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
  
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem("users")) || [];
  
      // Check if user exists and password matches
      const user = users.find(u => u.email === email && u.password === password);
  
      if (user) {
        alert("Login successful!");
        // Optionally store session user info
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        window.location.href = "home.html";
      } else {
        alert("Invalid email or password.");
      }
    });
  });

 