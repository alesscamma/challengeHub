const nodemailer = require('nodemailer'); 
  
  
let mailTransporter = nodemailer.createTransport({ 
    service: 'gmail', 
    auth: { 
        user: 'getchallenged42@gmail.com', 
        pass: 'Challengeapp!'
    } 
}); 
  
let mailDetails = { 
    from: 'getchallenged42@gmail.com', 
    to: 'alexcamma@gmail.com', 
    subject: 'Test mail', 
    text: 'Node.js testing mail '
}; 
  
mailTransporter.sendMail(mailDetails, function(err, data) { 
    if(err) { 
        console.log('Error Occurs'); 
    } else { 
        console.log('Email sent successfully'); 
    } 
}); 

router.post('/send-email', (req, res, next) => {
  let { email, subject, message } = req.body;
  res.render('message', { email, subject, message });
});

module.exports = app;