const express = require('express');
const router = express.Router();
const UserModel = require('../model/UserModel');
const CourseModel = require('../model/CourseModel');
const mongoose = require("mongoose");
var kafka = require('../kafka/client')


function handle_request(message, callBack) {


	console.log(`CourseId - ${message.CourseId}`)
	console.log(`AssignmentId - ${message.AssignmentId}`)

	UserModel.find(
		{
			Courses: {
				$elemMatch: {
					CourseId: message.CourseId,
					"Assignments.AssignmentId": message.AssignmentId
				}
			}
		},
		(err, doc) => {
			if(err) {
				console.log(`Error - Users with specific assignment submissions - ${err}`);
				callBack(null, {
					status: 404,
					error: err
				})
			} else {
				console.log(`Users with specific assignment submissions - ${doc}`);
				callBack(null, {
					status: 200,
					users: doc
				})
			}
		}
	);
}

exports.handle_request = handle_request;