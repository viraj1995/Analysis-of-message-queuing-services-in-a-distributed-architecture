import { GET_PEOPLE_BY_COURSE_ID } from './types';
import axios from 'axios';




export const getPeopleByCourseId = (courseId) => dispatch => {

	axios.defaults.withCredentials = true;
	axios.get(`${process.env.REACT_APP_REST_API_ENDPOINT_URL}:${process.env.REACT_APP_REST_API_ENDPOINT_PORT}/course/${courseId}/people`)
	.then(response => {
		console.log(`Response : ${response}`);
		if(response.status === 200){
			console.log("Got People enrolled/waitlisted in course in peopleActions->getPeopleByCourseId()");
			console.log(response.data);
			dispatch({
				type: GET_PEOPLE_BY_COURSE_ID,
				payload: response.data
			});
		}
	}).catch(error => {
		console.log(error);
		console.log("Something wrong in peopleActions-> getPeopleByCourseId()");
	});
}
