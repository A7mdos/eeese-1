const express = require("express");
const bcrypt = require("bcrypt");

const db = require("../data/database");

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
  const userData = req.body;

  const enteredEmail = userData.email;
  const enteredPassword = userData.password;

  const enteredName = userData.name;
  const enteredPhone = userData.phone;
  const enteredAge = userData.age;
  const enteredGender = userData.gender;

  //   if (
  //     !enteredEmail ||
  //     !enteredConfirmEmail ||
  //     !enteredPassword ||
  //     enteredPassword.trim().length < 6 ||
  //     enteredEmail !== enteredConfirmEmail ||
  //     !enteredEmail.includes("@")
  //   ) {
  //     req.session.inputData = {
  //       hasError: true,
  //       message: "Invalid input - please check your data.",
  //       email: enteredEmail,
  //       confirmEmail: enteredConfirmEmail,
  //       password: enteredPassword,
  //     };

  //     req.session.save(function () {
  //       res.redirect("/signup");
  //     });
  //     return;
  //   }

  const existingUser = await db
    .getDb()
    .collection("users")
    .findOne({ email: enteredEmail });

  if (existingUser) {
    res.json({ msg: "User already exists" });
    return;
  }

  const hashedPassword = await bcrypt.hash(enteredPassword, 12);

  const user = {
    name: enteredName,
    email: enteredEmail,
    password: hashedPassword,
    phone: enteredPhone,
    gender: enteredGender,
    age: enteredAge,
  };

  await db.getDb().collection("users").insertOne(user);

  res.json({ msg: "User created successfully!" });
  return;
});

router.post("/login", async function (req, res) {
  const userData = req.body;
  const enteredEmail = userData.email;
  const enteredPassword = userData.password;

  const existingUser = await db
    .getDb()
    .collection("users")
    .findOne({ email: enteredEmail });

  if (!existingUser) {
    res.json({
      msg: "Couldn't log in - user not registered!",
      status: 0,
    });
    return;
  }

  const passwordsAreEqual = await bcrypt.compare(
    enteredPassword,
    existingUser.password
  );

  if (!passwordsAreEqual) {
    res.json({
      msg: "Couldn't log in - password is incorrect!",
      status: 0,
    });
    return;
  }

  existingUser.id = existingUser._id.toString()
  delete existingUser._id
  delete existingUser.password
  res.json({
    user: existingUser,
    status: 1, 
  });
});

// router.post("/logout", function (req, res) {
//   req.session.user = null;
//   req.session.isAuthenticated = false;

//   res.redirect("/");
// });

module.exports = router;
