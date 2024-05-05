const express = require("express");
const User = require("../models/user");
const router = express.Router();
const multer = require("multer");
const admin = require("firebase-admin"); // Firebase Admin SDK

// Initialize Firebase app
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY); // Replace with your service account file

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "newtownlog.appspot.com"
  });
}

const bucket = admin.storage().bucket(); // Reference to your Firebase Storage bucket

const upload = multer({ dest: "/tmp" }); // Adjust path as needed

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
router.post("/users/register", upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const file = req.file;
    const fileName = `${Date.now()}-${file.originalname}`; // Generate unique filename

    const filePath = `newtownlog-avatar/${fileName}`; // Adjust path as needed within your bucket

    const uploadStream = bucket.file(filePath).createWriteStream({
      metadata: {
        contentType: file.mimetype // Set content type based on uploaded file
      }
    });

    const uploadPromise = new Promise((resolve, reject) => {
      uploadStream.on("error", error => reject(error));
      uploadStream.on("finish", () => resolve(filePath));
      file.stream.pipe(uploadStream);
    });

    const uploadedFilePath = await uploadPromise;

    const downloadUrl = await bucket.file(uploadedFilePath).getSignedUrl({
      action: "read",
      expires: "03-09-2450" // Adjust expiration as needed
    });

    const {
      name,
      age,
      email,
      phonenum,
      yearsofexp,
      title,
      wage,
      nextofKin,
      lenofcontract
    } = req.body;

    const user = new User({
      name,
      age,
      email,
      phonenum,
      yearsofexp,
      title,
      wage,
      nextofKin,
      lenofcontract,
      avatar: downloadUrl // Store download URL in user document
    });

    await user.save();

    res.status(200).render("form-response-good", { user });
  } catch (error) {
    console.error(error);
    res.status(500).render("form-response-bad", { error });
  }
});
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
