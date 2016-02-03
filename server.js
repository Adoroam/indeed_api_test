var express = require('express')
  , cors = require('cors')
  , app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var fs = require('fs');

var port = 80; 

var corsOptions = {
  origin: 'http://google.com'
};
app.use(cors(corsOptions));
app.use(express.static("dist"));
app.use(bodyParser.urlencoded({ extended:false }));
app.use(bodyParser.json());

//db stuff
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
});

//schemas
var userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    signup: Date,
    admin: Boolean
});
//models
var User = mongoose.model('User', userSchema);

app.get('/login', function(req, res) {
    res.redirect('/login.html');
});


//LISTEN
app.listen(port, function() {
    console.log("listening on port "+ port);
});
