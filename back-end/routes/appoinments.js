const express = require("express");
const db = require("../models/database");

const router = express.Router();

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

    // Hardcoded (fix it later)
    timeslot: {
      num: 1,
      str: "8-9",
    },
  };

  await db.getDb().collection("appointments").insertOne({ appointment });

  res.json({ status: 1 });
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
