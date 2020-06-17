import { GET_ANNOUNCEMENTS, ANNOUNCEMENT_DETAILS, GET_ANNOUNCEMENT_BY_ID, CREATE_ANNOUNCEMENT } from '../actions/types';
import axios from 'axios';
import moment from 'moment';

export const getAnnouncementsByCourseId = (courseid) => dispatch => {

	console.log("Inside getAnnouncementsByCourseId, courseid: ");
	console.log(courseid);

	let axiosConfig = {
		headers: {
			'userid': localStorage.getItem("userId"),
			'isprofessor': localStorage.getItem("isProfessor")
		}
	};

	axios.defaults.withCredentials = true;
	axios.get(`${process.env.REACT_APP_REST_API_ENDPOINT_URL}:${process.env.REACT_APP_REST_API_ENDPOINT_PORT}/announcements/courseid/${courseid}`, axiosConfig)
	.then(response => {
		console.log("Response : ",response);
		if(response.status === 200){
			console.log("Get announcements by course id in announcementsActions -> getAnnouncementsByCourseId()");
			console.log(response.data);
			dispatch({
				type: GET_ANNOUNCEMENTS,
				payload: response.data
			});
		}
	}).catch(error => {
		console.log(error);
		console.log("Something wrong in Announcements Action -> getAnnouncementsByCourseId()");
	});
}


export const getSelectedAnnouncementsDetails = (selectedAnnouncementData) => dispatch => {

	console.log("Inside getSelectedAnnouncementsDetails, selectedAnnouncementData: ");
	console.log(selectedAnnouncementData[0]);

	// console.log(`aid: ${selectedAnnouncementData[0].aid}`)
	// console.log(`acourseid: ${selectedAnnouncementData[0].acourseid}`)
	// console.log(`acourseterm: ${selectedAnnouncementData[0].acourseterm}`)
	// console.log(`assignmentname: ${selectedAnnouncementData[0].assignmentname}`)
	// console.log(`assignmentdesc: ${selectedAnnouncementData[0].assignmentdesc}`)
	// console.log(`assignmentduedate: ${selectedAnnouncementData[0].assignmentduedate}`)
	// console.log(`assignmentpoints: ${selectedAnnouncementData[0].assignmentpoints}`)

	dispatch({
		type: ANNOUNCEMENT_DETAILS,
		payload: selectedAnnouncementData[0]
	});	
}


export const getAnnouncementById = (courseId, selectedAnnouncementData) => dispatch => {

	console.log(`Course Id: ${courseId} \nInside getAnnouncementById, selectedAnnouncement: ${selectedAnnouncementData[0]}`);

	console.log(`AnnouncementId: ${selectedAnnouncementData[0].AnnouncementId}`);
	console.log(`AnnouncementName: ${selectedAnnouncementData[0].AnnouncementName}`);
	console.log(`AnnouncementDescription: ${selectedAnnouncementData[0].AnnouncementDescription}`);
	console.log(`AnnouncementPostedOn: ${selectedAnnouncementData[0].AnnouncementPostedOn}`);
	console.log(`AnnouncementPostedByUserId: ${selectedAnnouncementData[0].AnnouncementPostedByUserId}`);
	console.log(`AnnouncementPostedByUserName: ${selectedAnnouncementData[0].AnnouncementPostedByUserName}`);

	axios.defaults.withCredentials = true;
	axios.get(`${process.env.REACT_APP_REST_API_ENDPOINT_URL}:${process.env.REACT_APP_REST_API_ENDPOINT_PORT}/course/${courseId}/announcement/${selectedAnnouncementData[0].AnnouncementId}`)
	.then(response => {
		console.log(`Response: ${response}`);
		if(response.status === 200){
			console.log(`Get announcement by id in announcementsActions->getAnnouncementById()`);
			console.log(response.data);
			dispatch({
				type: GET_ANNOUNCEMENT_BY_ID,
				payload: response.data
			});
		}
	}).catch(error => {
		console.log(error);
		console.log(`Something wrong in Announcements Action -> getAnnouncementById()`);
	});	
}


export const createAnnouncement = (courseId, announcementData) => dispatch => {
	
	console.log(`Inside createAnnouncement, AnnouncementData: \n${announcementData}`);

	console.log(`AnnouncementName: ${announcementData.AnnouncementName}`)
	console.log(`AnnouncementDescription: ${announcementData.AnnouncementDescription}`)
	console.log(`AnnouncementFiles: ${announcementData.AnnouncementFiles}`)
	console.log(`AnnouncementPostedOn: ${announcementData.AnnouncementPostedOn}`)
	console.log(`AnnouncementPostedByUserId: ${announcementData.AnnouncementPostedByUserId}`)
	console.log(`AnnouncementPostedByUserName: ${announcementData.AnnouncementPostedByUserName}`)
	console.log(`AnnouncementFiles: ${announcementData.AnnouncementFiles}`)

	axios.defaults.withCredentials = true;
	axios
		.post(
			`${process.env.REACT_APP_REST_API_ENDPOINT_URL}:${process.env.REACT_APP_REST_API_ENDPOINT_PORT}/course/${courseId}/announcement`,
			announcementData
		)
		.then(response => {
			console.log(`createAnnouncement response: ${response}`);

			dispatch({
				type: CREATE_ANNOUNCEMENT,
				payload: response.data
			});
		})
		.catch(error => {
			console.log(error);
			console.log(
				"Something wrong in Announcements Action -> createAnnouncement()"
			);
		});
}