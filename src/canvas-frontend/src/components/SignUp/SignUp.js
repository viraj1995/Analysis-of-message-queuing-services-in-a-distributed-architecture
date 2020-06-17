import React, { Component } from 'react'
import { Form, Input, Icon, Typography, Select, Button, Upload, Radio } from 'antd';
import { connect } from 'react-redux';
import { signup } from '../../actions/authenticationActions'
import { Redirect } from 'react-router'
import PropTypes from 'prop-types';
import axios from 'axios';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

var uploadedfileList= [];

export class SignUp extends Component {
	state = {
		confirmDirty: false,
		autoCompleteResult: []
	};


	normFile = (e) => {
		console.log('Upload event:', e.fileList);
		if (Array.isArray(e)) {
			return e;
		}
		return e && e.fileList;
	}

	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFieldsAndScroll((error, values) => {
			if (!error) {
				console.log('Received values of form: ', values);
				values.profileImage = uploadedfileList[0].url;
				this.props.signup(values);
				uploadedfileList= [];
				this.props.history.push('/login');
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
				sm: { span: 8 },
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

		let redirectVar = null
		if (this.props.authenticated === true) {
			redirectVar = <Redirect to="/" />
		}
		
		return (
			<div className="container col-6">
				{ redirectVar }
				<br/>
				<br/>
				<Title style={{ textAlign: 'center' }}>Registration</Title>
				<br/>
				<Form {...formItemLayout} onSubmit={this.handleSubmit}>
					<Form.Item label="First Name">
						{getFieldDecorator('firstName', {
							rules: [{
								required: true, message: 'Please input your First Name!',
							}],
						})(
							<Input />
						)}
					</Form.Item>
					<Form.Item label="Last Name">
						{getFieldDecorator('lastName', {
							rules: [{
								required: true, message: 'Please input your Last Name!',
							}],
						})(
							<Input />
						)}
					</Form.Item>
					<Form.Item label="E-mail">
						{getFieldDecorator('email', {
							rules: [{
								type: 'email', message: 'The input is not valid E-mail!',
							}, {
								required: true, message: 'Please input your E-mail!',
							}],
						})(
							<Input />
						)}
					</Form.Item>
					<Form.Item label="Password">
						{getFieldDecorator('password', {
							rules: [{
								required: true, message: 'Please input your password!',
							}, {
								validator: this.validateToNextPassword,
							}],
						})(
							<Input type="password" />
						)}
					</Form.Item>
					<Form.Item label="Confirm Password">
						{getFieldDecorator('confirm', {
							rules: [{
								required: true, message: 'Please confirm your password!',
							}, {
								validator: this.compareToFirstPassword,
							}],
						})(
							<Input type="password" onBlur={this.handleConfirmBlur} />
						)}
					</Form.Item>
					<Form.Item label="About me">
						{getFieldDecorator('aboutMe', {})(
							<TextArea placeholder="Describe yourself" autosize />
						)}
					</Form.Item>
					<Form.Item label="Phone Number">
						{getFieldDecorator('phoneNumber',{
							rules: [{
								len: 10, message: 'Please input 10 digits!',
							}],
						})(
							<Input addonBefore={prefixSelector} style={{ width: '100%' }} />
						)}
					</Form.Item>
					<Form.Item label="Profile Image">
						{getFieldDecorator('profileImage', {
							valuePropName: 'fileList',
							getValueFromEvent: this.normFile
						})(
							<Upload name="logo"
								customRequest=	{({file, onSuccess}) => {
														const data = new FormData()
														data.append('profileImage', file, file.name);
														data.set('uid', file.uid);
														data.set('name', file.name);
														const config = {
															"headers": {
																'accept': 'application/json',
																'Accept-Language': 'en-US,en;q=0.8',
																'Content-Type': `multipart/form-data; boundary=${data._boundary}`
															}
														}
														axios.post(`${process.env.REACT_APP_REST_API_ENDPOINT_URL}:${process.env.REACT_APP_REST_API_ENDPOINT_PORT}/upload`, data, config)
														.then((res, any) => {
															console.log(`Response from /upload in react: ${res}`);
															console.log(`Response from /upload Key: ${Object.values(res.data)}`);
															let uploadedFile = {
																uid: file.uid,
																name: file.name,
																url: res.data.Location
															}
															uploadedfileList.push(uploadedFile);
															onSuccess("ok");
															console.log(`State: ${Object.values(uploadedfileList)}`)
														})
														.catch((err, Error) => {
															console.log(err)
														})
													}
												}
												
								listType="picture" accept="image/*">
								<Button>
									<Icon type="upload" /> Click to upload
              					</Button>
							</Upload>
						)}
					</Form.Item>
					<Form.Item label="City">
						{getFieldDecorator('city', {})(
							<Input />
						)}
					</Form.Item>
					<Form.Item label="Country">
						{getFieldDecorator('country', {})(
							<Input />
						)}
					</Form.Item>
					<Form.Item label="Company">
						{getFieldDecorator('company', {})(
							<Input />
						)}
					</Form.Item>
					<Form.Item label="School">
						{getFieldDecorator('school', {})(
							<Input />
						)}
					</Form.Item>
					<Form.Item label="Home Town">
						{getFieldDecorator('homeTown', {})(
							<Input />
						)}
					</Form.Item>
					<Form.Item label="Languages">
						{getFieldDecorator('languages', {})(
							<Input />
						)}
					</Form.Item>
					<Form.Item label="Gender">
						{getFieldDecorator('gender')(
							<Radio.Group>
								<Radio.Button value="Male">Male</Radio.Button>
								<Radio.Button value="Female">Female</Radio.Button>
							</Radio.Group>
						)}
					</Form.Item>
					<Form.Item label="Role">
						{getFieldDecorator('isProfessor', {
							rules: [{
								required: true, message: 'Please select your role!',
							}],
						})(
							<Radio.Group>
								<Radio value="1">Professor</Radio>
								<Radio value="0">Student</Radio>
							</Radio.Group>
						)}
					</Form.Item>
					<Form.Item style={{ textAlign: 'center' }}>
						<Button type="primary" htmlType="submit">Register</Button>
					</Form.Item>
				</Form>
			</div>
		);
	}
}
const WrappedSignUpForm = Form.create({ name: 'register' })(SignUp);

const mapStateToProps = state => ({
	authenticated: state.authenticationReducer.authenticated
});

WrappedSignUpForm.propTypes = {
	authenticated: PropTypes.bool.isRequired,
	signup: PropTypes.func.isRequired
};

export default connect(mapStateToProps, { signup })(WrappedSignUpForm);