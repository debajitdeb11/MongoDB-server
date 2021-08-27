const User = require("../models/users");

exports.getUserById = (req, res, next, id) => {
	User.findById(id).exec((err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: "User not found in Database",
			});
		}

		req.profile = user;
		next();
	});
};

exports.getUser = (req, res) => {
	const { _id, name, email, contact } = req.profile;

	return res.json({
		id: _id,
		name: name,
		email: email,
		contact: contact,
	});
};
