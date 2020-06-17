import { GET_FILES_BY_COURSE_ID, UPLOAD_FILES_BY_COURSE_ID } from './types';
import axios from 'axios';

export const getLectureNotesByCourseId = (courseId) => dispatch => {
	// let axiosConfig = {
	// 	headers: {
	// 		'userid': localStorage.getItem("userId"),
	// 		'isprofessor': localStorage.getItem("isProfessor")
	// 	}
	// };
	axios.defaults.withCredentials = true;
	axios.get(`${process.env.REACT_APP_REST_API_ENDPOINT_URL}:${process.env.REACT_APP_REST_API_ENDPOINT_PORT}/course/${courseId}/files`)
	.then(response => {
		console.log(`Response : ${response}`);
		if(response.status === 200){
			console.log("Got lecture notes in fileActions->getLectureNotesByCourseId()");
			console.log(response.data);
			dispatch({
				type: GET_FILES_BY_COURSE_ID,
				payload: response.data
			});
		}
	}).catch(error => {
		console.log(error);
		console.log("Something wrong in fileActions-> getLectureNotesByCourseId()");
	});
}


export const saveLectureNotesByCourseId = (courseId, lectureFiles) => dispatch => {
	
	axios.defaults.withCredentials = true;
	axios.post(`${process.env.REACT_APP_REST_API_ENDPOINT_URL}:${process.env.REACT_APP_REST_API_ENDPOINT_PORT}/course/${courseId}/files`, lectureFiles)
	.then(response => {
		console.log(`Response : ${response}`);
		if(response.status === 200){
			console.log("Save lecture files in fileActions->saveLectureNotesByCourseId()");
			console.log(response.data);
			dispatch({
				type: UPLOAD_FILES_BY_COURSE_ID,
				payload: response.data
			});
		}
	}).catch(error => {
		console.log(error);
		console.log("Something wrong in fileActions-> saveLectureNotesByCourseId()");
	});
}