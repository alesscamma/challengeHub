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
  const userId = userInSession ? userInSession._id : null;
  Challenge.find({ user: { $nin: userId } })
  .then(allChallenges => {
    res.render('explore', {allChallenges, userInSession});
  })
  .catch(error => {
    next(error);
  });
});

router.get('/invite-friends', (req, res, next)=>{
  const userInSession = req.session.currentUser;
  res.render('invite', {userInSession});
});

module.exports = router;
