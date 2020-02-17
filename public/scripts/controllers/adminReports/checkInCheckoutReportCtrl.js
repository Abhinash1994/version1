'use strict';

angular.module('sbAdminApp', ['isteven-multi-select', 'ui.bootstrap', 'daterangepicker', 'ngSanitize', 'ngTable', 'ngCsv'])
  .controller('checkInCheckout', function ($scope, $http, Excel, $timeout, NgTableParams, $stateParams, $window, $rootScope) {

    // console.log("checkInCheckout");
    $scope.date='';
    $scope.submitData=function(){
      // console.log($scope.date)
      $http.get("/role1/checkInCheckOutByDate?date="+$scope.date).success(function(res){
            // console.log(res);
            $scope.finalData=res.data;
            // console.log($scope.finalData);
      })
    }
    $scope.totalDistance=function(distanceArray){
      var total=0
      distanceArray.forEach(function(element) {
        var homeDistance=element.distanceTravelledSalonToHome?element.distanceTravelledSalonToHome:0
        total=total+element.distanceTravelled+homeDistance
      }, this);
      return total
    }
    $scope.effectiveDistance=function(distanceArray){
      var total=0
      distanceArray.forEach(function(element) {
        var homeDistance=element.distanceTravelledSalonToHome?element.distanceTravelledSalonToHome*.5:0
        var distance=element.distanceType=="home"?element.distanceTravelled*.5:element.distanceTravelled+homeDistance
        total=total+distance;
      }, this);
      // console.log("total",total)
      return total
    }

  });