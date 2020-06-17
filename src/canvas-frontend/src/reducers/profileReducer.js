import { GET_PROFILE } from '../actions/types'


const initialState = {
	profile: {}
}

export default function(state = initialState, action) {
	switch (action.type) {
		case GET_PROFILE:
			console.log(`In Profile Reducer-> getProfile: \n${action.payload}`);
			return {
				...state,
				profile: action.payload
			}
			// break;
		default:
			return state;
	}
}