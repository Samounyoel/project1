// Redirect to login page if user is not logged in
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
if (!loggedInUser) {
  window.location.href = "login.html"; // adjust the path if needed
}

const calendarGrid = document.getElementById("calendarGrid");
const eventModal = document.getElementById("eventModal");
const eventForm = document.getElementById("eventForm");
const eventName = document.getElementById("eventName");
const eventDay = document.getElementById("eventDay");
const eventHour = document.getElementById("eventHour");
const deleteEventButton = document.getElementById("deleteEventButton");

const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
let events = {};

// Create time labels for each row in the calendar
function createTimeLabels() {
  const timeColumn = document.querySelector(".time-column");
  for (let hour = 8; hour <= 18; hour++) {
    const label = document.createElement("div");
    label.textContent = `${hour < 10 ? "0" : ""}${hour}:00`;
    timeColumn.appendChild(label);
  }
}

// Render the calendar dynamically with events
function renderCalendar() {
  calendarGrid.innerHTML = "";

  days.forEach((day, dayIndex) => {
    const dayColumn = document.createElement("div");
    dayColumn.classList.add("day-column");

    const header = document.createElement("div");
    header.classList.add("day-header");
    header.textContent = day;
    dayColumn.appendChild(header);

    for (let hour = 8; hour <= 18; hour++) {
      const time = `${hour < 10 ? "0" : ""}${hour}:00`;
      const key = `${dayIndex}-${time}`;

      const slot = document.createElement("div");
      slot.classList.add("time-slot");
      slot.dataset.day = dayIndex;
      slot.dataset.time = time;

      // Make Friday (5) and Saturday (6) slots transparent and unclickable
      if (dayIndex === 5 || dayIndex === 6) {
        slot.style.pointerEvents = "none";
        slot.style.opacity = "0.3";
        slot.style.backgroundColor = "#f0f0f0";
      } else {
        // Add event listener for opening the modal when a time slot is clicked
        slot.addEventListener("click", () => openModal(dayIndex, time));
      }

      const event = events[key];
      if (event) {
        const eventDiv = document.createElement("div");
        eventDiv.className = `event priority-${event.priority}`;
        eventDiv.textContent = event.name;
        slot.appendChild(eventDiv);
      }

      dayColumn.appendChild(slot);
    }

    calendarGrid.appendChild(dayColumn);
  });
}

// Open the modal for adding or editing events
function openModal(day, time) {
  console.log("Opening modal for day:", day, "and time:", time); // Debugging step

  const key = `${day}-${time}`;
  const existing = events[key];

  eventDay.value = day;
  eventHour.value = time;
  eventName.value = existing ? existing.name : "";

  const selectedPriority = existing ? existing.priority : "Low";
  document.querySelectorAll('input[name="eventPriority"]').forEach(input => {
    input.checked = input.value === selectedPriority;
    updateCheckboxAvatar(input); // Update avatar on priority change
  });

  deleteEventButton.style.display = existing ? "block" : "none";

  // Make sure the modal becomes visible
  eventModal.style.display = "flex";
}

// Handle form submission for creating or editing an event
eventForm.onsubmit = function (e) {
  e.preventDefault();
  const key = `${eventDay.value}-${eventHour.value}`;
  const selectedPriority = document.querySelector('input[name="eventPriority"]:checked').value;

  events[key] = {
    name: eventName.value,
    priority: selectedPriority
  };

  saveEvents();
  eventModal.style.display = "none";
  renderCalendar();
};

// Delete the event and close the modal
deleteEventButton.addEventListener("click", () => {
  const key = `${eventDay.value}-${eventHour.value}`;
  delete events[key];
  saveEvents();
  eventModal.style.display = "none";
  renderCalendar();
});

// Save events to localStorage
function saveEvents() {
  localStorage.setItem("events", JSON.stringify(events));
}

// Load events from localStorage
function loadEvents() {
  const saved = localStorage.getItem("events");
  if (saved) events = JSON.parse(saved);
}

// Close modal if clicked outside of it
window.onclick = function (e) {
  if (e.target === eventModal) {
    eventModal.style.display = "none";
  }
};

function loadUserNavbar() {
  const navbar = document.getElementById("userNavbar");

  let avatarSrc = "";

  if (loggedInUser) {
    console.log(loggedInUser); // Debugging log to check the user data

    // Checking if the avatar is provided as a base64 string or path to the image
    if (loggedInUser.avatar?.startsWith("data:image")) {
      avatarSrc = loggedInUser.avatar;
    } else if (loggedInUser.avatar) {
      avatarSrc = `/project1/images/${loggedInUser.avatar}`;
    } else {
      avatarSrc = "/project1/images/1.jpg"; // Default avatar
    }

    navbar.innerHTML = `
      <div class="user-info">
        <img id="user-avatar" src="${avatarSrc}" alt="Avatar" onerror="this.src='/project1/images/1.jpg'" />
        <span class="user-name">${loggedInUser.firstName} ${loggedInUser.lastName}</span>
      </div>
      <button class="disconnect-btn" onclick="disconnect()">Disconnect</button>
    `;
  } else {
    console.log("No logged-in user found");
  }
}

// Disconnect = clear session and redirect
function disconnect() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}

// Function to update checkbox with avatar when selected
function updateCheckboxAvatar(checkbox) {
  const priority = checkbox.value;
  const avatarContainer = document.getElementById(`avatar-container-${priority}`);
  
  // Hide all avatar containers before updating
  document.querySelectorAll('.avatar-container').forEach(container => {
    container.style.backgroundImage = ""; // Reset all avatars
  });

  // Check if avatarContainer exists before updating
  if (avatarContainer) {
    if (checkbox.checked) {
      const avatarSrc = loggedInUser.avatar?.startsWith("data:image")
        ? loggedInUser.avatar
        : loggedInUser.avatar
        ? `/project1/images/${loggedInUser.avatar}`
        : "/project1/images/1.jpg";
      avatarContainer.style.backgroundImage = `url(${avatarSrc})`;
      avatarContainer.style.backgroundSize = "50px 50px"; // Avatar size
      avatarContainer.style.backgroundPosition = "center";
    }
  }
}

// Initialize the page
createTimeLabels();
loadEvents();
renderCalendar();
loadUserNavbar();

// Event listeners for checkboxes
document.querySelectorAll('input[name="eventPriority"]').forEach(input => {
  input.addEventListener('change', () => updateCheckboxAvatar(input)); // Listen for changes
  updateCheckboxAvatar(input); // Initialize avatar display based on checked state
});