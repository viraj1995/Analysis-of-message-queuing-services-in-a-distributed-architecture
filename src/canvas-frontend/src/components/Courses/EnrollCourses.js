import React, { Component } from 'react'
import { enrollCourse, waitlistCourse, dropCourse } from '../../actions/courseActions';
import { connect } from 'react-redux';
import { Layout, Table, Button, Icon, notification } from 'antd';
import { Redirect } from 'react-router'

import SideNav from '../SideNav/SideNav'
import PropTypes from 'prop-types';

const { Header, Content, Footer } = Layout;

class EnrollCourses extends Component {

	constructor(props) {
		super(props);
		this.state = {
			courseid: '',
			enroll: false,
			waitlist:false,
			dropFromEnroll: false,
			dropFromWaitlist: false,
			showActions: true
		}
	}

	handleEnroll = (event) => {
		console.log(`Enroll in handleEnroll:\n ${{event}}`);

		let enrolledCourse = this.props.searchCourses.filter(course => {
			console.log(course);
			console.log(course.CourseId);
			console.log(this.state.courseid);
			return (
				course.CourseId === this.state.courseid
			)
		  });
		console.log(`Enrolled course:${(Object.values({enrolledCourse})[0])[0]}`)

		this.props.enrollCourse((Object.values({enrolledCourse})[0])[0]);
		this.props.history.push('/search-course')

	}

	handleWaitlist = (event) => {
		console.log(`Waitlist in handleWaitlist:\n ${event}`);

		let waitlistCourse = this.props.searchCourses.filter(course => {
			console.log(course);
			console.log(course.CourseId);
			console.log(this.state.courseid);
			return (
				course.CourseId === this.state.courseid
			)
		});
		console.log(`Waitlisted course:${(Object.values({ waitlistCourse })[0])[0]}`)
		

		this.props.waitlistCourse((Object.values({waitlistCourse})[0])[0])
		this.props.history.push('/search-course')
	}

	handleDrop = (event) => {
		console.log(`Drop in handleDrop:\n ${event}`);
		let droppedCourse = this.props.searchCourses.filter(course => {
			console.log(course);
			console.log(course.CourseId);
			console.log(this.state.courseid);
			return (
				course.CourseId === this.state.courseid
			)
		  });
		  console.log(`Droppped course:${(Object.values({droppedCourse})[0])[0]}`)
		

		this.props.dropCourse((Object.values({droppedCourse})[0])[0])
		this.props.history.push('/search-course');
	}

