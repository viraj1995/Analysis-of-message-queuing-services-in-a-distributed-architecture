import React, { Component } from "react";
import { Layout, List, Typography, Button, Divider, Form, Upload, Icon } from 'antd';
import { connect } from 'react-redux';
import { Redirect } from 'react-router'
import { getLectureNotesByCourseId, saveLectureNotesByCourseId } from '../../actions/fileActions';

import SideNav from '../SideNav/SideNav'
import InsideSideNav from '../SideNav/InsideSideNav';
import PropTypes from 'prop-types';
import axios from 'axios';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

var uploadedfileList= [];

export class Files extends Component {

	constructor(props) {
		super(props);
		this.state = {
			wantToUploadFileBaby: false
		}
	}

	componentDidMount() {
		// get all lecture notes for the course
		this.props.getLectureNotesByCourseId(this.props.course.CourseId);
		// setTimeout(() => {

		// }, 2000);
	}

	

	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				console.log('Received values of form: ', values);
				values.LectureFiles = uploadedfileList;
				console.log('Received values of form: ', values);

				this.props.saveLectureNotesByCourseId(this.props.course.CourseId, values);
				this.setState({
					wantToUploadFileBaby: false
				})
				uploadedfileList= [];
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


		var lectureFiles = [];
		this.props.files.map(lectureFile =>
			lectureFiles.push({
				key: lectureFile.uid,
				name: lectureFile.name,
				url: lectureFile.url
			})
		);

		let redirectVar = null;
		if (this.props.authenticated === false) {
			redirectVar = <Redirect to="/login"/>
		}

		return (
			<Layout>
				{ redirectVar }
				<SideNav/>
				<Header style={{ background: '#fff', position: 'fixed', zIndex: 1, width: '100%', fontWeight:'bold', fontSize:20, marginLeft: 200 }}>
					{this.props.course.CourseDepartment}-{this.props.course.CourseNumber} > Files
				</Header>
				<Layout  style={{marginLeft: 200, position:'fluid' }}>
					<InsideSideNav/>
					<Layout  style={{marginLeft: 200, position:'fluid'}}>
						<Content  style={{ margin: '0 16px', marginTop: 70 }}>
							<div style={{ padding: 40, background: '#fff', minHeight:'85vh'}}>
								<Title level={2}>Lecture Files 
									{
										localStorage.getItem("isProfessor") === 'true' && <Button className="float-right center" type="primary" onClick={()=>{this.setState({wantToUploadFileBaby: true})}}>Upload Files</Button>
									} 
								</Title>
								<Divider/>
								<List
									size="small"
									split={false}
									dataSource={lectureFiles}
									renderItem={
										item => (
											<List.Item key={item.key}>
												<a href={item.url}>
													{item.name}
												</a>
											</List.Item>
										)
									}
								/>
								{
									this.state.wantToUploadFileBaby === true && 
									<div>
										<br/>
										<Divider/>
										<br/>
										<Form {...formItemLayout} onSubmit={this.handleSubmit}>
											<Form.Item label="Files">
												{getFieldDecorator('LectureFiles', {
													valuePropName: 'fileList',
													getValueFromEvent: this.normFile,
													rules: [{
														required: true, message: 'Please select the file to upload!',
													}],
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
																		
														listType="text" accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf">
														<Button>
															<Icon type="upload" /> Click to upload
														</Button>
													</Upload>
												)}
											</Form.Item>
											<Form.Item wrapperCol={{ span: 12, offset: 6 }}>
												<Button type="danger" onClick={()=>{this.setState({wantToUploadFileBaby: false})}}>Cancel</Button> &nbsp; &nbsp; &nbsp;
												<Button type="primary" htmlType="submit">Upload</Button>
											</Form.Item>
										</Form>
									</div>
								}
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

const WrappedFiles = Form.create({ name: 'file_upload' })(Files);

const mapStateToProps = state => ({
	authenticated: state.authenticationReducer.authenticated,
	user: state.userReducer.user,
	course: state.coursesReducer.course,
	files: state.fileReducer.files
});

WrappedFiles.propTypes = {
	authenticated: PropTypes.bool.isRequired,
	user: PropTypes.object.isRequired,
	course: PropTypes.object.isRequired,
	getLectureNotesByCourseId: PropTypes.func.isRequired,
	files: PropTypes.array.isRequired,
	saveLectureNotesByCourseId: PropTypes.func.isRequired
};

export default connect(mapStateToProps, { getLectureNotesByCourseId, saveLectureNotesByCourseId })(WrappedFiles);