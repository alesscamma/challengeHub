
const nodemailer = require('nodemailer'); 
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User.model');

router.post('/send-email', (req, res, next) => {
  let { email, subject, message } = req.body;
  res.render('message', { email, subject, message });
});

module.exports = router;