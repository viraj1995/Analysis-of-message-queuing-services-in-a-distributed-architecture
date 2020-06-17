import React, { Component } from 'react'
import { Form, Input, Typography, Button, Radio, InputNumber, Cascader } from 'antd';
import { createCourse } from '../../actions/courseActions';
import { connect } from 'react-redux';
import { Redirect } from 'react-router'
import SideNav from '../SideNav/SideNav'
import PropTypes from 'prop-types';

const { Title } = Typography;

const departments = [
	{
		value: 'CMPE',
		label: 'CMPE'
	}, 
	{
		value: 'CS',
		label: 'CS'
	}, 
	{
		value: 'EEE',
		label: 'EEE'
	}, 
	{
		value: 'MECH',
		label: 'MECH'
	}
];

const rooms = [
	{
		value: 'ENGG-108',
		label: 'ENGG-108'
	}, 
	{
		value: 'BBC-106',
		label: 'BBC-106'
	}, 
	{
		value: 'ENGG-300',
		label: 'ENGG-300'
	}, 
	{
		value: 'ENGG-100',
		label: 'ENGG-100'
	},
	{
		value: 'ENGG-101',
		label: 'ENGG-101'
	}, 
	{
		value: 'BBC-102',
		label: 'BBC-102'
	}, 
	{
		value: 'ENGG-103',
		label: 'ENGG-103'
	}, 
	{
		value: 'ENGG-104',
		label: 'ENGG-104'
	},
	{
		value: 'ENGG-105',
		label: 'ENGG-105'
	}, 
	{
		value: 'ENGG-106',
		label: 'ENGG-106'
	}, 
	{
		value: 'ENGG-107',
		label: 'ENGG-107'
	}, 
	{
		value: 'ENGG-109',
		label: 'ENGG-109'
	}, 
	{
		value: 'ENGG-110',
		label: 'ENGG-110'
	}
];


export class AddCourses extends Component {
	state = {
		confirmDirty: false,
		autoCompleteResult: [],
	};

	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFieldsAndScroll((err, values) => {
			if (!err) {

				console.log('Received values of form: ', values);
				this.props.createCourse(values);
				setTimeout(() => {
					this.props.history.push('/')
				}, 1000);
			}
		});
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

		let redirectVar = null
		if (this.props.authenticated === false) {
			redirectVar = <Redirect to="/login" />
		}

		return (
			<div>
				{ redirectVar }
			<SideNav courses={this.props.courses}/>
			<div className="container col-6">
				<br/>
				<br/>
				<Title style={{ textAlign: 'center' }}>Create Course</Title>
				<br/>
				<Form {...formItemLayout} onSubmit={this.handleSubmit}>
					<Form.Item label="Course Number">
						{getFieldDecorator('courseNumber', {
							rules: [{
								required: true, message: 'Please input Course Number!',
							}],
						})(
							<InputNumber min={0} />
						)}
					</Form.Item>
					<Form.Item label="Course Term" >
						{getFieldDecorator('courseTerm', {
							rules: [{
								required: true, message: 'Please select Course Term!',
							}],
						})(
							<Radio.Group>
								<Radio value="Fall">Fall</Radio>
								<Radio value="Spring">Spring</Radio>
								<Radio value="Winter">Winter</Radio>
								<Radio value="Summer">Summer</Radio>
							</Radio.Group>
						)}
					</Form.Item>
					<Form.Item label="Course Year" >
						{getFieldDecorator('courseYear', {
							initialValue: 2019,
							rules: [{
								required: true, message: 'Please select Course Year!',
							}],
						})(
							
							<InputNumber min={2019} max={2050} />
						)}
					</Form.Item>
					<Form.Item label="Course Name">
						{getFieldDecorator('courseName', {
							rules: [{
								required: true, message: 'Please input Course Name!',
							}],
						})(
							<Input />
						)}
					</Form.Item>
					<Form.Item label="Course Department">
						{getFieldDecorator('courseDepartment', {
							initialValue: ['CMPE'],
							rules: [{
								required: true, message: 'Please select Course Department!',
							}],
						})(
							<Cascader options={departments} />
						)}
					</Form.Item>
					<Form.Item label="Course Description">
						{getFieldDecorator('courseDescription', {})(
							<Input />
						)}
					</Form.Item>
					<Form.Item label="Course Room">
						{getFieldDecorator('courseRoom', {})(
							<Cascader options={rooms} />
						)}
					</Form.Item>
					<Form.Item label="Course Capacity" >
						{getFieldDecorator('courseCapacity', { 
							initialValue: 30, 
							rules:  [{
								required: true, message: 'Please input Course Capacity!',
								}],
							})(
							<InputNumber min={1} max={100} />
						)}
						<span className="ant-form-text"> students</span>
					</Form.Item>
					<Form.Item label="Waitlist Capacity" >
						{getFieldDecorator('waitlistCapacity', { 
							initialValue: 30, 
							rules:  [{
								required: true, message: 'Please input Waitlist Capacity!',
								}],
							})(
							<InputNumber min={0} max={40} />
						)}
						<span className="ant-form-text"> students</span>
					</Form.Item>
					<div className="container center" style={{paddingLeft: 200}}>
						<Form.Item style={{ textAlign: 'center'}}>
							<Button type="primary" htmlType="submit">Add Course</Button>
						</Form.Item>
					</div>
				</Form>
			</div>
			</div>
		);
	}
}


const WrappedAddCoursesForm = Form.create({ name: 'register' })(AddCourses);


const mapStateToProps = state => ({
	authenticated: state.authenticationReducer.authenticated,
	user: state.userReducer.user
});

WrappedAddCoursesForm.propTypes = {
	authenticated: PropTypes.bool.isRequired,
	user: PropTypes.object.isRequired,
	createCourse: PropTypes.func.isRequired
};

export default connect(mapStateToProps, { createCourse })(WrappedAddCoursesForm);
