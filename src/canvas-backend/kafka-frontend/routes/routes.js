const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const UserModel = require('../model/UserModel');
const CourseModel = require('../model/CourseModel');
const mongoose = require("mongoose");

var passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;

const jwt = require('jsonwebtoken');

var kafka = require('../kafka/client')

const AWS = require('aws-sdk');

const s3 = new AWS.S3({
	accessKeyId: `${process.env.AWS_ACCESS_KEY_ID}`,
	secretAccessKey: `${process.env.AWS_SECRET_ACCESS_KEY}`
});

const saltRounds = 10;

router.post('/upload', function (request, response) {

	console.log(`In upload`);

	const params = {
		Bucket: "canvas-san",
		Key: `${request.body.uid}-${request.body.name}`,
		Body: request.files.profileImage.data
	};

	s3.upload(params, function (error, data) {
		if (error) {
			console.log(`Profile image upload failed`);
			response.status(500).json({ error: error });
		} else {
			console.log(`Profile image upload successful`)
			response.status(200).json(data);
		}
	});
});


router.post('/signup', (request, response) => {

	console.log(`\n\nInside /signup`);

	console.log(`${request.body.firstName} 
					\n ${request.body.lastName}
					\n ${request.body.email}
					\n ${request.body.password}
					\n ${request.body.aboutMe}
					\n ${request.body.phoneNumber}
					\n ${request.body.profileImage}
					\n ${request.body.city}
					\n ${request.body.country}
					\n ${request.body.company}
					\n ${request.body.school}
					\n ${request.body.homeTown}
					\n ${request.body.languages}
					\n ${request.body.gender}
					\n ${request.body.isProfessor}`);

	bcrypt.hash(request.body.password, saltRounds,
		(error, hash) => {
			if (error) {
				response.status(500).json({ error: error });
			} else {
				hashedPassword = hash;
				console.log(`Hashed password - ${hashedPassword}`);

				const user = new UserModel({
					UserId: new mongoose.Types.ObjectId(),
					FirstName: request.body.firstName,
					LastName: request.body.lastName,
					Email: request.body.email,
					Password: hashedPassword,
					AboutMe: request.body.aboutMe,
					PhoneNumber: request.body.phoneNumber,
					ProfileImage: request.body.profileImage,
					City: request.body.city,
					Country: request.body.country,
					Company: request.body.company,
					School: request.body.school,
					HomeTown: request.body.homeTown,
					Languages: request.body.languages,
					Gender: request.body.gender,
					IsProfessor: request.body.isProfessor
				})

				user
					.save()
					.then(result => {
						console.log(`Result: ${result}`);
						response.status(200).json(result);
					}
					)
					.catch(err => {
						console.log(`Error: ${err}`);
						response.status(500).json({ error: err });
					}
					)
			}
		});
});




router.post('/login', (request, response) => {

	console.log(`\n\nInside /login: ${request.body}`);

	UserModel.findOne({ Email: request.body.email },
		(error, user) => {
			if (error) {
				console.log(`Error: ${error}`);
				//Couldn't connect to MongoDB
				response.status(500).json({ message: 'Error - Please try again!' });

			} else {
				console.log(`User found in db: ${user}`);
				if (user) {
					user.isValidPassword(request.body.password)
						.then(result => {
							console.log(`Success in promise: ${result}`);
							if (result === false) {
								console.log(`Promise Success but isValidPassword failed`);
								response.status(204).json({ message: 'Wrong Password' })
							} else {
								console.log(`Promise Success and isValidPassword passed`);

								//Generate token
								const payload = {
									userId: user.UserId
								};

								var token = jwt.sign(
									payload,
									"tilakasTamahishabandhanasutra",
									{ expiresIn: 12000 }
								);
								console.log(`Token generated - ${token}`);
								response.status(200).json({ user: user, token: token });
							}
						})
						.catch(error => {
							console.log(`Error in promise: ${error}`);
							response.status(404).json({ message: "User not found" })
						})
				} else {
					response.status(404).json({ message: 'User not signed up' });
				}
			}
		}
	);
});



