'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('capturePaymentCtrl', function($scope,$position, $http, $state,NgTableParams) {
    
    $scope.id=''
    $scope.amount=''
    
    $scope.capturedPayment=function(){
//        console.log("/loggedapi/capturePayment?razorPaymentId="+$scope.id + "&amount="+($scope.amount*100))
        $http.get("/loggedapi/capturePayment?razorPaymentId="+$scope.id + "&amount="+($scope.amount*100)).success(function(response){
            console.log(response);
            $scope.message=response.message
            alert($scope.message)
             $scope.id=''
            console.log
            $scope.amount=''
           
        })
       
        
       
        
    }
    
    
    
  });
