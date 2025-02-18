const express = require("express");
const bcrypt = require("bcryptjs");

const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());

const { userAuth } = require("./middlewares/auth");
const connectDB = require("./config/database");

const User = require("./model/user");
const validateSignupData = require("./utils/validation");
const jwt = require("jsonwebtoken");
app.use(express.json());
//to covert the json data to javascript object
app.post("/signup", async (req, res) => {
  try {
    //1 validation of the data should be the first thing
    validateSignupData(req);
    const { password, firstname, lastname, emailId } = req.body;
    //2 encrypt of the password
    const passwordHash = await bcrypt.hash(password, 10);

    //creating new instance of the user model
    const user = new User({
      firstname,
      lastname,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.send("signup success");
  } catch (err) {
    res.status(400).send("error saving the user: " + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isVaildPassword = user.validatePassword(password)
    if (isVaildPassword) {
      //create a jwt token
      const token = user.getJWT();
      //add the token to cookie and send the response back to the user
      // console.log(token);
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send("Login Successful!!");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = await req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("Error:" + err);
  }
});

app.get("/user", async (req, res) => {
  const emailId = req.body.emailId;
  try {
    const user = await User.find({ emailId: emailId });
    res.send(user);
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});
//Feed Api -get /feed to get all the user from the database
app.get("/feed", async (req, res) => {
  try {
    const user = await User.find({});
    res.send(user);
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});
app.patch("/user/:userId", async (req, res) => {
  const userID = req.params?.userId;
  const data = req.body;
  console.log(userID);
  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(data).every((k) => {
      ALLOWED_UPDATES.includes(k);
    });
    if (!isUpdateAllowed) {
      throw new Error("Update not Allowed");
    }

    const user = await User.findByIdAndUpdate({ _id: userID }, data, {
      runValidators: true,
    });

    res.send("data updated successfully");
  } catch (err) {
    res.status(400).send(`something went wrong, ${err.message}`);
  }
});
app.patch("/updateviaemail", async (req, res) => {
  const emailId = req.body.emailId;
  const data = req.body;
  // console.log(data)

  try {
    const user = await User.findOneAndUpdate({ emailId: emailId }, data, {
      runValidators: true,
    });
    res.send("data updated successfully");
  } catch (err) {
    res.status(400).send(`something went wrong, ${err.message}`);
  }
});
app.delete("/delete", async (req, res) => {
  const userID = req.body.userId;

  try {
    const user = await User.findByIdAndDelete(userID);
    res.send("data deleted successfully");
  } catch (err) {
    res.status(400).send(`something went wrong, ${err.message}`);
  }
});

connectDB()
  .then(() => {
    console.log("database connection succesful");
    // Start the server
    app.listen(3000, () => {
      console.log("Server started on port 3000");
    });
  })
  .catch((err) => {
    console.error("error in connecting database");
  });