router.post('/courses', (request, response) => {
	const kafkaData = {
		CourseId: new mongoose.Types.ObjectId(),
		CourseNumber: request.body.courseNumber,
		CourseTerm: request.body.courseTerm,
		CourseYear: request.body.courseYear,
		CourseDepartment: request.body.courseDepartment[0],
		CourseName: request.body.courseName,
		CourseDescription: request.body.courseDescription,
		CourseRoom: request.body.courseRoom[0],
		CourseCapacity: request.body.courseCapacity,
		WaitlistCapacity: request.body.waitlistCapacity,
		CourseTakenByUserId: request.headers.userid,
		CourseTakenByUserName: request.headers.username

	}

	kafka.make_request('create_course', kafkaData, function (error, result) {

		if (error) {
			response.status(500).json({ error: 'Kafka Connection failed' });
		} else {
			if (result.status === 200) {
				response.status(200).json({ course: result.course, user: result.user });
			}
			//TODO: Check for 404 and 500 response and send appropriate data in response
		}

	})
	console.log(`\n\nInside POST /courses - Request: ${request.body}`);
	console.log(`Inside POST /courses - Header: ${request.headers}`);
});

router.get('/user/:userId', (request, response) => {

	console.log(`\n\nInside Get /user/:userId - UserId: ${request.params.userId}`);

	UserModel.findOne({ UserId: request.params.userId })
		.then(doc => {
			console.log(`User found in db: ${doc}`);
			if (doc) {
				console.log(`User: ${doc}`);
				response.status(200).json(doc);
			} else {
				response.status(404).json({ message: `Couldn't spot you` });
			}
		})
		.catch(error => {
			console.log(`Error: ${error}`);
			response.status(500).json({ error: error });
		});
});

router.get('/course/:courseId', (request, response) => {

	console.log(`\n\nInside Get /course/:courseId - CourseId: ${request.params.courseId}`);

	CourseModel.findOne({ CourseId: request.params.courseId })
		.then(doc => {
			console.log(`Course found in db: ${doc}`);
			if (doc) {
				console.log(`Course: ${doc}`);
				response.status(200).json(doc);
			} else {
				response.status(404).json({ message: `Requested course not found` });
			}
		})
		.catch(error => {
			console.log(`Error: ${error}`);
			response.status(500).json({ error: error });
		});
});


router.get('/course/:courseId/files', (request, response) => {

	console.log(`\n\nInside Get /course/:courseId/files - CourseId: ${request.params.courseId}`);

	CourseModel.findOne({ CourseId: request.params.courseId })
		.then(doc => {
			console.log(`Course found in db: ${doc}`);

			console.log(`Course Lecture files: ${doc.Files}`);
			if (doc) {
				console.log(`Course: ${doc}`);
				response.status(200).json(doc.Files);
			} else {
				response.status(404).json({ message: `Lecture Files not found` });
			}
		})
		.catch(error => {
			console.log(`Error: ${error}`);
			response.status(500).json({ error: error });
		});
});


router.post('/course/:courseId/files', (request, response) => {

	console.log(`\n\nInside Post /course/:courseId/files - CourseId: ${request.params.courseId}`);
	console.log(`\n\nInside Post /course/:courseId/files - Request: ${request.body.LectureNotes}`);

	CourseModel.findOneAndUpdate(
		{ CourseId: request.params.courseId },
		{
			$push: {
				Files: {
					$each: request.body.LectureFiles
				}
			}
		},
		{ new: true },
		(err, doc) => {
			if (err) {
				console.log(`Attaching Files to Course Failure:\n ${err}`);
				response.status(500).json({ error: err, message: "Attaching Files to Course Failed" });
			} else {
				console.log(`Sucessfully Attached Files to Course:\n ${doc}`);
				response.status(200).json(doc);
			}
		}
	);
});




