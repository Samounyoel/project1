document.getElementById("registrationForm").addEventListener("submit", function(event) {
  event.preventDefault();
  
  // Get form values
  const firstName = document.getElementById("first-name").value;
  const lastName = document.getElementById("last-name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  const role = document.getElementById("role").value;
  const selectedAvatar = document.querySelector('input[name="avatar"]:checked');
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

  if (!selectedAvatar) {
    alert("Please select an avatar.");
    return;
  }

  // Prepare user data object
  const userData = {
    firstName,
    lastName,
    email,
    password,
    role,
    avatar: selectedAvatar.value, // file name (e.g., "1.jpg")
    termsAccepted
  };

  // Save user data to localStorage
  let users = JSON.parse(localStorage.getItem("users")) || [];
  users.push(userData);
  localStorage.setItem("users", JSON.stringify(users));

  alert("Registration successful!");
  
  // Redirect to login page
  showLoginForm();
});

function showLoginForm() {
  window.location.href = "login.html";
}