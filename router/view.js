const express = require("express");
const router = express.Router();
const User = require("../models/user");
const connectToDatabase = require("../db/cached-connection");

// router.get("/employee/:id", async (req, res) => {
//   const user = await User.findById(req.params.id);

//   res.status(200).render("employeeinfo", user);
// });

router.get("/newemployee", (req, res) => {
  res.status(200).render("newemployee");
});

router.get("/donotshare", async (req, res) => {
  try {
    const db = await connectToDatabase();

    const user = await User.find({});
    // const user = await db.Collection("users").find({});
    // console.log(user);
    res.status(200).render("admin.pug", { user });
  } catch (error) {
    res.status(500).render({ message: "error retrieving users" });
  }
});

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
