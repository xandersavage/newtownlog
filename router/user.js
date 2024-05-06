const express = require("express");
const User = require("../models/user");
const router = express.Router();
const multer = require("multer");
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable
} from "firebase/storage";
const config = require("../firebase-config");

//Initialize a firebase application
initializeApp(config);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage();

// Setting up multer as a middleware to grab photo uploads
const upload = multer({ storage: multer.memoryStorage() });

// CREATE A NEW USER
router.post("/users/register", upload.single("avatar"), async (req, res) => {
  try {
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
      avatar: downloadURL // Store download URL in user document
    });

    await user.save();

    return res.status(200).render("form-response-good", { user });
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
    const user = await User.findOne({ userId: _id });
    if (!user) {
      return res.status(404).send("employee not found");
    }
    res.json(user);
  } catch (e) {
    res.status(500).send("server error");
  }
});

// GET ALL USERS
router.get("/users", async (req, res) => {
  try {
    const user = await User.find({});
    res.send(user);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
