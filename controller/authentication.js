const User = require("../models/users");
const { body, validationResult, cookie } = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

exports.signup = (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array([0]).msg,
		});
	}

	const user = new User(req.body);
	user.save((err, user) => {
		if (err) {
			console.error(err);
			return res.status(400).json({
				error: "User already exist!",
			});
		}

		const { _id, name, email, contact } = user;

		return res.status(200).json({
			id: _id,
			name: name,
			email: email,
			contact: contact,
		});
	});
};

exports.signin = (req, res) => {
	const errors = validationResult(req);

	if (!error.isEmpty()) {
		return res.status(422).json({
			error: errors.array()[0].msg,
		});
	}

	const { email, password } = req.body;

	User.findOne({ email }, (err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: "Email not exist",
			});
		}

		if (!user.authenticate(password)) {
			return res.status(401).json({
				error: "Email and Password doesn't match",
			});
		}

		// JWT token
		const token = jwt.sign({ _id: user._id }, process.env.SECRET, {
			algorithm: "HS256",
		});

		// Put Token into Cookie
		res.cookie("token", token, { expire: new Date() + 1000 });

		const { _id, name, email, contact, encrypt_password } = user;

		// Send Response to frontend
		return res.json({
			token,
			user: {
				_id,
				name,
				email,
				contact,
				encrypt_password,
			},
		});
	});
};

// Protected routes
exports.isSignedIn = expressJwt({
	secret: process.env.SECRET,
	userProperty: "auth",
	algorithms: ["HS256"],
});

exports.isAuthenticated = (req, res, next) => {
	let checker = req.profile && req.auth && req.profile._id == req.auth._id;

	if (!checker) {
		return res.status(403).json({
			error: "Not Authenticated, Access Denied!",
		});
	}

	next();
};
