
"use strict";
var tm = angular.module('tokeMailApp', ['ngRoute', 'ngSanitize', 'ui.bootstrap']);

tm.config(function($routeProvider, $locationProvider) {
    $routeProvider.
    when("/", {
        templateUrl: '../token.html'
    }).
    when("/token/:id", {
        templateUrl: '../token.html',
        controller: "DetailCntl"
    }).
    otherwise({
        redirectTo: '/'
    });
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});

tm.service('db', function($http) {
    let isDev = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
    let apiBasePath = isDev ? 'http://localhost:3003/api' : '/api'

    return {
        getAllTokens: function() {
            return $http.get(apiBasePath + '/tokens')
        },
        getToken: function (tokenId) {
            return $http.get(apiBasePath + '/tokens/' + tokenId)
        }
    };
});

tm.controller("AppCntl",  function($scope, $route) {
    $scope.$route = $route;
});



tm.controller("MainCntl", function($scope, db, $uibModal) {
    $scope.tokens = [];
    
    db.getAllTokens().then((values) => {
        console.log('got tokens:', values)
        $scope.tokens = values.data;
    })

    $scope.openAddTokenDialog = function () {
        console.log('opening pop up');
        var modalInstance = $uibModal.open({
            templateUrl: '../../addToken.html',
            controller: 'PopupCont',
            scope: $scope
        });
    }
});

tm.controller("DetailCntl", function($scope, db, $route) {
    console.log($route.current.params.id);
    db.getToken($route.current.params.id).then((res) => $scope.token = res.data)

    $scope.onDelete = function(tokenId){
        console.log("Deleting token with id of  " + tokenId);
    }
});

tm.controller('PopupCont',  function ($scope, $uibModalInstance, $route) {
    $scope.website = "website";
    $scope.token = "token";
    $scope.close = function () {
        $uibModalInstance.close();
    };

    $scope.create = function(){
        console.log("Creating tokens: website="+$scope.website + " token="+ $scope.token);
        $scope.close();
        $route.reload();
    };

});




