import React, { Component } from 'react'
import { Layout, Card, Icon, Button } from 'antd';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router'
import { getCourseById } from '../../actions/courseActions';
import Draggable from 'react-draggable';

import PropTypes from 'prop-types';
import SideNav from '../SideNav/SideNav'

const { Header, Content, Footer } = Layout;
const { Meta } = Card;

class Home extends Component {

	onCardClick = (courseid) => {
		console.log(`Each on card click in Dashboard - Courseid ${courseid}`);

		this.props.getCourseById(courseid);
		this.props.history.push(`/course/${courseid}`)
	}

	render() {
		let coursesCards = this.props.user.Courses.map(course => {
			if(course.CourseStatus !== 'Waitlisted') {
				let title = `${course.CourseTerm} ${course.CourseYear}: ${course.CourseDepartment}-${course.CourseNumber}`;
				return  (
				<Draggable>
					<Card key={course.CourseId} onClick={() => { this.onCardClick(course.CourseId) }} style={{ width: 300, margin: '0 36px 36px 0', float: 'left', backgroundColor: '#1a9ee0' }} actions={[<Icon type="sound" />, <Icon type="profile" />, <Icon type="message" />, <Icon type="folder" />]} >
					<Meta style={{ height: 125, textAlign: 'center', padding: 20, fontSize: 15, fontWeight: 'bold' }} title={title} description={course.CourseName} />
				</Card>
				</Draggable>
				)
			}
		});


		let redirectVar = null
		if (this.props.authenticated === false) {
			console.log(` Type of authenticated: ${this.props.authenticated.type}`);
			redirectVar = <Redirect to="/login" />
		}
	

		//TODO:  Change back to localStorage.getItem("isProfessor") === "true"redirect
		let button = null;
		if (localStorage.getItem("isProfessor") === "true") {
			button = <Button type="primary" onClick={()=>{this.props.history.push('/create-course')}}>Create Course</Button>;
		} else {
			button = <Button type="primary" icon="search" onClick={()=>{this.props.history.push('/search-course')}}>Search Courses</Button>;
		}

		return (
			<Layout>
				{ redirectVar }
				<SideNav/>
				<Layout style={{marginLeft: 200, position:'fluid'}}>
					<Header style={{ background: '#fff', position: 'fixed', zIndex: 1, width: '100%', fontWeight:'bold', fontSize:20 }}>
						Dashboard
					</Header>
					<Content style={{ margin: '0 16px', marginTop: 70 }}>
						<div style={{ padding: 40, background: '#fff', minHeight: '100vh'}}>
							<br/>
							<div className="container row text-center">
								<div className="col">
									{ button }
								</div>
							</div>
							<br/>
							<br/>
							<br/>
							
							<div>
								{coursesCards}
							</div>
							
							<br/>
						</div>
					</Content>
					<Footer style={{ textAlign: 'center' }}>
						© Copyright Canvas.com, Inc.<br/>
						All rights reserved.
					</Footer>
				</Layout>
			</Layout>
		);
	}
}


const mapStateToProps = state => ({
	authenticated: state.authenticationReducer.authenticated,
	user: state.userReducer.user,
	course: state.coursesReducer.course
});

Home.propTypes = {
	authenticated: PropTypes.bool.isRequired,
	user: PropTypes.object.isRequired,
	getCourseById: PropTypes.func.isRequired,
	course: PropTypes.object.isRequired
};

export default withRouter(connect(mapStateToProps, { getCourseById } )(Home));