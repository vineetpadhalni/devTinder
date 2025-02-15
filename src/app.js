const express = require("express");
const app = express();

// Route for the root path ("/")
app.get("/", (req, res) => {
  res.send("hello from the dashboard");
});

// Route for "/test2"
app.get("/test2", (req, res) => {
  res.send("hello from the server");
});

// Route for "/test3"
app.get("/test3", (req, res) => {
  res.send("hello from test3");
});
app.get("/test4", (req, res) => {
    res.send("hello from test4");
  });

// Start the server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});