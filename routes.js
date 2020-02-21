var express = require("express");
var path = require("path");
var nodeMailer = require("nodemailer");
var bodyParser = require("body-parser");
var db = require("./db.js");
db.init();
var app = express();

app.use(express.static("src"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/send_mail", function(req, res) {
  var transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      // should be replaced with real sender's account
      user: "clientserver2020@gmail.com",
      pass: "Qwerty!234"
    }
  });
  var mailOptions = {
    // should be replaced with real recipient's account
    to: "clientserver2020@gmail.com",
    subject: req.body.fname + " " + req.body.lname + " " + req.body.email,
    text: req.body.comment
  };
  console.log("%s", req.body.comment);
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message %s sent: %s", info.messageId, info.response);
  });
  res.sendFile(path.join(__dirname + "/sucss.html"));
});

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname + "/log_in.html"));
});

app.post("/", (req, res) => {
  let email = req.body.email;

  authResultPromise = db.isUserAuthenticate(email, req.body.password);

  authResultPromise.then(result => {
    if (result) {
      res.redirect("/data");
    } else {
      res.sendFile(path.join(__dirname + "/worngPassOrEmail.html"));
    }
  });
});

app.get("/signup", function(req, res) {
  res.sendFile(path.join(__dirname + "/signup.html"));
});

app.get("/data", function(req, res) {
  res.sendFile(path.join(__dirname + "/data.html"));
});

app.post("/signup", (req, res) => {
  let userPromise = db.addNewUser(req.body.email, req.body.password);
  console.log(req);
  userPromise.then(result => {
    if (result) {
      res.redirect("/data");
    } else {
      res.sendFile(path.join(__dirname + "/userExist.html"));
    }
  });
});
//to change
app.get("/dataTable", (req, res) => {
      data = db.fetchData();
  
      data.then(result => {
        res.json(result);
      });
  });

app.get("/ContactUs", function(req, res) {
  res.sendFile(path.join(__dirname + "/ContactUs.html"));
});

const port = process.env.PORT || 8081;
app.listen(port, () => console.log(`Server started at port: ${port}!`));
