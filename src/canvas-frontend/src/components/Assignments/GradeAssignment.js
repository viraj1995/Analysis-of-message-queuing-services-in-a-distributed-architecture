import React, { Component } from "react";
import { Layout, Typography, Button, Collapse, Divider, Form, InputNumber } from 'antd';
import { connect } from 'react-redux';
import { Redirect } from 'react-router'
import { gradeAssignment } from '../../actions/assignmentActions';
// import { getCourseById } from '../../actions/courseActions';
import { Document, Page, pdfjs } from 'react-pdf';

import moment from "moment";
import SideNav from '../SideNav/SideNav'
import InsideSideNav from '../SideNav/InsideSideNav';
import PropTypes from 'prop-types';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;
const { Panel } = Collapse;

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export class GradeAssignment extends Component {


	constructor(props) {
		super(props);
		this.state = {
			numPages: null,
			pageNumber: 1
		};
	}

	goToPrevPage = () => {
		if(this.state.pageNumber > 1) {
			this.setState(state => ({ pageNumber: state.pageNumber - 1 }));
		}
	}
	
	
  	goToNextPage = () => {
		if(this.state.pageNumber < this.state.numPages) {
			this.setState(state => ({ pageNumber: state.pageNumber + 1 }));
		}
	}
    
	onDocumentLoad = ({ numPages }) => {
		this.setState({ numPages });
	}

	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFieldsAndScroll((err, values) => {
			if (!err) {

				console.log('Received values of form: ', values);

				var assignment = this.props.selectedAssignment;
				assignment.AssignmentGrade = values.AssignmentGrade;
				assignment.AssignmentStatus = 'Graded';

				console.log(`Graded Assignment - ${assignment}`);

				this.props.gradeAssignment(this.props.selectedUserForAssignmentGrading.UserId, this.props.course.CourseId, assignment);
				this.props.history.push(`/course/${this.props.course.CourseId}/assignment/${this.props.selectedAssignment.AssignmentName}/search-assignment`)

				// this.props.createCourse(values)
				
				// /course/5caab2f1d746ce1298726342/assignment/5cabd5a48cdbcc0820ee0dac/search-assignment
			}
		});
	}
	

	callback = (key) => {
		console.log(key);
	}

	render() {

		const { pageNumber, numPages } = this.state;

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
					{this.props.course.CourseDepartment}-{this.props.course.CourseNumber} > Assignments > {this.props.assignment.AssignmentName} > Grade > {this.props.selectedUserForAssignmentGrading.LastName}
				</Header>
				<Layout  style={{marginLeft: 200, position:'fluid' }}>
					<InsideSideNav/>
					<Layout  style={{marginLeft: 200, position:'fluid'}}>
						<Content  style={{ margin: '0 16px', marginTop: 70 }}>
							<div style={{ padding: 40, background: '#fff', minHeight:'85vh'}}>
								<Title level={2}> Grading <Button className="float-right center" type="primary" onClick={()=>{this.props.history.push(`/course/${this.props.course.CourseId}/assignment/${this.props.selectedAssignment.AssignmentName}/search-assignment`)}}>Back to user submissions</Button></Title>
								<br/>
								<br/>
								{
									this.props.selectedAssignment.AssignmentSubmissions.map(assignmentSubmission => 
										<Collapse onChange={this.callback}>
											<Panel header={`Submitted on - ${moment(assignmentSubmission.SubmissionTimeStamp).tz("America/Los_Angeles").format("MMMM Do YYYY, h:mm:ss a")}`} key={assignmentSubmission.SubmissionId}>
												{
													
													assignmentSubmission.SubmissionFiles.map(assignmentSubmissionFile => 
														<div>
														<Document
															file={assignmentSubmissionFile.url}
															onLoadSuccess={this.onDocumentLoad.bind(this)}
															onLoadError={(error)=>{console.log(`Error PDF load - ${error}`)}}
														>
														<Page pageNumber={pageNumber} />
														</Document>
														<div className="row">
															<div className="col text-center">
															<p>Page {pageNumber} of {numPages}</p>
															<Button type="primary" onClick={this.goToPrevPage}>Prev</Button> 
															&nbsp;
															&nbsp;
															<Button type="primary" onClick={this.goToNextPage}>Next</Button> 
															</div>
														</div>
														<br/>
														<br/>
														<Divider />
														<br/>
														</div>
													)
													
												}
												<div>
													{assignmentSubmission.SubmissionComment}
												</div>
											</Panel>
										</Collapse>
									)
									
								}

								<br/>
								<Divider/>
								<br/>
								{
									this.props.selectedAssignment.AssignmentStatus === "Ungraded" &&
									<Form {...formItemLayout} onSubmit={this.handleSubmit}>
										<Form.Item label="Grade" >
											{getFieldDecorator('AssignmentGrade', { 
												initialValue: 0,
												rules: [{
													required: true, message: 'Please enter Grade for the Assignment!',
												}]
											})(
												<InputNumber min={0} max={parseInt(this.props.selectedAssignment.AssignmentMaxMarks, 10)} />
											)}
											<span className="ant-form-text">/ {`${this.props.selectedAssignment.AssignmentMaxMarks}`} points</span>
										</Form.Item>
										<Form.Item wrapperCol={{ span: 12, offset: 6 }}>
											<Button type="danger" onClick={()=> {
												this.props.history.push(`/course/${this.props.course.CourseId}/assignment/${this.props.assignment.AssignmentId}/search-assignment`);
											}}>Cancel</Button> &nbsp; &nbsp; &nbsp;
											<Button type="primary" htmlType="submit">Grade</Button>
										</Form.Item>
									</Form>
								}
								{
									this.props.selectedAssignment.AssignmentStatus === "Graded" &&
									<div className="row">
										<div className="col text-center">
											Graded <br/>
											<span>{this.props.selectedAssignment.AssignmentGrade} / {this.props.selectedAssignment.AssignmentMaxMarks} points</span>
										</div>
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

const WrappedGradeAssignment = Form.create({ name: 'grade_assignment' })(GradeAssignment);

const mapStateToProps = state => ({
	authenticated: state.authenticationReducer.authenticated,
	user: state.userReducer.user,
	course: state.coursesReducer.course,
	assignment: state.assignmentReducer.assignment,
	usersWithSubmission: state.assignmentReducer.usersWithSubmission,
	selectedAssignment: state.assignmentReducer.selectedAssignment,
	selectedUserForAssignmentGrading: state.assignmentReducer.selectedUserForAssignmentGrading
});

WrappedGradeAssignment.propTypes = {
	authenticated: PropTypes.bool.isRequired,
	user: PropTypes.object.isRequired,
	course: PropTypes.object.isRequired,
	assignment: PropTypes.object.isRequired,
	usersWithSubmission: PropTypes.array.isRequired,
	selectedAssignment: PropTypes.object.isRequired,
	selectedUserForAssignmentGrading: PropTypes.object.isRequired,

	gradeAssignment: PropTypes.func.isRequired
};

export default connect(mapStateToProps, { gradeAssignment })(WrappedGradeAssignment);