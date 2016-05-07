var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: './public/images' });

var mongo = require('mongodb');
var db = require('monk')('localhost/node-blog');

router.get('/show/:id', function(req, res, next) {
  var posts = db.get('posts');

  posts.findById( req.params.id, function(err, post){
    res.render('showpost', {
      'post': post
    });
  });

});

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

router.post('/addcomment', function(req, res, next) {
  var posts = db.get('posts');

  var name = req.body.name;
  var email = req.body.email;
  var postid = req.body.postid;
  var body = req.body.body;
  var commentdate = new Date();

  req.checkBody('name','Name Field is required').notEmpty();
  req.checkBody('email','E-mail Field is required, but never displayed').notEmpty();
  req.checkBody('email','E-mail is not formatted properly').isEmail();
  req.checkBody('body','Body Field is required').notEmpty();

  var errors = req.validationErrors();

  if(errors) {
    posts.findById(postid, function(err, post){
      res.render('showpost',{
        "errors" : errors,
        "post" : post
      });
    });
  } else {
    var comment = {
      "name" : name,
      "email" : email,
      "body" : body,
      "commentdate": commentdate
    };

    posts.update({
      "_id" : postid
    }, {
      $push: {
        "comments" : comment
      }
    }, function(err, doc){
      if(err){
        throw err;
      } else {
        req.flash('success', 'Comment Added');
        res.location('/posts/show/' + postid);
        res.redirect('/posts/show/' + postid);
      }
    });
  }

});

module.exports = router;
