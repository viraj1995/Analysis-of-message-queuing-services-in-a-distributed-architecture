import React, { Component } from "react";
import { Layout, List, Avatar, Typography } from 'antd';
import { connect } from 'react-redux';
import { Redirect } from 'react-router'
import { findUsersWithAssignmentSubmissions, getAssignmentByUserIdAndCourseId, selectedUserForAssignmentGrading } from '../../actions/assignmentActions';
// import { getCourseById } from '../../actions/courseActions';

// import moment from "moment";
import SideNav from '../SideNav/SideNav'
import InsideSideNav from '../SideNav/InsideSideNav';
import PropTypes from 'prop-types';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

export class SearchUsersGradeAssignment extends Component {


	componentDidMount() {
		this.props.findUsersWithAssignmentSubmissions(this.props.course.CourseId, this.props.assignment.AssignmentId);
	}

	render() {

		var userData = [];
		this.props.usersWithSubmission.map(user =>
			userData.push({
				key: user.UserId,
				title: `${user.FirstName} ${user.LastName}`
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
					{this.props.course.CourseDepartment}-{this.props.course.CourseNumber} > Assignments > {this.props.assignment.AssignmentName}
				</Header>
				<Layout  style={{marginLeft: 200, position:'fluid' }}>
					<InsideSideNav/>
					<Layout  style={{marginLeft: 200, position:'fluid'}}>
						<Content  style={{ margin: '0 16px', marginTop: 70 }}>
							<div style={{ padding: 40, background: '#fff', minHeight:'85vh'}}>
								<List
									itemLayout="vertical"
									dataSource={userData}
									header={<Title level={2}>Students Submitted</Title> }
									pagination={{ pageSize: 5 }}
									renderItem={item => (
										<List.Item key={item.key} 
										onClick={()=>
											{
												let selectedUser = this.props.usersWithSubmission.filter(user => {
													return (
														user.UserId === item.key
													)
												});
												console.log(`Ide assignment selected: ${selectedUser[0].FirstName}`);

												this.props.getAssignmentByUserIdAndCourseId(selectedUser[0].UserId, this.props.course.CourseId, this.props.assignment.AssignmentId);
												this.props.selectedUserForAssignmentGrading(selectedUser[0]);
												this.props.history.push(`/course/${this.props.course.CourseId}/assignment/${this.props.assignment.AssignmentId}/grade-assignment`)
											}}>
											<List.Item.Meta
												avatar={<Avatar src="https://scontent-sjc3-1.xx.fbcdn.net/v/t1.0-9/54436971_2379589788771956_6737219063535108096_n.jpg?_nc_cat=103&_nc_ht=scontent-sjc3-1.xx&oh=741a557e06413edce36b1ca6e08ca2d6&oe=5D16BE4D" />}
												title={item.title}
											/>
										</List.Item>
									)}
								/>
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
	usersWithSubmission: state.assignmentReducer.usersWithSubmission,
	selectedAssignment: state.assignmentReducer.selectedAssignment,

	
});

SearchUsersGradeAssignment.propTypes = {
	authenticated: PropTypes.bool.isRequired,
	user: PropTypes.object.isRequired,
	course: PropTypes.object.isRequired,
	assignment: PropTypes.object.isRequired,
	usersWithSubmission: PropTypes.array.isRequired,
	findUsersWithAssignmentSubmissions: PropTypes.func.isRequired,
	selectedAssignment: PropTypes.object.isRequired,
	getAssignmentByUserIdAndCourseId: PropTypes.func.isRequired,
	selectedUserForAssignmentGrading: PropTypes.func.isRequired
};

export default connect(mapStateToProps, { findUsersWithAssignmentSubmissions, getAssignmentByUserIdAndCourseId, selectedUserForAssignmentGrading })(SearchUsersGradeAssignment);
