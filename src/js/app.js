var app = angular.module('app',['ngCookies']);

app.controller('indexCtrl', ['$scope', '$http', '$cookies', 'ind', function($scope, $http, $cookies, ind) {
    $scope.xml = '';
    if ($cookies.get('request')) {
        var rcookie = $cookies.get('request').slice(2);
        rcookie = JSON.parse(rcookie);
        //if (typeof rcoo)
        //console.log(rcookie.startNo);
        $scope.formdata = {
            jTitle: rcookie.jTitle,
            jLocation: Number(rcookie.jLocation),
            startNo: Number(rcookie.startNo)
        };

    }   else {
        $scope.formdata = {
            jTitle: "java",
            jLocation: 78726,
            startNo: 1
        };
    }
    //console.log($scope.formdata.startNo);
    $scope.controls20 = function(direction) {
        if (direction == "next") {
            $scope.formdata.startNo = $scope.formdata.startNo + 20;
        }   else {
            $scope.formdata.startNo = $scope.formdata.startNo - 20;
        }
    }
    function getxml() {
        $http.get('/xml')
            .then(function(response) {
                return response;
            });
    };
    if ($cookies.get('request')) {
        ind.get().then(function(d) {
            if (d.data) {
                $scope.xml = d.data;
                //console.log($scope.xml);
            }   else {console.log("nodata");}
        });
    };
}]);

app.factory('ind', function($http) {
    var promise;
    var jsondata = {
        get: function() {
            if (!promise) {
                var promise = $http.get('/data').success(function(response) {
                    return response;
                });
                return promise;
            }
        }
    };
    return jsondata;
});