router.post('/course/:courseId/assignment', (request, response) => {

	console.log(`\n\nInside POST /course/:courseId/assignment - Request: ${request.body}`);

	console.log(`AssignmentName: ${request.body.AssignmentName}`);
	console.log(`AssignmentDescription: ${request.body.AssignmentDescription}`);
	console.log(`AssignmentMaxMarks: ${request.body.AssignmentMaxMarks}`);
	console.log(`AssignmentDueDate: ${request.body.AssignmentDueDate}`);
	console.log(`AssignementFiles: ${request.body.AssignementFiles}`);

	var assignment = {
		AssignmentId: new mongoose.Types.ObjectId(),
		AssignmentName: request.body.AssignmentName,
		AssignmentDescription: request.body.AssignmentDescription,
		AssignmentMaxMarks: request.body.AssignmentMaxMarks,
		AssignmentDueDate: request.body.AssignmentDueDate,
		AssignementFiles: request.body.AssignementFiles
	};

	CourseModel.findOneAndUpdate(
		{ CourseId: request.params.courseId },
		{
			$push: {
				Assignments: assignment
			}
		},
		{ new: true },
		(err, doc) => {
			if (err) {
				console.log(`Error - ${err}`);
				console.log(`Attaching Assignments to Course Failure:\n ${err}`);
				response.status(500).json({ error: err });
			} else {
				console.log(`Course - ${doc}`);
				console.log(`Sucessfully Attached Assignments to Course:\n ${doc}`);
				response.status(200).json(doc);
			}
		}
	);
});



router.get('/course/:courseId/assignment/:assignmentId', (request, response) => {

	console.log(`\n\nInside GET /course/:courseId/assignment/:assignmentId`);

	CourseModel.findOne({ CourseId: request.params.courseId })
		.then(course => {
			console.log(`Found course`);
			const selectedAssignment = course.Assignments.filter(assignment => {
				if (assignment.AssignmentId == request.params.assignmentId) {
					console.log(`AssignmentId: ${assignment.AssignmentId}`);
					console.log(`AssignmentName: ${assignment.AssignmentName}`);
					console.log(`AssignmentDescription: ${assignment.AssignmentDescription}`);
					console.log(`AssignmentMaxMarks: ${assignment.AssignmentMaxMarks}`);
					console.log(`AssignmentDueDate: ${assignment.AssignmentDueDate}`);
					console.log(`AssignementFiles: ${assignment.AssignementFiles}`);

					return assignment;
				}
			});

			console.log(`Selected AssignmentId: ${selectedAssignment.AssignmentId}`);
			console.log(`Selected AssignmentName: ${selectedAssignment.AssignmentName}`);
			console.log(`Selected AssignmentDescription: ${selectedAssignment.AssignmentDescription}`);
			console.log(`Selected AssignmentMaxMarks: ${selectedAssignment.AssignmentMaxMarks}`);
			console.log(`Selected AssignmentDueDate: ${selectedAssignment.AssignmentDueDate}`);
			console.log(`Selected AssignementFiles: ${selectedAssignment.AssignementFiles}`);

			if (selectedAssignment[0]) {
				console.log(`Assignment Retrieved:\n ${selectedAssignment[0]}`);
				response.status(200).json(selectedAssignment[0]);
			} else {
				response.status(404).json({ message: `Requested Assignment not found` });
			}
		})
		.catch(error => {
			console.log(`Course Not found:\n ${error}`);
			response.status(500).json({ error: error });
		})
});

router.get('/health', (request, response) => {
	response.status(200).json("OK");

});


router.get('/user/:userId/course/:courseId/assignment/:assignmentId/forgrade', (request, response) => {
	console.log(`\n\nInside GET user/:userId/course/:courseId/assignment/:assignmentId/forgrade`);
	UserModel.findOne(
		{ UserId : request.params.userId, "Courses.CourseId": request.params.courseId},
		(error, user) => {

			if(error) {
				console.log(`Course not found for forgrade :\n ${error}`);
				response.status(500).json({ error: error, message: "Course not found for forgrade" });
			} else {
				console.log(`Course found for forgrade - ${user}`);
				let foundCourse = user.Courses.filter(course => {
					if(course.CourseId === request.params.courseId) {

						var foundAssignment = course.Assignments.find(assignment => 
							assignment.AssignmentId === request.params.assignmentId
						);
						if(foundAssignment === undefined) {
							//Not present logic
							console.log(`Assignment NOT found for forgrade`);							
							response.status(404).json({ message: 'Assignment not found for forgrade' });

						} else {
							//Present Logic
							console.log(`Assignment found for forgrade`);
							response.status(200).json(foundAssignment);
						}
					}
				});
			}
		});
});

