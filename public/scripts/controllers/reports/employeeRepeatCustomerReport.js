'use strict';

angular.module('sbAdminApp', ['ui.calendar','ui.bootstrap','ngTable','daterangepicker'])
.controller('employeeRepeatCustomerReport', function($scope,$http,$timeout,$state){

	    $scope.role=role;
        $scope.allParlors = allParlors;
        $scope.selectedParlorId = parlorId;

        $scope.changeParlor = function(pId){
        $scope.selectedParlorId = pId;
        $http.get("/role2/report/employeeRepeatCustomerReport?parlorId="+$scope.selectedParlorId).success(function(response, status){
      // console.log(response)
           $scope.report = response;
        });
      };
	
  $http.get("/role2/report/employeeRepeatCustomerReport?parlorId="+$scope.selectedParlorId).success(function(response, status){
      // console.log(response)
           $scope.report = response;
        });

});
