const express = require("express");

const db = require("./models/database");
const authRoutes = require("./routes/auth");
const appointments = require("./routes/appoinments");
const doctors = require("./routes/doctors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(authRoutes);
app.use(appointments);
app.use(doctors);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const IPV4 = "192.168.43.170";
const PORT = 8081;
db.connectToDatabase().then(function () {
  app.listen(PORT, IPV4, () => {
    console.log(`Server is running on http://${IPV4}:${PORT} ...`);
  });
});
