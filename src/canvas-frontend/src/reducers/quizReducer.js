import { GET_QUIZ_BY_ID } from '../actions/types'

const initialState = {
	quiz: {
		Questions: []
	}
}

export default function(state = initialState, action) {
	switch (action.type) {
		case GET_QUIZ_BY_ID:
		console.log(`In Quiz Reducer-> getQuizById: \n${action.payload}`);
			return {
				...state,
				quiz: action.payload
			}
		default:
			return state;
	}
}