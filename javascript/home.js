const calendarGrid = document.getElementById("calendarGrid");
const eventModal = document.getElementById("eventModal");
const eventForm = document.getElementById("eventForm");
const eventName = document.getElementById("eventName");
const eventPriority = document.getElementById("eventPriority");
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

      const event = events[key];
      if (event) {
        const eventDiv = document.createElement("div");
        eventDiv.className = `event priority-${event.priority}`;
        eventDiv.textContent = event.name;
        slot.appendChild(eventDiv);
      }

      slot.addEventListener("click", () => openModal(dayIndex, time));
      dayColumn.appendChild(slot);
    }

    calendarGrid.appendChild(dayColumn);
  });
}

// Open the modal for adding or editing events
function openModal(day, time) {
  const key = `${day}-${time}`;
  const existing = events[key];

  eventDay.value = day;
  eventHour.value = time;
  eventName.value = existing ? existing.name : "";
  eventPriority.value = existing ? existing.priority : "Low";

  deleteEventButton.style.display = existing ? "block" : "none";
  eventModal.style.display = "flex";  // Ensure modal is visible
}

// Handle form submission for creating or editing an event
eventForm.onsubmit = function (e) {
  e.preventDefault();
  const key = `${eventDay.value}-${eventHour.value}`;
  events[key] = {
    name: eventName.value,
    priority: eventPriority.value
  };
  saveEvents();
  eventModal.style.display = "none";  // Close the modal after saving
  renderCalendar();
};

// Delete the event and close the modal
deleteEventButton.addEventListener("click", () => {
  const key = `${eventDay.value}-${eventHour.value}`;
  delete events[key];
  saveEvents();
  eventModal.style.display = "none";  // Close the modal after deleting
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

// Initialize the calendar with time labels, load events, and render the calendar
createTimeLabels();
loadEvents();
renderCalendar();