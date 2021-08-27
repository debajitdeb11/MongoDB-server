const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
const authRoutes = require("./routes/authentication");

// Custom Routes
app.use("/api", authRoutes);

mongoose
	.connect(process.env.DATABASE)
	.then(() =>
		console.log("Database is successfully connected!", {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			connectTimeoutMS: 15000,
			useCreateIndex: true,
		})
	)
	.catch((err) => {
		console.error("Failed to connect to the database!");
	});

app.get("/", (req, res) => {
	res.send("<h1>Server is running!</h1>");
});

// listen
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
