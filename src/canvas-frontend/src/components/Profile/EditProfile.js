import React, { Component } from 'react'
import { Layout, Typography, Button, Form, Input, Upload, Radio, Select, Icon } from 'antd';
import { Redirect } from 'react-router'
import { connect } from 'react-redux';
import { getProfile, editProfile } from '../../actions/profileActions';

import SideNav from '../SideNav/SideNav'
import PropTypes from 'prop-types';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;
const { Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export class EditProfile extends Component {

	//TODO: try to implement this
	// constructor(props) {
	// 	super(props);
	// 	this.state = {
	// 		editable: false,
	// 		editText: 'Edit Profile'
	// 	};
	// }

	// {"id":11,"fname":"Sanjay","lname":"Nag","email":"sanjaynagbr@gmail.com","password":"$2b$10$JcusR2gRYMTiur9.paoqAuqqpNxfsGtDBOI5vHV6gEUfydTkMGlSe","aboutme":"I'm Sanjay, that's all there's to it!","phonenumber":"6692049908","profileimage":null,"city":"San Jose","country":"US","company":"Amazon","school":"SJSU","hometown":"Bangalore","languages":"English","gender":"Male","isprofessor":1}

	componentDidMount() {
		this.props.getProfile();
	}

	state = {
		confirmDirty: false,
		autoCompleteResult: [],
	};

	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFieldsAndScroll((error, values) => {
			if (!error) {
				console.log('Received values of profile edit form: ', values);

				if(values.firstName === undefined || values.firstName === '') {
					values.firstName = this.props.profile.fname
				}
				if(values.lastName === undefined || values.lastName === '') {
					values.lastName = this.props.profile.lname
				}
				if(values.aboutMe === undefined || values.aboutMe === '') {
					values.aboutMe = this.props.profile.aboutme
				}
				if(values.phoneNumber === undefined || values.phoneNumber === '') {
					values.phoneNumber = this.props.profile.phonenumber
				}
				if(values.profileImage === undefined || values.profileImage === '') {
					values.profileImage = this.props.profile.profileimage
				}
				if(values.city === undefined || values.city === '') {
					values.city = this.props.profile.city
				}
				if(values.country === undefined || values.country === '') {
					values.country = this.props.profile.country
				}
				if(values.company === undefined || values.company === '') {
					values.company = this.props.profile.company
				}
				if(values.school === undefined || values.school === '') {
					values.school = this.props.profile.school
				}
				if(values.homeTown === undefined || values.homeTown === '') {
					values.homeTown = this.props.profile.hometown
				}
				if(values.languages === undefined || values.languages === '') {
					values.languages = this.props.profile.languages
				}

				this.props.editProfile(values);

				setTimeout(() => {
					this.props.history.push('/profile');
				}, 300);
			}
		});
	}

	handleConfirmBlur = (e) => {
		const value = e.target.value;
		this.setState({ confirmDirty: this.state.confirmDirty || !!value });
	}

	compareToFirstPassword = (rule, value, callback) => {
		const form = this.props.form;
		if (value && value !== form.getFieldValue('password')) {
			callback('Two passwords that you entered are inconsistent!');
		} else {
			callback();
		}
	}

	validateToNextPassword = (rule, value, callback) => {
		const form = this.props.form;
		if (value && this.state.confirmDirty) {
			form.validateFields(['confirm'], { force: true });
		}
		callback();
	}

	handleWebsiteChange = (value) => {
		let autoCompleteResult;
		if (!value) {
			autoCompleteResult = [];
		} else {
			autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
		}
		this.setState({ autoCompleteResult });
	}



	render() {

		const { getFieldDecorator } = this.props.form;

		const formItemLayout = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 5 },
			},
			wrapperCol: {
				xs: { span: 15 },
				sm: { span: 16 },
			},
		};
		const prefixSelector = getFieldDecorator('prefix', {
			initialValue: '1',
		})(
			<Select style={{ width: 70 }}>
				<Option value="1">+1</Option>
				<Option value="91">+91</Option>
			</Select>
		);
		
		
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
							{/* <div style={{ textAlign: 'center'}}> */}
								<Button className="float-right" type="danger" onClick={()=>{this.props.history.push('/profile')}}>Cancel</Button>
								<br />
								<Form {...formItemLayout} onSubmit={this.handleSubmit}>
									<Form.Item label="First Name">
										{getFieldDecorator('firstName', {
											
										})(
											<Input placeholder={this.props.profile.fname}/>
										)}
									</Form.Item>
									<Form.Item label="Last Name">
										{getFieldDecorator('lastName', {
											
										})(
											<Input placeholder={this.props.profile.lname}/>
										)}
									</Form.Item>
									<Form.Item label="About me">
										{getFieldDecorator('aboutMe', {})(
											<TextArea placeholder={this.props.profile.aboutme} autosize />
										)}
									</Form.Item>
									<Form.Item label="Phone Number">
										{getFieldDecorator('phoneNumber', {
											rules: [{
												len: 10, message: 'Please input 10 digits!',
											}],
										})(
											<Input addonBefore={prefixSelector} style={{ width: '100%' }} placeholder={this.props.profile.phonenumber}/>
										)}
									</Form.Item>
									<Form.Item label="Profile Image">
										{getFieldDecorator('profileImage', {
											valuePropName: 'fileList',
											getValueFromEvent: this.normFile,
										})(
											<Upload name="logo" action="" listType="picture">
												<Button>
													<Icon type="upload" /> Click to upload
												</Button>
											</Upload>
										)}
									</Form.Item>
									<Form.Item label="City">
										{getFieldDecorator('city', {})(
											<Input placeholder={this.props.profile.city}/>
										)}
									</Form.Item>
									<Form.Item label="Country">
										{getFieldDecorator('country', {})(
											<Input placeholder={this.props.profile.country}/>
										)}
									</Form.Item>
									<Form.Item label="Company">
										{getFieldDecorator('company', {})(
											<Input placeholder={this.props.profile.company}/>
										)}
									</Form.Item>
									<Form.Item label="School">
										{getFieldDecorator('school', {})(
											<Input placeholder={this.props.profile.school}/>
										)}
									</Form.Item>
									<Form.Item label="Home Town">
										{getFieldDecorator('homeTown', {})(
											<Input placeholder={this.props.profile.hometown}/>
										)}
									</Form.Item>
									<Form.Item label="Languages">
										{getFieldDecorator('languages', {})(
											<Input placeholder={this.props.profile.languages}/>
										)}
									</Form.Item>
									<Form.Item style={{ textAlign: 'center', paddingLeft: 50 }}>
										<Button type="primary" htmlType="submit">Update</Button>
									</Form.Item>
								</Form>
							{/* </div> */}
						</div>
					</Content>
					<Footer style={{ textAlign: 'center'  }}>
						© Copyright Canvas.com, Inc.<br/>
						All rights reserved.
					</Footer>
				</Layout>
			</Layout>
		)
	}
}

const WrappedEditProfileForm = Form.create({ name: 'register' })(EditProfile);

const mapStateToProps = state => ({
	authenticated: state.authenticationReducer.authenticated,
	profile: state.profileReducer.profile
});

WrappedEditProfileForm.propTypes = {
	authenticated: PropTypes.bool.isRequired,
	getProfile: PropTypes.func.isRequired,
	editProfile: PropTypes.func.isRequired
};

export default connect(mapStateToProps, { getProfile, editProfile })(WrappedEditProfileForm);
