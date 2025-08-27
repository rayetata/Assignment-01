const userTableBody = document.getElementById('userTableBody');
const generateBtn = document.getElementById('generateBtn');
const userCountInput = document.getElementById('userCount');
const nameSelect = document.getElementById('nameSelect');

// Fetch multiple users from API
async function getUsers(count) {
  try {
    const response = await fetch(`https://randomuser.me/api/?results=${count}`);
    if (!response.ok) throw new Error("Failed to fetch users");

    const data = await response.json();
    setUsersInfo(data.results);
  } catch (error) {
    console.error(error);
    alert("⚠️ Error fetching users. Please check your internet connection and try again.");
  }
}

// Display users in table
function setUsersInfo(users) {
  userTableBody.innerHTML = ""; // Clear old rows

  users.forEach(user => {
    const row = document.createElement("tr");

    // Check dropdown selection (first or last name)
    const selectedName = nameSelect.value === "first" ? user.name.first : user.name.last;

    row.innerHTML = `
      <td>${selectedName}</td>
      <td>${user.gender}</td>
      <td><a href="mailto:${user.email}">${user.email}</a></td>
      <td>${user.location.country}</td>
    `;

    userTableBody.appendChild(row);
  });
}

// Event listener for button
generateBtn.addEventListener("click", () => {
  const count = parseInt(userCountInput.value) || 1; // default to 1 if empty
  getUsers(count);
});

// Event listener for dropdown change (updates table instantly)
nameSelect.addEventListener("change", () => {
  const count = parseInt(userCountInput.value) || 1;
  getUsers(count);
});
