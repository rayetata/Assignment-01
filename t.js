const userTableBody = document.getElementById("userTableBody");
const generateBtn = document.getElementById("generateBtn");
const userCountInput = document.getElementById("userCount");
const nameSelect = document.getElementById("nameSelect");

// Bootstrap modal
const modal = $("#userModal"); // is a jQuery object for a bootstap modal
const modalPicture = document.getElementById("modalPicture");
const modalName = document.getElementById("modalName");
const modalAddress = document.getElementById("modalAddress");
const modalEmail = document.getElementById("modalEmail");
const modalPhone = document.getElementById("modalPhone");
const modalCell = document.getElementById("modalCell");
const modalDob = document.getElementById("modalDob");
const modalGender = document.getElementById("modalGender");
// elements inside the modal

// Action buttons
const editUserBtn = document.getElementById("editUser");
const deleteUserBtn = document.getElementById("deleteUser");
// trigger editing and deleting

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

let currentUsers = []; // array that stores users
let selectedUserIndex = null;

// Fetch multiple users
// generate, click, request, ran..., num users, store num users to current users
async function getUsers(count) {
  try {
    const response = await fetch(`https://randomuser.me/api/?results=${count}`);
    if (!response.ok) throw new Error("Failed to fetch users");
    const data = await response.json();
    currentUsers = data.results;
    setUsersInfo(currentUsers); //fetching users from the api
  } catch (error) {
    console.error(error);
    alert("Error fetching users. Check your internet connection.");
  }
}

// Display users in table
function setUsersInfo(users) {
  // clear old rows make new rows
  userTableBody.innerHTML = "";

  users.forEach((user, index) => {
    const row = document.createElement("tr");
    // row shows
    let nameDisplay =
      nameSelect.value === "first" ? user.name.first : user.name.last;
    row.innerHTML = `
      <td>${nameDisplay}</td>
      <td>${user.gender}</td>
      <td><a href="mailto:${user.email}">${user.email}</a></td>
      <td>${user.location.country}</td>
    `;

    // Double click → open modal
    row.addEventListener("dblclick", () => {
      selectedUserIndex = index;
      openModal(user);
    });

    userTableBody.appendChild(row);
  });
}

// modal open will see the selected users info
function openModal(user) {
  // modal open will see the selected users info
  modalPicture.src = user.picture.large;
  modalName.textContent = `${user.name.first} ${user.name.last}`;

  // shows user info
  modalEmail.textContent = user.email;
  modalPhone.textContent = `Phone: ${user.phone}`;
  modalCell.textContent = `Telephone: ${user.cell}`;
  modalDob.textContent = `Date of Birth: ${new Date(
    user.dob.date
  ).toLocaleDateString()}`;
  modalGender.textContent = `Gender: ${user.gender}`;
  editForm.style.display = "none";
  modal.modal("show"); // bootstrap open
}

// Generate
// kwaon niya ang gin butang niya nga num
// himuon nga argument sa getuser para maka
// generate kang correct num of users rows
generateBtn.addEventListener("click", () => {
  const count = parseInt(userCountInput.value);

  if (count <= 0) {
    alert("⚠️ Please enter at least 1 user.");
    return;
  }

  if (count > 1000) {
    alert("⚠️ Maximum number of users allowed is 1000.");
    return;
  }

  getUsers(count);
});

// Name select change
nameSelect.addEventListener("change", () => {
  if (currentUsers.length > 0) setUsersInfo(currentUsers);
});

/* DELETE */
// remove the selected user from the array using splice, re-renders the table and hides the modal
deleteUserBtn.addEventListener("click", () => {
  if (selectedUserIndex !== null) {
    currentUsers.splice(selectedUserIndex, 1);
    setUsersInfo(currentUsers);
    modal.modal("hide");
  }
});

/* EDIT */
// yung na selected user,,,,fill the edit form with current details
// if done na edit ma update man sa currentusers
editUserBtn.addEventListener("click", () => {
  if (selectedUserIndex !== null) {
    const user = currentUsers[selectedUserIndex];

    editName.value = `${user.name.first} ${user.name.last}`;
    editAddress.value =
      user.fullAddress ||
      `${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${user.location.country}`;
    editEmail.value = user.email;
    editPhone.value = user.phone;
    editTelephone.value = user.cell;
    editDob.value = new Date(user.dob.date).toISOString().split("T")[0];
    editGender.value = user.gender;
    editForm.style.display = "block";
  }
});

// save edited user
saveEditBtn.addEventListener("click", () => {
  if (selectedUserIndex !== null) {
    const user = currentUsers[selectedUserIndex];

    // take the first token as first then the rest ma upod sa last name
    const [firstName, ...lastNameParts] = editName.value.trim().split(" ");
    user.name.first = firstName || user.name.first;
    user.name.last = lastNameParts.join(" ") || user.name.last;
    // updates the ff.
    user.email = editEmail.value || user.email;
    user.phone = editPhone.value || user.phone;
    user.cell = editTelephone.value || user.cell;
    user.dob.date = editDob.value || user.dob.date;
    user.gender = editGender.value || user.gender;

    // Save full address as one string
    user.fullAddress = editAddress.value || user.fullAddress;

    setUsersInfo(currentUsers);
    openModal(user);
    editForm.style.display = "none";
  }
});

cancelEditBtn.addEventListener("click", () => {
  editForm.style.display = "none";
});