router.post('/course/:courseId/announcement', (request, response) => {

	console.log(`\n\nInside POST /course/:courseId/announcement - Request: ${request.body}`);

	console.log(`AnnouncementName: ${request.body.AnnouncementName}`);
	console.log(`AnnouncementDescription: ${request.body.AnnouncementDescription}`);
	console.log(`AnnouncementPostedOn: ${request.body.AnnouncementPostedOn}`);
	console.log(`AnnouncementPostedByUserId: ${request.body.AnnouncementPostedByUserId}`);
	console.log(`AnnouncementPostedByUserName: ${request.body.AnnouncementPostedByUserName}`);
	console.log(`AnnouncementFiles: ${request.body.AnnouncementFiles}`);

	var announcement = {
		AnnouncementId: new mongoose.Types.ObjectId(),
		AnnouncementName: request.body.AnnouncementName,
		AnnouncementDescription: request.body.AnnouncementDescription,
		AnnouncementPostedOn: request.body.AnnouncementPostedOn,
		AnnouncementPostedByUserId: request.body.AnnouncementPostedByUserId,
		AnnouncementPostedByUserName: request.body.AnnouncementPostedByUserName,
		AnnouncementFiles: request.body.AnnouncementFiles
	};

	CourseModel.findOneAndUpdate(
		{ CourseId: request.params.courseId },
		{
			$push: {
				Announcements: announcement
			}
		},
		{new: true},
		(err, doc) => {
			if (err) {
				console.log(`Error - ${err}`);
				console.log(`Attaching Announcements to Course Failure:\n ${err}`);
				response.status(500).json({ error: err });
			} else {
				console.log(`Course - ${doc}`);
				console.log(`Sucessfully Attached Announcements to Course:\n ${doc}`);
				response.status(200).json(doc);
			}
		}
	);
});



router.get('/course/:courseId/announcement/:announcementId', (request, response) => {

	console.log(`\n\nInside GET /course/:courseId/announcement/:announcementId`);

	CourseModel.findOne({ CourseId: request.params.courseId })
		.then(course => {
			console.log(`Found course`);
			const selectedAnnouncement = course.Announcements.filter(announcement => {
				if(announcement.AnnouncementId == request.params.announcementId) {
					console.log(`AnnouncementId: ${announcement.AnnouncementId}`);
					console.log(`AnnouncementName: ${announcement.AnnouncementName}`);
					console.log(`AnnouncementDescription: ${announcement.AnnouncementDescription}`);
					console.log(`AnnouncementPostedOn: ${announcement.AnnouncementPostedOn}`);
					console.log(`AnnouncementPostedByUserId: ${announcement.AnnouncementPostedByUserId}`);
					console.log(`AnnouncementPostedByUserName: ${announcement.AnnouncementPostedByUserName}`);
					console.log(`AnnouncementFiles: ${announcement.AnnouncementFiles}`);
					return announcement;
				}
			});

			console.log(`Selected AnnouncementId: ${selectedAnnouncement.AnnouncementId}`);
			console.log(`Selected AnnouncementName: ${selectedAnnouncement.AnnouncementName}`);
			console.log(`Selected AnnouncementDescription: ${selectedAnnouncement.AnnouncementDescription}`);
			console.log(`Selected AnnouncementPostedOn: ${selectedAnnouncement.AnnouncementPostedOn}`);
			console.log(`Selected AnnouncementPostedByUserId: ${selectedAnnouncement.AnnouncementPostedByUserId}`);
			console.log(`Selected AnnouncementPostedByUserName: ${selectedAnnouncement.AnnouncementPostedByUserName}`);
			console.log(`Selected AssignementFiles: ${selectedAnnouncement.AnnouncementFiles}`);

			if(selectedAnnouncement[0]) {
				console.log(`Announcement Retrieved:\n ${selectedAnnouncement[0]}`);
				response.status(200).json(selectedAnnouncement[0]);
			} else {
				response.status(404).json({message: `Requested Announcement not found`});
			}
		})
		.catch(error => {
			console.log(`Course Not found:\n ${error}`);
			response.status(500).json({error: error});
		})
});



