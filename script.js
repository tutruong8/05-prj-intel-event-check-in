//DOM Elements
const form = document.getElementById("checkInForm");
const attendeeInput = document.getElementById("attendeeName");
const selectTeam = document.getElementById("teamSelect");

//Track Attendance
let count = 0;
const maxCount = 50;

//Form submission
form.addEventListener("submit", function(event) {
  event.preventDefault(); //Doesn't reload page
  //Grabs form values
  const name = attendeeInput.value;
  const team = selectTeam.value;
  const teamName = selectTeam.selectedOptions[0].text;

  console.log(name, team, teamName);

  //Increment Count
  count++;
  console.log("Total Check-ins: ", count);

  //Update progress bar
  const percent = Math.round((count / maxCount) * 100)  + "%";
  console.log(`Progress: ${percent}`);

  //Update Team count
  const teamCounter = document.getElementById(team + "Count");
  teamCounter.textContent = parseInt(teamCounter.textContent) + 1;

  //Show welcome message
  const message = `Welcome, ${name} from ${team}`;
  console.log(message);

  form.reset();
})