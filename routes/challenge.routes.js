const express = require('express');
const router  = express.Router();
const Challenge = require('../models/Challenge.model');
const hbs          = require('hbs');

router.get('/', (req, res, next) => {
  const userInSession = req.session.currentUser;
  Challenge.find({ user: userInSession._id })
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
    let format = challenge.timeFormat; //to get from DB challenge.timeFormat
    let timeNumb = challenge.timeNumber; // given from Db 
    
     duration= (format, timeNumb) =>  {
      let number = 0;
      if (format == 'Days'){
         number = 1;
      }
      else if (format == 'Weeks'){
           number = 7;
      }
      else if (format == 'Months'){
           number = 30;
      }
        else if (format == 'Years'){
           number = 365;
      }
      return timeNumb * number;
    };
    
    console.log(duration(format, timeNumb));
    
    
    
    function addDays(StartDate, duration) {
      var endDate = new Date(StartDate);
      endDate.setDate(endDate.getDate() + duration);
      return endDate;
    }
    console.log(addDays(challenge.startDate, 14));
    
    let today= new Date(2020, 12, 24); 
    
    
    const startDate = new Date(2020, 12, 12); //from db
    const endDate = new Date(2020, 12, 25);
    
    
    let checkDate = (startDate, today, endDate) => {
      const oneDay = 24 * 60 * 60 * 1000;
      if (startDate > today ){
        return Math.round(Math.abs((startDate - endDate) / oneDay));
      } else{
        return Math.round(Math.abs((today - endDate) / oneDay));
      }
    };
    console.log(checkDate( startDate, today, addDays(startDate, duration(format, timeNumb))));
    
    
    
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
  .then(challenge => {
    res.render('challenge/challenge', {challenge});
  })
  .catch(error => {
    console.log(error);
    res.render('challenge/create-challenge', {errorMessage: error});
  });
});

router.post('/:challengeId/delete', (req, res, next) => {
  Challenge.findByIdAndDelete(req.params.challengeId)
  .then(() => {
      res.redirect('/challenges');
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

router.get('/:challengeId/join', (req, res, next) => {
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
    res.render('challenge/copy-challenge', {challenge});
  })
  .catch(error => {
    next(error);
  });
});

router.post('/:challengeId/join', (req, res, next) => {
  const { category, timeNumber, timeFormat, goal, startDate, description, resources, thoughts, milestones} = req.body;
  const user = req.session.currentUser._id;

  Challenge.create({ user, category, timeNumber, timeFormat, goal, startDate, description, resources, thoughts, milestones })
  .then(challenge => {
    res.render('challenge/challenge', {challenge});
  })
  .catch(error => {
    console.log(error);
    res.render('challenge/create-challenge', {errorMessage: error});
  });
});



module.exports = router;
