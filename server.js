var http = require('http');
//var url = require('url');
var express = require('express')
  , cors = require('cors')
  , app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var parseString = require('xml2js').parseString;
var fs = require('fs');
var port = 80; 

var corsOptions = {
    origin: true
};
app.use(cors(corsOptions));
app.use(cookieParser());
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
var indSchema = mongoose.Schema({
    jTitle: String,
    jLocation: String,
    startNo: String,
    userip: String,
    useragent: String,
    requeststring: String
});
//models
var Ind = mongoose.model('Ind', indSchema);

//routes

app.post('/', function(req, res) {
    if (req.body.jTitle) {
        var jTitle = req.body.jTitle;
        var jLocation = req.body.jLocation;
        var startNo = req.body.startNo;
        var userip = req.ip;
        var useragent = req.headers['user-agent'];
        uTitle = encodeURI(jTitle);
        uLocation = encodeURI(jLocation);
        uuseragent = encodeURI(useragent);

        function createString() {
                return "http://api.indeed.com/ads/apisearch?publisher="+
                    2878037053725137+
                    "&q="+uTitle+
                    "&l="+uLocation+
                    "&sort=&radius=&st=&jt=&"+
                    "start="+startNo+
                    "&limit=20&fromage=&filter=&latlong=1&co=us&"+
                    "chnl=FJR"+
                    "&userip="+userip+
                    "&useragent="+uuseragent+"&v=2";
        };
        if ( jTitle && jLocation ) {        
            var requeststring = createString();
            var newRequest = new Ind({
                    jTitle: jTitle,
                    jLocation: jLocation,
                    startNo: startNo,
                    userip: userip,
                    useragent: useragent,
                    requeststring: requeststring
            });
            newRequest.save(function(err, newRequest) {
                if (err) return console.log(err);
                //log the new saved user
                console.log('saved as:' + newRequest);
            });
            res.cookie('request', newRequest);
        } //end if title && loc
    };  //end if req.body


   /* var str = newRequest.requeststring;

    function getxml(err, data) {
        if (err) return console.error(err);
        return data;
    };
    function parsexml(err, data) {
        if (err) return console.error(err);
        return data;
    };
    var getrequest = http.get(str, getxml);
    var parserequest = parseString(getrequest, parsexml);
    var xmltojson = JSON.stringify(parserequest);
    console.log(xmltojson);*/
    res.redirect('/');            
    //res.cookie('request' , newRequest);
});

app.get('/', function(req, res) {
    //res.clearCookie('request');
});

app.get('/data', function(req, res) {
    //var parsed = url.parse(req.url);
    //console.log(parsed);
    if (req.cookies['request']) {
        var reqcookie = req.cookies['request'];
        var requrl = reqcookie.requeststring;
        res.clearCookie('request');
        

        /*function getxml(err, data) {
            if (err) return console.error(err);
            var xml = data;

            //parseString(xml, parsexml);
        };*/
        /*function parsexml(err, data) {
            if (err) return console.error(err);
            //console.log(data);
        }*/
        //console.log(http.get(requrl, getxml));
        //res.json(http.get(reqcookie.requeststring, getxml));
        //console.log("reqcookie: "+reqcookie.requeststring);

        //res.json(http.get(requrl, getxml));
        
        /*var getindeed = */http.get(requrl, function(resp) {
            var xml = '';
            resp.on('data', function(chunk) {
                xml += chunk;
            });
            resp.on('end', function() {
                parseString(xml, function(err, result) {
                    //console.log(result.response.results);
                    /*for (x in result.response.results) {
                            console.log(x+" "+result.response.results[x]);
                    }*/
                    //console.log(result.response.results[0]);
                    res.json(result.response.results[0]);
                });
            });
        });
        /*getindeed.on('error', function(err) {
          // debug error
        });*/
        //console.log(getindeed);
        //res.json(parsedjson);
    }
    
});

//LISTEN
app.listen(port, function() {
    console.log("listening on port "+ port);
});

/*var req = http.get("http://api.indeed.com/ads/apisearch?publisher=2878037053725137&q=java&l=austin%2C+tx&sort=&radius=&st=&jt=&start=&limit=&fromage=&filter=&latlong=1&co=us&chnl=&userip=1.2.3.4&useragent=Mozilla/%2F4.0%28Firefox%29&v=2", function(res) {
      // save the data
      var xml = '';
      res.on('data', function(chunk) {
        xml += chunk;
      });
      res.on('end', function() {
        console.log(xml);
      });

    });
    req.on('error', function(err) {
      // debug error
    });*/