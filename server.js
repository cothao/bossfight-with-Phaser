const path = require("path");

const express = require("express");
const app = express();
app.use(express.static("/")); // allows access to files at this directory
app.use("/", express.static(path.join(__dirname, "./"))); //'/' sets up param for http requests, uses that directory and at that directory
app.use(express.static("static"));
app.use(express.static("static/js"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.listen(8080, () => {
  console.log(`listening on port ${8080}`);
});
