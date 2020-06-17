import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Redirect } from 'react-router'
import { Layout, Typography, Button, Divider } from 'antd';
import Moment from 'react-moment';
import moment from 'moment';
import 'moment-timezone';
import SideNav from '../SideNav/SideNav'
import InsideSideNav from '../SideNav/InsideSideNav';
import PropTypes from 'prop-types';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

class QuizDetails extends Component {

	
	// componentDidMount() {
	// 	console.log(`AssignmentId through URL: ${window.location.pathname.split('/')[4]}`);
	// 	// this.props.getCourseById(window.location.pathname.split('/')[4]);
	// }

	render() {

		let redirectVar = null;
		if (this.props.authenticated === false) {
			redirectVar = <Redirect to="/login"/>
		}

		// var quizAvailableTillDate = moment(this.props.quiz.QuizAvailableTill).tz("America/Los_Angeles").format("MMMM Do YYYY, h:mm:ss a");
		// var dateNow = moment().tz("America/Los_Angeles").format("MMMM Do YYYY, h:mm:ss a");
		// console.log(`quizAvailableTillDate- ${quizAvailableTillDate}`);
		// console.log(`dateNow - ${dateNow}`);

		// if (dateNow > quizAvailableTillDate) {
		// 	console.log(`date is past`);
		// } else {
		// 	console.log(`date is future`);
		// }

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
							{/* TODO: Check for isProfessor -> Change to false */}
								<Title level={2}>
									{this.props.quiz.QuizName}
									{
										localStorage.getItem("isProfessor") === "true" && <Button className="float-right center" type="primary" onClick={()=> {this.props.history.push(`/course/${this.props.course.CourseId}/quiz/${this.props.quiz.QuizId}/grade-quiz`)}}>Grade Quiz</Button>
									}

									{/* {
										localStorage.getItem("isProfessor") === "false" && <Button className="float-right center" type="primary" onClick={()=> {this.props.history.push(`/course/${this.props.course.CourseId}/quiz/${this.props.quiz.QuizId}/take-quiz`)}}>Take Quiz</Button>
									} */}
									
									{
										(
											localStorage.getItem("isProfessor") === "false" && moment().tz("America/Los_Angeles").format("MMMM Do YYYY, h:mm:ss a") <= moment(this.props.quiz.QuizAvailableTill).tz("America/Los_Angeles").format("MMMM Do YYYY, h:mm:ss a")
										) &&
											<Button className="float-right center" type="primary" 
												onClick={()=> {
													this.props.history.push(`/course/${this.props.course.CourseId}/quiz/${this.props.quiz.QuizId}/take-quiz`)
													}}>
												Take Quiz
											</Button>
										
									}

								
								</Title>
								Due:&nbsp;
								<Moment tz="America/Los_Angeles" format="MMMM Do YYYY, h:mm a">
									{this.props.quiz.QuizAvailableTill}
								</Moment>
								<Divider style={{width: 2}} type="vertical" />
								Points: {this.props.quiz.QuizTotalMarks}
								<br/>
								<Divider />
								{this.props.quiz.QuizInstruction}
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
	quiz: state.quizReducer.quiz
});

QuizDetails.propTypes = {
	authenticated: PropTypes.bool.isRequired,
	user: PropTypes.object.isRequired,
	course: PropTypes.object.isRequired,
	assignment: PropTypes.object.isRequired,
	quiz: PropTypes.object.isRequired
};

export default connect(mapStateToProps, {  })(QuizDetails);