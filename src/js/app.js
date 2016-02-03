var app = angular.module('app',[]);

app.controller('indexCtrl', ['$scope', '$http', '$window', function($scope, $http, $window) {
   $scope.xml = '';
   $scope.stringdata = {
        publisher: 2878037053725137,
        jTitle: 'java',
        jLocation: 78726,
        userip: '10.10.10.10',
        chnl: "FJR",
        useragent: "Mozilla/%2F4.0%28Firefox%29"
   };
    $scope.createString = function () {
            return "http://api.indeed.com/ads/apisearch?publisher="+
                $scope.stringdata.publisher+
                "&q="+encodeURI($scope.stringdata.jTitle)+
                "&l="+encodeURI($scope.stringdata.jLocation)+
                "&sort=&radius=&st=&jt=&start=&limit=20&fromage=&filter=&latlong=1&co=us&"+
                "chnl="+$scope.stringdata.chnl+
                "&userip="+$scope.stringdata.userip+
                "&useragent="+encodeURI($scope.stringdata.useragent)+"&v=2";
    };

    console.log($scope.createString());

    $scope.serv = {
            get: function() {
                    var promise = $http.get($scope.createString()).success(function(response) {
                                return response;
                            });
                        return promise;
                    }
    };


    $scope.serv.get().then(function(d) {
        $scope.xml = d.data;  
    });

}]);