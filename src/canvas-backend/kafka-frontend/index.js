const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const app = express();
var cors = require("cors");

const fileUpload = require('express-fileupload')
app.use(fileUpload());


app.use(cors({
	origin: 'http://localhost:3000',
	credentials: true
}));

app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
	res.setHeader('Access-Control-Allow-Credentials', 'true');
	res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, XMLHttpRequest');
	res.setHeader('Cache-Control', 'no-cache');
	next();
});


//Database Connection
mongoose.connect(
	`${process.env.MONGODB_CONNECTION_STRING}`, {
	useCreateIndex: true,
	useNewUrlParser: true,
	poolSize: 500
}
).then(
	() => {
		console.log("Sucessfully Connected to MogoDB");
	},
	err => {
		console.log(`Error Connecting to MogoDB: ${err}`);
	}
);


// mongoose.Promise = global.Promise;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


require('./auth/auth');
const routes = require('./routes/routes');
const secureRoute = require('./routes/secure-routes');


app.use('/', routes);
//We plugin our jwt strategy as a middleware so only verified users can access this route
// app.use('/user', passport.authenticate('jwt', { session: false }), secureRoute);


//Handle errors
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.json({ error: err });
});


app.listen(5000, () => {
	console.log('Server Started and Listening on Port 5000')
});

