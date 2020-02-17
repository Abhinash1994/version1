'use strict';

angular.module('sbAdminApp', ['ui.calendar','ui.bootstrap','ngTable','daterangepicker'])
.controller('salonReview', function($scope,$http,$timeout,$state){
	

	$http.get("/role2/parlorReviews").success(function(response, status){
           $scope.report = response.data;
            console.log(response);
        });
		

  		   $scope.addComment = function(){
              $('#tip').modal('hide');
              var url="/role2/replyReview?appointmentId="+$scope.appointmentId+"&reply="+$scope.reply
              console.log($scope.appointmentId,$scope.reply,url);
              $http.get(url).success(function(response, status){
                $scope.report = response.data;
                console.log(response);
                $http.get("/role2/parlorReviews").success(function(response, status){
                  $scope.report = response.data;
                  console.log(response);
               });
             });
   			 };

		   	 $scope.add=function(id){
            $('#tip').modal('show');
            $scope.appointmentId=id;
   			 };

});