	onAction = (event) => {
		console.log(`Event in onAction(): ${event.key} - ${event.courseid}`);
		console.log(`Start state onAction(): ${this.state.enroll} ${this.state.waitlist} ${this.state.dropFromEnroll} ${this.state.dropFromWaitlist}`);

		let foundCourse = false
		let innerCriteria = '';
		const criteria = this.props.searchCourses.map(allCourse => {

			innerCriteria = this.props.user.Courses.map(enrolledOrWaitlistedCourse => {

				if(enrolledOrWaitlistedCourse.CourseId === event.key) {

					console.log('In Drop');
					console.log(`enrolledOrWaitlistedCourse.CourseId: ${enrolledOrWaitlistedCourse.CourseId}`);
					console.log(`event.courseid: ${event.courseid}`);
					console.log(`event.key: ${event.key}`);

					if( enrolledOrWaitlistedCourse.CourseStatus === "Enrolled" ) {

						console.log('In Drop From Enroll');
						console.log(`enrolledOrWaitlistedCourse.CourseId: ${enrolledOrWaitlistedCourse.CourseId}`);
						console.log(`allCourse.courseid: ${allCourse.CourseId}`);
						console.log(`event.courseid: ${event.courseid}`);
						console.log(`event.key: ${event.key}`);

						this.setState({
							courseid: event.key,
							enroll: false,
							waitlist: false,
							dropFromEnroll: true,
							dropFromWaitlist: false
						})
						foundCourse = true
						return(
							this.state
						)
					} else if( enrolledOrWaitlistedCourse.CourseStatus === "Waitlisted" ) {

							console.log('In Drop From Enroll');
							console.log(`enrolledOrWaitlistedCourse.CourseId: ${enrolledOrWaitlistedCourse.CourseId}`);
							console.log(`allCourse.courseid: ${allCourse.CourseId}`);
							console.log(`event.courseid: ${event.courseid}`);
							console.log(`event.key: ${event.key}`);
	
							this.setState({
								courseid: event.key,
								enroll: false,
								waitlist: false,
								dropFromEnroll: false,
								dropFromWaitlist: true,
								showActions: false
							})
							foundCourse = true
							return(
								this.state
							)
					}
				}
			})

			if(allCourse.CourseId === event.key && foundCourse === false) {

				console.log('In Enroll/Waitlist/None');
				console.log(`allCourse.CourseId: ${allCourse.CourseId}`)
				console.log(`event.courseid: ${event.courseid}`)
				console.log(`event.key: ${event.key}`);

				if(allCourse.CurrentEnrolled < allCourse.CourseCapacity) {

					console.log('In Enroll');
					console.log(`allCourse.CurrentEnrolled: ${allCourse.CurrentEnrolled}`)
					console.log(`allCourse.CourseCapacity: ${allCourse.CourseCapacity}`)
					
					this.setState({
						courseid: event.key,
						enroll: true,
						waitlist: false,
						dropFromEnroll: false,
						dropFromWaitlist: false
					})
					return(
						this.state
					)
				} else if((allCourse.WaitlistCapacity !== 0) && (allCourse.CurrentWaitlisted < allCourse.WaitlistCapacity)) {

					console.log('In Waitlist');
					console.log(`allCourse.WaitlistCapacity: ${allCourse.WaitlistCapacity}`)
					console.log(`allCourse.CurrentWaitlisted: ${allCourse.CurrentWaitlisted}`)

					this.setState({
						courseid: event.key,
						enroll: false,
						waitlist: true,
						dropFromEnroll: false,
						dropFromWaitlist: false
					})
					return(
						this.state
					)
				} else {

					console.log('In None');

					this.setState({
						courseid: event.key,
						enroll: false,
						waitlist: false,
						dropFromEnroll: false,
						dropFromWaitlist: false
					})
					return(
						this.state
					)
				}
			}
		});

		console.log(`innerCriteria: ${innerCriteria}`)
		console.log(`criteria: ${criteria}`)
		console.log(`End state onAction(): ${this.state.enroll} ${this.state.waitlist} ${this.state.dropFromEnroll} ${this.state.dropFromWaitlist}`);
	}

	openNotification = () => {
		notification.open({
			message: 'NO ACTIONS',
			description: 'A this moment, this course can neither be Enrolled/Waitlisted/Dropped',
			onClick: () => {
				console.log('Notification Clicked!');
			},
			duration: 3,
			placement: 'topLeft'
		});
	};

