import React, { Component } from "react";
import { Layout, List, Avatar, Typography } from 'antd';
import { connect } from 'react-redux';
import { Redirect } from 'react-router'
import { getPeopleByCourseId } from '../../actions/peopleActions'

// import moment from "moment";
import SideNav from '../SideNav/SideNav'
import InsideSideNav from '../SideNav/InsideSideNav';
import PropTypes from 'prop-types';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

export class People extends Component {

	componentDidMount() {
		// get all lecture notes for the course
		this.props.getPeopleByCourseId(this.props.course.CourseId);
		// setTimeout(() => {

		// }, 2000);
	}
	

	render() {

		let redirectVar = null;
		if (this.props.authenticated === false) {
			redirectVar = <Redirect to="/login"/>
		}

		var peopleData = [];
		this.props.people.map(user =>
			peopleData.push({
				key: user.UserId,
				name: `${user.FirstName} ${user.LastName}`,
				profileImage: user.ProfileImage,
				email: `Email: ${user.Email} | Phone Number: ${user.PhoneNumber}`
			})
		);

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
									dataSource={peopleData}
									header={<Title level={2}> Students </Title> }
									pagination={{ pageSize: 5 }}
									renderItem={item => (
										<List.Item key={item.key}>
											<List.Item.Meta
												avatar={<Avatar src={item.profileImage} />}
												title={item.name}
												description={item.email}
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
	people: state.peopleReducer.people
});

People.propTypes = {
	authenticated: PropTypes.bool.isRequired,
	user: PropTypes.object.isRequired,
	course: PropTypes.object.isRequired,
	getPeopleByCourseId: PropTypes.func.isRequired,
	people: PropTypes.array.isRequired,
};

export default connect(mapStateToProps, { getPeopleByCourseId })(People);
