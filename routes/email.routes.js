const nodemailer = require('nodemailer'); 
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const templates = require('../templates/template');
var dotenv = require('dotenv');

router.get('/invite-friends', (req, res, next) => {
  const userInSession = req.session.currentUser;
  res.render('invite', {userInSession});
});

router.post('/invite-friends', (req, res, next) => {
  const user = req.session.currentUser;
  let { email, message } = req.body;
  let subject = `Invitation for you from ${user.username} - join Challenge Hub today!`;
  let transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: { 
      user: 'getchallenged42@gmail.com', 
      pass: process.env.EMAILPW    }
  });

  transporter.sendMail({
    from: '"ChallengeHub " <getchallenged42@gmail.com>',
    to: email, 
    subject: subject, 
    text: message,
    html: templates.template(message, user),
  })
  .then(() => res.redirect('/invite-friends'))
  .catch(error => console.log(error));
});

module.exports = router;