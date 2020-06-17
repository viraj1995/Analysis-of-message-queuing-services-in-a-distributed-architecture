import { GET_ASSIGNMENTS, GET_ASSIGNMENT_BY_ID, CREATE_ASSIGNMENT, SUBMIT_ASSIGNMENT, FIND_USERS_WITH_ASSIGNMENT, GET_ASSIGNMENTS_BY_USER_COURSE_ASSIGNMENT_IDS, SELECTED_USER_FOR_ASSIGNMENT_GRADING, GRADE_ASSIGNMENT, GET_ASSIGNMENT_FOR_GRADE } from './types';
import axios from 'axios';
import moment from 'moment';

// export const getAssignmentsByCourseIdAndCourseTerm = (courseData) => dispatch => {

// 	console.log("Inside getAssignmentsByCourseIdAndCourseTerm, courseData: ");
// 	console.log(courseData);

// 	let axiosConfig = {
// 		headers: {
// 			'userid': localStorage.getItem("userId"),
// 			'isprofessor': localStorage.getItem("isProfessor")
// 		}
// 	};

// 	axios.defaults.withCredentials = true;
// 	axios.get(`${process.env.REACT_APP_REST_API_ENDPOINT_URL}:${process.env.REACT_APP_REST_API_ENDPOINT_PORT}/assignments/courseid/${courseData.courseid}/courseterm/${courseData.courseterm}`, axiosConfig)
// 	.then(response => {
// 		console.log("Response : ",response);
// 		if(response.status === 200){
// 			console.log("Get assignments by course id and course term in assignmentsActions->getAssignmentsByCourseIdAndCourseTerm()");
// 			console.log(response.data);
// 			dispatch({
// 				type: GET_ASSIGNMENTS,
// 				payload: response.data
// 			});
// 		}
// 	}).catch(error => {
// 		console.log(error);
// 		console.log("Something wrong in Assignments Action -> getAssignmentsByCourseIdAndCourseTerm()");
// 	});
// }


export const getAssignmentsByCourseId = (courseid) => dispatch => {

	console.log("Inside getAssignmentsByCourseId, courseid: ");
	console.log(courseid);

	let axiosConfig = {
		headers: {
			'userid': localStorage.getItem("userId"),
			'isprofessor': localStorage.getItem("isProfessor")
		}
	};

	axios.defaults.withCredentials = true;
	axios.get(`${process.env.REACT_APP_REST_API_ENDPOINT_URL}:${process.env.REACT_APP_REST_API_ENDPOINT_PORT}/assignments/courseid/${courseid}`, axiosConfig)
	.then(response => {
		console.log("getAssignmentsByCourseId Response : ",response);
		if(response.status === 200){
			console.log(`Get assignments by course id in assignmentsActions->getAssignmentsByCourseId()`);
			console.log(response.data);
			dispatch({
				type: GET_ASSIGNMENTS,
				payload: response.data
			});
		}
	}).catch(error => {
		console.log(error);
		console.log(`Something wrong in Assignments Action -> getAssignmentsByCourseId()`);
	});
}


export const getAssignmentById = (courseId, selectedAssignmentData) => dispatch => {

	console.log(`Course Id: ${courseId} \nInside getAssignmentById, selectedAssignmentData: ${selectedAssignmentData[0]}`);

	console.log(`AssignmentId: ${selectedAssignmentData[0].AssignmentId}`);
	console.log(`AssignmentName: ${selectedAssignmentData[0].AssignmentName}`);
	console.log(`AssignmentDescription: ${selectedAssignmentData[0].AssignmentDescription}`);
	console.log(`AssignmentMaxMarks: ${selectedAssignmentData[0].AssignmentMaxMarks}`);
	console.log(`AssignmentDueDate: ${selectedAssignmentData[0].AssignmentDueDate}`);
	console.log(`AssignementFiles: ${selectedAssignmentData[0].AssignementFiles}`);

	axios.defaults.withCredentials = true;
	axios.get(`${process.env.REACT_APP_REST_API_ENDPOINT_URL}:${process.env.REACT_APP_REST_API_ENDPOINT_PORT}/course/${courseId}/assignment/${selectedAssignmentData[0].AssignmentId}`)
	.then(response => {
		console.log(`getAssignmentById Response: ${response}`);
		if(response.status === 200){
			console.log(`Get assignment by id in assignmentsActions->getAssignmentById()`);
			console.log(response.data);
			dispatch({
				type: GET_ASSIGNMENT_BY_ID,
				payload: response.data
			});
		}
	}).catch(error => {
		console.log(error);
		console.log(`Something wrong in Assignments Action -> getAssignmentById()`);
	});	
}

