const express = require("express");
const router = express.Router();

const { getUserById, getUser } = require("../controller/user");

const { isSignedIn } = require("../controller/authentication");

router.param("userId", getUserById);

router.get("/user/:userId", isSignedIn, getUser);

module.exports = router;
