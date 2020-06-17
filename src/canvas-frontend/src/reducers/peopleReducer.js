import { GET_PEOPLE_BY_COURSE_ID } from '../actions/types';

const initialState = {
	people: []
}


export default function(state = initialState, action) {
	switch (action.type) {
		case GET_PEOPLE_BY_COURSE_ID:
			console.log(`In People Reducer-> getPeopleByCourseId: \n${action.payload}`);
			return {
				...state,
				people: action.payload
			}
		default:
			return state;
	}
}