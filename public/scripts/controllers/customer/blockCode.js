'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # LeaveController
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp',['nvd3','ui.bootstrap','isteven-multi-select'])
  .controller('blockCodeCtrl',['$scope','$http','NgTableParams', function($scope, $http,NgTableParams) {

 // console.log("this is a block code");
   
   
   $scope.code=''
   
   // console.log( $scope.cupon)
      $scope.blockCode=function(){
      
       
       // console.log($scope.code)
             alert("Are You Sure");
     $http.post("role1/blockCouponCodes",{code:$scope.code}).success(function(response){
       
      
      // console.log(response);
            
           });
//          
          
          
      }
   

  }]);
