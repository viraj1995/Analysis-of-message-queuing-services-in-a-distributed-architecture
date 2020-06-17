import React, { Component } from "react";
import { connect } from 'react-redux';
import { Redirect } from 'react-router'
import { Layout, Typography, Button, Divider, Statistic, Form, Input, message } from 'antd';

import 'moment-timezone';
import SideNav from '../SideNav/SideNav'
import InsideSideNav from '../SideNav/InsideSideNav';
import PropTypes from 'prop-types';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;
const { Countdown } = Statistic;

export class TakeQuiz extends Component {

	constructor(props) {
		super(props);
		this.state = {
			questionsWithAnswers: []
		};
	}

	onFinish = (event) => {
		message.loading('Submitting Quiz', 1)
			.then(() => message.success('Quiz submitted', 1));
		setTimeout(()=> {
			this.props.history.push(`/course/${this.props.course.CourseId}/quizzes`);
		}, 2500);
	}

	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				console.log('Received values of form: ', values);

				// console.log(`AssignmentName: ${values.AssignmentName}`)
				// console.log(`AssignmentDescription: ${values.AssignmentDescription}`)
				// console.log(`AssignmentMaxMarks: ${values.AssignmentMaxMarks}`)
				// console.log(`AssignmentDueDate: ${values.AssignmentDueDate}`)
				// console.log(`Before AssignementFiles: ${values.AssignementFiles}`)

				// values.AssignementFiles = uploadedfileList;

				// console.log(`After AssignementFiles: ${values.AssignementFiles}`)

				// this.props.createAssignment(this.props.course.CourseId, values);
				// setTimeout(() => {
				// 	this.props.history.push(`/course/${this.props.course.CourseId}`);
				// }, 100);
				
			}
		});
	};

	saveFormRef = (formRef) => {
		this.formRef = formRef;
	}

	render() {


		let TakeQuizForm = [];

		let redirectVar = null;
		if (this.props.authenticated === false) {
			redirectVar = <Redirect to="/login"/>
		}

		var questions = [];
		this.props.quiz.Questions.filter(question => {
			if(question.QuestionType === "MultipleChoice") {
				questions.push({
					key: question._id,
					question: question.Question,
					options: `${question.PossibleAnswer1} / ${question.PossibleAnswer2} / ${question.PossibleAnswer3} / ${question.CorrectAnswer}`,
					correctAnswer: question.CorrectAnswer
				})
			} else  if(question.QuestionType === "True-False") {
				questions.push({
					key: question._id,
					question: question.Question,
					options: `True / False`,
					correctAnswer: question.CorrectAnswer
				})
			}
		});

		return (
			<Layout>
				{ redirectVar }
				<SideNav/>
				<Header style={{ background: '#fff', position: 'fixed', zIndex: 1, width: '100%', fontWeight:'bold', fontSize:20, marginLeft: 200 }}>
					{this.props.course.CourseDepartment}-{this.props.course.CourseNumber} > Quizzes > {this.props.quiz.QuizName}
				</Header>
				<Layout  style={{marginLeft: 200, position:'fluid' }}>
					<InsideSideNav/>
					<Layout  style={{marginLeft: 200, position:'fluid'}}>
						<Content  style={{ margin: '0 16px', marginTop: 70 }}>
							<div style={{ padding: 40, background: '#fff', minHeight:'85vh'}}>
								<Title level={2}>
									{this.props.quiz.QuizName}
									<Countdown className="float-right center" title="Time Remaining" value={Date.now() + 1000 * 60 * this.props.quiz.QuizTimeLimit} onFinish={this.onFinish} />
								</Title>
								<br/>
								<Divider />

								{
									
									TakeQuizForm = Form.create({ name: 'question_form' })(
										// eslint-disable-next-line
										class extends React.Component {

											constructor(props){
												super(props);
												this.state = {
													qstnType: ''
												};
											}

											questionType = (e) => {
												console.log('QuestionType:', e);
												this.setState({
													qstnType: e
												})
												return e;
											}

											render() {
												const { form } = this.props;
												const { getFieldDecorator } = form;
												return (
													questions.map( question => 

														<div>
															<Form layout="vertical">
																<Form.Item label="Question">
																	<span className="ant-form-text">{question.question}</span>
																</Form.Item>
																<Form.Item label="Options">
																	<span className="ant-form-text">{question.options}</span>
																</Form.Item>
																<Form.Item label="Answer">
																	{getFieldDecorator('Answer', {
																		rules: [{ required: true, message: 'Please specify the answer to the Question!' }],
																	})(
																		<Input />
																	)}
																</Form.Item>
															</Form>
															<Divider />
														</div>
													)

												)
											}
										}
									)
									
								}

								<TakeQuizForm wrappedComponentRef={this.saveFormRef} visible={true}/>

								<Button onClick={this.onFinish}>Submit Quiz</Button>


							</div>
						</Content>
						<Footer style={{ textAlign: 'center' }}>
							© Copyright Canvas.com, Inc.<br/>
							All rights reserved.
						</Footer>
					</Layout>
				</Layout>
			</Layout>
		)
	}
}

const mapStateToProps = state => ({
	authenticated: state.authenticationReducer.authenticated,
	user: state.userReducer.user,
	course: state.coursesReducer.course,
	quiz: state.quizReducer.quiz
});

TakeQuiz.propTypes = {
	authenticated: PropTypes.bool.isRequired,
	user: PropTypes.object.isRequired,
	course: PropTypes.object.isRequired,
	quiz: PropTypes.object.isRequired
};

export default connect(mapStateToProps, {  })(TakeQuiz);