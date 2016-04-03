var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });

var mongo = require('mongodb');
var db = require('monk')('localhost/node-blog');

/* GET Posts listing. */
router.get('/add', function(req, res, next) {
  var categories = db.get('categories');

  categories.find({},{}, function(err, categories){
    res.render('addpost', {
      'title': 'Add Post',
      'categories': categories
    });
  });

});

router.post('/add', upload.single('mainimage'), function(req, res, next) {
  var title = req.body.title;
  var category = req.body.category;
  var body = req.body.body;
  var author = req.body.author;
  var date = new Date();
  var mainimage = 'noimage.jpg';

  if(req.file){
    mainimage = req.file.filename;
  }

  req.checkBody('title','Title Field is required');
  req.checkBody('body','Body Field is required');

  var errors = req.validationErrors();

  if(errors) {
    res.render('addpost',{
      "errors" : errors
    });
  } else {
    var posts = db.get('posts');
    posts.insert({
      "title": title,
      "body": body,
      "category": category,
      "date": date,
      "author": author,
      "mainimage": mainimage,
    },function(err, post){
      if(err){
        res.send(err);
      } else {
        req.flash('success', 'Post Added');
        res.location('/');
        res.redirect('/');
      }
    });
  }

});

module.exports = router;