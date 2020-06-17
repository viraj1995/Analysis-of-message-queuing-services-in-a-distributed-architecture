//const passport = require('passport');
//const LocalStrategy = require('passport-local').Strategy;
//const passportJWT = require('passport-jwt');
//const JWTStrategy = passportJWT.Strategy;
//var Module = require('../models/user');
//var PropertyModule = require('../models/property');
// var AssignmentModule = require('../models/assignments-create');
var config = require('../kafka-backend/config/main');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var express = require('express');
var app = express();
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const multer=require('multer')

var connection =  new require('./kafka/connection');
//topics files
//var signin = require('./services/signin.js');
var createCourse = require('./services/createCourse');
var findAssignmentSubmissions = require('./services/findAssignmentSubmissions');
var findAssignmentSubmissionsDetails = require('./services/findAssignmentSubmissionsDetails');
var gradeAssignment = require('./services/gradeAssignment');
var coursePeople = require('./services/coursePeople');
var searchCourses = require('./services/searchCourses');
var enrollCourse = require('./services/enrollCourse');
var waitlistCourse = require('./services/waitlistCourse');
var dropCourse = require('./services/dropCourse');

function handleTopicRequest(topic_name,fname){
    //var topic_name = 'root_topic';
    var consumer = connection.getConsumer(topic_name);
    var producer = connection.getProducer();
    console.log('server is running ');
    consumer.on('message', function (message) {
        console.log('message received for ' + topic_name +" ", fname);
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);
        
        fname.handle_request(data.data, function(err,res){
            console.log('after handle'+res);
            var payloads = [
                { topic: data.replyTo,
                    messages:JSON.stringify({
                        correlationId:data.correlationId,
                        data : res
                    }),
                    partition : 0
                }
            ];
            producer.send(payloads, function(err, data){
                console.log(data);
            });
            return;
        });
        
    });
}
// Add your TOPICs here
//first argument is topic name
//second argument is a function that will handle this topic request
//handleTopicRequest("post_book",Books)
handleTopicRequest("create_course", createCourse);
handleTopicRequest("find_assignmentSubmissions", findAssignmentSubmissions);
handleTopicRequest("find_assignmentSubmissions_details", findAssignmentSubmissionsDetails);
handleTopicRequest("grade_assignment", gradeAssignment);
handleTopicRequest("course_people", coursePeople);
handleTopicRequest("search_courses", searchCourses);
handleTopicRequest("enroll_course", enrollCourse);
handleTopicRequest("waitlist_course", waitlistCourse);
handleTopicRequest("drop_course", dropCourse);