const express = require('express');
const cors = require('cors');
const app = require('../app');

const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/hello', function(req, res, next) {
  res.status(200).send("Hello world!");
});

module.exports = router;
