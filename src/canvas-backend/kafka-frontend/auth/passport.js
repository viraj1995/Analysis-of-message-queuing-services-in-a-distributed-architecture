'use strict';
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var mongoose = require('mongoose');
mongoose.Promise=global.Promise;
//Set up default mongoose connection
// var mongoDB = 'mongodb+srv://sanjay:sanjay@canvascluster-ybjjb.mongodb.net/canvas?retryWrites=true';
var mongoDB = 'mongodb+srv://sanjay:sanjay@canvas-baa6b.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(mongoDB, { useNewUrlParser: true });
var UserModel = require("../model/UserModel");

// Setup work and export for the JWT passport strategy
module.exports = function (passport) {
    var opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
        secretOrKey: "tilakasTamahishabandhanasutra"
    };
    passport.use(new JwtStrategy(opts, function (jwt_payload, callback) {


		UserModel.findOne(
			{
				UserId: jwt_payload.userId
			},
			(err, res) => {
				if (res) {
					var userId = res.UserId;
					callback(null, userId);
				} else {
					callback(err, false);
				}
			}
		);



        kafka.make_request('requireauth',jwt_payload, function(err,result){
            console.log('in result');
            console.log(result);
            if (err){
                return callback("Username or password invalid", false);
            }else{
                var user = {email:result.email};
                callback(null, user);
                } 
        });
  
        
        console.log("requiring auth");
        console.log(jwt_payload);
      
    }));
};