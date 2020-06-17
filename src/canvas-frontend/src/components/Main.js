import React, { Component } from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Home from './Home/Home';
import Profile from './Profile/Profile';
import EditProfile from './Profile/EditProfile';
import Login from './Login/Login';
import SignUp from './SignUp/SignUp'
import CreateCourse from './Courses/AddCourses';
import SearchCourses from './Courses/SearchCourses';
import EnrollCourses from './Courses/EnrollCourses';

import Assignments from './Assignments/Assignments';
import AssignmentDetails from './Assignments/AssignmentDetails';
import CreateAssignment from './Assignments/CreateAssignment';
import SubmitAssignment from './Assignments/SubmitAssignment';
import SearchUsersGradeAssignment from './Assignments/SearchUsersGradeAssignment'
import GradeAssignment from './Assignments/GradeAssignment'

import Announcements from './Announcements/Announcements';
import AnnouncementDetails from './Announcements/AnnouncementDetails';
import CreateAnnouncement from './Announcements/CreateAnnouncement';

import Quiz from './Quizzes/Quiz';
import QuizDetails from './Quizzes/QuizDetails'
import CreateQuiz from './Quizzes/CreateQuiz';
import TakeQuiz from './Quizzes/TakeQuiz';

import Files from './Files/Files';

import People from './People/People';

class Main extends Component {
	render() {
		return (
			<div>
				<BrowserRouter>
					<Switch>
						<Route exact path="/" component={Home} />
						<Route path="/login" component={Login} />
						<Route path="/signup" component={SignUp} />
						<Route path="/dashboard" component={Home} />
						<Route path="/profile" component={Profile} />
						<Route path="/edit-profile" component={EditProfile} />
						<Route path="/create-course" component={CreateCourse} />
						<Route path="/search-course" component={SearchCourses} />
						<Route path="/enroll-course" component={EnrollCourses} />
						<Route exact path="/course/:courseId" component={Assignments} />
						<Route exact path="/course/:courseId/assignments" component={Assignments} />
						<Route exact path="/course/:courseId/create-assignment" component={CreateAssignment} />
						<Route exact path="/course/:courseId/assignment/:assignmentId" component={AssignmentDetails} />
						<Route exact path="/course/:courseId/assignment/:assignmentId/submit-assignment" component={SubmitAssignment} />
						<Route exact path="/course/:courseId/assignment/:assignmentId/search-assignment" component={SearchUsersGradeAssignment} />
						<Route exact path="/course/:courseId/assignment/:assignmentId/grade-assignment" component={GradeAssignment} />

						<Route exact path="/course/:courseId/announcements" component={Announcements} />
						<Route exact path="/course/:courseId/create-announcement" component={CreateAnnouncement} />
						<Route path="/course/:courseId/announcement/:announcementId" component={AnnouncementDetails} />
						<Route exact path="/course/:courseId/quizzes" component={Quiz} />
						<Route exact path="/course/:courseId/quiz/:quizId" component={QuizDetails} />
						<Route exact path="/course/:courseId/create-quiz" component={CreateQuiz} />
						<Route exact path="/course/:courseId/quiz/:quizId/take-quiz" component={TakeQuiz} />

						<Route exact path="/course/:courseId/files" component={Files} />

						<Route exact path="/course/:courseId/people" component={People} />
					</Switch>
				</BrowserRouter>
			</div>
		)
	}
}

export default Main;