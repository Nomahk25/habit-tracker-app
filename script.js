const habitForm = document.getElementById("habit-form");
const habitInput = document.getElementById("habit-name");
const habitList = document.getElementById("habit-list");
const calendar = document.getElementById("calendar");
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
const ding = new Audio("assets/sounds/ding.mp3");

let habits = JSON.parse(localStorage.getItem("habits")) || [];
let theme = localStorage.getItem("theme") || "light";

function saveHabits() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

function updateTheme() {
  document.documentElement.setAttribute("data-theme", theme);
  themeIcon.src = theme === "dark" ? "assets/icons/sun.svg" : "assets/icons/moon.svg";
  localStorage.setItem("theme", theme);
}

themeToggle.onclick = () => {
  theme = theme === "dark" ? "light" : "dark";
  updateTheme();
};

function renderHabits() {
  habitList.innerHTML = "";
  habits.forEach((habit, index) => {
    const div = document.createElement("div");
    div.className = "habit" + (habit.done ? " done" : "");
    div.innerHTML = `
      <span>${habit.name} ${habit.streak > 0 ? `🔥${habit.streak}` : ""}</span>
      <button onclick="toggleHabit(${index})">
        <img src="assets/icons/check.svg" alt="Check">
      </button>
    `;
    habitList.appendChild(div);
  });
}

function renderCalendar() {
  const days = 30;
  calendar.innerHTML = "";
  for (let i = 1; i <= days; i++) {
    const div = document.createElement("div");
    div.className = "calendar-day" + (Math.random() > 0.7 ? " active" : "");
    div.textContent = i;
    calendar.appendChild(div);
  }
}

function toggleHabit(index) {
  const today = new Date().toDateString();
  if (habits[index].lastCompleted !== today) {
    habits[index].done = true;
    habits[index].lastCompleted = today;
    habits[index].streak = (habits[index].streak || 0) + 1;
    ding.play();
  } else {
    habits[index].done = false;
    habits[index].streak = Math.max(0, habits[index].streak - 1);
  }
  saveHabits();
  renderHabits();
}

habitForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = habitInput.value.trim();
  if (name) {
    habits.push({ name, done: false, streak: 0 });
    habitInput.value = "";
    saveHabits();
    renderHabits();
  }
});

updateTheme();
renderHabits();
renderCalendar();
