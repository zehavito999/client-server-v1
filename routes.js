var  express = require("express");
var  path = require('path');
var  nodeMailer = require('nodemailer');
var  bodyParser = require('body-parser');

var app = express();

app.use(express.static('src'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.post('/send_mail', function (req, res) {
  var transporter = nodeMailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
          // should be replaced with real sender's account
          user: 'clientserver2020@gmail.com',
          pass: 'Qwerty!234'
      }
  });
  var mailOptions = {
      // should be replaced with real recipient's account
      to: 'clientserver2020@gmail.com',
      subject: req.body.fname + ' ' + req.body.lname + ' ' + req.body.email,
      text: req.body.comment
  };
  console.log("%s",req.body.comment);
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message %s sent: %s', info.messageId, info.response);
  });
  res.sendFile(path.join(__dirname + '/sucss.html'));
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/log_in.html'));
});

app.get('/signup', function(req, res) {
    res.sendFile(path.join(__dirname + '/signup.html'));
});

app.get('/ContactUs', function(req, res) {
    res.sendFile(path.join(__dirname + '/ContactUs.html'));
});

const port = process.env.PORT || 8081;
app.listen(port,() => console.log("Server started at port: %s", port))
