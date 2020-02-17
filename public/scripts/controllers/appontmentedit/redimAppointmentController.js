'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # LeaveController
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp',['nvd3','ui.bootstrap','isteven-multi-select'])
  .controller('redimAppointmentController',['$scope','$http','NgTableParams', function($scope, $http,NgTableParams) {

 // console.log("this is a changes parlor");
   
    $scope.selectedParlor={};
    $scope.hideTextarea=null;

    
    
    $scope.phoneNumber=''
$scope.submitphoneNumber=function(){
    $http.post("/role1/updateSubscriptionBalance",{phoneNumber:$scope.phoneNumber}).success(function(res){
      // console.log(res);
      $scope.users=res.data;
      // console.log($scope.users)
    })
}
 
    $scope.save=function(index,a) {

      $scope.selectedParlorInfo=$scope.selectedParlor.selected;
      $scope.selectedParlor={};
      // console.log($scope.selectedParlorInfo);
      $scope.hideTextarea=null;
      var query ={appointmentId :$scope.users[index]._id,
                  userId:$scope.users[index].client.id,
                  backend:true}
            // if(a=='reopen'){query.reOpen=true};
      
      $http.post('/role3/verifyOtpForSubscription',query).success(function(res){
          // console.log(res);
          alert(res.message);
          $scope.submitphoneNumber()
      })
     
    }

   

  }]);
