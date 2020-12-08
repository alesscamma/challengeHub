const express = require('express');
const router  = express.Router();
const Challenge = require('../models/Challenge.model');

router.get('/', (req, res, next) => {
  Challenge.find(req.params.userId)
  .then(challengesFromDB => {
    res.render('challenge/challenge-list', {challengesFromDB});
  })
  .catch(error => {
    next(error);
  });
});

router.get('/new', (req, res, next) => {
  res.render('challenge/create-challenge');
});

router.get('/:challengeId', (req, res, next) => {
  Challenge.findById(req.params.challengeId)
  .then(challenge => {
    res.render('challenge/challenge', {challenge});
  })
  .catch(error => {
    next(error);
  });
});

router.post('/new', (req, res, next) => {
  const { category, timeNumber, timeFormat, goal } = req.body;
  const user = req.session.currentUser._id;
  console.log(user);

  Challenge.create({ user, category, timeNumber, timeFormat, goal })
  .then(() => {
    res.redirect('/');
  })
  .catch(error => {
    console.log(error);
    res.render('challenge/create-challenge', {errorMessage: error});
  });
});

router.post('/:challengeId/delete', (req, res, next) => {
  Challenge.findByIdAndDelete(req.params.challengeId)
  .then(() => {
      res.redirect('/');
  })
  .catch(error => {
      next(error);
  });
});

router.get('/:challengeId/edit', (req, res, next) => {
  Challenge.findById(req.params.challengeId)
  .then(challenge => {
      res.render('challenge/edit-challenge', {challenge});
  })
  .catch(error => {
      next(error);
  });
});

router.post('/:challengeId', (req, res, next) => {
  Challenge.findByIdAndUpdate(req.params.challengeId, req.body, {new: true})
  .then(() => {
      res.redirect('/');
  })
  .catch(error => {
      next(error);
  });
});

module.exports = router;
