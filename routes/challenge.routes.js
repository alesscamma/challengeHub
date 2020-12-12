const express = require('express');
const router  = express.Router();
const Challenge = require('../models/Challenge.model');
const hbs          = require('hbs');



router.get('/', (req, res, next) => {
  const userInSession = req.session.currentUser;
  console.log(userInSession);
  Challenge.find(req.params.userId)
  .then(challengesFromDB => {
    res.render('challenge/challenge-list', {challengesFromDB, userInSession});
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
  const { category, timeNumber, timeFormat, goal, startDate, description, resources, thoughts, milestones} = req.body;
  const user = req.session.currentUser._id;
  console.log(user);

  Challenge.create({ user, category, timeNumber, timeFormat, goal, startDate, description, resources, thoughts, milestones })
  .then(() => {
    res.redirect('/challenges');
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
  let {challengeId} = req.params;

  Challenge.findById(challengeId)
  .then(challenge => {
    hbs.registerHelper ("setChecked", function (value, currentValue) {
      if (value == currentValue) {
         return "checked";
      } else {
         return "";
      }
   });
      res.render('challenge/edit-challenge', {challenge});
  })
  .catch(error => {
      next(error);
  });
});

router.post('/:challengeId/edit', (req, res, next) => {
  let {challengeId} = req.params;
  Challenge.findByIdAndUpdate(challengeId, req.body, {new: true})
  .then(() => {
      res.redirect('/challenges');
  })
  .catch(error => {
      next(error);
  });
});

module.exports = router;
