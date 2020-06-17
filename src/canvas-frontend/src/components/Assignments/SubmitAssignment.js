import React, { Component } from 'react'
import { Form, Button, Upload, Icon, Divider, Layout, Typography, Input } from 'antd';
import { connect } from 'react-redux';
import { Redirect } from 'react-router'
import { submitAssignment } from '../../actions/assignmentActions';

import Moment from 'react-moment';
import moment from 'moment';
import 'moment-timezone';
import axios from 'axios';
import SideNav from '../SideNav/SideNav'
import InsideSideNav from '../SideNav/InsideSideNav';
import PropTypes from 'prop-types';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;
const { TextArea } = Input;

var uploadedfileList= [];

class SubmitAssignment extends Component {	


	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				console.log('Received values of form: ', values);

				console.log(`SubmissionComment: ${values.SubmissionComment}`)
				values['SubmissionTimeStamp'] = moment.utc().format();
				console.log(`SubmissionTimeStamp: ${values.SubmissionTimeStamp}`)
				values.SubmissionFiles = uploadedfileList;

				console.log(`=================================================================`)
				console.log(`=================================================================`)
				console.log(`AssignmentId - ${this.props.assignment.AssignmentId} `);
				console.log(`AssignmentName - ${this.props.assignment.AssignmentName} `);
				console.log(`AssignmentMaxMarks - ${this.props.assignment.AssignmentMaxMarks} `);
				console.log(`=================================================================`)
				console.log(`=================================================================`)

				values.AssignmentId = this.props.assignment.AssignmentId;
				values.AssignmentName = this.props.assignment.AssignmentName;
				values.AssignmentMaxMarks = this.props.assignment.AssignmentMaxMarks


				this.props.submitAssignment(this.props.course.CourseId, this.props.assignment.AssignmentId, values);
				uploadedfileList = [];
				this.props.history.push(`/course/${this.props.course.CourseId}`);


			}
		});
	}

	normFile = (e) => {
		console.log('Upload event:', e);
		if (Array.isArray(e)) {
			return e;
		}
		return e && e.fileList;
	}

	render() {

		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: { span: 6 },
			wrapperCol: { span: 14 }
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
					{this.props.course.CourseDepartment}-{this.props.course.CourseNumber} > Assignments > {this.props.assignment.AssignmentName}
				</Header>
				<Layout  style={{marginLeft: 200, position:'fluid' }}>
					<InsideSideNav/>
					<Layout  style={{marginLeft: 200, position:'fluid'}}>
						<Content  style={{ margin: '0 16px', marginTop: 70 }}>
							<div style={{ padding: 40, background: '#fff', minHeight:'85vh'}}>
								<Title level={2}>
									{this.props.assignment.AssignmentName}
								</Title>
								Due:&nbsp;
								<Moment tz="America/Los_Angeles" format="MMMM Do YYYY, h:mm:ss a">
									{this.props.assignment.AssignmentDueDate}
								</Moment>
								<Divider style={{width: 2}} type="vertical" />
								Points: {this.props.assignment.AssignmentMaxMarks}
								<br/>
								<Divider />
									<br/>
									<br/>
									<br/>
									<Form {...formItemLayout} onSubmit={this.handleSubmit}>
										<Form.Item label="Files">
											{getFieldDecorator('SubmissionFiles', {
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
										<Form.Item label="Comment">
											{getFieldDecorator('SubmissionComment', {})(
												<TextArea rows={4} placeholder="Comments" autosize />
											)}
										</Form.Item>
										<Form.Item wrapperCol={{ span: 12, offset: 6 }}>
											<Button type="danger" onClick={()=> {this.props.history.push(`/course/${this.props.course.CourseId}/assignment/${this.props.assignment.AssignmentId}`)}}>Cancel</Button> &nbsp; &nbsp; &nbsp;
											<Button type="primary" htmlType="submit">Submit Assignment</Button>
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

const WrappedSubmitAssignment = Form.create({ name: 'submit_assignment' })(SubmitAssignment);

const mapStateToProps = state => ({
	authenticated: state.authenticationReducer.authenticated,
	user: state.userReducer.user,
	course: state.coursesReducer.course,
	assignment: state.assignmentReducer.assignment
});

WrappedSubmitAssignment.propTypes = {
	authenticated: PropTypes.bool.isRequired,
	user: PropTypes.object.isRequired,
	course: PropTypes.object.isRequired,
	assignment: PropTypes.object.isRequired,
	submitAssignment: PropTypes.func.isRequired
};

export default connect(mapStateToProps, { submitAssignment })(WrappedSubmitAssignment);