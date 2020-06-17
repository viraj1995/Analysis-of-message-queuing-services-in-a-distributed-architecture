import React, { Component } from 'react';
import { Layout, Form, Input, Select, Button, Radio, Cascader } from 'antd';
import { connect } from 'react-redux';
import { searchCourse } from '../../actions/courseActions';
import PropTypes from 'prop-types';
import SideNav from '../SideNav/SideNav';
import { Redirect } from 'react-router'

const { Header, Content, Footer } = Layout;
const { Option } = Select;

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

class SearchCourses extends Component {

	constructor(props) {
		super(props);
		this.state = {
			confirmDirty: false,
			autoCompleteResult: [],
			searchBy: ''
		};
	}
	

	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFieldsAndScroll((error, values) => {
			if (!error) {
				console.log('Received values of Search Course form: ', values);

				// CourseDepartment: ["CMPE"]
				// CourseNumber: "1"
				// CourseTerm: "Spring"
				// SearchCoursesBy: "CourseId"
				// prefix: ">"

				
				this.props.searchCourse(values);
				
				this.props.history.push('/enroll-course')
			}
		});
	}

	searchCoursesBy = (e) => {
		console.log('searchCoursesBy:', e);
		this.setState({
			searchBy: e.target.value
		})
		console.log(`SearchBy from state - ${this.state.searchBy}`);
		console.log(`Search course by props name - ${this.props}`)
		return e.target.value;
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
				sm: { span: 10 },
			},
		};

		const prefixSelector = getFieldDecorator('prefix', {
			initialValue: '=',
		})(
			<Select >
				<Option value="=">Equal</Option>
				<Option value=">">Greater</Option>
				<Option value="<">Lesser</Option>
			</Select>
		);

		let redirectVar = null
		if (this.props.authenticated === false) {
			redirectVar = <Redirect to="/login" />
		}
		
		return (
			<Layout>
				{ redirectVar }
				<SideNav />
				<Layout style={{ marginLeft: 200, position: "fluid" }}>
					<Header
						style={{
							background: "#fff",
							position: "fixed",
							zIndex: 1,
							width: "100%",
							fontWeight: "bold",
							fontSize: 20
						}}
					>
						Search Courses
					</Header>
					<Content
						style={{ margin: "0 16px", marginTop: 70 }}
					>
						<div
							style={{
								padding: 40,
								background: "#fff",
								paddingRight: 10,
								minHeight: "85vh"
							}}
						>
							
							<Form {...formItemLayout} onSubmit={this.handleSubmit}>
								<Form.Item label="Search Courses By" >
									{getFieldDecorator('SearchCoursesBy', {
										valuePropName: 'srchCoursesBy',
										getValueFromEvent: this.searchCoursesBy,
										rules: [{ required: true, message: 'Please select type of search!'}]
										
									})(
										<Radio.Group>
											<Radio value="CourseId">
												Course Id
											</Radio>
											<Radio value="CourseName">
												Course Name
											</Radio>
										</Radio.Group>
									)}
								</Form.Item>
								{
									this.state.searchBy === "CourseId" &&
									<div>
									
										<Form.Item label="Course Term">
											{getFieldDecorator("CourseTerm", {
												rules: [
													{
														required: true,
														message:
															"Please select Course Term!"
													}
												]
											})(
												<Radio.Group>
													<Radio value="Fall">
														Fall
													</Radio>
													<Radio value="Spring">
														Spring
													</Radio>
													<Radio value="Winter">
														Winter
													</Radio>
													<Radio value="Summer">
														Summer
													</Radio>
												</Radio.Group>
											)}
										</Form.Item>
										<Form.Item label="Course Number">
											{getFieldDecorator("CourseNumber", {
												rules: [
													{
														required: true,
														message:
															"Please input Course Number!"
													}
												]
											})(
												<Input
													type="number"
													prefix={prefixSelector}
													style={{ paddingLeft: 92 }}
												/>
											)}
										</Form.Item>
										<Form.Item label="Course Department">
											{getFieldDecorator(
												"CourseDepartment",
												{
													initialValue: ["CMPE"],
													rules: [
														{
															required: true,
															message:
																"Please select Course Department!"
														}
													]
												}
											)(
												<Cascader
													options={departments}
												/>
											)}
										</Form.Item>
									</div>
								}
								{
									this.state.searchBy === "CourseName" &&
									<Form.Item label="Course Name">
										{getFieldDecorator(
											"CourseName",
											{
												rules: [
													{
														required: true,
														message:
															"Please select Course Name!"
													}
												]
											}
										)(
											<Input />
										)}
									</Form.Item>
								}
								<div
									className="container center"
									style={{ paddingLeft: 325 }}
								>
									<Form.Item
										style={{ textAlign: "center" }}
									>
										<Button
											type="primary"
											htmlType="submit"
										>
											Search
										</Button>
									</Form.Item>
								</div>
							</Form>
							<div
								className="container center"
								style={{
									paddingTop: 40,
									textAlign: "center"
								}}
							>
								{/* {coursesCards} */}
							</div>
						</div>
					</Content>
					<Footer style={{ textAlign: "center" }}>
						© Copyright Canvas.com, Inc.
						<br />
						All rights reserved.
					</Footer>
				</Layout>
			</Layout>
		);
	}
}

const WrappedSearchCourses = Form.create({ name: 'search' })(SearchCourses);



const mapStateToProps = state => ({
	authenticated: state.authenticationReducer.authenticated,
	user: state.userReducer.user,
	searchCourses: state.coursesReducer.searchCourses

	// courses: state.coursesReducer.courses,
	// searchCourses: state.coursesReducer.searchCourses,
});

WrappedSearchCourses.propTypes = {
	authenticated: PropTypes.bool.isRequired,
	user: PropTypes.object.isRequired,
	searchCourse: PropTypes.func.isRequired,
	searchCourses: PropTypes.array.isRequired

	// courses: PropTypes.array.isRequired,
	
	// searchCourses: PropTypes.array.isRequired
};

export default connect(mapStateToProps, { searchCourse })(WrappedSearchCourses);



// this.state.searchBy === "CourseName" &&

// this.state.searchBy === "CourseId" &&