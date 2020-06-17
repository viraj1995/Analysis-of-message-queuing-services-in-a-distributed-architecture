import React, { Component } from 'react'
import { Layout, Typography, Button } from 'antd';
import { Redirect } from 'react-router'
import { connect } from 'react-redux';
import { getProfile } from '../../actions/profileActions';

import SideNav from '../SideNav/SideNav'
import PropTypes from 'prop-types';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;
const { Paragraph } = Typography;

export class Profile extends Component {

	constructor(props) {
		super(props);
		this.state = {
			editable: false,
			editText: 'Edit Profile'
		};
	}

	componentDidMount() {
		this.props.getProfile();
	}

	render() {
		
		let redirectVar = null;
		if (this.props.authenticated === false) {
			redirectVar = <Redirect to="/login"/>
		}

		// {"id":11,"fname":"Sanjay","lname":"Nag","email":"sanjaynagbr@gmail.com","password":"$2b$10$JcusR2gRYMTiur9.paoqAuqqpNxfsGtDBOI5vHV6gEUfydTkMGlSe","aboutme":"I'm Sanjay, that's all there's to it!","phonenumber":"6692049908","profileimage":null,"city":"San Jose","country":"US","company":"Amazon","school":"SJSU","hometown":"Bangalore","languages":"English","gender":"Male","isprofessor":1}

		return (
			<Layout>
				{ redirectVar }
				<SideNav/>
				<Layout style={{marginLeft: 200, position:'fluid'}}>
					<Header style={{ background: '#fff', position: 'fixed', zIndex: 1, width: '100%', fontWeight:'bold', fontSize:20 }}>
						Profile
					</Header>
					<Content style={{ margin: '0 16px', marginTop: 70 }}>
						<div style={{ padding: 40, background: '#fff', minHeight: '85vh'}}>
							<Button className="float-right" onClick={()=>{this.props.history.push('/edit-profile')}}>{this.state.editText}</Button>
							<br/>
							<br/>
							<div style={{ textAlign: 'center'}}>
								<Paragraph><Title level={4}>Name:</Title> {this.props.profile.fname} {this.props.profile.lname}</Paragraph>
								<Paragraph><Title level={4}>Email:</Title>{this.props.profile.email}</Paragraph>
								<Paragraph><Title level={4}>About Me:</Title>{this.props.profile.aboutme}</Paragraph>
								<Paragraph><Title level={4}>Phone:</Title>{this.props.profile.phonenumber}</Paragraph>
								<Paragraph><Title level={4}>City:</Title>{this.props.profile.city}</Paragraph>
								<Paragraph><Title level={4}>Country:</Title>{this.props.profile.country}</Paragraph>
								<Paragraph><Title level={4}>Company:</Title>{this.props.profile.company}</Paragraph>
								<Paragraph><Title level={4}>School:</Title>{this.props.profile.school}</Paragraph>
								<Paragraph><Title level={4}>Hometown:</Title>{this.props.profile.hometown}</Paragraph>
								<Paragraph><Title level={4}>Languages:</Title>{this.props.profile.languages}</Paragraph>
								<Paragraph><Title level={4}>Gender:</Title>{this.props.profile.gender}</Paragraph>
								<Paragraph><Title level={4}>Role:</Title>{this.props.profile.isprofessor === 1
									? 'Professor' : 'Student'}</Paragraph>
							</div>
						</div>
					</Content>
					<Footer style={{ textAlign: 'center' }}>
						© Copyright Canvas.com, Inc.<br/>
						All rights reserved.
					</Footer>
				</Layout>
			</Layout>
		)
	}
}

const mapStateToProps = state => ({
	authenticated: state.authenticationReducer.authenticated,
	profile: state.profileReducer.profile
});

Profile.propTypes = {
	authenticated: PropTypes.bool.isRequired,
	getProfile: PropTypes.func.isRequired
};

export default connect(mapStateToProps, { getProfile })(Profile);
