import { GET_USER } from '../actions/types';
import axios from 'axios';


export const getUserById = () => dispatch => {

	console.log(`Inside getUserById`);

	let axiosConfig = {
		headers: {
			token: localStorage.getItem("token")
		}
	};

	axios.defaults.withCredentials = true;
	axios.get(`${process.env.REACT_APP_REST_API_ENDPOINT_URL}:${process.env.REACT_APP_REST_API_ENDPOINT_PORT}/user/${localStorage.getItem("userId")}`, axiosConfig)
	.then(response => {
		console.log("Response : ",response);
		if(response.status === 200) {
			console.log(`Get User details by user id in userActions -> getUserById()`);
			console.log(response.data);
			dispatch({
				type: GET_USER,
				payload: response.data
			});
		}
		if(response.status === 404) {
			console.log(`In 404`);
			alert(`Something wrong in User Action -> getUserById()!`);
		}
		if(response.status === 500) {
			console.log(`In 500`);
			alert(`Something wrong in User Action -> getUserById()!`);
		}
	}).catch(error => {
		console.log(error);
		console.log(`Something wrong in User Action -> getUserById()`);
	});
}