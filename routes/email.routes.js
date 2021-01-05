
const nodemailer = require('nodemailer'); 
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User.model');



router.post('/send-email', (req, res, next) => {
  let { email, subject, message } = req.body;
  let transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: { 
      user: 'getchallenged42@gmail.com', 
      pass: 'Challengeapp!'
    }
  });
  transporter.sendMail({
    from: '"ChallengeHub " <getchallenged42@gmail.com>',
    to: email, 
    subject: subject, 
    text: message,
    html: `<h1>Here is your Message</h1><p>${message}</p>`
  })
  .then(info => res.render('index'))
  .catch(error => console.log(error));
});


module.exports = router;