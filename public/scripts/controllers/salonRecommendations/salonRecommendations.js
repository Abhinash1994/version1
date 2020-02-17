'use strict';

angular.module('sbAdminApp', ['ui.calendar','ui.bootstrap','ngTable','daterangepicker'])
.controller('salonrecommendations', function($scope,$http,$timeout,$state){
	

	 $http.get("/role2/salonRecommendations?parlorId="+parlorId).success(function(response, status){
            $scope.report = response[0].data;
           // console.log($scope.report)
        });


});
