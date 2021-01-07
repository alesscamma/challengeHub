const nodemailer = require('nodemailer'); 
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User.model');

router.post('/send-email', (req, res, next) => {
  const user = req.session.currentUser;
  let { email, message } = req.body;
  let subject = `Invitation for you from ${user.username} - join Challenge Hub today!`;
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
    html: `<h1>Your invitation</h1><p>${user.username} is inviting you to join Challenge Hub and start working on your goals! Here's their message for you: "${message}"</p><button><a href="https://challenge-hub.herokuapp.com/signup">Accept the invitation</a></button>`
  })
  .then(() => res.render('invite', {successMessage: 'Invitation sent!'}))
  .catch(error => console.log(error));
});

module.exports = router;