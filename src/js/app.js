/* DEFINE APP */
var app = angular.module('app',['ngCookies']);

/* CONFIGURE URL PARSING WITH HTML5 */
app.config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode(true);
}]);

/* CONTROLLER FOR INDEX */
app.controller('indexCtrl', ['$scope', '$cookies', '$location', 'ind', function($scope, $cookies, $location, ind) {
/* BUILD QUERYINFO FROM URL*/
    $scope.queryinfo = $location.search();

/* DEFINE BLANK HTTP INFO */
    $scope.xml = false;

/* UPDATE FUNCTION */
    $scope.update = function(reset) {
        if (reset == "page") {
                $scope.queryinfo.start = "0";
                $scope.queryinfo.limit = "20";
        }
        if (reset == "all") {
            $scope.queryinfo.start = "0";
            $scope.queryinfo.limit = "20";
            $scope.queryinfo.date = "any";
            $scope.queryinfo.jobtype = "any";
            $scope.queryinfo.radius = "25";
        }
        //update url query with queryinfo
        $location.search($scope.queryinfo);
    /* CALL TO HTTP GET SERVICE */
        ind.get().then(function(d) {
            if (d.data) {
                //bind the usable data to xml
                $scope.xmltotal = d.data.totalresults[0];
                $scope.xml = d.data.results[0];
                if (typeof $scope.xml == 'string') {
                    $scope.xml = false;
                };
                //drop limit to match the maximum reults
                /*if ($scope.xml) {
                    var total = Number($scope.xmltotal);
                    var limit = Number($scope.queryinfo.limit);
                    if (total < limit) {
                        $scope.queryinfo.limit = total.toString();

                    }   else {
                        $scope.queryinfo.limit = "20";
                    }
                }*/

            }   else {console.log("nodata");}
        });
    };
    $scope.resetPage = function() {
        $scope.queryinfo.start = "0";
        $scope.queryinfo.limit = "20";
    }
/* ADVANCED SEARCH */
    $scope.adv = {
        tog: false,
        color: 'white'
    };
    $scope.advtoggle = function() {
        if ($scope.adv.tog) {
            $scope.adv.tog = false;
            $scope.adv.color = 'white';
        }   else {
            $scope.adv.tog = true;
            $scope.adv.color = 'purple';
        }
    };
/* ENTER KEY TRIGGER */
    $scope.enter = function(event) {
        if (event.keyCode == 13) {
            $scope.update('page');
        };
    };
/* PAGE CONTROLS */
    $scope.controls = function(direction) {
        var qs = $scope.queryinfo.start;
        var ql = $scope.queryinfo.limit;
        var ta = $scope.xmltotal;
        ta = Number(ta);
        qs = Number(qs);
        ql = Number(ql);
        if (direction == "hide") {
            if (qs > 1) {return false;}   
            else {return true;}
        }   
        if (direction == "show") {
            if (ta > qs+ql ) {return true;}   
            else {return false;}
        }
        if (direction == "end") {
            var total = qs+ql;
            if (total >= $scope.xmltotal) {return $scope.xmltotal;}   
            else {return total;}
        };
        if (direction == "next") {qs += ql;}   
        if (direction == "prev") {qs -= ql;}
        if (qs < 1) {qs = 0;}
        $scope.queryinfo.start = qs.toString();
        $scope.update();
    };
/* INIT UPDATE RUN */    
    $scope.update('all');

/* CONVERSION SCRIPT FOR ONMOUSEDOWN EVENT */
   /* $scope.conversion = function(a, md) {
        console.log(a.href);
        var itemstart = md.indexOf("'")+1;
        var itemend = md.lastIndexOf("'");
        var item = md.slice(itemstart, itemend);
        indeed_clk(a, item);
    }*/

}]);

/* SERVICE FOR HTTP GET REQUEST TO API */
app.factory('ind', function($http, $location) {
    //function to turn parsed query info into useable string
    function buildquery() {
        var str = "";
        var parsed = $location.search();
        //console.log(parsed);
        var count = 0;
        for (x in parsed) {
            if (count) {
                str += "&"+x+"="+parsed[x];
            }   else {
                str += "?"+x+"="+parsed[x];
                count ++;
            }
        };
        return str;
    };
    //actual http request
    var promise;
    var jsondata = {
        get: function() {
            if (!promise) {
                var promise = $http.get('/data'+buildquery()).success(function(response) {
                    return response;
                });
                return promise;
            }
        }
    };
    return jsondata;
});

/* DIRECTIVES */
app.directive('pageControls', function() {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'templates/pc.html'
    }
});
app.directive('advSearch', function() {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'templates/advsearch.html'
    }
});
