import React, { Component } from 'react'
import { Form, Input, InputNumber, Button,  Layout, Typography, DatePicker, Modal, Radio, Select, Divider } from 'antd';
import { Redirect } from 'react-router'
import { connect } from 'react-redux';
import { getCourseById } from '../../actions/courseActions';
import { createQuiz } from '../../actions/quizActions'

import moment from 'moment';

import PropTypes from 'prop-types';
import SideNav from '../SideNav/SideNav'
import InsideSideNav from '../SideNav/InsideSideNav';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
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
			const { visible, onCancel, onCreate, form } = this.props;
			const { getFieldDecorator } = form;
			return (
				<Modal visible={visible} title="Create a new question" okText="Create" onCancel={onCancel} onOk={onCreate}>
					<Form layout="vertical">
						<Form.Item label="Question" hasFeedback>
							{getFieldDecorator('Question', {
								rules: [{ required: true, message: 'Please input the Question!' }],
							})(
								<Input />
							)}
						</Form.Item>
						<Form.Item label="Question Type" hasFeedback >
							{getFieldDecorator('QuestionType', {
								valuePropName: 'qType',
								getValueFromEvent: this.questionType,
								rules: [{ required: true, message: 'Please select the question type!'}]
								
							})(
								<Select placeholder="Please select a question type">
									<Option value="MultipleChoice">Multiple Choice</Option>
									<Option value="True-False">True/False</Option>
								</Select>
							)}
						</Form.Item>
						<Form.Item label="Points">
							{getFieldDecorator('QuestionPoints', { initialValue: 1, rules: [{ required: true, message: 'Please specify the weightage for the question!' }] 
							})(
								<InputNumber min={1} max={500} />
							)}
						</Form.Item>

						<Divider>Answers</Divider>

						{ this.state.qstnType === "True-False" && <Form.Item label="Correct Answer">
							{getFieldDecorator('CorrectAnswer', {
								rules: [{ required: true, message: 'Please specify the correct answer to the question!' }]
							})(
								<Radio.Group>
									<Radio value="true">True</Radio>
									<Radio value="false">False</Radio>
								</Radio.Group>
							)}
						</Form.Item> }
						{ this.state.qstnType === "MultipleChoice" && <div><Form.Item label="Correct Answer" hasFeedback>
							{getFieldDecorator('CorrectAnswer', {
								rules: [{ required: true, message: 'Please specify the correct answer to the Question!' }],
							})(
								<Input />
							)}
						</Form.Item>
						<Form.Item label="Possible Answer" hasFeedback>
							{getFieldDecorator('PossibleAnswer1', {
								rules: [{ required: true, message: 'Please input a possible answer to the Question!' }],
							})(
								<Input />
							)}
						</Form.Item>
						<Form.Item label="Possible Answer" hasFeedback>
							{getFieldDecorator('PossibleAnswer2', {
								rules: [{ required: true, message: 'Please input a possible answer to the Question!' }],
							})(
								<Input />
							)}
						</Form.Item>
						<Form.Item label="Possible Answer" hasFeedback>
							{getFieldDecorator('PossibleAnswer3', {
								rules: [{ required: true, message: 'Please input a possible answer to the Question!' }],
							})(
								<Input />
							)}
						</Form.Item></div> }
					</Form>
				</Modal>
			);
		}
	}
);

export class CreateQuiz extends Component {

	constructor(props) {
		super(props)
		this.state = {
			visible: false,
			questions: []
		};
	}
	

	showModal = () => {
		this.setState({ visible: true });
	}

	handleCancel = () => {
		this.setState({ visible: false });
	}

	handleCreate = () => {
		const form = this.formRef.props.form;
		form.validateFields((err, values) => {
			if (err) {
				return;
			}

			console.log('Received values of Question form: ', values);

			var question = {};
			question['Question'] = values.Question;
			question['QuestionType'] = values.QuestionType;
			question['QuestionPoints'] = values.QuestionPoints;

			if(values.QuestionType === "MultipleChoice") {
				question['PossibleAnswer1'] = values.PossibleAnswer1;
				question['PossibleAnswer2'] = values.PossibleAnswer2;
				question['PossibleAnswer3'] = values.PossibleAnswer3;
			}
			question['CorrectAnswer'] = values.CorrectAnswer;

			this.setState({
				questions: [...this.state.questions, question]
			})

			form.resetFields();
			this.setState({ visible: false });
		});
	}

	saveFormRef = (formRef) => {
		this.formRef = formRef;
	}

	componentDidMount() {
		console.log(`CourseId through URL: ${window.location.pathname.split('/')[2]}`);
		this.props.getCourseById(this.props.course.CourseId);
	}

	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				console.log('Received values of create quiz form: ', values);

