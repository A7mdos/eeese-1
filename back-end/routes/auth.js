const express = require("express");
const bcrypt = require("bcrypt");

const db = require("../data/database");
const { ObjectId } = require("mongodb");

const router = express.Router();

router.get("/", function (req, res) {
  res.send("Welcome");
});

// router.get("/signup", function (req, res) {
//   let sessionInputData = req.session.inputData;

//   if (!sessionInputData) {
//     sessionInputData = {
//       hasError: false,
//       email: "",
//       confirmEmail: "",
//       password: "",
//     };
//   }

//   req.session.inputData = null;

//   res.render("signup", { inputData: sessionInputData });
// });

router.post("/signup", async function (req, res) {
  const patientData = req.body;

  const enteredEmail = patientData.email;
  const enteredPassword = patientData.password;

  const enteredName = patientData.name;
  const enteredPhone = patientData.phone;
  const enteredAge = patientData.age;
  const enteredGender = patientData.gender;

  const existingPatient = await db
    .getDb()
    .collection("patients")
    .findOne({ email: enteredEmail });

  if (existingPatient) {
    res.json({ msg: "Patient already exists", status: 0 });
    return;
  }

  const hashedPassword = await bcrypt.hash(enteredPassword, 12);

  const patient = {
    name: enteredName,
    email: enteredEmail,
    password: hashedPassword,
    phone: enteredPhone,
    gender: enteredGender,
    age: enteredAge,
  };

  await db.getDb().collection("patients").insertOne(patient);

  res.json({
    msg: "Patient created successfully!",
    patient: patient,
    status: 1,
  });
  return;
});

router.post("/login", async function (req, res) {
  const patientData = req.body;
  const enteredEmail = patientData.email;
  const enteredPassword = patientData.password;

  const existingPatient = await db
    .getDb()
    .collection("patients")
    .findOne({ email: enteredEmail });

  if (!existingPatient) {
    res.json({
      msg: "Couldn't log in - patient not registered!",
      status: 0,
    });
    return;
  }

  const passwordsAreEqual = await bcrypt.compare(
    enteredPassword,
    existingPatient.password
  );

  if (!passwordsAreEqual) {
    res.json({
      msg: "Couldn't log in - password is incorrect!",
      status: 0,
    });
    return;
  }

  existingPatient.id = existingPatient._id.toString();
  delete existingPatient._id;
  delete existingPatient.password;
  res.json({
    patient: existingPatient,
    status: 1,
  });
});

// router.post("/logout", function (req, res) {
//   req.session.user = null;
//   req.session.isAuthenticated = false;

//   res.redirect("/");
// });

router.get("/categories", async (req, res) => {
  const categories = await db.getDb().collection("categories").find().toArray();

  categories.forEach((category) => {
    category.id = category._id.toString();
    delete category._id;
  });

  res.json(categories);
});

router.post("/appointments", async (req, res) => {
  const appointmentData = req.body;

  const enteredId = appointmentData.patientId;
  const enteredCategoryId = appointmentData.category.id; 
  const enteredCategoryName = appointmentData.category.name; 
  const enteredDate = appointmentData.date;

  // Some validation should be added here 
  
  const appointment = {
    patientId: new ObjectId(enteredId),
    category: {
      id: new ObjectId(enteredCategoryId),
      name: enteredCategoryName,
    },
    date: enteredDate,
  };

  await db.getDb().collection("appointments").insertOne({ appointment });

  res.json({ status: 1 })
});

router.get("/appointments/:patientId", async (req, res) => {
  patientId = new ObjectId(req.params.patientId);

  const appointments = await db
    .getDb()
    .collection("appointments")
    .find({ patientId: patientId })
    .toArray();

  res.json(appointments);
});

module.exports = router;
