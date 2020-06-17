import React, { Component } from 'react'
import { Layout, List, Avatar, Typography, Button } from 'antd';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router'
import { getAnnouncementById } from '../../actions/announcementActions';
import { getCourseById } from '../../actions/courseActions';

import moment from "moment";
import SideNav from '../SideNav/SideNav'
import InsideSideNav from '../SideNav/InsideSideNav';
import PropTypes from 'prop-types';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

class Announcements extends Component {

	componentDidMount() {
		this.props.getCourseById(window.location.pathname.split('/')[2]);
	}

	render() {
		var announcementData = [];
		this.props.course.Announcements.map(announcement => {
			announcementData.push({
				key: announcement.AnnouncementId,
				title: announcement.AnnouncementName,
				postedOn: moment(announcement.AnnouncementPostedOn).format("MMMM Do YYYY, h:mm:ss a"),
				postedByUserId: announcement.AnnouncementPostedByUserId,
				postedByUserName: announcement.AnnouncementPostedByUserName,
				shortDesc: `Posted by: ${announcement.AnnouncementPostedByUserName} | Posted on: ${moment(announcement.AnnouncementPostedOn).format("MMMM Do YYYY, h:mm:ss a")}`
			});
		});

		let redirectVar = null;
		if (this.props.authenticated === false) {
			redirectVar = <Redirect to="/login"/>
		}

		return (
			<Layout>
				{ redirectVar }
				<SideNav/>
				<Header style={{ background: '#fff', position: 'fixed', zIndex: 1, width: '100%', fontWeight:'bold', fontSize:20, marginLeft: 200 }}>
				{this.props.course.CourseDepartment}-{this.props.course.CourseNumber} > Announcements
				</Header>
				<Layout  style={{marginLeft: 200, position:'fluid' }}>
					<InsideSideNav/>
					<Layout  style={{marginLeft: 200, position:'fluid'}}>
						<Content  style={{ margin: '0 16px', marginTop: 70 }}>
							<div style={{ padding: 40, background: '#fff', minHeight:'85vh'}}>
								<List
									itemLayout="vertical"
									dataSource={announcementData}
									header={<Title level={2}>Announcements {localStorage.getItem("isProfessor") === 'true' && <Button className="float-right center" type="primary" onClick={()=>{this.props.history.push(`/course/${this.props.course.CourseId}/create-announcement`)}}>Create Announcements</Button>} </Title> }
									pagination={{ pageSize: 5 }}
									renderItem={item => (
										<List.Item key={item.key} onClick={()=>
											{
												let selectedAnnouncement = this.props.course.Announcements.filter(announcement => {
													console.log(`Key: ${item.key}`);
													console.log(`Announcement: ${announcement.AnnouncementId}`);
													return (
														announcement.AnnouncementId === item.key
													)
												});
												console.log(`Ide announcements: ${selectedAnnouncement[0].AnnouncementName}`);
												this.props.getAnnouncementById(this.props.course.CourseId,selectedAnnouncement);
												this.props.history.push(`/course/${this.props.course.CourseId}/announcement/${item.key}`)
											}}>
											<List.Item.Meta
												avatar={<Avatar src="https://scontent-sjc3-1.xx.fbcdn.net/v/t1.0-9/53267082_2380701731994095_6071041916206579712_n.jpg?_nc_cat=107&_nc_ht=scontent-sjc3-1.xx&oh=4e6e2b94b829314f74b721fe610e6765&oe=5D163B6C" />}
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
	// courseDetails: state.coursesReducer.courseDetails,
	// announcements: state.announcementReducer.announcements,
	user: state.userReducer.user,
	course: state.coursesReducer.course
});

Announcements.propTypes = {
	authenticated: PropTypes.bool.isRequired,
	// courseDetails: PropTypes.object.isRequired,
	// announcements: PropTypes.array.isRequired,
	// getAnnouncementsByCourseId: PropTypes.func.isRequired,
	// getSelectedAnnouncementsDetails: PropTypes.func.isRequired,
	getAnnouncementById: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired,
	getCourseById: PropTypes.func.isRequired,
	course: PropTypes.object.isRequired
};

export default withRouter(connect(mapStateToProps, { getAnnouncementById, getCourseById })(Announcements));



