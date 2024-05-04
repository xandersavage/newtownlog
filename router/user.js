const express = require("express");
const User = require("../models/user");
const router = express.Router();

// GET ALL USERS
router.get("/users", async (req, res) => {
  try {
    const user = await User.find({});
    res.send(user);
  } catch (error) {
    res.status(500).send();
  }
});

// CREATE A NEW USER
router.post("/users/register", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    //res.status(201).send(user);
    // Render the Pug template with data
    res.status(201).render("form-response-good", { user });
  } catch (error) {
    res.status(400).render("form-response-bad");
  }
});
// _id.toHexString()
// GET A USER
router.get("/getemployee", async (req, res) => {
  const _id = req.query.id;
  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send("employee not found");
    }
    res.json(user);
  } catch (e) {
    res.status(500).send("server error");
  }
});

module.exports = router;
