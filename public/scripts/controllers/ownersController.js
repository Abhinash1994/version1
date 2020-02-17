'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('OwnersCtrl', function($scope,$position, $http) {
    $scope.owners = [];
    $http.get("/role1/owners").success(function(response, status){
        $scope.owners = response.data;
        console.log(response.data);
      });



    $scope.addOwner = function(){
        $http.post("/role1/owner", $scope.user).success(function(response, status){
            $scope.owners.push(response.data);
            $scope.user  = {};
            $('#addOwner').modal('hide');
        });
    };
  });
