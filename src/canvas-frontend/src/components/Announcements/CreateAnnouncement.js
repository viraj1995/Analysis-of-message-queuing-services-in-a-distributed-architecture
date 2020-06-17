import React, { Component } from 'react'
import { Form, Input, message, Button, Upload, Icon,  Layout, Typography } from 'antd';
import { connect } from 'react-redux';
import { Redirect } from 'react-router'
import { getCourseById } from '../../actions/courseActions';
import { createAnnouncement } from '../../actions/announcementActions';

import moment from 'moment';

import axios from 'axios';
import PropTypes from 'prop-types';
import SideNav from '../SideNav/SideNav'
import InsideSideNav from '../SideNav/InsideSideNav';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;
const { TextArea } = Input;

var uploadedfileList= [];

export class CreateAnnouncement extends Component {

	componentDidMount() {
		console.log(`CourseId through URL: ${window.location.pathname.split('/')[2]}`);
		this.props.getCourseById(this.props.course.CourseId);
	}

	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				console.log('Received values of create announcement form: ', values);

				console.log(`AnnouncementName: ${values.AnnouncementName}`)
				console.log(`AnnouncementDescription: ${values.AnnouncementDescription}`)
				console.log(`AnnouncementFiles: ${values.AnnouncementFiles}`)

				console.log(`AnnouncementPostedOn: ${moment.utc().format()}`);
				console.log(`AnnouncementPostedByUserId: ${localStorage.getItem("userId")}`)
				console.log(`AnnouncementPostedByUserName: ${localStorage.getItem("userName")}`)

				values['AnnouncementPostedOn'] = moment.utc().format();
				values['AnnouncementPostedByUserId'] = localStorage.getItem("userId");
				values['AnnouncementPostedByUserName'] = localStorage.getItem("userName");
				values.AnnouncementFiles = uploadedfileList;

				this.props.createAnnouncement(this.props.course.CourseId, values);
				uploadedfileList= [];
				setTimeout(() => {
					this.props.history.push(`/course/${this.props.course.CourseId}/announcements`);
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
					Create Announcement
				</Header>
				<Layout  style={{marginLeft: 200, position:'fluid' }}>
					<InsideSideNav/>
					<Layout  style={{marginLeft: 200, position:'fluid'}}>
						<Content  style={{ margin: '0 16px', marginTop: 70 }}>
							<div style={{ padding: 40, background: '#fff', minHeight:'85vh'}}>
								<Title style={{ textAlign:'center' }} level={2}> Create Announcement </Title>
								<br/>
								<Form {...formItemLayout} onSubmit={this.handleSubmit}>
									<Form.Item label="Name" hasFeedback>
										{getFieldDecorator('AnnouncementName', {
											rules: [{
												required: true, message: 'Please enter Announcement Name!',
											}]
										})(
											<Input />
										)}
									</Form.Item>
									<Form.Item label="Description">
										{getFieldDecorator('AnnouncementDescription', {})(
											<TextArea rows={4} placeholder="Describe the Announcement here" autosize />
										)}
									</Form.Item>
									
									<Form.Item label="Files">
										{getFieldDecorator('AnnouncementFiles', {
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
																			message.success('Successfully uploaded');
																			onSuccess(res.statusText);
																			console.log(`State: ${Object.values(uploadedfileList)}`)
																		})
																		.catch((err, Error) => {
																			console.log(err)
																			message.error('Upload failed');
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

const WrappedCreateAnnouncement = Form.create({ name: 'create_announcement' })(CreateAnnouncement);

const mapStateToProps = state => ({
	authenticated: state.authenticationReducer.authenticated,
	user: state.userReducer.user,
	course: state.coursesReducer.course
});

WrappedCreateAnnouncement.propTypes = {
	authenticated: PropTypes.bool.isRequired,
	user: PropTypes.object.isRequired,
	getCourseById: PropTypes.func.isRequired,
	course: PropTypes.object.isRequired,
	createAnnouncement: PropTypes.func.isRequired
};

export default connect(mapStateToProps, { getCourseById, createAnnouncement })(WrappedCreateAnnouncement);




