const nodemailer = require('nodemailer'); 
  
  

  
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



module.exports = app;