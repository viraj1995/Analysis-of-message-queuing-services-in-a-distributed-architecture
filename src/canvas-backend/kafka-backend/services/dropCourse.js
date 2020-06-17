const express = require('express');
const router = express.Router();
const UserModel = require('../model/UserModel');
const CourseModel = require('../model/CourseModel');
const mongoose = require("mongoose");
var kafka = require('../kafka/client');

function handle_request(message, callBack) {

	UserModel.findOneAndUpdate(
		{ UserId: message.userId },
		{ $pull: { Courses: { CourseId: message.courseId } } },
		{new: true},
		(err, userDoc) => {
			if (err) {
				console.log(`Error - Couldn't remove Course from User:\n ${err}`);
				callBack(null, {
					status: 500,
					error: err
				})
				// response.status(500).json({ error: err });
			} else {
				console.log(`Sucessfully removed Course from User:\n ${userDoc}`);

				if(message.DropType === "Enrolled") {
					CourseModel.findOneAndUpdate(
						{ CourseId: message.courseId },
						{ $inc: { CurrentEnrolled : -1 } },
						{ new: true },
						(courseError, doc) => {
							if (courseError) {
								console.log(`Error while decrementing CurrentEnrolled in CourseModel:\n ${courseError}`);
								callBack(null, {
									status: 500,
									error: courseError,
									message: "Error while decrementing CurrentEnrolled in CourseModel"
								})
								// response.status(500).json({ error: courseError, message: "Error while decrementing CurrentEnrolled in CourseModel" });
							} else {
								console.log(`Searching Courses Sucessful:\n ${doc}`);
								callBack(null, {
									status: 200,
									doc: doc
								})
								// response.status(200).json(doc);
							}
						}
					);
				} else if(message.DropType === "Waitlisted") {
					CourseModel.findOneAndUpdate(
						{ CourseId: message.courseId  },
						{ $inc: { CurrentWaitlisted : -1 } },
						{ new: true },
						(courseErrorWaitlist, doc) => {
							if (courseErrorWaitlist) {
								console.log(`Error while decrementing CurrentWaitlisted in CourseModel:\n ${courseErrorWaitlist}`);
								callBack(null, {
									status: 500,
									error: courseErrorWaitlist,
									message: "Error while decrementing CurrentWaitlisted in CourseModel"
								})
								// response.status(500).json({ error: courseErrorWaitlist, message: "Error while decrementing CurrentWaitlisted in CourseModel" });
							} else {
								console.log(`Searching Courses Sucessful:\n ${doc}`);
								callBack(null, {
									status: 200,
									doc: doc
								})
								// response.status(200).json(doc);
							}
						}
					);
				}
				
				
			}
		}
	);


}

exports.handle_request = handle_request;