router.post('/course/:courseId/quiz', (request, response) => {

	console.log(`\n\nInside POST /course/:courseId/quiz - Request: ${request.body}`);

	console.log(`QuizName: ${request.body.QuizName}`);
	console.log(`QuizInstruction: ${request.body.QuizInstruction}`);
	console.log(`QuizTotalMarks: ${request.body.QuizTotalMarks}`);
	console.log(`QuizTimeLimit: ${request.body.QuizTimeLimit}`);

	console.log(`QuizAvailableFrom: ${request.body.QuizAvailableFrom}`);
	console.log(`QuizAvailableTill: ${request.body.QuizAvailableTill}`);

	request.body.Questions.map(question => {

		console.log(`Question: ${question.Question}`);
		console.log(`QuestionType: ${question.QuestionType}`);
		console.log(`QuestionPoints: ${question.QuestionPoints}`);
		console.log(`CorrectAnswer: ${question.CorrectAnswer}`);
		if(question.QuestionType) {
			console.log(`PossibleAnswer1: ${question.PossibleAnswer1}`);
			console.log(`PossibleAnswer2: ${question.PossibleAnswer2}`);
			console.log(`PossibleAnswer3: ${question.PossibleAnswer3}`);
		}

	});

	var quiz = {
		QuizId: new mongoose.Types.ObjectId(),
		QuizName: request.body.QuizName,
		QuizInstruction: request.body.QuizInstruction,
		QuizTotalMarks: request.body.QuizTotalMarks,
		QuizAvailableFrom: request.body.QuizAvailableFrom,
		QuizAvailableTill: request.body.QuizAvailableTill,
		QuizTimeLimit: request.body.QuizTimeLimit,
		Questions: request.body.Questions
	};

	CourseModel.findOneAndUpdate(
		{ CourseId: request.params.courseId },
		{
			$push: {
				Quizzes: quiz
			}
		},
		{new: true},
		(err, doc) => {
			if (err) {
				console.log(`Error - ${err}`);
				console.log(`Attaching Quizzes to Course Failure:\n ${err}`);
				response.status(500).json({ error: err });
			} else {
				console.log(`Course - ${doc}`);
				console.log(`Sucessfully Attached Quiz to Course:\n ${doc}`);
				response.status(200).json(doc);
			}
		}
	);
});



router.get('/course/:courseId/quiz/:quizId', (request, response) => {

	console.log(`\n\nInside GET /course/:courseId/quiz/:quizId`);

	CourseModel.findOne({ CourseId: request.params.courseId })
		.then(course => {
			console.log(`Found course`);
			const selectedQuiz = course.Quizzes.filter(quiz => {
				if(quiz.QuizId == request.params.quizId) {
					return quiz;
				}
			});
			if(selectedQuiz[0]) {
				console.log(`Quiz Retrieved:\n ${selectedQuiz[0]}`);
				response.status(200).json(selectedQuiz[0]);
			} else {
				response.status(404).json({message: `Requested Quiz not found`});
			}
		})
		.catch(error => {
			console.log(`Course Not found:\n ${error}`);
			response.status(500).json({error: error});
		})
});



router.post('/course/search', (request, response) => {

	console.log(`\n\nInside POST /course/search - Request: ${request.body}`);

	console.log(`SearchCoursesBy: ${request.body.SearchCoursesBy}`);

	kafka.make_request('search_courses', request.body, function(error, result) {

		if(error) {
			response.status(500).json({error: 'Kafka Connection failed'});
		} else {

			if(result.status === 200) {
				response.status(200).json(result.courses);
			} 
			if(result.status === 500) {
				response.status(200).json({ error: result.error })
			}
		}
	})
});



