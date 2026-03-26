const userTableBody = document.getElementById("userTableBody");
const generateBtn = document.getElementById("generateBtn");
const userCountInput = document.getElementById("userCount");
const nameSelect = document.getElementById("nameSelect");

// Bootstrap modal
const modal = $("#userModal");
const modalPicture = document.getElementById("modalPicture");
const modalName = document.getElementById("modalName");
const modalAddress = document.getElementById("modalAddress");
const modalEmail = document.getElementById("modalEmail");
const modalPhone = document.getElementById("modalPhone");
const modalCell = document.getElementById("modalCell");
const modalDob = document.getElementById("modalDob");
const modalGender = document.getElementById("modalGender");

// Action buttons
const editUserBtn = document.getElementById("editUser");
const deleteUserBtn = document.getElementById("deleteUser");

// Edit form
const editForm = document.getElementById("editForm");
const editName = document.getElementById("editName");
const editAddress = document.getElementById("editAddress");
const editEmail = document.getElementById("editEmail");
const editPhone = document.getElementById("editPhone");
const editTelephone = document.getElementById("editTelephone");
const editDob = document.getElementById("editDob");
const editGender = document.getElementById("editGender");
const saveEditBtn = document.getElementById("saveEdit");
const cancelEditBtn = document.getElementById("cancelEdit");

let currentUsers = [];
let selectedUserIndex = null;

// Fetch users from server
async function getUsers(count) {
  try {
    const response = await fetch(`/api?results=${count}`);
    if (!response.ok) throw new Error("Failed to fetch users");
    const data = await response.json();
    currentUsers = data.results;
    setUsersInfo(currentUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    alert("Error fetching users. Check your server.");
  }
}

// Display users in table
function setUsersInfo(users) {
  userTableBody.innerHTML = "";

  users.forEach((user, index) => {
    const row = document.createElement("tr");
    let nameDisplay = nameSelect.value === "first" ? user.name.first : user.name.last;
    row.innerHTML = `
      <td>${nameDisplay}</td>
      <td>${user.gender.charAt(0).toUpperCase() + user.gender.slice(1)}</td>
      <td><a href="mailto:${user.email}">${user.email}</a></td>
      <td>${user.location.country}</td>
    `;

    row.addEventListener("dblclick", () => {
      selectedUserIndex = index;
      openModal(user);
    });

    userTableBody.appendChild(row);
  });
}

// Modal
function openModal(user) {
  modalPicture.src = user.picture.large;
  modalName.textContent = `${user.name.first} ${user.name.last}`;
  modalEmail.textContent = user.email;
  modalPhone.textContent = `Phone: ${user.phone}`;
  modalCell.textContent = `Telephone: ${user.cell}`;
  modalDob.textContent = `Date of Birth: ${new Date(user.dob.date).toLocaleDateString()}`;
  modalGender.textContent = `Gender: ${user.gender.charAt(0).toUpperCase() + user.gender.slice(1)}`;
  editForm.style.display = "none";
  modal.modal("show");
}

// Generate button
generateBtn.addEventListener("click", () => {
  const count = parseInt(userCountInput.value);
  if (!count || count < 1) return alert("Please enter at least 1 user.");
  if (count > 1000) return alert("Maximum allowed is 1000 users.");
  getUsers(count);
});

// Name select
nameSelect.addEventListener("change", () => {
  if (currentUsers.length) setUsersInfo(currentUsers);
});

// Delete user
deleteUserBtn.addEventListener("click", () => {
  if (selectedUserIndex !== null) {
    currentUsers.splice(selectedUserIndex, 1);
    setUsersInfo(currentUsers);
    modal.modal("hide");
  }
});

// Edit user
editUserBtn.addEventListener("click", () => {
  if (selectedUserIndex !== null) {
    const user = currentUsers[selectedUserIndex];
    editName.value = `${user.name.first} ${user.name.last}`;
    editAddress.value = user.fullAddress || `${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${user.location.country}`;
    editEmail.value = user.email;
    editPhone.value = user.phone;
    editTelephone.value = user.cell;
    editDob.value = new Date(user.dob.date).toISOString().split("T")[0];
    editGender.value = user.gender;
    editForm.style.display = "block";
  }
});

// Save edited user
saveEditBtn.addEventListener("click", () => {
  if (selectedUserIndex !== null) {
    const user = currentUsers[selectedUserIndex];
    const [firstName, ...lastNameParts] = editName.value.trim().split(" ");
    user.name.first = firstName || user.name.first;
    user.name.last = lastNameParts.join(" ") || user.name.last;
    user.email = editEmail.value || user.email;
    user.phone = editPhone.value || user.phone;
    user.cell = editTelephone.value || user.cell;
    user.dob.date = editDob.value || user.dob.date;
    user.gender = editGender.value || user.gender;
    user.fullAddress = editAddress.value || user.fullAddress;

    setUsersInfo(currentUsers);
    openModal(user);
    editForm.style.display = "none";
  }
});

// Cancel edit
cancelEditBtn.addEventListener("click", () => {
  editForm.style.display = "none";
});
