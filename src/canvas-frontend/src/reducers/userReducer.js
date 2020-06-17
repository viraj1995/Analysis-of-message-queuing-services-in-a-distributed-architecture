import { GET_USER } from '../actions/types';


const initialState = {
	user: {
		Courses: [{
			Assignments:[{
				AssignmentSubmissions: [{
					SubmissionFiles: []
				}]
			}],
			Quizzes:[]
		}]
	}
	
}

export default function(state = initialState, action) {
	switch (action.type) {
		case GET_USER:
		console.log(`In User Reducer-> getUserById: \n${action.payload}`);
			return {
				...state,
				user: action.payload
			}
		default:
			return state;
	}
}