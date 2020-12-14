const express = require('express');
const router  = express.Router();
const Challenge = require('../models/Challenge.model');

/* GET home page */
router.get('/', (req, res, next) => {
  const userInSession = req.session.currentUser;
  res.render('index', {userInSession});
});

router.get('/explore', (req, res, next) => {
  const userInSession = req.session.currentUser;
  Challenge.find()
  .then(allChallenges => {
    res.render('explore', {userInSession, allChallenges});
  })
  .catch(error => {
    next(error);
  });
});

module.exports = router;
