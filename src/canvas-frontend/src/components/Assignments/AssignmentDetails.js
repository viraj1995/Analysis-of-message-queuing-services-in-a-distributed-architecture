import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Redirect } from 'react-router'
import { Layout, Typography, Button, Divider, List } from 'antd';
import Moment from 'react-moment';
import 'moment-timezone';
import SideNav from '../SideNav/SideNav'
import InsideSideNav from '../SideNav/InsideSideNav';
import PropTypes from 'prop-types';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

class AssignmentDetails extends Component {

	
	// componentDidMount() {
	// 	console.log(`AssignmentId through URL: ${window.location.pathname.split('/')[4]}`);
	// 	// this.props.getCourseById(window.location.pathname.split('/')[4]);
	// }

	render() {

		let redirectVar = null;
		if (this.props.authenticated === false) {
			redirectVar = <Redirect to="/login"/>
		}

		var assignmentFiles = [];
		this.props.assignment.AssignementFiles.map(assignmentFile =>
			assignmentFiles.push({
				key: assignmentFile.uid,
				name: assignmentFile.name,
				url: assignmentFile.url
			})
		);

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
									{
										localStorage.getItem("isProfessor") === "false" && <Button className="float-right center" type="primary" onClick={()=> {this.props.history.push(`/course/${this.props.course.CourseId}/assignment/${this.props.assignment.AssignmentId}/submit-assignment`)}}>Submit Assignment</Button>
									}
									{
										localStorage.getItem("isProfessor") === "true" && <Button className="float-right center" type="primary" onClick={()=> {this.props.history.push(`/course/${this.props.course.CourseId}/assignment/${this.props.assignment.AssignmentId}/search-assignment`)}}>Grade Assignment</Button>
									}
								</Title>
								Due:&nbsp;
								<Moment tz="America/Los_Angeles" format="MMMM Do YYYY, h:mm:ss a">
									{this.props.assignment.AssignmentDueDate}
								</Moment>
								<Divider style={{width: 2}} type="vertical" />
								Points: {this.props.assignment.AssignmentMaxMarks}
								<br/>
								<Divider />
								{this.props.assignment.AssignmentDescription}
								<br/>
								<Divider>Files</Divider>
								<List
									size="small"
									split={false}
									dataSource={assignmentFiles}
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
									(this.props.assignmentForGrade.AssignmentStatus === "Graded") &&
									<div>
										<Divider>Grades</Divider>
										<div className="row">
											<div className="col text-center">
												Graded <br/>
												<br/>
												<span>{this.props.assignmentForGrade.AssignmentGrade} / {this.props.assignmentForGrade.AssignmentMaxMarks} points</span>
											</div>
										</div>
									</div>
								}
								{
									(this.props.assignmentForGrade.AssignmentStatus === "Ungraded") &&
									<Divider>Not Graded</Divider>
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

const mapStateToProps = state => ({
	authenticated: state.authenticationReducer.authenticated,
	user: state.userReducer.user,
	course: state.coursesReducer.course,
	assignment: state.assignmentReducer.assignment,
	assignmentForGrade: state.assignmentReducer.assignmentForGrade
});

AssignmentDetails.propTypes = {
	authenticated: PropTypes.bool.isRequired,
	user: PropTypes.object.isRequired,
	course: PropTypes.object.isRequired,
	assignment: PropTypes.object.isRequired,
	assignmentForGrade: PropTypes.object.isRequired
};

export default connect(mapStateToProps, {  })(AssignmentDetails);