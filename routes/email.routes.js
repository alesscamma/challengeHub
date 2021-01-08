const nodemailer = require('nodemailer'); 
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const templates = require('../templates/template');

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
    html: templates.template(message, user),
  })
  .then(() => res.render('invite', {successMessage: 'Invitation sent!'}))
  .catch(error => console.log(error));
});

module.exports = router;