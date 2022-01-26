const express  = require("express");
const bodyParser = require("body-parser");
const path = require ("path");
const nodemailer = require("nodemailer");

const { getMaxListeners } = require("process");
const PORT = process.env.PORT || 3000;
require ('dotenv').config();

const app = express();

//Middleware
app.use(express.static("public"));  
app.use(express.json());

//HOME

/* Redirect http to https */
app.get("*", function (req, res, next) {

  if ("https" !== req.headers["x-forwarded-proto"] && "production" === process.env.NODE_ENV) {
      res.redirect("https://" + req.hostname + req.url);
  } else {
      // Continue to other routes if we're not redirecting
      next();
  }

});

app.get('/index', (req, res) => {
    res.sendFile(__dirname + "/index.html"); 
});



app.post('/', (req, res)=> {
  console.log(req.body);

  const transporter = nodemailer.createTransport({
    host: "smtpout.secureserver.net",
    port: 465,
    secure: true, 
    auth: {
      user: process.env.EMAIL1,
      pass: process.env.PASS1
    }
  });

  const mailOptions = {
    from: req.body.email,
    to: 'info@starweb.services',
    subject: "Tienes un nuevo mensaje de un Cliente",
    text: req.body.message
  };

  transporter.sendMail(mailOptions, (error, info)=> {
    if(error){
      console.log(error);
      res.send('error');
    } else {
      console.log('Email sent: ' + info.response)
      res.send('success')
    }
  });

});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, () => {          
  console.log('Server has started succesfully');
});
