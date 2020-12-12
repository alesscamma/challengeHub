const express = require('express');
const router  = express.Router();
const Challenge = require('../models/Challenge.model');
const hbs          = require('hbs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const dom = new JSDOM(`<!DOCTYPE html><input type="checkbox" id="Education" name="category" value="Hello" >Education
<input type="checkbox" id="Sports" name="category" value="World" >Sports
<input type="checkbox" id="Arts" name="category" value="Arts">Arts
<input type="checkbox" id="Entertainment" name="category" value="Entertainment" >Entertainment
<input type="checkbox" id="Self-care" name="category" value="Self-care" >Self-care
<input type="checkbox" id="Health" name="category" value="Health" >Health
<input type="checkbox" id="Other" name="category" value="Other" >Other`);



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
  let {challengeId} = req.params;
  Challenge.findById(challengeId)
  .then(challenge => {
    console.log(dom.window.document.getElementById('Education').value);
    console.log(challenge.category);
    if ( dom.window.document.getElementById('Education').value == challenge.category){
      dom.window.document.getElementById('Education').setAttribute('checked', true);
    }
    else {
      dom.window.document.getElementById('Education').checked = false;
    }if ( dom.window.document.getElementById('Sports').value == challenge.category){
      dom.window.document.getElementById('Sports').setAttribute('checked', true);
    }
    else {
      dom.window.document.getElementById('Sports').checked = false;
    }if ( dom.window.document.getElementById('Arts').value == challenge.category){
      dom.window.document.getElementById('Arts').checked = true;
    }
    else {
      dom.window.document.getElementById('Arts').checked = false;
    }if ( dom.window.document.getElementById('Entertainment').value == challenge.category){
      dom.window.document.getElementById('Entertainment').checked = true;
    }
    else {
      dom.window.document.getElementById('Entertainment').checked = false;
    }
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
