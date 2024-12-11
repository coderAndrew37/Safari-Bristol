const mongoose = require("mongoose");
const Joi = require("joi");

// Define Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 255 },
  category: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  description: { type: String, required: true, minlength: 10 },
  priceCents: { type: Number, required: true }, // Store price in cents for consistency
  rating: {
    stars: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },
});

// Validation Schema for Joi
function validateProduct(product) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    category: Joi.string().required(),
    slug: Joi.string().required(),
    image: Joi.string().uri().required(),
    description: Joi.string().min(10).required(),
    priceCents: Joi.number().required(),
    rating: Joi.object({
      stars: Joi.number().min(0).max(5).default(0),
      count: Joi.number().min(0).default(0),
    }).default(),
  });

  return schema.validate(product);
}

// Export the model
const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
module.exports = { Product, validateProduct };
