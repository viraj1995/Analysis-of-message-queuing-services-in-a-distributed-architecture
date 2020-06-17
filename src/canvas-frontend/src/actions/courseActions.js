import { GET_COURSES, CREATE_COURSE, SEARCH_COURSE, ENROLL_COURSE, WAITLIST_COURSE, DROP_COURSE, COURSE_DETAILS, GET_COURSE_BY_ID } from './types';
import axios from 'axios';


export const getCourses = () => dispatch => {
	let axiosConfig = {
		headers: {
			'userid': localStorage.getItem("userId"),
			'isprofessor': localStorage.getItem("isProfessor")
		}
	};
	axios.defaults.withCredentials = true;
	axios.get(`${process.env.REACT_APP_REST_API_ENDPOINT_URL}:${process.env.REACT_APP_REST_API_ENDPOINT_PORT}`, axiosConfig)
	.then(response => {
		console.log("Response : ",response);
		if(response.status === 200){
			console.log("Got courses in courseActions->getCourses()");
			console.log(response.data);
			dispatch({
				type: GET_COURSES,
				payload: response.data
			});
		}
	}).catch(error => {
		console.log(error);
		console.log("Something wrong in Courses Action -> getCourses()");
	});
}

export const createCourse = (courseData) => dispatch => {


	console.log(`Inside createCourse, CourseData: \n${courseData}`);

	let axiosConfig = {
		headers: {
			'userid': localStorage.getItem("userId"),
			'username': localStorage.getItem("userName")
		}
	};

	axios.defaults.withCredentials = true;
	axios.post(`${process.env.REACT_APP_REST_API_ENDPOINT_URL}:${process.env.REACT_APP_REST_API_ENDPOINT_PORT}/courses`, courseData, axiosConfig)
		.then(response => {
			console.log(`Response : ${response}`);
			if (response.status === 200) {
				console.log(`Course created succesfully`);
				console.log(`Response Body: ${response.body}`);
				dispatch({
					type: CREATE_COURSE,
					payload: response.data
				});
			}
		}).catch(error => {
			console.log(error);
			alert("Something wrong in Courses Action -> createCourse()!");
		});



	// let axiosConfig = {
	// 	headers: {
	// 		'userid': localStorage.getItem("userId"),
	// 		'isprofessor': localStorage.getItem("isProfessor")
	// 	}
	// };
	// let courseCreatedData = {
	// 	courseId: courseData.courseId,
	// 	courseTerm: courseData.courseTerm
	// }
	// console.log(`CoursesCreated data :\n ${courseCreatedData}`);
	// axios.defaults.withCredentials = true;
	// axios.all([
	// 	axios.post(`${process.env.REACT_APP_REST_API_ENDPOINT_URL}:${process.env.REACT_APP_REST_API_ENDPOINT_PORT}/courses`, courseData, axiosConfig),
	// 	axios.post(`${process.env.REACT_APP_REST_API_ENDPOINT_URL}:${process.env.REACT_APP_REST_API_ENDPOINT_PORT}/coursesCreate`, courseCreatedData, axiosConfig)
	// ]).then(axios.spread((courses , coursesCreated) => {
	// 	console.log("Created courses in courseActions->createCourse()");
	// 	console.log(`Courses: ${courses}`);
	// 	console.log(`CoursesCreated: ${coursesCreated}`);

	// 	axios
	// 	.get(`${process.env.REACT_APP_REST_API_ENDPOINT_URL}:${process.env.REACT_APP_REST_API_ENDPOINT_PORT}/courses/${courseData.courseId}/${courseData.courseTerm}`, axiosConfig)
	// 	.then(coursesRetrieved => {

	// 		console.log(`CoursesRetrieved: \n${coursesRetrieved}`);
	// 		dispatch({
	// 			type: CREATE_COURSE,
	// 			payload: coursesRetrieved.data
	// 		});
	// 	})
	// 	.catch(error => {
	// 		console.log(error);
	// 		console.log("Something wrong in Retrieving course in Courses Action -> createCourse()");
	// 	});
	// }))
	// .catch(error => {
	// 	console.log(error);
	// 	console.log("Something wrong in Courses Action -> createCourse()");
	// });
}


export const searchCourse = (courseSearchData) => dispatch => {
	console.log(`Inside searchCourse, CourseSearchData: ${courseSearchData}`);

	axios.defaults.withCredentials = true;
	axios
		.post(
			`${process.env.REACT_APP_REST_API_ENDPOINT_URL}:${process.env.REACT_APP_REST_API_ENDPOINT_PORT}/course/search`,
			courseSearchData
		)
		.then(response => {
				console.log("Searched courses in courseActions->searchCourse()");
				console.log(response.data);

				dispatch({
					type: SEARCH_COURSE,
					payload: response.data
				});
		})
		.catch(error => {
			console.log(error);
			console.log("Something wrong in Courses Action -> searchCourse()");
		});
}


