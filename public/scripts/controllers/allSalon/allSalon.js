'use strict';

angular.module('sbAdminApp', ['ui.calendar','ui.bootstrap','ngTable','daterangepicker'])
.controller('allSalon', function($scope,$http,$timeout,$state){
	
	 $http.get("/role2/salonRecommendations?allParlors=true").success(function(response, status){
           // console.log("here")
            $scope.report = response;
            // console.log( $scope.report)
        });


});
