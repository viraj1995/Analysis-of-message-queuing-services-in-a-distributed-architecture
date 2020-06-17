import React, { Component } from 'react'
import {  Layout, List, Avatar, Typography, Button } from 'antd';
import { connect } from 'react-redux';
import { getCourseById } from '../../actions/courseActions';
import { getQuizById } from '../../actions/quizActions';
import { Redirect } from 'react-router'
import moment from 'moment';

import PropTypes from 'prop-types';
import SideNav from '../SideNav/SideNav'
import InsideSideNav from '../SideNav/InsideSideNav';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

export class Quiz extends Component {

	componentDidMount() {
		this.props.getCourseById(this.props.course.CourseId);
	}

	render() {

		var quizData = [];
		this.props.course.Quizzes.map(quiz => 
			quizData.push({
				key: quiz.QuizId,
				title: quiz.QuizName,
				dueDate: moment(quiz.QuizAvailableTill).format("MMMM Do YYYY, h:mm a"),
				maxMarks: quiz.QuizTotalMarks,
				shortDesc: `Due: ${moment(quiz.QuizAvailableTill).format("MMMM Do YYYY, h:mm a")}  |  Points: ${quiz.QuizTotalMarks}`
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
					{this.props.course.CourseDepartment}-{this.props.course.CourseNumber} > Quizzes
				</Header>
				<Layout  style={{marginLeft: 200, position:'fluid' }}>
					<InsideSideNav/>
					<Layout  style={{marginLeft: 200, position:'fluid'}}>
						<Content  style={{ margin: '0 16px', marginTop: 70 }}>
							<div style={{ padding: 40, background: '#fff', minHeight:'85vh'}}>
								<List
									itemLayout="vertical"
									dataSource={quizData}
									header={<Title level={2}>Quizzes {localStorage.getItem("isProfessor") === "true" && <Button className="float-right center" type="primary" onClick={()=>{this.props.history.push(`/course/${this.props.course.CourseId}/create-quiz`)}}>Create Quiz</Button>} </Title> }
									pagination={{ pageSize: 5 }}
									renderItem={item => (
										<List.Item key={item.key} onClick={()=>
											{
												let selectedQuiz = this.props.course.Quizzes.filter(quiz => {
													return (
														quiz.QuizId === item.key
													)
												});
												console.log(`Ide quiz selected: ${selectedQuiz[0].QuizName}`);
												this.props.getQuizById(this.props.course.CourseId, selectedQuiz);
												this.props.history.push(`/course/${this.props.course.CourseId}/quiz/${item.key}`)
											}}>
											<List.Item.Meta
												avatar={<Avatar src="https://scontent-sjc3-1.xx.fbcdn.net/v/t1.0-9/56702274_2416862001711401_2525204022860709888_n.jpg?_nc_cat=109&_nc_ht=scontent-sjc3-1.xx&oh=db219571ee8802761b9c2a9969d38527&oe=5D4963D0" />}
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

Quiz.propTypes = {
	authenticated: PropTypes.bool.isRequired,
	getQuizById: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired,
	getCourseById: PropTypes.func.isRequired,
	course: PropTypes.object.isRequired
};

export default connect(mapStateToProps, { getCourseById, getQuizById })(Quiz)
