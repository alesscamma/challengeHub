const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  const userInSession = req.session.currentUser;
  res.render('index', {userInSession});
});

module.exports = router;