				if(this.state.questions.length > 0) {

					values['Questions'] = this.state.questions;
					console.log(`Vales from Quiz creation: ${values}`);
					// console.log(`Vales from Question creation: ${this.state.questions}`);


					console.log(`QuizName: ${values.QuizName}`);
					console.log(`QuizInstruction: ${values.QuizInstruction}`);
					console.log(`QuizTotalMarks: ${values.QuizTotalMarks}`);
					console.log(`QuizTimeLimit: ${values.QuizTimeLimit}`);

					console.log(`QuizAvailableFrom: ${moment(values.QuizDueDate[0]).utc().format()}`);
					console.log(`QuizAvailableTill: ${moment(values.QuizDueDate[1]).utc().format()}`);
					values['QuizAvailableFrom'] = moment(values.QuizDueDate[0]).utc().format();
					values['QuizAvailableTill'] = moment(values.QuizDueDate[1]).utc().format();

					console.log(`QuizAvailableFrom: ${values.QuizAvailableFrom}`);
					console.log(`QuizAvailableTill: ${values.QuizAvailableTill}`);

					console.log(`Again Vales from Quiz creation: ${values}`);

					console.log(`this.props.course.CourseId: ${this.props.course.CourseId}`);

					delete values['QuizDueDate'];


					this.props.createQuiz(this.props.course.CourseId ,values);
					setTimeout(() => {
						this.props.history.push(`/course/${this.props.course.CourseId}/quizzes`);
					}, 100);

				} else {
					alert(`Add questions to the quiz!`);
				}
			}
		});
	};

	
	render() {

		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: { span: 6 },
			wrapperCol: { span: 14 },
		};

		let redirectVar = null;
		if (this.props.authenticated === false) {
			redirectVar = <Redirect to="/login"/>
		}

		return (

			<Layout>
				{ redirectVar }
				<SideNav/>
				<Header style={{ background: '#fff', position: 'fixed', zIndex: 1, width: '100%', fontWeight:'bold', fontSize:20, marginLeft: 200 }}>
					Create Quiz
				</Header>
				<Layout  style={{marginLeft: 200, position:'fluid' }}>
					<InsideSideNav/>
					<Layout  style={{marginLeft: 200, position:'fluid'}}>
						<Content  style={{ margin: '0 16px', marginTop: 70 }}>
							<div style={{ padding: 40, background: '#fff', minHeight:'85vh'}}>
								<Title style={{ textAlign:'center' }} level={2}> Create Quiz </Title>
								<br/>
								<Form {...formItemLayout} onSubmit={this.handleSubmit}>
									<Form.Item label="Name" hasFeedback>
										{getFieldDecorator('QuizName', {
											rules: [{
												required: true, message: 'Please enter Quiz Name!',
											}]
										})(
											<Input />
										)}
									</Form.Item>
									<Form.Item label="Instructions">
										{getFieldDecorator('QuizInstruction', {})(
											<TextArea placeholder="Quiz Instructions..." autosize={{ minRows: 2, maxRows: 6 }} />
										)}
									</Form.Item>
									<Form.Item label="Total Points" >
										{getFieldDecorator('QuizTotalMarks', { 
											initialValue: 100,
											rules: [{
												required: true, message: 'Please enter Total Points for the Quiz!',
											}]
										})(
											<InputNumber min={1} max={1000} />
										)}
										<span className="ant-form-text"> points</span>
									</Form.Item>
									<Form.Item  label="Time Window" hasFeedback>
										{getFieldDecorator('QuizDueDate', {
											rules: [{
												required: true, message: 'Please enter Assignment Due date!',
											}],
										})(
											
											<RangePicker style={{width: '90%'}} showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" 
												placeholder={['Start Time', 'End Time']}
												// onChange={onChange}
												size="large"
												/>
										)}
									</Form.Item>
									<Form.Item label="Time Limit" >
										{getFieldDecorator('QuizTimeLimit', { 
											initialValue: 10,
											rules: [{
												required: true, message: 'Please enter Time Limit for the Quiz!',
											}]
										})(
											<InputNumber min={1} max={500} />
										)}
										<span className="ant-form-text"> minutes</span>
									</Form.Item>
									<Form.Item wrapperCol={{ span: 12, offset: 6 }}>
									{getFieldDecorator('Questions', {
											rules: [{
												required: true, message: 'Please enter Questions for the Quiz!',
											}]
										})(
											<div>
												<Button onClick={this.showModal}>Add Question</Button>
												<CollectionCreateForm wrappedComponentRef={this.saveFormRef} visible={this.state.visible} onCancel={this.handleCancel} onCreate={this.handleCreate}/>
											</div>
										)}
									</Form.Item>
									<Form.Item wrapperCol={{ span: 12, offset: 6 }}>
										<Button type="primary" htmlType="submit">Create</Button>
									</Form.Item>
								</Form>
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

const WrappedCreateQuiz = Form.create({ name: 'create_quiz' })(CreateQuiz);

const mapStateToProps = state => ({
	authenticated: state.authenticationReducer.authenticated,
	user: state.userReducer.user,
	course: state.coursesReducer.course
});

WrappedCreateQuiz.propTypes = {
	authenticated: PropTypes.bool.isRequired,
	user: PropTypes.object.isRequired,
	getCourseById: PropTypes.func.isRequired,
	course: PropTypes.object.isRequired,
	createQuiz: PropTypes.func.isRequired
};

export default connect(mapStateToProps, { getCourseById, createQuiz })(WrappedCreateQuiz);