import { combineReducers } from 'redux';
import courseReducer from '../reducers/courseReducer';
import authenticationReducer from '../reducers/authenticationReducer';
import assignmentReducer from '../reducers/assignmentReducer';
import announcementReducer from '../reducers/announcementReducer';
import profileReducer from '../reducers/profileReducer';
import userReducer from '../reducers/userReducer';
import quizReducer from '../reducers/quizReducer';
import fileReducer from '../reducers/fileReducer';
import peopleReducer from '../reducers/peopleReducer'

export default combineReducers({
	coursesReducer: courseReducer,
	authenticationReducer,
	assignmentReducer,
	announcementReducer,
	profileReducer,
	userReducer,
	quizReducer,
	fileReducer,
	peopleReducer
});