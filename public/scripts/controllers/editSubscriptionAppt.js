'use strict';

angular.module('sbAdminApp', ['ui.calendar','ui.bootstrap','ngTable','daterangepicker'])
.controller('editSubscriptionAppt', function($scope,$http,$timeout) {
    $scope.selectedParlor={};
    $scope.hideTextarea=null;
    $http.get("/beuApp/getParlorsWithAddress").success(function(res) {
      console.log(res);
      $scope.parlors=res.data;
    })

    $http.post("role1/changeParlorForSubscription").success(function(res){
      console.log(res);
      $scope.users=res.data;
    })
    $scope.edit=function(index) {
      $scope.hideTextarea=index;
      $scope.editRow=$scope.users[index];
      console.log($scope.editRow);
    }
    $scope.save=function(index) {

      $scope.selectedParlorInfo=$scope.selectedParlor.selected;
      $scope.selectedParlor={};
      console.log($scope.selectedParlorInfo);
      $scope.hideTextarea=null;
      var query ={
        appointmentId :$scope.editRow._id,
        parlorId:$scope.selectedParlorInfo._id
      }
      console.log("query",query);
      $http.post('/role1/changeParlorForSubscription',query).success(function(res){
          console.log(res);
          alert(res.data);
      })
      $http.post("role1/changeParlorForSubscription").success(function(res){
        console.log(res);
        $scope.users=res.data;
      })
    }

})
