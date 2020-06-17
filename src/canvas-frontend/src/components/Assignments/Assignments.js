import React, { Component } from 'react'
import { Layout, List, Avatar, Typography, Button } from 'antd';
import { connect } from 'react-redux';
import { Redirect } from 'react-router'
import { getAssignmentById, getAssignmentForGrades } from '../../actions/assignmentActions';
import { getCourseById } from '../../actions/courseActions';

import moment from "moment";
import SideNav from '../SideNav/SideNav'
import InsideSideNav from '../SideNav/InsideSideNav';
import PropTypes from 'prop-types';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

class Assignments extends Component {

	componentDidMount() {
		console.log(`CourseId through URL: ${window.location.pathname.split('/')[2]}`);
		this.props.getCourseById(this.props.course.CourseId);
	}

	render() {

		var assignmentData = [];
		this.props.course.Assignments.map(assignment =>
			assignmentData.push({
				key: assignment.AssignmentId,
				title: assignment.AssignmentName,
				dueDate: moment(assignment.AssignmentDueDate).format("MMMM Do YYYY, h:mm:ss a"),
				maxMarks: assignment.AssignmentMaxMarks,
				shortDesc: `Due: ${moment(assignment.AssignmentDueDate).format("MMMM Do YYYY, h:mm:ss a")} | Points: ${assignment.AssignmentMaxMarks}`
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
					{this.props.course.CourseDepartment}-{this.props.course.CourseNumber} > Assignments
				</Header>
				<Layout  style={{marginLeft: 200, position:'fluid' }}>
					<InsideSideNav/>
					<Layout  style={{marginLeft: 200, position:'fluid'}}>
						<Content  style={{ margin: '0 16px', marginTop: 70 }}>
							<div style={{ padding: 40, background: '#fff', minHeight:'85vh'}}>
								<List
									itemLayout="vertical"
									dataSource={assignmentData}
									header={<Title level={2}>Assignments {localStorage.getItem("isProfessor") === 'true' && <Button className="float-right center" type="primary" onClick={()=>{this.props.history.push(`/course/${this.props.course.CourseId}/create-assignment`)}}>Create Assignment</Button>} </Title> }
									pagination={{ pageSize: 5 }}
									renderItem={item => (
										<List.Item key={item.key} onClick={()=>
											{
												let selectedAssignment = this.props.course.Assignments.filter(assignment => {
													return (
														assignment.AssignmentId === item.key
													)
												});
												console.log(`Ide assignment selected: ${selectedAssignment[0].AssignmentName}`);
												this.props.getAssignmentById(this.props.course.CourseId, selectedAssignment);
												this.props.getAssignmentForGrades(localStorage.getItem("userId"), this.props.course.CourseId, selectedAssignment);
												this.props.history.push(`/course/${this.props.course.CourseId}/assignment/${item.key}`)
											}}>
											<List.Item.Meta
												avatar={<Avatar src="https://scontent-sjc3-1.xx.fbcdn.net/v/t1.0-9/54436971_2379589788771956_6737219063535108096_n.jpg?_nc_cat=103&_nc_ht=scontent-sjc3-1.xx&oh=741a557e06413edce36b1ca6e08ca2d6&oe=5D16BE4D" />}
												title={item.title}
												description={item.shortDesc}
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
	course: state.coursesReducer.course
});

Assignments.propTypes = {
	authenticated: PropTypes.bool.isRequired,
	getAssignmentById: PropTypes.func.isRequired,
	getAssignmentForGrades: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired,
	getCourseById: PropTypes.func.isRequired,
	course: PropTypes.object.isRequired
};

export default connect(mapStateToProps, { getAssignmentById, getCourseById, getAssignmentForGrades })(Assignments);