export const getAssignmentForGrades = (userId, courseId, selectedAssignmentData) => dispatch => {

	console.log(`Course Id: ${courseId} \nInside getAssignmentForGrades, selectedAssignmentData: ${selectedAssignmentData[0]}`);

	console.log(`AssignmentId: ${selectedAssignmentData[0].AssignmentId}`);
	console.log(`AssignmentName: ${selectedAssignmentData[0].AssignmentName}`);
	console.log(`AssignmentDescription: ${selectedAssignmentData[0].AssignmentDescription}`);
	console.log(`AssignmentMaxMarks: ${selectedAssignmentData[0].AssignmentMaxMarks}`);
	console.log(`AssignmentDueDate: ${selectedAssignmentData[0].AssignmentDueDate}`);
	console.log(`AssignementFiles: ${selectedAssignmentData[0].AssignementFiles}`);

	axios.defaults.withCredentials = true;
	axios.get(`${process.env.REACT_APP_REST_API_ENDPOINT_URL}:${process.env.REACT_APP_REST_API_ENDPOINT_PORT}/user/${userId}/course/${courseId}/assignment/${selectedAssignmentData[0].AssignmentId}/forgrade`)
	.then(response => {
		console.log(`getAssignmentForGrades Response: ${response}`);
		if(response.status === 200){
			console.log(`Get assignment by id in assignmentsActions for grades->getAssignmentForGrades()`);
			console.log(response.data);
			dispatch({
				type: GET_ASSIGNMENT_FOR_GRADE,
				payload: response.data
			});
		}
	}).catch(error => {
		console.log(error);
		console.log(`Something wrong in Assignments Action -> getAssignmentById()`);
	});	
}


export const createAssignment = (courseId, assignmentData) => dispatch => {
	
	console.log(`Inside createAssignment, AssignmentData: \n${assignmentData}`);

	console.log(`AssignmentName: ${assignmentData.AssignmentName}`);
	console.log(`AssignmentDescription: ${assignmentData.AssignmentDescription}`);
	console.log(`AssignmentMaxMarks: ${assignmentData.AssignmentMaxMarks}`);
	console.log(`AssignmentDueDate: ${moment(assignmentData.AssignmentDueDate).utc().format()}`);
	console.log(`AssignementFiles: ${assignmentData.AssignementFiles}`);

	axios.defaults.withCredentials = true;
	axios
		.post(
			`${process.env.REACT_APP_REST_API_ENDPOINT_URL}:${process.env.REACT_APP_REST_API_ENDPOINT_PORT}/course/${courseId}/assignment`,
			assignmentData
		)
		.then(response => {
			console.log(`createAssignment response: ${response}`);

			dispatch({
				type: CREATE_ASSIGNMENT,
				payload: response.data
			});
		})
		.catch(error => {
			console.log(error);
			console.log(
				"Something wrong in Assignment Action -> createAssignment()"
			);
		});
}

