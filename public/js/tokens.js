
"use strict";
var tm = angular.module('tokeMailApp', ['ngRoute', 'ngSanitize']);

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

tm.service('db', function() {
    var tokens = [{
        "id": "1",
        "name": "Amazon",
        "value":"7a87d575-ce69-40a5-8dfc-6c268b6e7f32"
    }, {
        "id": "2",
        "name": "Stripe",
        "value":"9543ef5-9fe9-476c-88fe-be690c3ea9ec"
    }, {
        "id": "3",
        "name": "Bingo",
        "value":"722880d9-c3bd-4a74-8616-a6caf3c6f7f4"
    }];

    return {
        getTokens: function(tokenId) {
            if (tokenId === 0) {
                return tokens;
            } else {
                return tokens[tokenId - 1];
            }
        }
    };
});

tm.controller("AppCntl", function($scope, $route) {
    $scope.$route = $route;
});

tm.controller("MainCntl", function($scope, db) {
    $scope.tokens = db.getTokens(0);
});

tm.controller("DetailCntl", function($scope, db, $route) {
    console.log($route.current.params.id);
    $scope.pt = db.getTokens($route.current.params.id);
});

