const express = require('express');
const router = express.Router();
const UserModel = require('../model/UserModel');
const CourseModel = require('../model/CourseModel');
const mongoose = require("mongoose");
var kafka = require('../kafka/client');

function handle_request(message, callBack) {

	CourseModel.findOneAndUpdate(
		{ CourseId: message.courseId },
		{ $inc: { CurrentWaitlisted : 1 } },
		{ new: true },
		(error, courseModel) => {
			if(error) {
				console.log(`Error Course not found:\n ${error}`);
				callBack(null, {
					status: 500,
					error: error,
					message: "Course not found"
				})
				// response.status(500).json({error: error, message: "Course not found"});
			} else {
				console.log(`Course found successfully:\n ${courseModel}`);

				var course = {
					CourseId: courseModel.CourseId,
					CourseNumber: courseModel.CourseNumber,
					CourseTerm: courseModel.CourseTerm,
					CourseYear: courseModel.CourseYear,
					CourseName: courseModel.CourseName,
					CourseDepartment: courseModel.CourseDepartment,
					CourseStatus: 'Waitlisted',
				};

				// setTimeout(() => {}, 1000);

				UserModel.findOneAndUpdate(
					{ UserId: message.userId },
					{
						$push: {
							Courses: course
						}
					},
					{new: true},
					(err, doc) => {
						if (err) {
							console.log(`Attaching Waitlisted Course to User Failure:\n ${err}`);
							callBack(null, {
								status: 500,
								error: err,
								message: "Attaching Course to User Failure"
							})
							// response.status(500).json({ error: err, message: "Attaching Course to User Failure" });
						} else {
							console.log(`Sucessfully Attached Waitlisted Course to User:\n ${doc}`);
							callBack(null, {
								status: 200,
								course: courseModel,
								user: doc
							})
							// response.status(200).json({ course: courseModel, user: doc});
						}
					}
				);
				
			} 
		}
	);

}

exports.handle_request = handle_request;