const express = require("express");
const { ObjectId } = require("mongodb");
const db = require("../models/database");
const router = express.Router();

router.get("/doctors", async (req, res) => {
  const doctors = await db.getDb().collection("doctors").find().toArray();

  res.json(doctors);
});

router.get("/doctors/:categoryId", async (req, res) => {
  const categoryId = new ObjectId(req.params.categoryId);

  const doctors = await db
    .getDb()
    .collection("doctors")
    .find({ categoryId: categoryId })
    .toArray();

  res.json(doctors);
});

router.get("/timeslots", async (req, res) => {
    const slots = await db
    .getDb()
    .collection("timeslots")
    .find()
    .toArray();

  res.json(slots);

});

module.exports = router;
