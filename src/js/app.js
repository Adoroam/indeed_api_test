var app = angular.module('app',['ngCookies']);

app.controller('indexCtrl', ['$scope', '$http', '$cookies', 'ind', function($scope, $http, $cookies, ind) {
   $scope.xml = '';
   $scope.formdata = {
        jTitle: 'java',
        jLocation: 78726,
        startNo: 0
   };
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
                console.log($scope.xml);
            }   else {console.log("nodata");}
        });
   };

   //console.log($scope.xml);
   //ind;

    /*$scope.serv = {
            get: function() {
                    var promise = $http.get($scope.createString()).success(function(response) {
                                return response;
                            });
                        return promise;
                    }
    };*/


    /*$scope.serv.get().then(function(d) {
        $scope.xml = d.data;  
    });*/

}]);

/*app.factory('ind', function() {
   
   //console.log(str);
});*/
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