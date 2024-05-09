const express = require("express");
const User = require("../models/user");
const uuid = require("uuid-v4");
const router = express.Router();
const multer = require("multer");
const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable
} = require("firebase/storage");
const config = require("../firebase-config");
const connectToDatabase = require("../db/cached-connection");

//Initialize a firebase application
initializeApp(config);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage();

// Setting up multer as a middleware to grab photo uploads
const upload = multer({ storage: multer.memoryStorage() });

// CREATE A NEW USER
router.post("/users/register", upload.single("avatar"), async (req, res) => {
  try {
    // Connect to the database
    const db = await connectToDatabase();

    const dateTime = giveCurrentDateTime();

    const storageRef = ref(
      storage,
      `files/${req.file.originalname + "       " + dateTime}`
    );

    // Create file metadata including the content type
    const metadata = {
      contentType: req.file.mimetype
    };

    // Upload the file in the bucket storage
    const snapshot = await uploadBytesResumable(
      storageRef,
      req.file.buffer,
      metadata
    );
    //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

    // Grab the public url
    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log("File successfully uploaded.");

    // Create user with other details
    const {
      name,
      age,
      email,
      phonenum,
      yearsofexp,
      wage,
      title,
      nextofKin,
      lenofcontract
    } = req.body;

    const user = new User({
      name,
      age,
      email,
      phonenum,
      yearsofexp,
      wage,
      title,
      nextofKin,
      lenofcontract,
      avatar: downloadURL, // Store download URL in user document
      userId: `NTL${uuid()
        .slice(-6)
        .toUpperCase()}` //Generate unique id with NTL prefix
    });

    // await user.save();
    const newUser = user.save(db); // Use Mongoose with the connection

    return res.status(200).render("form-response-good", { newUser });
  } catch (error) {
    console.error(error);
    res.status(500).render("form-response-bad", { error });
  }
});

const giveCurrentDateTime = () => {
  const today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date + " " + time;
  return dateTime;
};

// GET A USER
router.get("/getemployee", async (req, res) => {
  const _id = req.query.id;
  try {
    // Connect to the database
    const db = await connectToDatabase();
    // const user = await User.findOne({ userId: _id });
    const user = await db.Collection("users").findOne({ userId: _id });
    console.log("The user is: ", user);
    if (!user) {
      return res.status(404).send("employee not found");
    }
    res.json(user);
  } catch (e) {
    res.status(500).send("server error");
  }
});

// GET ALL USERS
// router.get("/users", async (req, res) => {
//   try {
//     const user = await User.find({});
//     res.send(user);
//   } catch (error) {
//     res.status(500).send();
//   }
// });

// Route to update user data (PATCH request)
router.post("/employee/:id", upload.single("avatar"), async (req, res) => {
  try {
    // Connect to the database
    const db = await connectToDatabase();
    let downloadURL;
    if (req.file) {
      // Handle image uploads
      const dateTime = giveCurrentDateTime();

      const storageRef = ref(
        storage,
        `files/${req.file.originalname + "       " + dateTime}`
      );

      // Create file metadata including the content type
      const metadata = {
        contentType: req.file.mimetype
      };

      // Upload the file in the bucket storage
      const snapshot = await uploadBytesResumable(
        storageRef,
        req.file.buffer,
        metadata
      );
      //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

      // Grab the public url
      downloadURL = await getDownloadURL(snapshot.ref);

      console.log("File successfully uploaded.");
    }
    // Update the rest fields
    const userId = req.params.id;
    const updateData = req.body; // Object containing updated fields

    // Find the user by ID
    const user = await User.findById(userId);
    // const user = await db.Collection("users").findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update specific fields based on the request body
    user.name = updateData.name ? updateData.name : user.name;
    user.email = updateData.email ? updateData.email : user.email;
    user.age = updateData.age ? updateData.age : user.age;
    user.phonenum = updateData.phonenum ? updateData.phonenum : user.phonenum;
    user.yearsofexp = updateData.name ? updateData.yearsofexp : user.yearsofexp;
    user.wage = updateData.wage ? updateData.wage : user.wage;
    user.lenofcontract = updateData.lenofcontract
      ? updateData.lenofcontract
      : user.lenofcontract;
    user.title = updateData.title ? updateData.title : user.title;
    user.avatar = downloadURL ? downloadURL : user.avatar;

    // Save the updated user document
    // const updatedUser = await user.save();
    await user.save(db);

    res.json({ message: "User data updated successfully" });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
