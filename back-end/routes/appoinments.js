const express = require("express");
const { ObjectId } = require("mongodb");
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
  const enteredDoctorId = appointmentData.doctorId;
  const enteredCategory = appointmentData.category; // id + name
  const enteredTimeslot = appointmentData.timeslot; // num + str

  // Some validation should be added here

  const appointment = {
    patientId: new ObjectId(enteredId),
    doctorId: new ObjectId(enteredDoctorId),
    category: {
      id: new ObjectId(enteredCategory.id),
      name: enteredCategory.name,
    },

    timeslot: {
      num: enteredTimeslot.num,
      str: enteredTimeslot.str,
    },
  };

  await db.getDb().collection("appointments").insertOne(appointment);

  res.json({ msg: "Appointment added succesfully!", status: 1 });
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
