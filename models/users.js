const mongoose = require("mongoose");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},

		email: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},

		contact: {
			type: Number,
			trim: true,
		},

		encrypt_password: {
			type: String,
			required: true,
		},

		salt: {
			type: String,
		},
	},
	{ timestamps: true }
);

userSchema
	.virtual("password")
	.set(function (password) {
		this._password = password;
		this.salt = uuidv4();
		this.encrypt_password = this.securePassword(password);
	})
	.get(function () {
		return this._password;
	});

userSchema.methods = {
	/* Does password encryption */
	securePassword: function (plainPassword) {
		if (!plainPassword) return "";

		try {
			return crypto
				.createHmac("sha256", this.salt)
				.update(plainPassword)
				.digest("hex");
		} catch (error) {
			return "";
		}
	},

	/* Check if the password is correct or not */
	authenticate: function (plainPassword) {
		return this.securePassword(plainPassword) === this.encrypt_password;
	},
};

module.exports = mongoose.model("User", userSchema);
