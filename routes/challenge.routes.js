const express = require('express');
const router  = express.Router();
const Challenge = require('../models/Challenge.model');
const hbs          = require('hbs');


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
  const { category, timeNumber, timeFormat, goal, startDate} = req.body;
  const user = req.session.currentUser._id;
  console.log(user);

  Challenge.create({ user, category, timeNumber, timeFormat, goal, startDate })
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
  //console.log('====>',req.params)
  let {challengeId} = req.params;
  Challenge.findById(challengeId)
  .then(challenge => {
    hbs.registerHelper ("setChecked", function (value, currentValue) {
      // if ( value === currentValue) {
      //   console.log(currentValue);
      //    return "checked";
      // } else if(value === undefined){
      //    return "";
      // }else{
      //   return "";
      // }
      if (value == undefined) return "";
      return value == currentValue ? 'checked' : "";
    });
      res.render('challenge/edit-challenge', {challenge});
  })
  .catch(error => {
      next(error);
  });
});

router.post('/:challengeId/edit', (req, res, next) => {
  let {challengeId} = req.params;
  console.log('DAina is mad', req.body);
  Challenge.findByIdAndUpdate(challengeId, req.body, {new: true})
  .then(() => {
      res.redirect('/challenges');
  })
  .catch(error => {
      next(error);
  });
});

module.exports = router;
