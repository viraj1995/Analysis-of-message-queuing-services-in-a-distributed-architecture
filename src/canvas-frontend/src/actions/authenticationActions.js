import { AUTHENTICATED, UNAUTHENTICATED, SIGNED_UP } from './types';
import axios from 'axios';

export const login = (loginData) => dispatch => {
	axios.defaults.withCredentials = true;
	axios.post(`${process.env.REACT_APP_REST_API_ENDPOINT_URL}:${process.env.REACT_APP_REST_API_ENDPOINT_PORT}/login`, loginData)
		.then(response => {
			console.log("Response: ", response);
			if (response.status === 200) {
				console.log("Login succesful");
				console.log(response.data);

				console.log(`Adding user details to localStorage`);
				localStorage.setItem("userId", response.data.user.UserId);
				localStorage.setItem("userEmail", response.data.user.Email);
				localStorage.setItem("userName", `${response.data.user.FirstName} ${response.data.user.LastName}`);
				localStorage.setItem("isProfessor", response.data.user.IsProfessor);
				localStorage.setItem("token", response.data.token);


				console.log(`UserId: ${localStorage.getItem("userId")}`);
				console.log(`UserEmail: ${localStorage.getItem("userEmail")}`);
				console.log(`UserName: ${localStorage.getItem("userName")}`);
				console.log(`IsProfessor: ${localStorage.getItem("isProfessor")}`);
				console.log(`Token: ${localStorage.getItem("token")}`);

				dispatch({
					type: AUTHENTICATED,
					payload: true
				});
			} else if(response.status === 204) {
				alert("Authentication Failed! - Wrong Password");
				// window.location.reload();
			}  else if(response.status === 404) {

				alert("Authentication Failed! - User not found");
				window.location.reload();
			} else  if(response.status === 500) {
				alert("Error - Please try again!");
				// window.location.reload();
			}
		})
		.catch(error => {
			console.log(error);
			alert("User not found");
			// window.location.reload();
		});
}

export const signup = (signupData) => dispatch => {

	console.log(`Signup request: ${signupData.firstName}`);


	axios.defaults.withCredentials = true;
	axios.post(`${process.env.REACT_APP_REST_API_ENDPOINT_URL}:${process.env.REACT_APP_REST_API_ENDPOINT_PORT}/signup`, signupData)
		.then(response => {
			console.log("Response : ", response);
			if (response.status === 200) {
				console.log("Signup succesful");
				dispatch({
					type: SIGNED_UP,
					payload: false
				});
			}
		}).catch(error => {
			console.log(error);
			alert("User with the specified E-Mail already presnet!");
		});
}



export const logout = () => dispatch => {

	dispatch({
		type: UNAUTHENTICATED,
		payload: false
	});

	console.log(`Removing user details from localStorage`);
	console.log(`UserId: ${localStorage.getItem("userId")}`);
	console.log(`UserEmail: ${localStorage.getItem("userEmail")}`);
	console.log(`UserName: ${localStorage.getItem("userName")}`);
	console.log(`IsProfessor: ${localStorage.getItem("isProfessor")}`);

	localStorage.removeItem("userId");
	localStorage.removeItem("userEmail");
	localStorage.removeItem("userName");
	localStorage.removeItem("isProfessor");
}