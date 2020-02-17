'use strict';

angular.module('sbAdminApp', ['ui.calendar','ui.bootstrap','ngTable','daterangepicker'])
.controller('addManagertoSalon', function($scope,$http,$timeout,$state){
		

        		$scope.apply = function(x){
        			 $http.post("/role1/changeManagerSalon", {phoneNumber : x.phoneNumber, parlorId : x.parlorId}).success(function(response, status){
					            // console.log(response)
     					});
        		}

            $http.post("/role1/parlorList").success(function(response, status) {
                        // console.log(response);
                         $scope.parlors = response.data;
                });



     $http.post("/role1/changeManagerSalon").success(function(response, status){
            $scope.stat = response.data;
            // console.log(response)
     });
});
