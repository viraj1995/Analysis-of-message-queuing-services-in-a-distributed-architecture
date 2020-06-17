import { GET_ANNOUNCEMENTS, ANNOUNCEMENT_DETAILS, GET_ANNOUNCEMENT_BY_ID } from '../actions/types';

const initialState = {
	announcement: {
		AnnouncementFiles: []
	}
}


export default function(state = initialState, action) {
	switch (action.type) {
		// case GET_ANNOUNCEMENTS:
		// 	console.log(`In Announcements Reducer-> getAnnouncementByCourseId: \n${action.payload}`);
		// 	return {
		// 		...state,
		// 		announcements: action.payload
		// 	}
		// case ANNOUNCEMENT_DETAILS:
		// 	console.log(`In Announcements Reducer-> getSelectedAnnouncementsDetails: \n${action.payload}`);
		// 	return {
		// 		...state,
		// 		selectedAnnouncement: action.payload
		// 	}
		case GET_ANNOUNCEMENT_BY_ID:
			console.log(`In Announcements Reducer-> getAnnouncementById: \n${action.payload}`);
			return {
				...state,
				announcement: action.payload
			}
		default:
			return state;
	}
}