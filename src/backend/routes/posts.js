var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/create', function(req, res, next) {
    console.log(req)
    res.send('Username: ' + req.body.username + '\nTweet: ' + req.body.tweet);
    const node = require('../peerNode/peerNode').getNode();
    
});

module.exports = router;