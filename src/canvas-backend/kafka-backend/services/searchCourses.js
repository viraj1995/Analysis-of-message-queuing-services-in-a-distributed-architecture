const express = require('express');
const router = express.Router();
const UserModel = require('../model/UserModel');
const CourseModel = require('../model/CourseModel');
const mongoose = require("mongoose");
var kafka = require('../kafka/client');

function handle_request(message, callBack) {

	if(message.SearchCoursesBy === "CourseId") {

		console.log(`CourseTerm: ${message.CourseTerm}`);
		console.log(`CourseNumber: ${message.CourseNumber}`);
		console.log(`courseDepartment: ${message.CourseDepartment[0]}`);
		console.log(`prefix: ${message.prefix}`);

		if ( message.prefix === "=") {

			console.log(`Prefix: =`)
			CourseModel.find(
				{
					CourseTerm: message.CourseTerm,
					CourseNumber: message.CourseNumber,
					CourseDepartment:
						message.CourseDepartment[0]
				},
				(err, doc) => {
					if (err) {
						console.log(`Searching Courses Failure:\n ${err}`);
						callBack(null, {
							status: 500,
							error: err
						})
						// response.status(500).json({ error: err });
					} else {
						console.log(`Searching Courses Sucessful:\n ${doc}`);
						callBack(null, {
							status: 200,
							courses: doc
						})
						// response.status(200).json(doc);
					}
				}
			);
	
		} else if( message.prefix === "<" ) {
			console.log(`Prefix: <`)

			CourseModel.find(
				{
					CourseTerm: message.CourseTerm,
					CourseDepartment:
						message.CourseDepartment[0],
					CourseNumber: {
						$lte: message.CourseNumber
					}
				},
				(err, doc) => {
					if (err) {
						console.log(`Searching Courses Failure:\n ${err}`);
						callBack(null, {
							status: 500,
							error: err
						})
						// response.status(500).json({ error: err });
					} else {
						console.log(`Searching Courses Sucessful:\n ${doc}`);
						callBack(null, {
							status: 200,
							courses: doc
						})
						// response.status(200).json(doc);
					}
				}
			);
	
		} else {
			console.log(`Prefix: >`)

			CourseModel.find(
				{
					CourseTerm: message.CourseTerm,
					CourseDepartment:
						message.CourseDepartment[0],
					CourseNumber: {
						$gte: message.CourseNumber
					}
				},
				(err, doc) => {
					if (err) {
						console.log(`Searching Courses Failure:\n ${err}`);
						callBack(null, {
							status: 500,
							error: err
						})
						// response.status(500).json({ error: err });
					} else {
						console.log(`Searching Courses Sucessful:\n ${doc}`);
						callBack(null, {
							status: 200,
							courses: doc
						})
						// response.status(200).json(doc);
					}
				}
			);
		}
	} else if (message.SearchCoursesBy === "CourseName") {

		console.log(`CourseName: ${message.CourseName}`);

		CourseModel.find(
			{
				CourseName: {
					$regex:
						".*" + message.CourseName + ".*",
					$options: 'i'
				}
			},
			(err, doc) => {
				if (err) {
					console.log(`Searching Courses Failure:\n ${err}`);
					callBack(null, {
						status: 500,
						error: err
					})
					// response.status(500).json({ error: err });
				} else {
					console.log(`Searching Courses Sucessful:\n ${doc}`);
					callBack(null, {
						status: 200,
						courses: doc
					})
					// response.status(200).json(doc);
				}
			}
		);
	}

}

exports.handle_request = handle_request;