router.post('/user/:userId/course/:courseId/drop', (request, response) => {

	console.log(`\n\nInside POST /user/:userId/course/:courseId/drop`);
	console.log(`UserId: ${request.params.userId}`);
	console.log(`CourseId: ${request.params.courseId}`);

	const kafkaData = {
		userId: request.params.userId,
		courseId: request.params.courseId,
		DropType: request.body.DropType
	}

	kafka.make_request('drop_course', kafkaData, function(error, result) {

		if(error) {
			response.status(500).json({error: 'Kafka Connection failed'});
		} else {

			if(result.status === 200) {
				response.status(200).json(result.doc);
			} 
			if(result.status === 500) {
				response.status(200).json({ error: result.error, message: result.message });
			}
		}
	})
});




router.post('/user/:userId/course/:courseId/enroll', (request, response) => {

	console.log(`\n\nInside POST /user/:userId/course/:courseId/enroll`);
	console.log(`UserId: ${request.params.userId}`);
	console.log(`CourseId: ${request.params.courseId}`);

	kafka.make_request('enroll_course', request.params, function(error, result) {

		if(error) {
			response.status(500).json({error: 'Kafka Connection failed'});
		} else {

			if(result.status === 200) {
				response.status(200).json({course: result.course, user: result.user });
			} 
			if(result.status === 500) {
				response.status(500).json({ error: result.error })
			}
		}
	})
});



router.post('/user/:userId/course/:courseId/waitlist', (request, response) => {

	console.log(`\n\nInside POST /user/:userId/course/:courseId/waitlist`);
	console.log(`UserId: ${request.params.userId}`);
	console.log(`CourseId: ${request.params.courseId}`);


	kafka.make_request('waitlist_course', request.params, function(error, result) {

		if(error) {
			response.status(500).json({error: 'Kafka Connection failed'});
		} else {

			if(result.status === 200) {
				response.status(200).json({course: result.course, user: result.user });
			} 
			if(result.status === 500) {
				response.status(500).json({ error: result.error })
			}
		}
	})
});



router.post('/user/:userId/course/:courseId/assignment/:assignmentId/submit', (request, response) => {

	var assignmentSubmissionRequest = {
		SubmissionId: new  mongoose.Types.ObjectId(),
		SubmissionComment: request.body.SubmissionComment,
		SubmissionTimeStamp: request.body.SubmissionTimeStamp,
		SubmissionFiles: request.body.SubmissionFiles
	};

	UserModel.findOne(
		{ UserId : request.params.userId, "Courses.CourseId": request.params.courseId},
		(error, user) => {

			if(error) {
				console.log(`Course not found for submission :\n ${error}`);
				response.status(500).json({ error: error, message: "Course not found for submission" });
			} else {
				console.log(`Course found for submission - ${user}`);
				let foundCourse = user.Courses.filter(course => {
					if(course.CourseId === request.params.courseId) {
						//if assignment present, push only the submissions to that assignment
						//if assignment not present, create an assignment object with submissoins and push it to assignments
					
						var foundAssignment = course.Assignments.find(assignment => 
							assignment.AssignmentId === request.params.assignmentId
						);
						if(foundAssignment === undefined) {
							//Not present logic
							console.log(`Creating assignment for the first time`);

							//Sending these values from frontend
							const assignment = {
								AssignmentId: request.params.assignmentId,
								AssignmentName: request.body.AssignmentName,
								AssignmentMaxMarks: request.body.AssignmentMaxMarks,
								AssignmentSubmissions: [assignmentSubmissionRequest]
							};
		
							course.Assignments.push(assignment);
							user.save();
							response.status(200).json(user);

						} else {
							//Present Logic
							console.log(`Repeated submission`);
							foundAssignment.AssignmentSubmissions.push(assignmentSubmissionRequest);
							user.save();
							response.status(200).json(user);
						}
					}
				});
			}
		});
});


