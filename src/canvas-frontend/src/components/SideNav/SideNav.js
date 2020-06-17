import React, { Component } from 'react'
import { Layout, Menu, Icon, Avatar } from 'antd';
import { connect } from 'react-redux';
import { Redirect } from 'react-router'
import { getCourses, getCourseDetails, getCourseById } from '../../actions/courseActions';
import { getUserById } from '../../actions/userActions'
import { logout } from '../../actions/authenticationActions';
import { withRouter } from 'react-router'
import { getAssignmentsByCourseId } from '../../actions/assignmentActions';

// import Profile from '../Profile/Profile'
import PropTypes from 'prop-types';

const { Sider } = Layout;
const SubMenu = Menu.SubMenu;

class SideNav extends Component {

	clickedMenu = (event) => {
		console.log("Each on click");

		console.log(`CourseDetails CourseId: ${event.key}`);

		this.props.getCourseById(event.key);

		// this.props.getCourseDetails(event.key);
		// this.props.getAssignmentsByCourseId(event.key);
		this.props.history.push(`/course/${event.key}`)
	}

	handleLogout = (event) => {
		console.log(`LOGOUT CALLING!`);
		this.props.logout();
	}

	handleAccount = (event) => {
		this.props.history.push('/profile')
	}

	componentDidMount() {
		// this.props.getCourses();
		this.props.getUserById();
	}

	render() {

		let coursesDropDown = this.props.user.Courses.map(course => {
			if (course.CourseStatus !== 'Waitlisted') {
				return <Menu.Item key={course.CourseId} onClick={this.clickedMenu}>
					{course.CourseDepartment}-{course.CourseNumber}
				</Menu.Item>
			}
		});
		

		let redirectVar = null
		if (this.props.authenticated === false) {
			redirectVar = <Redirect to="/login" />
		}

		return (
			<Sider style={{ overflow: 'auto', height: '100%', position: 'fixed', left: 0}} >
				{ redirectVar }
				<div className="logo" onClick={()=>{this.props.history.push('/')}}>
					<Avatar shape="square" size="large" style={{ width: '100%', height: '64px'}} src="https://scontent-sjc3-1.xx.fbcdn.net/v/t1.0-9/53208702_2366155286782073_8801676282124304384_n.jpg?_nc_cat=108&_nc_ht=scontent-sjc3-1.xx&oh=74c3309ff5dd2f51d9a4d0c0c7995184&oe=5D0CE11A" />
				</div>
				<Menu theme="dark" mode="inline">
					<Menu.Item key="account" style={{ textAlign: 'center', paddingTop:10, height: '60px' }} onClick={()=>{this.props.history.push('/profile')}}>
						<div style={{verticalAlign: 'middle'}}>
							<Avatar size="large" src={this.props.user.ProfileImage} />
						</div>
					</Menu.Item>
					<Menu.Item key="dashboard" onClick={()=>{this.props.history.push('/')}}>
						<Icon type="dashboard" />
						<span>Dashboard</span>
					</Menu.Item>
					<SubMenu key="courses" title={<span><Icon type="read" /><span>Courses</span></span>}  onTitleClick={this.handleCourses}>
						{coursesDropDown}
					</SubMenu>
					<Menu.Item key="logout" onClick={this.handleLogout}>
						<Icon type="logout" />
						<span>Logout</span>
					</Menu.Item>
				</Menu>
			</Sider>
			
		)
	}
}

SideNav.propTypes = {
	// getCourses: PropTypes.func.isRequired,
	// courses: PropTypes.array.isRequired,
	logout: PropTypes.func.isRequired,
	authenticated: PropTypes.bool.isRequired,
	// getCourseDetails: PropTypes.func.isRequired,
	// getAssignmentsByCourseId: PropTypes.func.isRequired,
	getUserById: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired,
	getCourseById: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	// courses: state.coursesReducer.courses,
	authenticated: state.authenticationReducer.authenticated,
	// assignments: state.authenticationReducer.assignments,
	user: state.userReducer.user
});

export default withRouter(connect(mapStateToProps, { getCourses, logout, getCourseDetails, getAssignmentsByCourseId, getUserById, getCourseById })(SideNav));