export const enrollCourse = (enrollCourseData) => dispatch => {
	console.log("Inside enrollCourse, enrollCourseData: ");
	console.log(enrollCourseData);

	console.log(`CourseId: ${enrollCourseData.CourseId}`);
	console.log(`CourseNumber: ${enrollCourseData.CourseNumber}`);
	console.log(`CourseDepartment: ${enrollCourseData.CourseDepartment}`);
	console.log(`CourseTerm: ${enrollCourseData.CourseTerm}`);
	console.log(`CourseName: ${enrollCourseData.CourseName}`);
	console.log(`CourseDescription: ${enrollCourseData.CourseDescription}`);
	console.log(`CourseRoom: ${enrollCourseData.CourseRoom}`);
	console.log(`CourseCapacity: ${enrollCourseData.CourseCapacity}`);
	console.log(`WaitlistCapacity: ${enrollCourseData.WaitlistCapacity}`);
	console.log(`CurrentEnrolled: ${enrollCourseData.CurrentEnrolled}`);
	console.log(`CurrentWaitlisted: ${enrollCourseData.CurrentWaitlisted}`);

	enrollCourseData.CurrentEnrolled++;

	console.log(`CurrentEnrolled: ${enrollCourseData.CurrentEnrolled}`);

	console.log(`CoursesEnrolled data :\n ${enrollCourseData}`);
	axios.defaults.withCredentials = true;
	axios
		.post(
			`${process.env.REACT_APP_REST_API_ENDPOINT_URL}:${process.env.REACT_APP_REST_API_ENDPOINT_PORT}/user/${localStorage.getItem("userId")}/course/${enrollCourseData.CourseId}/enroll`,
			enrollCourseData
		)
		.then(response => {
				console.log("Searched courses in courseActions->enrollCourse()");
				console.log(response.data);

				dispatch({
					type: ENROLL_COURSE,
					payload: response.data
				});
		})
		.catch(error => {
			console.log(error);
			console.log("Something wrong in Courses Action -> enrollCourse()");
		});
}


export const waitlistCourse = (waitlistCourseData) => dispatch => {
	console.log("Inside waitlistCourse, waitlistCourseData: ");
	console.log(waitlistCourseData);

	console.log(`CourseId: ${waitlistCourseData.CourseId}`);
	console.log(`CourseNumber: ${waitlistCourseData.CourseNumber}`);
	console.log(`CourseDepartment: ${waitlistCourseData.CourseDepartment}`)
	console.log(`CourseTerm: ${waitlistCourseData.CourseTerm}`)
	console.log(`CourseName: ${waitlistCourseData.CourseName}`)
	console.log(`CourseDescription: ${waitlistCourseData.CourseDescription}`)
	console.log(`CourseRoom: ${waitlistCourseData.CourseRoom}`)
	console.log(`CourseCapacity: ${waitlistCourseData.CourseCapacity}`)
	console.log(`WaitlistCapacity: ${waitlistCourseData.WaitlistCapacity}`)
	console.log(`CurrentEnrolled: ${waitlistCourseData.CurrentEnrolled}`)
	console.log(`CurrentWaitlisted: ${waitlistCourseData.CurrentWaitlisted}`)

	waitlistCourseData.CurrentWaitlisted++;

	console.log(`CurrentWaitlisted: ${waitlistCourseData.CurrentWaitlisted}`)

	console.log(`CoursesWaitlist data :\n ${waitlistCourseData}`);
	axios.defaults.withCredentials = true;
	axios
		.post(
			`${process.env.REACT_APP_REST_API_ENDPOINT_URL}:${process.env.REACT_APP_REST_API_ENDPOINT_PORT}/user/${localStorage.getItem("userId")}/course/${waitlistCourseData.CourseId}/waitlist`,
			waitlistCourseData
		)
		.then(response => {
				console.log("Waitlisted course in courseActions->waitlistCourse()");
				console.log(response.data);

				dispatch({
					type: WAITLIST_COURSE,
					payload: response.data
				});
		})
		.catch(error => {
			console.log(error);
			console.log("Something wrong in Courses Action -> waitlistCourse()");
		});
}


