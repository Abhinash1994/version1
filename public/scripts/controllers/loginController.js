'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('loginCtrl', function($scope, $position, $http, $state) {
    $scope.login = function(){
        $http.post("/user/login", {phoneNumber : $scope.phoneNumber, password : $scope.password }).success(function(response, status){
        $scope.showLoader = false;
        if(response.error) $scope.errorMessage = response.message;
        else{
            window.location.replace("/crm");
        }
    });
    };

  });