export const submitAssignment = (courseId, assignmentId, assignmentSubmissionData) => dispatch => {
	
	console.log(`Inside submitAssignment, assignmentSubmissionData: \n${assignmentSubmissionData}`);
	console.log(`Inside submitAssignment, courseId: \n${courseId}`);
	console.log(`Inside submitAssignment, assignmentId: \n${assignmentId}`);

	axios.defaults.withCredentials = true;
	axios
		.post(`${process.env.REACT_APP_REST_API_ENDPOINT_URL}:${process.env.REACT_APP_REST_API_ENDPOINT_PORT}/user/${localStorage.getItem("userId")}/course/${courseId}/assignment/${assignmentId}/submit`, assignmentSubmissionData)
		.then(response => {
			console.log(`Create announcement response- ${response.data}`);
			
			dispatch({
				type: SUBMIT_ASSIGNMENT,
				payload: response.data
			});
		})
		.catch(error => {
			console.log(`Something wrong while creating announcement: ${error}`);
		});
}

export const findUsersWithAssignmentSubmissions = (courseId, assignmentId) => dispatch => {
	
	console.log(`Inside findUsersWithAssignmentSubmissions, courseId: \n${courseId}`);
	console.log(`Inside findUsersWithAssignmentSubmissions, assignmentId: \n${assignmentId}`);

	axios.defaults.withCredentials = true;
	axios
		.get(`${process.env.REACT_APP_REST_API_ENDPOINT_URL}:${process.env.REACT_APP_REST_API_ENDPOINT_PORT}/course/${courseId}/assignment/${assignmentId}/find`)
		.then(response => {
			console.log(`findUsersWithAssignmentSubmissions response- ${response.data}`);
			
			dispatch({
				type: FIND_USERS_WITH_ASSIGNMENT,
				payload: response.data
			});
		})
		.catch(error => {
			console.log(`Something wrong in findUsersWithAssignmentSubmissions: ${error}`);
		});
}

export const getAssignmentByUserIdAndCourseId = (userId, courseId, assignmentId) => dispatch => {
	
	console.log(`Inside getAssignmentByUserIdAndCourseId, userId: \n${userId}`);
	console.log(`Inside getAssignmentByUserIdAndCourseId, courseId: \n${courseId}`);
	console.log(`Inside getAssignmentByUserIdAndCourseId, assignmentId: \n${assignmentId}`);

	axios.defaults.withCredentials = true;
	axios
		.get(`${process.env.REACT_APP_REST_API_ENDPOINT_URL}:${process.env.REACT_APP_REST_API_ENDPOINT_PORT}/user/${userId}/course/${courseId}/assignment/${assignmentId}/find`)
		.then(response => {
			console.log(`getAssignmentByUserIdAndCourseId response- ${response.data}`);
			
			dispatch({
				type: GET_ASSIGNMENTS_BY_USER_COURSE_ASSIGNMENT_IDS, 
				payload: response.data
			});
		})
		.catch(error => {
			console.log(`Something wrong in getAssignmentByUserIdAndCourseId: ${error}`);
		});
}

export const selectedUserForAssignmentGrading = (user) => dispatch => {
	dispatch({
		type: SELECTED_USER_FOR_ASSIGNMENT_GRADING, 
		payload: user
	});
}


export const gradeAssignment = (userId, courseId, assignmentData) => dispatch => {

	console.log(`Inside gradeAssignment, userId: \n${userId}`);
	console.log(`Inside gradeAssignment, courseId: \n${courseId}`);
	console.log(`Inside gradeAssignment, assignmentData - AssignmentId: \n${assignmentData.AssignmentId}`);

	axios.defaults.withCredentials = true;
	axios
		.post(`${process.env.REACT_APP_REST_API_ENDPOINT_URL}:${process.env.REACT_APP_REST_API_ENDPOINT_PORT}/user/${userId}/course/${courseId}/assignment/${assignmentData.AssignmentId}/grade`, assignmentData)
		.then(response => {
			console.log(`gradeAssignment response- ${response.data}`);
			
			dispatch({
				type: GRADE_ASSIGNMENT, 
				payload: response.data
			});
		})
		.catch(error => {
			console.log(`Something wrong in gradeAssignment: ${error}`);
		});


}