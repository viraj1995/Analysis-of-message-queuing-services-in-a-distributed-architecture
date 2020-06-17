const express = require('express');
const router = express.Router();
const UserModel = require('../model/UserModel');
const CourseModel = require('../model/CourseModel');
const mongoose = require("mongoose");
var kafka = require('../kafka/client');


function handle_request(message, callBack) {

	console.log(`UserId - ${message.UserId}`);
	console.log(`CourseId - ${message.CourseId}`);
	console.log(`AssignmentId - ${message.AssignmentId}`);
	console.log(`Assignment Object - ${message.Assignment}`);

	UserModel.findOne(
		{ UserId : message.UserId, "Courses.CourseId": message.CourseId},
		(error, user) => {

			if(error) {

				console.log(`Course not found for assignment grade :\n ${error}`);

				// response.status(500).json({ error: error, message: "Course not found for assignment grade" });

				callBack(null, {
					status: 500,
					error: error,
					message: "Course not found for assignment grade"
				})

			} else {

				console.log(`Course found for assignment grade - ${user}`);

				let foundCourse = user.Courses.filter(course => {

					if(course.CourseId === message.CourseId) {

						console.log(`Creating assignment for the first time`);

						let foundAssignment = course.Assignments.filter(assignment => {

							if(assignment.AssignmentId === message.AssignmentId) {

								console.log(`Found Assignment to be uploaded`);
								console.log(`Assignment Status - ${message.Assignment.AssignmentStatus}`);
								console.log(`Assignment Grade - ${message.Assignment.AssignmentGrade}`);

								assignment.AssignmentStatus = message.Assignment.AssignmentStatus;
								assignment.AssignmentGrade = message.Assignment.AssignmentGrade;
							}
							// course.assignment = assignment;
						});
					}
				});
				user.save();
				callBack(null, {
					status: 200,
					user: user
				})
			}
		});
}

exports.handle_request = handle_request;