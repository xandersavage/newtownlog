const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/employee/:id", async (req, res) => {
  const user = await User.findById(req.params.id);

  res.status(200).render("employeeinfo", user);
});

router.get("/newemployee", async (req, res) => {
  res.status(200).render("newemployee");
})

// Route for static pages (assuming it's also in the public directory)
router.get("/about", (req, res) => {
  res.sendFile("about-us.html", { root: "public" });
});

router.get("/", (req, res) => {
  res.sendFile("index.html", { root: "public" });
});

router.get("/contact", (req, res) => {
  res.sendFile("contact-us.html", { root: "public" });
});

module.exports = router;