const express = require('express');
const router = express.Router();
const authRouter = require('./auth');


// * '/signup' 
router.use('/signup', authRouter);


// GET  '/'   home page. 
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Basic Authentication' });
});

module.exports = router;
