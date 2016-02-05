var http = require('http');
var url = require('url');
var express = require('express');
  //, cors = require('cors')
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var parseString = require('xml2js').parseString;
var fs = require('fs');
var port = 80; 

/*var corsOptions = {
    origin: true
};
app.use(cors(corsOptions));*/
app.use(cookieParser());
app.use(express.static("dist"));
app.use(bodyParser.urlencoded({ extended:false }));
app.use(bodyParser.json());

//db stuff
mongoose.connect('mongodb://localhost/indeedlogs');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
});
//schemas
var indSchema = mongoose.Schema({
    q: String,
    l: String,
    start: String,
    userip: String,
    useragent: String,
    userdate: Date
});
//models
var Ind = mongoose.model('Ind', indSchema);

//routes
app.post('/', function(req, res) {
    res.redirect('/');            
});
app.get('/admin', function(req, res) {
    res.redirect('/login.html');            
});

app.get('/', function(req, res) {
    res.redirect('/');            
});

app.get('/data', function(req, res) {
    var parsed = url.parse(req.url);
    var queries = parsed.query.split('&');
    var qobj = {};
    for (x in queries) {
        var str = queries[x];
        str = str.split("=");
        qobj[str[0]] = str[1];
    };
    var userip = req.ip;
    var useragent = req.headers['user-agent'];
    qobj.userdate = Date();
    var newRequest = new Ind({
        q: qobj.q,
        l:qobj.l,
        start: qobj.start,
        userip: userip,
        useragent: useragent,
        userdate: qobj.userdate
    });
    if (qobj.q && qobj.l && qobj.q != undefined) {
        newRequest.save(function(err, newRequest) {
            if (err) return console.log(err);
            //log the new saved user
            console.log('saved as:' + newRequest);
        });
    };
    qobj.q = encodeURI(qobj.q);
    qobj.l = encodeURI(qobj.l);
    qobj.userip = encodeURI(qobj.userip);
    qobj.useragent = encodeURI(useragent);
    //console.log(qobj);
    if (!qobj.limit || qobj.limit == "0" || qobj.limit == undefined) {
        qobj.limit = "20";
    }
    function createString() {
        var str = "http://api.indeed.com/ads/apisearch"+
        "?publisher="+2878037053725137+
        "&q="+qobj.q+
        "&l="+qobj.l+
        "&sort="+
        "&radius="+qobj.radius+
        "&st="+
        "&jt="+qobj.jobtype+
        "&start="+qobj.start+
        "&limit=20"+//qobj.limit+
        "&fromage="+qobj.date+
        "&filter=&latlong=1&co=us&"+
        "chnl=FJR"+
        "&userip="+qobj.userip+
        "&useragent="+qobj.useragent+"&v=2";
        return str;
    };
    var requrl = createString();
    http.get(requrl, function(resp) {
        var xml = '';
        resp.on('data', function(chunk) {
            xml += chunk;
        });
        resp.on('end', function() {
            parseString(xml, function(err, result) {
                //this returns just the results if needed
                //res.json(result.response.results[0]);
                res.json(result.response);
            });
        });
    });
});

//LISTEN
app.listen(port, function() {
    console.log("listening on port "+ port);
});