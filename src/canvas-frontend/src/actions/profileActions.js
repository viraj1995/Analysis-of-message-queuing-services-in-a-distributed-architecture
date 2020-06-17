import { GET_PROFILE } from './types'
import axios from 'axios';

export const getProfile = () => dispatch => {
	let axiosConfig = {
		headers: {
			'userid': localStorage.getItem("userId"),
			'isprofessor': localStorage.getItem("isProfessor")
		}
	};
	axios.defaults.withCredentials = true;
	axios.get(`${process.env.REACT_APP_REST_API_ENDPOINT_URL}:${process.env.REACT_APP_REST_API_ENDPOINT_PORT}/getProfile`, axiosConfig)
	.then(response => {
		console.log("Response : ",response);
		if(response.status === 200){
			console.log("Got profile data in Profile Actions->getProfile()");
			console.log(response.data);
			dispatch({
				type: GET_PROFILE,
				payload: response.data
			});
		}
	}).catch(error => {
		console.log(error);
		console.log("Something wrong in Profile Action->getProfile()");
	});
}

export const editProfile = (editProfileData) => dispatch => {

	console.log("Inside editProfile, editProfileData: ");
	console.log(editProfileData);

	

// 	aboutMe: "I'm Sanjay, that's all there's to it!"
// city: "San Jose"
// company: "Amazon"
// country: "US"
// firstName: "Sanjay"
// homeTown: "Bangalore"
// languages: "English"
// lastName: "Nag"
// phoneNumber: "6692049908"
// prefix: "1"
// profileImage: undefined
// school: "SJSU"
	
	console.log(`FirstName : ${editProfileData.firstName}`);
	console.log(`LastName : ${editProfileData.lastName}`);
	console.log(`aboutMe : ${editProfileData.aboutMe}`);
	console.log(`city : ${editProfileData.city}`);
	console.log(`company : ${editProfileData.company}`);
	console.log(`homeTown : ${editProfileData.homeTown}`);
	console.log(`languages : ${editProfileData.languages}`);
	console.log(`phoneNumber : ${editProfileData.phoneNumber}`);
	console.log(`profileImage : ${editProfileData.profileImage}`);
	console.log(`school : ${editProfileData.school}`);
	console.log(`country : ${editProfileData.country}`);

	let axiosConfig = {
		headers: {
			'userid': localStorage.getItem("userId"),
			'isprofessor': localStorage.getItem("isProfessor")
		}
	};

	axios.defaults.withCredentials = true;
	axios.post(`${process.env.REACT_APP_REST_API_ENDPOINT_URL}:${process.env.REACT_APP_REST_API_ENDPOINT_PORT}/editProfile`, editProfileData,  axiosConfig)
	.then(response => {
		console.log("Response : ",response);
		if(response.status === 200){
			console.log("Edited profile data in Profile Actions->editProfile()");
			console.log(response.data);
			// dispatch({
			// 	type: GET_PROFILE,
			// 	payload: response.data
			// });
		}
	}).catch(error => {
		console.log(error);
		console.log("Something wrong in Profile Actions->editProfile()");
	});


	// axios.defaults.withCredentials = true;
	// axios.post(`${process.env.REACT_APP_REST_API_ENDPOINT_URL}:${process.env.REACT_APP_REST_API_ENDPOINT_PORT}/signup`, signupData)
	// 	.then(response => {
	// 		console.log("Response : ", response);
	// 		if (response.status === 200) {
	// 			console.log("Signup succesful");
	// 			dispatch({
	// 				type: SIGNED_UP,
	// 				payload: false
	// 			});
	// 		}
	// 	}).catch(error => {
	// 		console.log(error);
	// 		alert("Invalid user credentials!");
	// 	});
}