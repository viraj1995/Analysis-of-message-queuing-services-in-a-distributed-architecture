import React, { Component } from 'react'
import { Form, Input, InputNumber, Button, Upload, Icon, Layout, Typography, DatePicker } from 'antd';
import { connect } from 'react-redux';
import { Redirect } from 'react-router'
import { getCourseById } from '../../actions/courseActions';
import { createAssignment } from '../../actions/assignmentActions'

import axios from 'axios';
import PropTypes from 'prop-types';
import SideNav from '../SideNav/SideNav'
import InsideSideNav from '../SideNav/InsideSideNav';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;
const { TextArea } = Input;

var uploadedfileList= [];

export class CreateAssignment extends Component {

	componentDidMount() {
		console.log(`CourseId through URL: ${window.location.pathname.split('/')[2]}`);
		this.props.getCourseById(this.props.course.CourseId);
	}

	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				console.log('Received values of form: ', values);

				console.log(`AssignmentName: ${values.AssignmentName}`)
				console.log(`AssignmentDescription: ${values.AssignmentDescription}`)
				console.log(`AssignmentMaxMarks: ${values.AssignmentMaxMarks}`)
				console.log(`AssignmentDueDate: ${values.AssignmentDueDate}`)
				console.log(`Before AssignementFiles: ${values.AssignementFiles}`)

				values.AssignementFiles = uploadedfileList;

				console.log(`After AssignementFiles: ${values.AssignementFiles}`)

				this.props.createAssignment(this.props.course.CourseId, values);
				uploadedfileList= [];
				setTimeout(() => {
					this.props.history.push(`/course/${this.props.course.CourseId}`);
				}, 100);
				
			}
		});
	};

	normFile = (e) => {
		console.log('Upload event:', e);
		if (Array.isArray(e)) {
			return e;
		}
		return e && e.fileList;
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
					Create Assignment
				</Header>
				<Layout  style={{marginLeft: 200, position:'fluid' }}>
					<InsideSideNav/>
					<Layout  style={{marginLeft: 200, position:'fluid'}}>
						<Content  style={{ margin: '0 16px', marginTop: 70 }}>
							<div style={{ padding: 40, background: '#fff', minHeight:'85vh'}}>
								<Title style={{ textAlign:'center' }} level={2}> Create Assignment </Title>
								<br/>
								<Form {...formItemLayout} onSubmit={this.handleSubmit}>
									<Form.Item label="Name" hasFeedback>
										{getFieldDecorator('AssignmentName', {
											rules: [{
												required: true, message: 'Please enter Assignment Name!',
											}],
										})(
											<Input />
										)}
									</Form.Item>
									<Form.Item label="Description">
										{getFieldDecorator('AssignmentDescription', {})(
											<TextArea rows={4} placeholder="Describe the assignment here" autosize />
										)}
									</Form.Item>
									<Form.Item label="Maximum Points" >
										{getFieldDecorator('AssignmentMaxMarks', { 
											initialValue: 100,
											rules: [{
												required: true, message: 'Please enter Max Marks for the Assignment!',
											}]
										})(
											<InputNumber min={1} max={1000} />
										)}
										<span className="ant-form-text"> points</span>
									</Form.Item>
									<Form.Item  label="Due Date" hasFeedback>
										{getFieldDecorator('AssignmentDueDate', {
											rules: [{
												required: true, message: 'Please enter Assignment Due date!',
											}],
										})(
											<DatePicker style={{width: '55%'}} showTime size="large"/>
										)}
									</Form.Item>
									<Form.Item label="Files">
										{getFieldDecorator('AssignementFiles', {
											valuePropName: 'fileList',
											getValueFromEvent: this.normFile
										})(
											<Upload name="file"
												customRequest=	{({file, onSuccess}) => {
																		const data = new FormData()
																		data.append('profileImage', file, file.name);
																		data.set('uid', file.uid);
																		data.set('name', file.name);
																		const config = {
																			"headers": {
																				'accept': 'application/json',
																				'Accept-Language': 'en-US,en;q=0.8',
																				'Content-Type': `multipart/form-data; boundary=${data._boundary}`
																			}
																		}
																		axios.post(`${process.env.REACT_APP_REST_API_ENDPOINT_URL}:${process.env.REACT_APP_REST_API_ENDPOINT_PORT}/upload`, data, config)
																		.then((res, any) => {
																			console.log(`Response from /upload in react: ${res}`);
																			console.log(`Response from /upload Key: ${Object.values(res.data)}`);
																			let uploadedFile = {
																				uid: file.uid,
																				name: file.name,
																				url: res.data.Location
																			}
																			uploadedfileList.push(uploadedFile);
																			onSuccess(res.statusText);
																			console.log(`State: ${Object.values(uploadedfileList)}`)
																		})
																		.catch((err, Error) => {
																			console.log(err)
																		})
																	}
																}
																
												listType="picture" accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf">
												<Button>
													<Icon type="upload" /> Click to upload
												</Button>
											</Upload>
										)}
									</Form.Item>
									<Form.Item wrapperCol={{ span: 12, offset: 6 }}>
										<Button type="primary" htmlType="submit">Submit</Button>
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



const WrappedCreateAssignment = Form.create({ name: 'create_assignment' })(CreateAssignment);

const mapStateToProps = state => ({
	authenticated: state.authenticationReducer.authenticated,
	user: state.userReducer.user,
	course: state.coursesReducer.course
});

WrappedCreateAssignment.propTypes = {
	authenticated: PropTypes.bool.isRequired,
	user: PropTypes.object.isRequired,
	getCourseById: PropTypes.func.isRequired,
	course: PropTypes.object.isRequired,
	createAssignment: PropTypes.func.isRequired
};

export default connect(mapStateToProps, { getCourseById, createAssignment })(WrappedCreateAssignment);
