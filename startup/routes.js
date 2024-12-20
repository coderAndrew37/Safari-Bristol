const products = require("../routes/products.js");
const auth = require("../routes/auth.js");
const cart = require("../routes/cart.js");
const passwordReset = require("../routes/passwordReset.js");
const contacts = require("../routes/contacts.js");
const newsletter = require("../routes/newsletter.js");
const orders = require("../routes/orders.js");
const deliveryOptions = require("../routes/deliveryOptions.js");
module.exports = function (app) {
  app.use("/api/products", products);
  app.use("/api/users", auth);
  app.use("/api/cart", cart);
  app.use("/api/password-reset", passwordReset);
  app.use("/api/contacts", contacts);
  app.use("/api/newsletter", newsletter); // Added the newsletter route
  app.use("/api/orders", orders);
  app.use("/api/delivery-options", deliveryOptions); // Added the delivery options route
};
