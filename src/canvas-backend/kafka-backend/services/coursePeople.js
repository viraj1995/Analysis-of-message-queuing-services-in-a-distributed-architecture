const express = require('express');
const router = express.Router();
const UserModel = require('../model/UserModel');
const CourseModel = require('../model/CourseModel');
const mongoose = require("mongoose");
var kafka = require('../kafka/client');


function handle_request(message, callBack) {

	console.log(`CourseId - ${message.CourseId}`);

	UserModel.find(
		{
			Courses: {
				$elemMatch: {
					CourseId: message.CourseId,
					CourseStatus: 'Enrolled'
				}
			}
		},
		(err, doc) => {
			if(err) {
				console.log(`Error - People enrolled in course - ${err}`);
				callBack(null, {
					status: 404,
					error: err
				})
			} else {
				console.log(`People enrolled in course - ${doc}`);
				callBack(null, {
					status: 200,
					users: doc
				})
			}
		}
	);
}

exports.handle_request = handle_request;