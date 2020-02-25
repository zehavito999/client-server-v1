var express = require("express");
var path = require("path");
var nodeMailer = require("nodemailer");
var bodyParser = require("body-parser");
var db = require("./db.js");
db.init();
var app = express();
var http = require('http');
var url = require('url');

var transporter = nodeMailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "clientserver2020@gmail.com",
    pass: "Qwerty!234"
  }
});

app.use(express.static("src"));


app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.post("/ContactUs", function(req, res) {
  
  var mailOptions = {
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
  res.sendFile(path.join(__dirname + "/data.html"));
});

app.get('/forgotPSW', function(req,res){
  res.sendFile(path.join(__dirname + "/forgotPSW.html"))
});

app.get('/', function(req,res){
  res.redirect('/login');
});

app.get("/login", function(req, res) {
  res.sendFile(path.join(__dirname + "/log_in.html"));
});

app.post("/login", (req, res) => {
  let useremail = req.body.email;
  console.log(req.body.email);
  let userpassword = req.body.psw;
  console.log(req.body.psw);
  var data = {
    email: useremail,
    password: userpassword
  }
  isOKResult = db.isUserOK(useremail, req.body.psw);

  isOKResult.then(result => {
    if (result) {
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify(data));
    } else {
      res.writeHead(400);
      res.end();
    }
  });
});

app.get("/signup", function(req, res) {
  res.sendFile(path.join(__dirname + "/signup.html"));
});



app.post("/signup", (req, res) => {
  let user = db.addUser(req.body.email, req.body.password);
  var mailOptions = {
    // should be replaced with real recipient's account
    to: req.body.email,
    subject: "Welcome on bord",
    text: "We are happy you join us!"
  };
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message %s sent: %s", info.messageId, info.response);
  });
  console.log(req);
  user.then(result => {
    if (result) {
      res.redirect("/data");
    } else {
      res.writeHead(400);
      res.end();
    }
  });
});

app.post("/forget", (req, res) => {
  let passwordPromise = db.getPassword(req.body.email);

//  let mailPromise =  new Promise(function (resolve, reject) {
  
  return passwordPromise.then(result => {

    if (result) {
      console.log(result)
        var mailOptions = {
          to: req.body.email,
          subject: "A password reminder",
          text: "your password is:" + result
        };
       
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log(error);
            }
            console.log("Message %s sent: %s", info.messageId, info.response);
            
         });
         return res.status(200).json({LastChangeTime: "temp"});  
    }
    return res.status(500).json({LastChangeTime: "temp1"});  

  });
});





app.get("/data", function(req, res) {
  res.sendFile(path.join(__dirname + "/data.html"));
});


app.post("/dataTable", (req, res) => {
      loginUser= req.body.user;
      db.importData(loginUser, res);
  });

app.get("/ContactUs", function(req, res) {
  res.sendFile(path.join(__dirname + "/contactUs.html"));
});


const port = process.env.PORT || 8081;
app.listen(port, () => console.log(`Server started at port: ${port}!`));
