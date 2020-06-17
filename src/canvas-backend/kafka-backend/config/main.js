const express = require('express');
const mongoose = require('mongoose');
const app = express();

// mongodb+srv://sanjay:sanjay@canvascluster-ybjjb.mongodb.net/canvas?retryWrites=true
// mongodb+srv://sanjay:sanjay@canvas-baa6b.mongodb.net/test?retryWrites=true&w=majority

mongoose.connect(
	"mongodb+srv://sanjay:sanjay@canvas-baa6b.mongodb.net/test?retryWrites=true&w=majority", {
		useCreateIndex: true,
		useNewUrlParser: true,
		poolSize: 500
	}
).then(
	() => { 
		console.log("Sucessfully Connected to MogoDB"); 
	},
	err => { 
		console.log(`Error Connecting to MogoDB: ${err}`); 
	}
);