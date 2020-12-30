const express = require('express');
const router  = express.Router();
const Challenge = require('../models/Challenge.model');
const hbs = require('hbs');

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
    let format = challenge.timeFormat; 
    let timeNumb = challenge.timeNumber; 
    
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
    
    
    function addDays(StartDate, duration) {
      var endDate = new Date(StartDate);
      endDate.setDate(endDate.getDate() + duration);
      return endDate;
    }
    
    let today= new Date(); 
    
    
    const startDate = new Date(challenge.startDate); //from db
    const endDate = addDays(challenge.startDate, duration(format, timeNumb));

    console.log(today);
    console.log(startDate);
    
    let checkDate = (startDate, today, endDate) => {
      const oneDay = 24 * 60 * 60 * 1000;
      if (startDate > today ){
        return Math.round(Math.abs((startDate - endDate) / oneDay));
      } else{
        return Math.round(Math.abs((today - endDate) / oneDay));
      }
    };
    console.log(checkDate( startDate, today, addDays(startDate, duration(format, timeNumb))));

    challenge.daysLeft = checkDate( startDate, today, addDays(startDate, duration(format, timeNumb)));
    
    
    res.render('challenge/challenge', {challenge});
  })
  .catch(error => {
    next(error);
  });
});


router.post('/new', (req, res, next) => {
  const { category, timeNumber, timeFormat, goal, startDate, description, resources, thoughts, milestones } = req.body;
  const user = req.session.currentUser._id;

  const milestonesForDB = milestones.map(milestone => {
    return {name: milestone, status: false};
  });

  Challenge.create({ user, category, timeNumber, timeFormat, goal, startDate, description, resources, thoughts, milestonesForDB })
  .then(challenge => {
    res.redirect(`/challenges/${challenge._id}`);
  })
  .catch(error => {
    next(error);
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

router.post('/:challengeId/count', (req, res, next) => {
  let {challengeId} = req.params;
  
  Challenge.findById(challengeId)
  .then(challenge => {
    let body = req.body['milestone'];
    let output = body.map(() => {
      return true;
    })
    let diff = challenge.milestonesForDB.length - body.length;
    if(diff > 0) {
      output.push(false);
    }

    console.log(output);
    console.log(output[0]);
    console.log(output[1]);
    console.log(output[2]);

    const outputValue = () => {
      for(let i=0; i<output.length; i++) {
        return output[i];
      }
    }
    
    let milestones = challenge.milestonesForDB.map(milestone => {
      return {status: outputValue(), name: milestone.name};
    })
    console.log('Milestones: ', milestones);
    console.log('...')
    let milestonesObj = {
      milestonesForDB: milestones
    };
    console.log('MilestonesObj: ', milestonesObj);
    console.log('...');
    Challenge.findByIdAndUpdate(challengeId, {$set: milestonesObj}, {new: true})
    .then(challenge => {
      res.redirect(`/challenges/${challenge._id}`)
    })
    .catch(error => {
      next(error);
    })
  })
  .catch(error => {
    next(error);
  });
});

router.get('/:challengeId/edit', (req, res, next) => {
  let {challengeId} = req.params;

  Challenge.findById(challengeId)
  .then(challenge => {
    hbs.registerHelper ("setChecked", function (value, category) {
        if (value.includes(category)) {
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
  const {challengeId} = req.params;
  const { category, timeNumber, timeFormat, goal, startDate, description, resources, thoughts, milestones } = req.body;

  const milestonesForDB = milestones.map(milestone => {
    return {name: milestone, status: false};
  });

  if (!req.body.category || !req.body.timeNumber || !req.body.timeFormat || !req.body.goal || !req.body.startDate) {
    res.render('error', {errorMessage: 'Please fill in all mandatory fields: category, time, start date and goal.', challengeId});
    return;

  } else {
    console.log(req.body);
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
  let {challengeId} = req.params;
  Challenge.findById(challengeId)
  .then(challenge => {
    hbs.registerHelper ("setChecked", function (value, category) {
      if (value.includes(category)) {
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

  const milestonesForDB = milestones.map(milestone => {
    return {name: milestone, status: false};
  });

  Challenge.create({ user, category, timeNumber, timeFormat, goal, startDate, description, resources, thoughts, milestonesForDB })
  .then(challenge => {
    res.redirect(`/challenges/${challenge._id}`);
  })
  .catch(error => {
    next(error);
  });
});


module.exports = router;
