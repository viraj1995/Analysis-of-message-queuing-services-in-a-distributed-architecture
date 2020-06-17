import { AUTHENTICATED, UNAUTHENTICATED, SIGNED_UP } from '../actions/types';

const initialState = {
	authenticated: false
}

export default function(state = initialState, action) {
	switch (action.type) {
		case AUTHENTICATED:
		console.log(`In Authentication Reducer-> login: \n${action.payload}`);
			return {
				...state, authenticated: true
			};
		case SIGNED_UP:
		console.log(`In Authentication Reducer-> signup: \n${action.payload}`);
			return {
				...state, authenticated: false
			};
		case UNAUTHENTICATED:
		console.log(`In Authentication Reducer-> logout: \n${action.payload}`);
			return {
				...state, 
				authenticated: false,
				message: action.payload
			};
		default:
			return state;
	}
}