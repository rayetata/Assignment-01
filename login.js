const express = require("express"); // import express to create server
const session = require("express-session"); // session handling
const path = require("path"); // handle file paths

const app = express(); // initialize express app
const PORT = process.env.PORT || 3000; // set server port

const users = {}; // in-memory "database" for storing users

// Middleware
app.use(express.urlencoded({ extended: true })); // parse form data
app.use(
  session({
    secret: "some very secret key", // secret for session encryption
    resave: false, // don't resave unchanged sessions
    saveUninitialized: false, // don't save empty sessions
  })
);

// serve static files (like style.css) from the same folder as login.js
app.use(express.static(__dirname));

// layout function to wrap pages with HTML + CSS link
function layout(title, content) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>${title}</title>
    <link rel="stylesheet" href="/style.css">
  </head>
  <body>
    <div class="container">
      ${content}
    </div>
  </body>
  </html>
  `;
}

// Home Page
app.get("/", (req, res) => {
  res.send(
    layout("Home", `
      <h1>Welcome</h1>
      <p><a href="/signup">Signup</a> | <a href="/login">Login</a></p>
    `)
  );
});

// Signup Page
app.get("/signup", (req, res) => {
  res.send(
    layout("Signup", `
      <h1>Signup</h1>
      <form method="POST" action="/signup">
        <label>First Name: <input type="text" name="firstName" required></label>
        <label>Last Name: <input type="text" name="lastName" required></label>
        <label>Email: <input type="email" name="email" required></label>
        <label>Birthdate: <input type="date" name="birthdate" required></label>
        <label>Password: <input type="password" name="password" required></label>
        <label>Re-Password: <input type="password" name="repassword" required></label>
        <button type="submit">Sign Up</button>
      </form>
      <p>Already have an account? <a href="/login">Login here</a></p>
    `)
  );
});

// handle signup form submission
app.post("/signup", (req, res) => {
  const { firstName, lastName, email, birthdate, password, repassword } = req.body;

  // check if all fields are filled
  if (!firstName || !lastName || !email || !birthdate || !password || !repassword) {
    return res.send(layout("Error", "<p>All fields are required. <a href='/signup'>Try again</a></p>"));
  }

  // check if passwords match
  if (password !== repassword) {
    return res.send(layout("Error", "<p>Passwords do not match. <a href='/signup'>Try again</a></p>"));
  }

  // check if user already exists
  if (users[email]) {
    return res.send(layout("Error", "<p>User already exists. <a href='/login'>Login</a></p>"));
  }

  // save new user
  users[email] = { firstName, lastName, email, birthdate, password };
  res.send(layout("Signup Successful", "<p>Signup successful! You can now <a href='/login'>log in</a>.</p>"));
});

// Login Page
app.get("/login", (req, res) => {
  res.send(
    layout("Login", `
      <h1>Login</h1>
      <form method="POST" action="/login">
        <label>Email: <input type="email" name="email" required></label>
        <label>Password: <input type="password" name="password" required></label>
        <button type="submit">Log In</button>
      </form>
      <p>Don’t have an account? <a href="/signup">Signup here</a></p>
    `)
  );
});

// handle login form submission
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // check if fields are filled
  if (!email || !password) {
    return res.send(layout("Error", "<p>Email and Password required. <a href='/login'>Try again</a></p>"));
  }

  const user = users[email]; // find user
  if (!user) {
    return res.send(layout("Error", "<p>No user found with that email. <a href='/signup'>Signup</a></p>"));
  }

  // check password
  if (user.password !== password) {
    return res.send(layout("Error", "<p>Password is incorrect. <a href='/login'>Try again</a></p>"));
  }

  // save user session
  req.session.user = {
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  };

  res.send(
    layout("Login Success", `
      <p>Login successful. Welcome <b>${user.firstName} ${user.lastName}</b>!</p>
      <p><a href="/profile">Go to Profile</a></p>
    `)
  );
});

// Profile page (protected)
app.get("/profile", (req, res) => {
  if (!req.session.user) {
    return res.send(layout("Unauthorized", "<p>You must be logged in. <a href='/login'>Login</a></p>"));
  }
  res.send(
    layout("Profile", `
      <h1>Profile</h1>
      <p><b>Name:</b> ${req.session.user.firstName} ${req.session.user.lastName}</p>
      <p><b>Email:</b> ${req.session.user.email}</p>
      <a href="/logout">Logout</a>
    `)
  );
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send(layout("Error", "<p>Error logging out</p>"));
    }
    res.send(layout("Logout", "<p>You have been logged out. <a href='/login'>Login again</a></p>"));
  });
});

// Start server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
