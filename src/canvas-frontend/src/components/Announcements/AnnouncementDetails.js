import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Redirect } from 'react-router'
import { Layout, Typography, Divider, List } from 'antd';
import Moment from 'react-moment';
import SideNav from '../SideNav/SideNav'
import InsideSideNav from '../SideNav/InsideSideNav';
import PropTypes from 'prop-types';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

class AnnouncementDetails extends Component {
	render() {

		let redirectVar = null;
		if (this.props.authenticated === false) {
			redirectVar = <Redirect to="/login"/>
		}

		var announcementFiles = [];
		this.props.announcement.AnnouncementFiles.map(announcementFile =>
			announcementFiles.push({
				key: announcementFile.uid,
				name: announcementFile.name,
				url: announcementFile.url
			})
		);

		return (
			<Layout>
				{ redirectVar }
				<SideNav/>
				<Header style={{ background: '#fff', position: 'fixed', zIndex: 1, width: '100%', fontWeight:'bold', fontSize:20, marginLeft: 200 }}>
				{this.props.course.CourseDepartment}-{this.props.course.CourseNumber} > Announcements > {this.props.announcement.AnnouncementName}
				</Header>
				<Layout  style={{marginLeft: 200, position:'fluid' }}>
					<InsideSideNav/>
					<Layout  style={{marginLeft: 200, position:'fluid'}}>
						<Content  style={{ margin: '0 16px', marginTop: 70 }}>
							<div style={{ padding: 40, background: '#fff', minHeight:'85vh'}}>
								<Title level={2}>
									{this.props.announcement.AnnouncementName}
								</Title>
								Posted by: {this.props.announcement.AnnouncementPostedByUserName} 
								<Divider style={{width: 2}} type="vertical" /> 
								Posted on:&nbsp;
								<Moment tz="America/Los_Angeles" format="MMMM Do YYYY, h:mm:ss a">
									{this.props.announcement.AnnouncementPostedOn}
								</Moment>
								<br/>
								<Divider />
								{this.props.announcement.AnnouncementDescription}
								<br/>
								<Divider>Files</Divider>
								<List
									size="small"
									split={false}
									dataSource={announcementFiles}
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
	announcement: state.announcementReducer.announcement
});

AnnouncementDetails.propTypes = {
	authenticated: PropTypes.bool.isRequired,
	user: PropTypes.object.isRequired,
	course: PropTypes.object.isRequired,
	announcement: PropTypes.object.isRequired
};

export default connect(mapStateToProps, {  })(AnnouncementDetails);

