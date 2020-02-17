'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('createMembershipCtrl', ['$scope','$position', '$http', '$state', 'NgTableParams', function($scope,$position, $http, $state, NgTableParams) {
	  
      $scope.days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
	  $scope.membership = {};
	  $scope.membership.percentage = [];
	  $scope.memberships = [];
	  $http.get("/role1/supercategory").success(function(response, status){
        $scope.departments = response.data;
        // console.log($scope.departments);
    });


	  $http.get("/role2/membership").success(function(response, status){
        $scope.memberships = response.data;
        // console.log($scope.memberships);
    });

	  $scope.printArray=function(){



	  		$http.post('role1/membership', $scope.membership).success(function(response, status){
	  			$scope.memberships.push(response.data);
	  			$scope.membership = {};
	  			$scope.membership.percentage = [];
	  		});
	  };

  }]);
