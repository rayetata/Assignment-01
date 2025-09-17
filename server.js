const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Serve HTML, CSS, JS
app.use(express.static(__dirname));

// Serve images folder
app.use('/images', express.static(path.join(__dirname, 'images')));

// Serve HTML on root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "randomUserApi.html"));
});

// API endpoint
app.get("/api", (req, res) => {
  let count = parseInt(req.query.results) || 1;
  if (count < 1) count = 1;
  if (count > 1000) count = 1000;

  const firstNames = ["Princess","Dianne","Nicole","John","Jane","Tyron","Alice","Bob","Phoenix","Titus","Phoebe","Mary","Tom","Michael","Sarah","David","Emma","Chris","Olivia","Daniel","Sophia","James","Mia","Robert","Emily"];
  const lastNames = ["Smith","Doe","Joe","Johnson","Knight","Velasquez","Summers","Marquis","Diamond","Emerald","Mercury","Zapanta","Brown","Taylor","Lee","Wilson","Anderson","Thomas","Jackson","White","Harris","Martin","Thompson","Garcia","Martinez"];
  const genders = ["male","female"];
  const countries = ["USA","Canada","UK","UAE","Japan","Chile","Poland","Finland","Uruguay","Africa","Lebanon","Egypt","Jerusalem","Italy","Rome","Greece","Iceland","China","Philippines","Australia"];

  const users = [];
  for (let i = 0; i < count; i++) {
    const gender = genders[Math.floor(Math.random()*genders.length)];
    const first = firstNames[Math.floor(Math.random()*firstNames.length)];
    const last = lastNames[Math.floor(Math.random()*lastNames.length)];
    const country = countries[Math.floor(Math.random()*countries.length)];

    users.push({
      name: { first, last },
      gender,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@example.com`,
      location: { street: { number: Math.floor(Math.random()*1000), name: "Main St" }, city: "City", country },
      phone: "123-456-7890",
      cell: "098-765-4321",
      dob: { date: "1990-01-01T00:00:00.000Z" },
      picture: { large: `/images/user${(i % 14) + 1}.jpg` } // cycle through 14  local images
    });
  }

  res.json({ results: users });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:3000`));
