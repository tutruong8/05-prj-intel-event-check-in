//DOM Elements
const form = document.getElementById("checkInForm");
const greeting = document.getElementById("greeting");
const attendeeInput = document.getElementById("attendeeName");
const selectTeam = document.getElementById("teamSelect");
const progressBar = document.getElementById("progressBar");
const checkInBtn = document.getElementById("checkInBtn");
const winningTeam = document.getElementById("winningTeam");

//Track Attendance
let count = 0;
//const maxCount = 50;
const maxCount = 4; //Testing because I don't want to check in 50 people every time i test this

function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function loadData(key, defaultValue) {
  const raw = localStorage.getItem(key);
  if (raw === null) {
    return defaultValue;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error("Failed to parse localStorage value:", key, error);
    return defaultValue;
  }
}

function getSavedList(listId) {
  const items = document.getElementById(listId).querySelectorAll("li");
  return Array.from(items, function (item) {
    return item.textContent;
  });
}

function saveCounts() {
  saveData("attendeeCount", count);
  saveData(
    "waterCount",
    Number(document.getElementById("waterCount").textContent),
  );
  saveData(
    "zeroCount",
    Number(document.getElementById("zeroCount").textContent),
  );
  saveData(
    "powerCount",
    Number(document.getElementById("powerCount").textContent),
  );
  saveData("waterList", getSavedList("waterList"));
  saveData("zeroList", getSavedList("zeroList"));
  saveData("powerList", getSavedList("powerList"));
}

function loadList(key, listId) {
  const list = loadData(key, []);
  if (!Array.isArray(list)) {
    return;
  }

  const container = document.getElementById(listId);
  list.forEach(function (name) {
    const li = document.createElement("li");
    li.textContent = name;
    container.appendChild(li);
  });
}

function updateWinningTeam() {
  const waterCount = Number(document.getElementById("waterCount").textContent);
  const zeroCount = Number(document.getElementById("zeroCount").textContent);
  const powerCount = Number(document.getElementById("powerCount").textContent);
  const mostMembers = Math.max(waterCount, zeroCount, powerCount);

  if (mostMembers === 0) {
    winningTeam.textContent = "";
    return;
  }

  if (waterCount === mostMembers && waterCount > zeroCount && waterCount > powerCount) {
    winningTeam.textContent = "🏆 The winning team is: Team Water Wise!";
  } else if (zeroCount === mostMembers && zeroCount > waterCount && zeroCount > powerCount) {
    winningTeam.textContent = "🏆 The winning team is: Team Net Zero!";
  } else if (powerCount === mostMembers && powerCount > waterCount && powerCount > zeroCount) {
    winningTeam.textContent = "🏆 The winning team is: Team Renewables!";
  } else {
    winningTeam.textContent = "🏆 It's a tie between two or more teams!";
  }
}

function loadCounts() {
  count = loadData("attendeeCount", 0);
  document.getElementById("attendeeCount").textContent = count;
  document.getElementById("waterCount").textContent = loadData("waterCount", 0);
  document.getElementById("zeroCount").textContent = loadData("zeroCount", 0);
  document.getElementById("powerCount").textContent = loadData("powerCount", 0);

  loadList("waterList", "waterList");
  loadList("zeroList", "zeroList");
  loadList("powerList", "powerList");

  const percent = Math.round((count / maxCount) * 100) + "%";
  progressBar.style.width = percent;

  if (count >= maxCount) {
    checkInBtn.disabled = true;
  }

  updateWinningTeam();
}

window.addEventListener("DOMContentLoaded", loadCounts);

//Form submission
form.addEventListener("submit", function (event) {
  event.preventDefault(); //Doesn't reload page

  //Grabs form values
  const name = attendeeInput.value;
  const team = selectTeam.value;
  const teamName = selectTeam.selectedOptions[0].text;

  console.log(name, team, teamName);

  //Increment Count and update the count to attendance
  const totalAttendees = document.getElementById("attendeeCount");

  if (count >= maxCount) {
    alert("Maximum number of attendees have been reached!");
    checkInBtn.disabled = true;
    updateWinningTeam();
    return;
  }

  count++;
  totalAttendees.textContent = count;
  console.log("Total Check-ins: ", count);

  if (count === maxCount) {
    checkInBtn.disabled = true;
  }

  //Update progress bar
  const percent = Math.round((count / maxCount) * 100) + "%";
  progressBar.style.width = percent;
  console.log(`Progress: ${percent}`);

  //Update Team count
  const teamCounter = document.getElementById(team + "Count");
  teamCounter.textContent = parseInt(teamCounter.textContent) + 1;

  //Add attendee to team list
  const teamList = document.getElementById(team + "List");
  const listName = document.createElement("li");
  listName.textContent = name;
  teamList.appendChild(listName);

  saveCounts();

  //Show welcome message
  const message = `Welcome, ${name} from ${teamName}!`;
  greeting.textContent = message;
  console.log(message);

  form.reset();
});
