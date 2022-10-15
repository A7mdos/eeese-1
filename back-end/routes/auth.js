const express = require("express");
const bcrypt = require("bcrypt");

const db = require("../models/database");
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


module.exports = router;
