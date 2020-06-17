import { GET_COURSE_BY_ID, SEARCH_COURSE, ENROLL_COURSE, WAITLIST_COURSE, DROP_COURSE } from '../actions/types'


const initialState = {
	course: {
		Assignments: [{
			AssignementFiles: []
		}],
		Announcements: [{
			AnnouncementFiles: []
		}],
		Quizzes: [{
			Questions: [{
				Options: []
			}]
		}]
	},
	searchCourses: []
}


export default function(state = initialState, action) {
	switch (action.type) {
		case GET_COURSE_BY_ID:
		console.log(`In Course Reducer-> getCourseById: \n${action.payload}`);
			return {
				...state,
				course: action.payload
			}
		case SEARCH_COURSE:
		console.log(`In Course Reducer-> getCourseById: \n${action.payload}`);
			return {
				...state,
				searchCourses: action.payload
			}
		case ENROLL_COURSE:
			console.log(`In Course Reducer-> enrollCourse: \n${action.payload}`);
			// return {
			// 	...state,
			// 	searchCourses: action.payload
			// }
			return state;
		case WAITLIST_COURSE:
			console.log(`In Reducer-> waitlistCourse: \n${action.payload}`);
			// return {
			// 	...state,
			// 	searchCourses: action.payload
			// }
			return state;
		case DROP_COURSE:
			console.log(`In Course Reducer-> dropCourse: \n${action.payload}`);
			// return {
			// 	...state,
			// 	searchCourses: action.payload
			// }
			return state;
		default:
			return state;
	}
}