'use static'
let fs = require('fs');
let path = require('path');
let express = require('express');
let morgan = require('morgan');
let rfs = require('rotating-file-stream');

let app = express();
let logDirectory = path.join(__dirname, 'log');

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

// create a rotating write stream
var accessLogStream = rfs('access.log', {
  interval: '1d', // rotate daily
  path: logDirectory
})

// setup the logger
app.use(morgan('combined', {stream: accessLogStream}))

app.use(express.static('public'));

app.get('/',function(req,res){
	res.send('Happy Birthday');
})

app.listen(80, function () {
	console.log('Example app listening on port 80!');
});