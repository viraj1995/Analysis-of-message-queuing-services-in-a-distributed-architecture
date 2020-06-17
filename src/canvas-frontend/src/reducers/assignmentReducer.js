import { GET_ASSIGNMENTS, ASSIGNMENT_DETAILS, GET_ASSIGNMENT_BY_ID, SUBMIT_ASSIGNMENT, FIND_USERS_WITH_ASSIGNMENT, GET_ASSIGNMENTS_BY_USER_COURSE_ASSIGNMENT_IDS, SELECTED_USER_FOR_ASSIGNMENT_GRADING, GRADE_ASSIGNMENT, GET_ASSIGNMENT_FOR_GRADE } from '../actions/types';

const initialState = {
	assignment: {
		AssignementFiles: []
	},
	usersWithSubmission: [{
		Courses: [{
			Assignments:[{
				AssignmentSubmissions: [{
					SubmissionFiles: []
				}]
			}],
			Quizzes:[]
		}]
	}],
	selectedAssignment: {
		AssignmentSubmissions: [{
			SubmissionFiles: [{
				_id: '',
				uid: '',
				name: '',
				url: ''
			}]
		}]
	},
	selectedUserForAssignmentGrading: {},
	assignmentForGrade: {}
}


export default function(state = initialState, action) {
	switch (action.type) {
		// case GET_ASSIGNMENTS:
		// 	console.log(`In Assignment Reducer-> getAssignmentsByCourseId: \n${action.payload}`);
		// 	return {
		// 		...state,
		// 		assignments: action.payload
		// 	}
		// case ASSIGNMENT_DETAILS:
		// 	console.log(`In Assignment Reducer-> getSelectedAssignmentsDetails: \n${action.payload}`);
		// 	return {
		// 		...state,
		// 		selectedAssignment: action.payload
		// 	}
		case GET_ASSIGNMENT_BY_ID: 
			console.log(`In Assignment Reducer-> getAssignmentById: \n${action.payload}`);
			return {
				...state,
				assignment: action.payload
			}
		case SUBMIT_ASSIGNMENT: 
			console.log(`In Assignment Reducer-> submitAssignment: \n${action.payload}`);
			return state;
		case FIND_USERS_WITH_ASSIGNMENT: 
			console.log(`In Assignment Reducer-> findUsersWithAssignmentSubmissions: \n${action.payload}`);
			return {
				...state,
				usersWithSubmission : action.payload
			}
		case GET_ASSIGNMENTS_BY_USER_COURSE_ASSIGNMENT_IDS:
			console.log(`In Assignment Reducer-> findUsersWithAssignmentSubmissions: \n${action.payload}`);
			return {
				...state,
				selectedAssignment : action.payload
			}
		case SELECTED_USER_FOR_ASSIGNMENT_GRADING:
			console.log(`In Assignment Reducer-> selectedUserForAssignmentGrading: \n${action.payload}`);
			return {
				...state,
				selectedUserForAssignmentGrading : action.payload
			}
		case GRADE_ASSIGNMENT:
			console.log(`In Assignment Reducer-> gradeAssignment: \n${action.payload}`);
			return state;
		case GET_ASSIGNMENT_FOR_GRADE:
			console.log(`In Assignment Reducer-> gradeAssignment: \n${action.payload}`);
			return {
				...state,
				assignmentForGrade : action.payload
			}
		default:
			return state;
	}
}