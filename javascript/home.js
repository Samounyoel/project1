// Redirect to login page if user is not logged in
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
if (!loggedInUser) {
  window.location.href = "login.html"; // adjust path if needed
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

function getUserEventKey() {
  return `events_${loggedInUser.email}`;
}

// Create time labels for each row
function createTimeLabels() {
  const timeColumn = document.querySelector(".time-column");
  for (let hour = 8; hour <= 18; hour++) {
    const label = document.createElement("div");
    label.textContent = `${hour < 10 ? "0" : ""}${hour}:00`;
    timeColumn.appendChild(label);
  }
}

// Render calendar with user's events
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

      if (dayIndex === 5 || dayIndex === 6) {
        slot.style.pointerEvents = "none";
        slot.style.opacity = "0.3";
        slot.style.backgroundColor = "#f0f0f0";
      } else {
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

// Open modal and fill existing event if any
function openModal(day, time) {
  const key = `${day}-${time}`;
  const existing = events[key];

  eventDay.value = day;
  eventHour.value = time;
  eventName.value = existing ? existing.name : "";

  const selectedPriority = existing ? existing.priority : null;
  document.querySelectorAll('input[name="eventPriority"]').forEach(input => {
    input.checked = input.value === selectedPriority;
    updateCheckboxAvatar(input, !!existing);
  });

  deleteEventButton.style.display = existing ? "block" : "none";
  eventModal.style.display = "flex";
}

// Submit form (add/update event)
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

// Delete event
deleteEventButton.addEventListener("click", () => {
  const key = `${eventDay.value}-${eventHour.value}`;
  delete events[key];
  saveEvents();
  eventModal.style.display = "none";
  renderCalendar();
});

// Save user-specific events
function saveEvents() {
  localStorage.setItem(getUserEventKey(), JSON.stringify(events));
}

// Load user-specific events
function loadEvents() {
  const saved = localStorage.getItem(getUserEventKey());
  if (saved) events = JSON.parse(saved);
}

// Close modal when clicked outside
window.onclick = function (e) {
  if (e.target === eventModal) {
    eventModal.style.display = "none";
  }
};

// Navbar setup
function loadUserNavbar() {
  const navbar = document.getElementById("userNavbar");
  let avatarSrc = "";

  if (loggedInUser) {
    if (loggedInUser.avatar?.startsWith("data:image")) {
      avatarSrc = loggedInUser.avatar;
    } else if (loggedInUser.avatar) {
      avatarSrc = `/project1/images/${loggedInUser.avatar}`;
    } else {
      avatarSrc = "/project1/images/1.jpg";
    }

    navbar.innerHTML = `
      <div class="user-info">
        <img id="user-avatar" src="${avatarSrc}" alt="Avatar" onerror="this.src='/project1/images/1.jpg'" />
        <span class="user-name">${loggedInUser.firstName} ${loggedInUser.lastName}</span>
      </div>
      <button class="disconnect-btn" onclick="disconnect()">Disconnect</button>
    `;
  }
}

// Disconnect user
function disconnect() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}

// Show priority avatars only if event exists
function updateCheckboxAvatar(checkbox, hasEvent = false) {
  const priority = checkbox.value;
  const avatarContainer = document.getElementById(`avatar-container-${priority}`);
  
  document.querySelectorAll('.avatar-container').forEach(container => {
    container.style.backgroundImage = "";
  });

  if (avatarContainer && checkbox.checked && hasEvent) {
    const avatarSrc = loggedInUser.avatar?.startsWith("data:image")
      ? loggedInUser.avatar
      : loggedInUser.avatar
      ? `/project1/images/${loggedInUser.avatar}`
      : "/project1/images/1.jpg";

    avatarContainer.style.backgroundImage = `url(${avatarSrc})`;
    avatarContainer.style.backgroundSize = "50px 50px";
    avatarContainer.style.backgroundPosition = "center";
  }
}

// Initialization
createTimeLabels();
loadEvents();
renderCalendar();
loadUserNavbar();

// Handle checkbox avatar update
document.querySelectorAll('input[name="eventPriority"]').forEach(input => {
  input.addEventListener("change", () => updateCheckboxAvatar(input, true));
});