router.get('/course/:courseId/assignment/:assignmentId/find', (request, response) => {

	console.log(`\n\nInside GET /course/:courseId/assignment/:assignmentId/find`);
	console.log(`CourseId: ${request.params.courseId}`);
	console.log(`AssignmentId: ${request.params.assignmentId}`);

	const kafkaData = {
		CourseId: request.params.courseId,
		AssignmentId: request.params.assignmentId
	}

	kafka.make_request('find_assignmentSubmissions', kafkaData, function(error, result) {
		
		if(error) {
			response.status(500).json({error: 'Kafka Connection failed'});
		} else {
			if(result.status === 200) {
				console.log(`Users with assignment submissions found - ${result.users}`);
				response.status(200).json(result.users);
			}
			if(result.status === 404) {
				response.status(404).json(result.error);
			}
		}
	});
});


router.get('/user/:userId/course/:courseId/assignment/:assignmentId/find', (request, response) => {

	console.log(`\n\nInside GET /user/:userId/course/:courseId/assignment/:assignmentId/find`);
	console.log(`UserId: ${request.params.userId}`);
	console.log(`CourseId: ${request.params.courseId}`);
	console.log(`AssignmentId: ${request.params.assignmentId}`);

	const kafkaData = {
		UserId: request.params.userId,
		CourseId: request.params.courseId,
		AssignmentId: request.params.assignmentId
	}

	kafka.make_request('find_assignmentSubmissions_details', kafkaData, function(error, result) {
		
		if(error) {
			response.status(500).json({error: 'Kafka Connection failed'});
		} else {
			if(result.status === 200) {
				console.log(`Users with assignment submissions details found - ${result.user}`);
				//Neenu devru bro _/|\_
				let foundCourse = result.user.Courses.filter(course => {
					if(course.CourseId === request.params.courseId) {
							let foundAssignment = course.Assignments.filter(assignment => {
								if(assignment.AssignmentId === request.params.assignmentId) {
									// console.log(`Find the specified Assignment - ${assignment.AssignmentId}`);
									response.status(200).json(assignment);
								}
							});
					}
				});
			}
			if(result.status === 404) {
				response.status(404).json(result.error);
			}
		}
	});
});


router.post('/user/:userId/course/:courseId/assignment/:assignmentId/grade', (request, response) => {

	console.log(`\n\nInside POST /user/:userId/course/:courseId/assignment/:assignmentId/grade`);
	console.log(`UserId: ${request.params.userId}`);
	console.log(`CourseId: ${request.params.courseId}`);
	console.log(`AssignmentId: ${request.params.assignmentId}`);
	console.log(`Graded Assignment from Frontend: ${request.body}`);

	const kafkaData = {
		UserId: request.params.userId,
		CourseId: request.params.courseId,
		AssignmentId: request.params.assignmentId,
		Assignment: request.body
	}

	kafka.make_request('grade_assignment', kafkaData, function(error, result) {
		
		if(error) {
			response.status(500).json({error: 'Kafka Connection failed'});
		} else {
			if(result.status === 200) {
				console.log(`Users with assignment submissions details found - ${result.user}`);
				response.status(200).json(result.user);
			}
			if(result.status === 404) {
				response.status(404).json(result.error);
			}
		} 
	});
});


router.get('/course/:courseId/people', (request, response) => {

	console.log(`\n\nInside GET /course/:courseId/people`);
	
	console.log(`CourseId: ${request.params.courseId}`);

	const kafkaData = {
		CourseId: request.params.courseId
	}

	kafka.make_request('course_people', kafkaData, function(error, result) {
		
		if(error) {
			response.status(500).json({error: 'Kafka Connection failed'});
		} else {
			if(result.status === 200) {
				console.log(`People in courses found - ${result.user}`);
				response.status(200).json(result.users);
			}
			if(result.status === 404) {
				response.status(404).json(result.error);
			}
		} 
	});
});

module.exports = router;