const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	UserId: {
		type: mongoose.Schema.Types.ObjectId
	},
	FirstName: {
		type: String,
		required: true
	},
	LastName: {
		type: String,
		required: true
	},
	Email: {
		type: String,
		required: true,
		unique: true
	},
	Password: {
		type: String,
		required: true
	},
	AboutMe: {
		type: String
	},
	PhoneNumber:  {
		type: Number
	},
	ProfileImage: {
		type: String
	},
	City: {
		type: String
	},
	Country:  {
		type: String
	},
	Company: {
		type: String
	},
	School:  {
		type: String
	},
	HomeTown: {
		type: String
	},
	Languages: {
		type: String
	},
	Gender: {
		type: String
	},
	IsProfessor: {
		type: Boolean,
		required: true
	},
	Courses: [{
		CourseId: {
			type: String
		},
		CourseNumber: {
			type: Number
		},
		CourseTerm: {
			type: String
		},
		CourseYear: {
			type: Number
		},
		CourseName: {
			type: String
		},
		CourseDepartment: {
			type: String
		},
		CourseStatus: {
			type: String
		},
		CourseSequenceNumber: {
			type: Number
		},
		Assignments: [{
			AssignmentId: {
				type: String
			},
			AssignmentName: {
				type: String
			},
			AssignmentGrade: {
				type: Number,
				default: -1
			},
			AssignmentStatus: {
				type: String,
				default: "Ungraded"
			},
			AssignmentMaxMarks: {
				type: String
			},
			AssignmentSubmissions: [{
				SubmissionId: {
					type: mongoose.Schema.Types.ObjectId
				},
				SubmissionComment: {
					type: String
				},
				SubmissionTimeStamp: {
					type: Date
				},
				"SubmissionFiles": [{
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
			}]
		}]
	}]
});

//This is called a pre-hook, before the user information is saved in the database
//this function will be called, we'll get the plain text password, hash it and store it.
// UserSchema.pre('save', async function (next) {
// 	//'this' refers to the current document about to be saved
// 	const user = this;
// 	//Hash the password with a salt round of 10, the higher the rounds the more secure, but the slower
// 	//your application becomes.
// 	const hash = await bcrypt.hash(this.Password, 10);
// 	//Replace the plain text password with the hash and then store it
// 	this.Password = hash;
// 	//Indicates we're done and moves on to the next middleware
// 	next();
// });

//We'll use this later on to make sure that the user trying to log in has the correct credentials
UserSchema.methods.isValidPassword = async function (Password) {
	const user = this;
	//Hashes the password sent by the user for login and checks if the hashed password stored in the 
	//database matches the one sent. Returns true if it does else false.
	const compare = await bcrypt.compare(Password, user.Password);
	return compare;
}

const UserModel = mongoose.model('users', UserSchema, 'Users');
module.exports = UserModel;