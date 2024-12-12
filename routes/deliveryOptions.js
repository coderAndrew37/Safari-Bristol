const express = require("express");
const DeliveryOption = require("../models/deliveryOption");
const router = express.Router();

// Add new delivery option
router.post("/", async (req, res) => {
  const { error } = DeliveryOption.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const option = new DeliveryOption(req.body);
    await option.save();
    res
      .status(201)
      .json({ message: "Delivery option added successfully", option });
  } catch (err) {
    console.error("Error adding delivery option:", err);
    res.status(500).json({ error: "Failed to add delivery option" });
  }
});

router.get("/", async (req, res) => {
  try {
    const options = await DeliveryOption.find({});
    res.status(200).json(options);
  } catch (err) {
    console.error("Error fetching delivery options:", err);
    res.status(500).json({ error: "Failed to fetch delivery options" });
  }
});

module.exports = router;