export const dropCourse = (dropCourseData) => dispatch => {
	console.log(`Inside dropCourse, dropCourseData: ${dropCourseData}`);

	console.log(`CourseId: ${dropCourseData.CourseId}`)
	console.log(`CourseNumber: ${dropCourseData.CourseNumber}`)
	console.log(`CourseDepartment: ${dropCourseData.CourseDepartment}`)
	console.log(`CourseTerm: ${dropCourseData.CourseTerm}`)
	console.log(`CourseName: ${dropCourseData.CourseName}`)
	console.log(`CourseDescription: ${dropCourseData.CourseDescription}`)
	console.log(`CourseRoom: ${dropCourseData.CourseRoom}`)
	console.log(`CourseCapacity: ${dropCourseData.CourseCapacity}`)
	console.log(`WaitlistCapacity: ${dropCourseData.WaitlistCapacity}`)
	console.log(`CurrentEnrolled: ${dropCourseData.CurrentEnrolled}`)
	console.log(`CurrentWaitlisted: ${dropCourseData.CurrentWaitlisted}`)
	console.log(`CourseTakenByUserId: ${dropCourseData.CourseTakenByUserId}`)
	console.log(`CourseTakenByUserName: ${dropCourseData.CourseTakenByUserName}`)

	if(dropCourseData.CurrentEnrolled > 0) {
		dropCourseData.CurrentEnrolled--;
		dropCourseData.DropType = "Enrolled"
	} else if(dropCourseData.CurrentWaitlisted > 0) {
		dropCourseData.CurrentWaitlisted--;
		dropCourseData.DropType = "Waitlisted"
	}   
	
	console.log(`currentDropped.CurrentEnrolled: ${dropCourseData.CurrentEnrolled}`);
	console.log(`currentDropped.CurrentWaitlisted: ${dropCourseData.CurrentWaitlisted}`);

	console.log(`CoursesDrop data :\n ${dropCourseData}`);
	axios.defaults.withCredentials = true;
	axios
		.post(
			`${process.env.REACT_APP_REST_API_ENDPOINT_URL}:${process.env.REACT_APP_REST_API_ENDPOINT_PORT}/user/${localStorage.getItem("userId")}/course/${dropCourseData.CourseId}/drop`,
			dropCourseData
		)
		.then(response => {
				console.log("Searched courses in courseActions->dropCourse()");
				console.log(response.data);

				dispatch({
					type: DROP_COURSE,
					payload: response.data
				});
		})
		.catch(error => {
			console.log(error);
			console.log("Something wrong in Courses Action -> dropCourse()");
		});
}


export const getCourseDetails = (courseId) => dispatch => {
	console.log("Inside getCourseDetails, courseId: ");
	console.log(courseId);

	// console.log(`courseid: ${courseDetailData.courseid}`)
	// console.log(`coursedept: ${courseDetailData.coursedept}`)
	// console.log(`courseterm: ${courseDetailData.courseterm}`)
	// console.log(`coursename: ${courseDetailData.coursename}`)
	// console.log(`coursedesc: ${courseDetailData.coursedesc}`)
	// console.log(`courseroom: ${courseDetailData.courseroom}`)
	// console.log(`coursecapacity: ${courseDetailData.coursecapacity}`)
	// console.log(`waitlistcapacity: ${courseDetailData.waitlistcapacity}`)
	// console.log(`currentEnrolled: ${courseDetailData.currentEnrolled}`)
	// console.log(`currentWaitlisted: ${courseDetailData.currentWaitlisted}`)


	let axiosConfig = {
		headers: {
			'userid': localStorage.getItem("userId"),
			'isprofessor': localStorage.getItem("isProfessor")
		}
	};

	console.log(`CourseDetailData coureId :\n ${courseId}`);
	axios.defaults.withCredentials = true;
	axios
		.get(
			`${process.env.REACT_APP_REST_API_ENDPOINT_URL}:${process.env.REACT_APP_REST_API_ENDPOINT_PORT}/courses/${courseId}`,
			axiosConfig
		)
		.then(response => {
				console.log("Course Details in courseActions->getCourseDetails()");
				console.log(response.data);

				dispatch({
					type: COURSE_DETAILS,
					payload: response.data
				});
		})
		.catch(error => {
			console.log(error);
			console.log("Something wrong in Courses Action -> getCourseDetails()");
		});
}






export const getCourseById = (courseId) => dispatch => {

	console.log(`Inside getCourseById- CourseId: ${courseId}`);

	// let axiosConfig = {
	// 	headers: {
	// 		'userid': localStorage.getItem("userId"),
	// 		'isprofessor': localStorage.getItem("isProfessor")
	// 	}
	// };

	axios.defaults.withCredentials = true;
	axios.get(`${process.env.REACT_APP_REST_API_ENDPOINT_URL}:${process.env.REACT_APP_REST_API_ENDPOINT_PORT}/course/${courseId}`)
	.then(response => {
		console.log("Response : ",response);
		if(response.status === 200) {
			console.log(`Get Course by CourseId in Course Actions -> getCourseById()`);
			console.log(response.data);
			dispatch({
				type: GET_COURSE_BY_ID,
				payload: response.data
			});
		}
		if(response.status === 404) {
			console.log(`In 404`);
			alert(`Something wrong in Course Action -> getCourseById()!`);
		}
		if(response.status === 500) {
			console.log(`In 500`);
			alert(`Something wrong in Course Action -> getCourseById()!`);
		}
	}).catch(error => {
		console.log(error);
		console.log(`Something wrong in Course Action -> getCourseById()`);
	});
}