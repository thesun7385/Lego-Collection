const moongose = require("mongoose");
const Schema = moongose.Schema;
require("dotenv").config();
const bcrypt = require("bcryptjs");

// Create a schema for the userSchema
const userSchema = new Schema({
  userName: {
    type: String,
    unique: true, // Ensure unique username
    required: true, // Username is required
  },
  password: {
    type: String,
    required: true, // Password is required
  },
  email: {
    type: String,
    required: true, // Email is required
  },
  loginHistory: [
    {
      dateTime: {
        type: Date,
        required: true,
      },
      userAgent: {
        type: String,
        required: true,
      },
    },
  ],
});

//Define User variable
let User;

// Export the function to initialize the schema
function initialize() {
  return new Promise(async (resolve, reject) => {
    try {
      let db = await moongose.createConnection(process.env.MONGODB);
      db.on("error", (err) => {
        reject(err); // reject the promise with the provided error
      });
      db.once("open", () => {
        User = db.model("users", userSchema);
        console.log("Mongo DB successfully connected !!");
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
}

// Create registerUser(userData)
function registerUser(userData) {
  return new Promise(async (resolve, reject) => {
    if (userData.password !== userData.password2) {
      reject("Passwords do not match");
      return;
    }

    try {
      // Hash the password
      const handle = await bcrypt.hash(userData.password, 10);

      // Create a new user with the hashed password
      let newUser = new User({
        userName: userData.userName,
        password: handle,
        email: userData.email,
        loginHistory: [],
      });

      // Persist the user
      await newUser.save();
      resolve();
    } catch (err) {
      if (err.code === 11000) {
        reject("User Name already taken");
      } else {
        reject(`There was an error creating the user: ${err}`);
      }
    }
  });
}

// Check users
function checkUser(userData) {
  return new Promise(async (resolve, reject) => {
    try {
      // Query the database for the user
      const user = await User.findOne({ userName: userData.userName });

      // Check if user exists
      if (!user) {
        reject(`Unable to find user: ${userData.userName}`);
        return;
      }

      // Compare the entered password with the hashed password in the database
      const passwordMatch = await bcrypt.compare(
        userData.password,
        user.password
      );

      // Check if passwords match
      if (!passwordMatch) {
        reject(`Incorrect Password for user: ${userData.userName}`);
        return;
      }
      // Update login history
      if (user.loginHistory.length === 8) {
        user.loginHistory.pop();
      }

      // Unshift new login history
      user.loginHistory.unshift({
        dateTime: new Date().toString(),
        userAgent: userData.userAgent,
      });

      // Update login history in the database
      const updateResult = await User.updateOne(
        { userName: user.userName },
        { $set: { loginHistory: user.loginHistory } }
      );

      // If update was successful, resolve with the user object
      resolve(user);
    } catch (err) {
      // Log the actual error for debugging purposes
      console.error("Error checking user:", err);

      // Reject with a more informative error message
      reject(`Error checking user: ${err.message || JSON.stringify(err)}`);
    }
  });
}

// Export moduile functions
module.exports = {
  initialize,
  registerUser,
  checkUser,
};
