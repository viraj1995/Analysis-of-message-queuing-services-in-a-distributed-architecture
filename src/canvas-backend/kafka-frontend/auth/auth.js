const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const UserModel = require('../model/UserModel');
const JWTstrategy = require('passport-jwt').Strategy;
//We use this to extract the JWT sent by the user
const ExtractJWT = require('passport-jwt').ExtractJwt;
var mongoose = require('mongoose');
mongoose.Promise=global.Promise;


// //Create a passport middleware to handle user registration
// passport.use('signup', async (email, password, done) => {
// 	try {
// 		//Save the information provided by the user to the the database
// 		console.log(`Request: ${req}`);
// 		const user = await UserModel.create({ 
// 			email,
// 			password
// 		});
// 		//Send the user information to the next middleware
// 		return done(null, user);
// 	} catch (error) {
// 		done(error);
// 	}
// });

// //Create a passport middleware to handle User login
// passport.use('login', new localStrategy({
// 	usernameField: 'email',
// 	passwordField: 'password'
// }, async (email, password, done) => {
// 	try {
// 		//Find the user associated with the email provided by the user
// 		const user = await UserModel.findOne({ email });
// 		if (!user) {
// 			//If the user isn't found in the database, return a message
// 			return done(null, false, { message: 'User not found' });
// 		}
// 		//Validate password and make sure it matches with the corresponding hash stored in the database
// 		//If the passwords match, it returns a value of true.
// 		const validate = await user.isValidPassword(password);
// 		if (!validate) {
// 			return done(null, false, { message: 'Wrong Password' });
// 		}
// 		//Send the user information to the next middleware
// 		return done(null, user, { message: 'Logged in Successfully' });
// 	} catch (error) {
// 		return done(error);
// 	}
// }));

// //This verifies that the token sent by the user is valid
// passport.use(new JWTstrategy({
// 	//secret we used to sign our JWT
// 	secretOrKey: 'tilakasTamahishabandhanasutra',
// 	//we expect the user to send the token as a query paramater with the name 'secret_token'
// 	jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token')
// }, async (token, done) => {
// 	try {
// 		//Pass the user details to the next middleware
// 		return done(null, token.user);
// 	} catch (error) {
// 		done(error);
// 	}
// }));


// var UserModel = require('../model/UserModel');

// var mongoDB = 'mongodb+srv://sanjay:sanjay@canvascluster-ybjjb.mongodb.net/canvas?retryWrites=true';
var mongoDB = 'mongodb+srv://sanjay:sanjay@canvas-baa6b.mongodb.net/test?retryWrites=true&w=majority';

mongoose.connect(mongoDB, { useNewUrlParser: true });


module.exports = function(passport) {
	
	var options = {
		jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme("token"),
		secretOrKey: "tilakasTamahishabandhanasutra"
	};

	passport.use(
		"jwt",
		new JWTstrategy(options, function(jwt_payload, callback) {
			console.log("Inside passport strategy", jwt_payload.userId);

			UserModel.findOne(
				{
					UserId: jwt_payload.userId
				},
				(err, res) => {
					if (res) {
						var user = res;
						callback(null, true);
					} else {
						callback(err, false);
					}
				}
			);
		})
	);
};