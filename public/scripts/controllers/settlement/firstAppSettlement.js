'use strict';

angular.module('sbAdminApp', ['ui.calendar','ui.bootstrap','ngTable','daterangepicker'])
.controller('firstAppSettlement', function($scope,$http,$timeout,$state){

  $scope.formats = ['EEEE,d,MMMM,yy'];
  $scope.format = $scope.formats[0];
  $scope.dateRangeSelected='';
  $scope.dateRangeSelected = {};

  $scope.today = function() {
    $scope.dt ="";
  };
  $scope.b=[""]
  $scope.today();
  $scope.popup1 = {
    opened: false
  };
  $scope.open1 = function(index) {
    $scope.popup1.opened = true;
  };

  $scope.submitButton=function() {
    // console.log($scope.dateRangeSelected.startDate._d);
    // console.log($scope.dateRangeSelected.endDate._d);
    $http.post("/api/firstappDigitalSettlement",{startDate:$scope.dateRangeSelected.startDate._d,endDate:$scope.dateRangeSelected.endDate._d}).success(function(response) {
     // console.log(response);
      alert("Successfully Submitted");
    })

  }

});
