const Joi = require("joi");
const mongoose = require("mongoose");

// Define Delivery Option Schema
const deliveryOptionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true, // Ensure each delivery option has a unique ID
  },
  deliveryDays: {
    type: Number,
    required: true,
  },
  priceCents: {
    type: Number,
    required: true,
  },
});

// Define Joi validation schema for Delivery Options
const deliveryOptionValidationSchema = Joi.object({
  id: Joi.string().required(),
  deliveryDays: Joi.number().required(),
  priceCents: Joi.number().required(),
});

// Validate delivery option data
deliveryOptionSchema.statics.validate = function (data) {
  return deliveryOptionValidationSchema.validate(data);
};

// Create and export the model
const DeliveryOption =
  mongoose.models.DeliveryOption ||
  mongoose.model("DeliveryOption", deliveryOptionSchema);
module.exports = DeliveryOption;
