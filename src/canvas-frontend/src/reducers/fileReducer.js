import { GET_FILES_BY_COURSE_ID, UPLOAD_FILES_BY_COURSE_ID } from '../actions/types';

const initialState = {
	files: []
}


export default function(state = initialState, action) {
	switch (action.type) {
		case GET_FILES_BY_COURSE_ID:
			console.log(`In File Reducer-> saveLectureNotesByCourseId: \n${action.payload}`);
			return {
				...state,
				files: action.payload
			}
		case UPLOAD_FILES_BY_COURSE_ID:
			console.log(`In File Reducer-> saveLectureNotesByCourseId: \n${action.payload}`);
			// return {
			// 	...state,
			// 	files: action.payload
			// }
			return state;
		default:
			return state;
	}
}