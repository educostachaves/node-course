var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

router.get('/', function(req, res, next) {
  res.render('contact', { title: 'Contact' });
});

router.post('/send',function(req, res, next){
  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'educostachaves@gmail.com',
      pass: 'mypass'
    }
  });

  var mailOptions = {
    from: 'Jonh Doe <johndoe@outlook.com>',
    to: 'educostachaves@gmail.com',
    subject: 'Website Submission',
    text: 'Name: '+req.body.name+' Email: '+req.body.email+' Message'+req.body.message,
    html: '<p>You got a new submission</p><ul><li>Name: '+req.body.name+'</li><li>Email: '+req.body.email+'</li><li>Message'+req.body.message+'</li></ul>'
  };

  transporter.sendMail(mailOptions, function(error, info){
    if(error){
      console.log(error);
      res.redirect('/');
    } else {
      console.log('Message Sent: '+info.response);
      res.redirect('/');
    }
  });
});

module.exports = router;
