var express = require('express');
var router = express.Router();
var Info = require('./../models/info');

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log("indexpage");
  res.render('index', { title: 'Express' });
});

/* GET Login Page. */
router.get('/login', function(req, res, next) {
	res.render('login', {title: 'Login Page'});
});

/* POST Authenticate user after Login Page. */
router.post('/loginAuth', function (req, res) {
	var body = req.body;
	console.log(body.username);
	console.log('Sumit providing the username');
	if(body.username) {
		Info.findOne( {_id: req.body.username, password: req.body.password}, function(err, info){
			if(err) {
				res.json(err);
			} 
			console.log('value of info'+info);
			if (info === undefined || info === null) {
				console.log('some problem occur while logging in');
				res.render('register', {
					title: 'Login Page'
				});
			} else {
				console.log(info);
				res.render('welcome', {title: body.username});
			}
  		})
	}
});

/* POST Register user. */
router.post('/registerUser', function (req, res) {
	console.log(req.body.username);
	console.log(req.body.email);
	console.log(req.body.password);
	new Info({
		_id: req.body.username,
		username: req.body.username,
  		email: req.body.email,
  		password: req.body.password
	}).save(function(err, info){
		if(err) {
			res.render('register', {title: 'Login Page'	});
		} else {
			res.send('welcome', {title: "successfully inserted"});
		}
	})
});

/* GET Register Page. */
router.get('/register', function(req, res, next) {
	res.render('register', {title: 'Login Page'});
});

module.exports = router;
