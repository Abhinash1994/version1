'use strict';

angular.module('sbAdminApp', ['ui.calendar','ui.bootstrap','ngTable','daterangepicker'])
.controller('customersNoShow3Months', function($scope,$http,$timeout,$state){

	//console.log("/role2/report/customersNoShow3MonthsByParlor?parlorId="+parlorId)
     

     $scope.service=function(services){
     	var data="";
     	services.forEach(function(service){
     		data+=service.name+ "(" + service.employees[0] + "), " 
     	})
     	return data;
     }
    


        $scope.role=role;
        $scope.allParlors = allParlors;
        $scope.selectedParlorId = parlorId;

$http.get("/role2/report/customersNoShow3MonthsByParlor?parlorId="+$scope.selectedParlorId).success(function(response, status){
          // console.log(response)
            $scope.customersNoShow = response;
        });

        $scope.changeParlor = function(pId){
        $scope.selectedParlorId = pId;
        $http.get("/role2/report/customersNoShow3MonthsByParlor?parlorId="+$scope.selectedParlorId).success(function(response, status){
          // console.log(response)
            $scope.customersNoShow = response;
        });
      };
});
