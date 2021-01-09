const express = require('express');
const router  = express.Router();
const Challenge = require('../models/Challenge.model');
const hbs = require('hbs');
require('../helpers/hbs-helpers')(hbs);

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
  const userInSession = req.session.currentUser;
  res.render('challenge/create-challenge', {userInSession});
});

router.get('/:challengeId', (req, res, next) => {
  const userInSession = req.session.currentUser;
  Challenge.findById(req.params.challengeId)
  .then(challenge => {
    let format = challenge.timeFormat; 
    let timeNumb = challenge.timeNumber;
    
    duration = (format, timeNumb) =>  {
      let number = 0;
      if (format == 'Days'){
        number = 1;
      } else if (format == 'Weeks'){
        number = 7;
      } else if (format == 'Months'){
        number = 30;
      } else if (format == 'Years'){
        number = 365;
      }
      return timeNumb * number;
    };
    
    function addDays(StartDate, duration) {
      var endDate = new Date(StartDate);
      endDate.setDate(endDate.getDate() + duration);
      return endDate;
    }
    
    let today= new Date(); 
    
    const startDate = new Date(challenge.startDate);
    const endDate = addDays(challenge.startDate, duration(format, timeNumb));
    
    let checkDate = (startDate, today, endDate) => {
      const oneDay = 24 * 60 * 60 * 1000;
      if (startDate > today ){
        return Math.round(Math.abs((startDate - endDate) / oneDay));
      } else{
        return Math.round(Math.abs((today - endDate) / oneDay));
      }
    };

    days = checkDate( startDate, today, addDays(startDate, duration(format, timeNumb)));

    if(challenge.milestonesForDB.length > 0) {
      let countChallenge = challenge.milestonesForDB.length;
      let trueMilestones = 0;
      for (let i=0; i<challenge.milestonesForDB.length; i++) {
        if(challenge.milestonesForDB[i].status == true) {
          trueMilestones++;
        }
      }
      let progress = (countChallenge, trueMilestones ) => {
        return Math.round((trueMilestones/countChallenge)*100) + "%";
      };
      
      progressPct = progress(countChallenge,trueMilestones);

    } else {
      progressPct = '0%';
    }

    let completedChallenge;
    if(progressPct == '100%') {
        completedChallenge = true;
    } else {
        completedChallenge = false;
    }

    let daysLeftAndProgressObj = {
      daysLeft: days,
      progressPercent: progressPct,
      challengeCompletion: completedChallenge
    };

    Challenge.findByIdAndUpdate(req.params.challengeId, {$set: daysLeftAndProgressObj}, {new: true})
    .then(challenge => {
      res.render('challenge/challenge', {challenge, userInSession});
    })
    .catch(error => {
      next(error);
    });
  })
  .catch(error => {
    next(error);
  });
});


router.post('/new', (req, res, next) => {
  const { category, timeNumber, timeFormat, goal, startDate, description, resources, thoughts, milestones } = req.body;
  const user = req.session.currentUser._id;
  const userInSession = req.session.currentUser;
  let milestonesForDB = [];

  if (!req.body.category || !req.body.timeNumber || !req.body.timeFormat || !req.body.goal || !req.body.startDate) {
    res.render('error', {errorMessageCreation: 'Please fill in all mandatory fields: category, time, start date and goal.', userInSession});
    return;
  } else {
    if(milestones) {
      milestonesForDB = milestones.map(milestone => {
        return {name: milestone, status: false};
      });
    }
  
    Challenge.create({ user, category, timeNumber, timeFormat, goal, startDate, description, resources, thoughts, milestonesForDB })
    .then(challenge => {
      res.redirect(`/challenges/${challenge._id}`);
    })
    .catch(error => {
      next(error);
    });
  }
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

router.post('/:challengeId/count', (req, res, next) => {
  let {challengeId} = req.params;

  const completedMilestonesArr = req.body.milestone;
  
  Challenge.findById(challengeId)
  .then(challenge => {

    let milestones = challenge.milestonesForDB.map(milestone => {
      return {
       name: milestone.name,
       status:  completedMilestonesArr.includes(milestone.name) ? true : false
      };
    });

    let milestonesObj = {
      milestonesForDB: milestones
    };

    Challenge.findByIdAndUpdate(challengeId, {$set: milestonesObj}, {new: true})
    .then(challenge => {
      res.redirect(`/challenges/${challenge._id}`);
    })
    .catch(error => {
      next(error);
    });
  })
  .catch(error => {
    next(error);
  });
});

router.get('/:challengeId/edit', (req, res, next) => {
  const userInSession = req.session.currentUser;
  let {challengeId} = req.params;

  Challenge.findById(challengeId)
  .then(challenge => {
    res.render('challenge/edit-challenge', {challenge, userInSession});
  })
  .catch(error => {
      next(error);
  });
});

router.post('/:challengeId/edit', (req, res, next) => {
  const {challengeId} = req.params;
  const { category, timeNumber, timeFormat, goal, startDate, description, resources, thoughts, milestones } = req.body;
  const userInSession = req.session.currentUser;

  let milestonesForDB = [];

  if(milestones) {
    milestonesForDB = milestones.map(milestone => {
      return {name: milestone, status: false};
    });
  }

  if (!req.body.category || !req.body.timeNumber || !req.body.timeFormat || !req.body.goal || !req.body.startDate) {
    res.render('error', {errorMessage: 'Please fill in all mandatory fields: category, time, start date and goal.', challengeId, userInSession});
    return;

  } else {
    Challenge.findByIdAndUpdate(challengeId, { category, timeNumber, timeFormat, goal, startDate, description, resources, thoughts, milestonesForDB }, {new: true})
    .then(challenge => {
      res.redirect(`/challenges/${challenge._id}`);
    })
    .catch(error => {
      next(error);
  });
  }
});

router.get('/:challengeId/join', (req, res, next) => {
  const userInSession = req.session.currentUser;
  let {challengeId} = req.params;
  Challenge.findById(challengeId)
  .then(challenge => {
    res.render('challenge/copy-challenge', {challenge, userInSession});
  })
  .catch(error => {
    next(error);
  });
});

router.post('/:challengeId/join', (req, res, next) => {
  const { category, timeNumber, timeFormat, goal, startDate, description, resources, thoughts, milestones} = req.body;
  const user = req.session.currentUser._id;
  const userInSession = req.session.currentUser;
  let milestonesForDB = [];

  if(milestones) {
    milestonesForDB = milestones.map(milestone => {
      return {name: milestone, status: false};
    });
  }

  if (!req.body.category || !req.body.timeNumber || !req.body.timeFormat || !req.body.goal || !req.body.startDate) {
    res.render('error', {errorMessageJoin: 'Please fill in all mandatory fields: category, time, start date and goal.', userInSession});
    return;
  } else {
    Challenge.create({ user, category, timeNumber, timeFormat, goal, startDate, description, resources, thoughts, milestonesForDB })
    .then(challenge => {
    res.redirect(`/challenges/${challenge._id}`);
  })
    .catch(error => {
    next(error);
  });
  }
});

module.exports = router;

