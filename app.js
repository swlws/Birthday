'use static'

let express = require('express');
let app = express();

app.use(express.static('public'));

app.get('/',function(req,res){
	res.send('Happy Birthday');
})

app.listen(80, function () {
	console.log('Example app listening on port 80!');
});