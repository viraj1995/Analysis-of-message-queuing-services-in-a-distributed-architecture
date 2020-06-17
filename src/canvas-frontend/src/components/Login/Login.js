import React, { Component } from 'react'
import { Form, Icon, Input, Button, Avatar } from 'antd';
import { connect } from 'react-redux';
import { login } from '../../actions/authenticationActions'
import { Redirect } from 'react-router'
import PropTypes from 'prop-types';

export class Login extends Component {

	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((error, values) => {
			if (!error) {
				console.log('Received values of Login form: ', values);
				
				this.props.login(values);
			}
		});
	}

	render() {

		const { getFieldDecorator } = this.props.form;

		let redirectVar = null
		if (this.props.authenticated === true) {
			redirectVar = <Redirect to="/" />
		}

		return (
			<div className="container col-4 col-5-lg">
				{ redirectVar }
				<br />
				<br />
				<br />
				<br />
				<Form onSubmit={this.handleSubmit} className="login-form">
					<Form.Item style={{ textAlign: 'center' }}>
						<Avatar size={150} src="../../logo.png" />
					</Form.Item>
					<Form.Item>
						{getFieldDecorator('email', {
							rules: [{ required: true, message: 'Please input your username!' }],
						})(
							<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
						)}
					</Form.Item>
					<Form.Item>
						{getFieldDecorator('password', {
							rules: [{ required: true, message: 'Please input your Password!' }],
						})(
							<Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
						)}
					</Form.Item>
					<Form.Item style={{ textAlign: 'center' }}>
						<Button type="primary" htmlType="submit" className="login-form-button">Log in</Button><br/>
						Or <a href="/signup">register now!</a>
					</Form.Item>
				</Form>
			</div>
		);
	}
}
const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(Login);

const mapStateToProps = state => ({
	authenticated: state.authenticationReducer.authenticated
});

WrappedNormalLoginForm.propTypes = {
	authenticated: PropTypes.bool.isRequired,
	login: PropTypes.func.isRequired
};

export default connect(mapStateToProps, { login })(WrappedNormalLoginForm);
