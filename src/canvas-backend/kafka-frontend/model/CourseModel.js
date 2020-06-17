const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
	CourseId: {
		type: mongoose.Schema.Types.ObjectId
	},
	CourseNumber: {
		type: Number,
		required: true
	},
	CourseYear: {
		type: Number,
		required: true
	},
	CourseTerm: {
		type: String,
		required: true
	},
	CourseDepartment: {
		type: String,
		required: true
	},
	CourseName: {
		type: String,
		required: true
	},
	CourseDescription: {
		type: String
	},
	CourseRoom: {
		type: String
	},
	CourseCapacity: {
		type: Number
	},
	WaitlistCapacity: {
		type: Number
	},
	CurrentEnrolled: {
		type: Number,
		default: 0
	},
	CurrentWaitlisted: {
		type: Number,
		default: 0
	},
	CourseTakenByUserId: {
		type: String
	},
	CourseTakenByUserName: {
		type: String
	},
	Assignments: [{
		AssignmentId: {
			type: mongoose.Schema.Types.ObjectId
		},
		AssignmentName: {
			type: String
		},
		AssignmentDescription: {
			type: String
		},
		AssignmentMaxMarks: {
			type: Number
		},
		AssignmentDueDate: {
			type: Date
		},
		"AssignementFiles": [{
			uid: {
				type: String
			},
			name: {
				type: String
			},
			url: {
				type: String
			}
		}]
	}],
	Announcements: [{
		AnnouncementId: {
			type: mongoose.Schema.Types.ObjectId
		},
		AnnouncementName: {
			type: String
		},
		AnnouncementDescription: {
			type: String
		},
		AnnouncementPostedOn: {
			type: Date
		},
		AnnouncementPostedByUserId: {
			type: String
		},
		AnnouncementPostedByUserName: {
			type: String
		},
		"AnnouncementFiles": [{
			uid: {
				type: String
			},
			name: {
				type: String
			},
			url: {
				type: String
			}
		}]
	}],
	Quizzes: [{
		QuizId: {
			type: mongoose.Schema.Types.ObjectId
		},
		QuizName: {
			type: String
		},
		QuizInstruction: {
			type: String
		},
		QuizTotalMarks: {
			type: Number
		},
		QuizAvailableFrom: {
			type: Date
		},
		QuizAvailableTill: {
			type: Date
		},
		QuizTimeLimit: {
			type: Number
		},
		Questions: [{
			QuestionId: {
				type: mongoose.Schema.Types.ObjectId
			},
			Question: {
				type: String
			},
			QuestionType: {
				type: String
			},
			QuestionPoints: {
				type: Number
			},
			PossibleAnswer1: {
				type: String
			},
			PossibleAnswer2: {
				type: String
			},
			PossibleAnswer3: {
				type: String
			},
			CorrectAnswer: {
				type: String
			}
		}]
	}],
	Files: [{
		uid: {
			type: String
		},
		name: {
			type: String
		},
		url: {
			type: String
		}
	}]
});

const CourseModel = mongoose.model('course', CourseSchema, 'Courses');
module.exports = CourseModel;