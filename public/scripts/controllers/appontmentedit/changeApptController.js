'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # LeaveController
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp',['nvd3','ui.bootstrap','isteven-multi-select'])
  .controller('editSubscriptionCtrl',['$scope','$http','NgTableParams', function($scope, $http,NgTableParams) {

 // console.log("this is a changes parlor");
   
    $scope.selectedParlor={};
    $scope.hideTextarea=null;
    $http.get("/beuApp/getParlorsWithAddress").success(function(res) {
      // console.log(res);
      $scope.parlors=res.data;
    })
    
    
    $scope.phoneNumber=''
$scope.submitphoneNumber=function(){
    $http.post("role1/changeParlorEditAppointment",{phoneNumber:$scope.phoneNumber}).success(function(res){
      // console.log(res);
      $scope.users=res.data;
      // console.log($scope.users)
    })
}
    $scope.edit=function(index) {
      $scope.hideTextarea=index;
      $scope.editRow=$scope.users[index];
      // console.log($scope.editRow);
    }
    $scope.save=function(index) {

      $scope.selectedParlorInfo=$scope.selectedParlor.selected;
      $scope.selectedParlor={};
      // console.log($scope.selectedParlorInfo);
      $scope.hideTextarea=null;
      var query ={
        appointmentId :$scope.editRow._id,
        parlorId:$scope.selectedParlorInfo._id
      }
      // console.log("query",query);
      $http.post('/role1/changeParlorEditAppointment',query).success(function(res){
          // console.log(res);
          alert(res.data);
      })
      $http.post("role1/changeParlorEditAppointment",{phoneNumber:$scope.phoneNumber}).success(function(res){
        // console.log(res);
        $scope.users=res.data;
      })
    }

   

  }]);
