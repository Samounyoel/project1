document.getElementById("registrationForm").addEventListener("submit", function(event) {
  event.preventDefault();
  
  // Get form values
  const firstName = document.getElementById("first-name").value;
  const lastName = document.getElementById("last-name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  const role = document.getElementById("role").value;
  const avatar = document.getElementById("profile-photo").files[0];
  const termsAccepted = document.getElementById("terms").checked;

  // Validation
  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  if (!termsAccepted) {
    alert("You must accept the terms and conditions.");
    return;
  }

  // Prepare user data object
  const userData = {
    firstName,
    lastName,
    email,
    password,
    role,
    avatar: avatar ? avatar.name : null,
    termsAccepted
  };

  // Save user data to localStorage
  let users = JSON.parse(localStorage.getItem("users")) || [];
  users.push(userData);
  localStorage.setItem("users", JSON.stringify(users));

  alert("Registration successful!");
  
  // Redirect to login page (optional)
  showLoginForm();
});

function showLoginForm() {
  window.location.href = "login.html";  // assuming you have a login page.
}