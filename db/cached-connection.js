const mongoose = require("mongoose");

let cachedConnection = null;

// Function to connect to the MongoDB database
exports.connectToDatabase = async () => {
  if (cachedConnection) {
    // Check if connection is already established and open
    if (cachedConnection.readyState === 1) {
      console.log("=> using existing database connection");
      return cachedConnection;
    }

    // If connection was closed, remove it from cache
    cachedConnection = null;
  }

  // If no connection or closed connection, create a new one
  console.log("=> using new database connection");

  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false
    });

    cachedConnection = connection;
    return connection;
  } catch (error) {
    console.error("Error connecting to database:", error);
    //throw error; // Re-throw the error for further handling (optional)
  }
};

module.exports = connectToDatabase;
