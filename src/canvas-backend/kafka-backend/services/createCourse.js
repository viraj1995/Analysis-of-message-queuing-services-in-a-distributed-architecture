const express = require('express');
const router = express.Router();

const UserModel = require('../model/UserModel');
const CourseModel = require('../model/CourseModel');
const mongoose = require("mongoose");
// const passport = require('passport');
// const jwt = require('jsonwebtoken');
var kafka = require('../kafka/client')


function handle_request(message, callBack){

	console.log(`CourseDepartment - ${message.CourseDepartment}`)
	console.log(`Type of CourseDepartment - ${typeof message.CourseDepartment}`)

	const course = new CourseModel(message);

	course
		.save()
		.then(result => {
			console.log(`Result: ${result}`);
			var course = {
				CourseId: result.CourseId,
				CourseNumber: result.CourseNumber,
				CourseTerm: result.CourseTerm,
				CourseYear: result.CourseYear,
				CourseName: result.CourseName,
				CourseDepartment: result.CourseDepartment,
				CourseStatus: 'Created',
			};
			UserModel.findOneAndUpdate(
				{ UserId: message.CourseTakenByUserId },
				{
					$push: {
						Courses: course
					}
				},
				{new: true},
				(err, doc) => {
					if (err) {
						console.log(`Error - ${err}`);
						console.log(`Attaching Course to User Failure:\n ${err}`);

						callBack(null, {
							status: 404,
							error: err
						})
						// response.status(500).json({ error: err });
					} else {
						console.log(`User - ${doc}`);
						console.log(`Sucessfully Attached Course to User:\n ${doc}`);

						callBack(null, {
							status: 200,
							course: result,
							user: doc
						})
						// response.status(200).json({ course: result, user: doc});
					}
				}
			);
		})
		.catch(error => {
			console.log(`Error: ${error}`);
			callBack(null, {
				status: 500,
				error: error
			})
			// response.status(500).json({ error: error });
		});

}

exports.handle_request = handle_request;