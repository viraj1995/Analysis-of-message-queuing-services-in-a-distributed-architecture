import React, { Component } from 'react'
import { Menu, Layout } from 'antd';
import { connect } from 'react-redux';
import { Redirect } from 'react-router'
import PropTypes from 'prop-types';
import { withRouter } from 'react-router'
// import { getCourseById } from '../../actions/courseActions';

const { Sider } = Layout;

export class InsideSideNav extends Component {


	componentDidMount() {
		// this.props.getCourseById()
	}
	

	render() {

		let redirectVar = null;
		if (this.props.authenticated === false) {
			redirectVar = <Redirect to="/login"/>
		}

		return (
			<Sider style={{ overflow: 'auto', height: '100%', position: 'fixed', left: 200 }} >
				{ redirectVar }
				<Menu onClick={this.handleClick} style={{ position: 'fixed', left: 200, width: 200, marginTop: 65, height: '100%' }} mode="inline">
					<Menu.Item key="home" onClick={()=>{this.props.history.push(`/course/${this.props.course.CourseId}`)}}>
						<span>Home</span>
					</Menu.Item>
					<Menu.Item key="announcements" onClick={()=>{this.props.history.push(`/course/${this.props.course.CourseId}/announcements`)}}>
						<span>Announcements</span>
					</Menu.Item>
					<Menu.Item key="assignments" onClick={()=>{this.props.history.push(`/course/${this.props.course.CourseId}/assignments`)}}>
						<span>Assignments</span>
					</Menu.Item>
					<Menu.Item key="people" onClick={()=>{this.props.history.push(`/course/${this.props.course.CourseId}/people`)}}>
						<span>People</span>
					</Menu.Item>
					<Menu.Item key="files" onClick={()=>{this.props.history.push(`/course/${this.props.course.CourseId}/files`)}}>
						<span>Files</span>
					</Menu.Item>
					<Menu.Item key="quizzes" onClick={()=>{this.props.history.push(`/course/${this.props.course.CourseId}/quizzes`)}}>
						<span>Quizzes</span>
					</Menu.Item>
				</Menu>
			</Sider>
		)
	}
}

const mapStateToProps = state => ({
	authenticated: state.authenticationReducer.authenticated,
	course: state.coursesReducer.course
});

InsideSideNav.propTypes = {
	authenticated: PropTypes.bool.isRequired,
	course: PropTypes.object.isRequired
};

export default withRouter(connect(mapStateToProps, null)(InsideSideNav));
