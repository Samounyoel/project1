document.getElementById("registerBtn").addEventListener("click", function () {

  // Get form values
  const firstName = document.getElementById("first-name").value;
  const lastName = document.getElementById("last-name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  const role = document.getElementById("role").value;
  const avatar = document.getElementById("profile-photo").files[0];
  const termsAccepted = document.getElementById("terms").checked;

  if (!firstName || !lastName) {
    alert("All fields are required.")
  } else {

    // Validation
    if (password !== confirmPassword) {
      alert("Passwords do not match! Try again.");
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
    let USERS = JSON.parse(localStorage.getItem("USERS")) || [];
    USERS.push(userData);
    localStorage.setItem("USERS", JSON.stringify(USERS));

    alert("Registration successful!");

    // Redirect to login page (optional)
    window.location.href = "login.html";
  }
});

