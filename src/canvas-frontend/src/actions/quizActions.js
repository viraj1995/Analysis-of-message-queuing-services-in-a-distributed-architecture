import { GET_QUIZ_BY_ID, CREATE_QUIZ } from './types';
import axios from 'axios';

export const getQuizById = (courseId, selectedQuizData) => dispatch => {

	console.log(`Course Id: ${courseId} \nInside getQuizById, selectedQuizData: ${selectedQuizData[0]}`);

	console.log(`QuizId: ${selectedQuizData[0].QuizId}`);
	console.log(`QuizName: ${selectedQuizData[0].QuizName}`);
	console.log(`QuizInstruction: ${selectedQuizData[0].QuizInstruction}`);
	console.log(`QuizTotalMarks: ${selectedQuizData[0].QuizTotalMarks}`);
	console.log(`QuizAvailableFrom: ${selectedQuizData[0].QuizAvailableFrom}`);
	console.log(`QuizAvailableTill: ${selectedQuizData[0].QuizAvailableTill}`);

	axios.defaults.withCredentials = true;
	axios.get(`${process.env.REACT_APP_REST_API_ENDPOINT_URL}:${process.env.REACT_APP_REST_API_ENDPOINT_PORT}/course/${courseId}/quiz/${selectedQuizData[0].QuizId}`)
	.then(response => {
		console.log(`Response: ${response}`);
		if(response.status === 200){
			console.log(`Get quiz by id in QuizActions->getQuizById()`);
			console.log(response.data);
			dispatch({
				type: GET_QUIZ_BY_ID,
				payload: response.data
			});
		}
	}).catch(error => {
		console.log(error);
		console.log(`Something wrong in QuizActions -> getQuizById()`);
	});	
}


export const createQuiz = (courseId, quizData) => dispatch => {
	
	console.log(`Inside createQuiz, courseId: \n${courseId}`);
	console.log(`Inside createQuiz, QuizData: \n${quizData}`);

	console.log(`QuizName: ${quizData.QuizName}`);
	console.log(`QuizInstruction: ${quizData.QuizInstruction}`);
	console.log(`QuizTotalMarks: ${quizData.QuizTotalMarks}`);
	console.log(`QuizTimeLimit: ${quizData.QuizTimeLimit}`);
	console.log(`QuizAvailableFrom: ${quizData.QuizAvailableFrom}`);
	console.log(`QuizAvailableTill: ${quizData.QuizAvailableTill}`);

	quizData.Questions.map(question => {

		console.log(`Question: ${question.Question}`);
		console.log(`QuestionType: ${question.QuestionType}`);
		console.log(`QuestionPoints: ${question.QuestionPoints}`);
		console.log(`CorrectAnswer: ${question.CorrectAnswer}`);
		if(question.QuestionType) {
			console.log(`PossibleAnswer1: ${question.PossibleAnswer1}`);
			console.log(`PossibleAnswer2: ${question.PossibleAnswer2}`);
			console.log(`PossibleAnswer3: ${question.PossibleAnswer3}`);
		}
	});

	axios.defaults.withCredentials = true;
	axios
		.post(`${process.env.REACT_APP_REST_API_ENDPOINT_URL}:${process.env.REACT_APP_REST_API_ENDPOINT_PORT}/course/${courseId}/quiz`, quizData)
		.then(response => {
			console.log(`Response : ${response}`);
			if (response.status === 200) {
				console.log(`Quiz created succesfully`);
				console.log(`Response Body: ${response.body}`);
				dispatch({
					type: CREATE_QUIZ,
					payload: response.data
				});
			}
		})
		.catch(error => {
			console.log(error);
			alert("Something wrong in Quiz Action -> createQuiz()!");
		});
}