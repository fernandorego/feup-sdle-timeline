const express = require('express');
const cors = require('cors');
const app = require('../app');
const peerNode = require('../peerNode/peerNode');

const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const PEER_NODE = require('../peerNode/peerNode')
  console.log(PEER_NODE.node());
  res.render('index', { title: 'ola' });
});

router.post('/login', function(req, res, next) {
  const username = req.body.username;
  console.log("Logged in as: " + username);
  const user = peerNode.getOrCreateUser(username);
  res.status(200).send(user);
});

router.get('/hello', function(req, res, next) {
  res.status(200).send("Hello world!");
});

module.exports = router;