	render() {
		console.log("Search Course in EnrollCourses");
		console.log(this.props.searchCourses);
		console.log(this.state)


		const columns = [
			{
				title: 'Course Id', width: 100, dataIndex: 'courseid', key: 'courseid', fixed: 'left', align: 'center',
			},
			{
				title: 'Course Department', width: 120, dataIndex: 'coursedept', key: 'coursedept', fixed: 'left', align: 'center',
			},
			{
				title: 'Course Term', dataIndex: 'courseterm', key: 'courseterm', width: 150, align: 'center',
			},
			{
				title: 'Course Name', dataIndex: 'coursename', key: 'coursename', width: 150, align: 'center',
			},
			{
				title: 'Course Description', dataIndex: 'coursedesc', key: 'coursedesc', width: 150, align: 'center',
			},
			{
				title: 'Course Room', dataIndex: 'courseroom', key: 'courseroom', width: 150, align: 'center',
			},
			{
				title: 'Course Capacity', dataIndex: 'coursecapacity', key: 'coursecapacity', width: 150, align: 'center',
			},
			{
				title: 'Waitlist Capacity', dataIndex: 'waitlistcapacity', key: 'waitlistcapacity', width: 150, align: 'center',
			},
			{
				title: 'Taken By', dataIndex: 'takenBy', key: 'takenBy', width: 150, align: 'center',
			},
			{
				title: 'Action',
				key: 'action',
				width: 200,
				align: 'center',
				render: (record) => (
					<span> 
						<a href='#' onClick={()=>{this.onAction(record)}}>Actions</a>
					</span>
				)
			}
		];

		var data = [];
		this.props.searchCourses.map(course => {
			data.push({
				key: course.CourseId,
				courseid: course.CourseNumber,
				coursedept: course.CourseDepartment,
				courseterm: course.CourseTerm,
				coursename: course.CourseName,
				coursedesc: course.CourseDescription,
				courseroom: course.CourseRoom,
				coursecapacity: course.CourseCapacity,
				waitlistcapacity: course.WaitlistCapacity,
				takenBy: course.CourseTakenByUserName
			});
		});

		console.log('Data:');
		console.log(data);

		let redirectVar = null
		if (this.props.authenticated === false) {
			redirectVar = <Redirect to="/login" />
		}

		return (
			<Layout>
				{ redirectVar }
				<SideNav courses={this.props.courses} />
				<Layout style={{ marginLeft: 200, position: 'fluid' }}>
					<Header style={{ background: '#fff', position: 'fixed', zIndex: 1, width: '100%', fontWeight: 'bold', fontSize: 20 }}>
						Enroll Courses
					</Header>
					<Content style={{ margin: '0 16px', marginTop: 70 }}>
						<div style={{ padding: 40, background: '#fff', paddingRight: 10, height: 800 }}>
							<br/>
							<br/>
							<Button type="primary" onClick={()=>{this.props.history.push('/search-course')}}><Icon type="left" />Back to search</Button>
							<br/>
							<br/>
							<br/>
							<Table columns={columns} dataSource={data} scroll={{ x: 1300, y: 300 }} />
							<br/>
							<br/>
							
								<div className="container center" style={{display: 'grid'}}>
									{this.state.enroll && <Button type="primary" onClick={this.handleEnroll}>Enroll</Button>}
									{this.state.waitlist && <Button onClick={this.handleWaitlist}>Waitlist</Button>}
									{(this.state.dropFromEnroll || this.state.dropFromWaitlist) && <Button type="danger" onClick={this.handleDrop}>Drop</Button>}
									{/* {
										(this.state.enroll === false && this.state.waitlist === false && this.state.dropFromEnroll === false && this.state.dropFromWaitlist === false) && 
										<Button type="primary" onClick={this.openNotification}>No Action</Button>
									} */}
								</div>
							
						</div>
					</Content>
					<Footer style={{ textAlign: 'center' }}>
						© Copyright Canvas.com, Inc.<br />
						All rights reserved.
					</Footer>
				</Layout>
			</Layout>
		)
	}
}


const mapStateToProps = state => ({
	authenticated: state.authenticationReducer.authenticated,
	user: state.userReducer.user,
	course: state.coursesReducer.course,
	searchCourses: state.coursesReducer.searchCourses
});

EnrollCourses.propTypes = {

	authenticated: PropTypes.bool.isRequired,
	user: PropTypes.object.isRequired,
	course: PropTypes.object.isRequired,

	searchCourses: PropTypes.arrayOf(
		PropTypes.object.isRequired
	)

	// enrollCourse: PropTypes.func.isRequired,
	// waitlistCourse: PropTypes.func.isRequired,
	// dropCourse: PropTypes.func.isRequired,
	// courses: PropTypes.array.isRequired,
};

export default connect(mapStateToProps, { enrollCourse, waitlistCourse, dropCourse })(EnrollCourses);
