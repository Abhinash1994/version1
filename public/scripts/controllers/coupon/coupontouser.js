'use strict';

angular.module('sbAdminApp', ['ui.calendar','ui.bootstrap','ngTable','daterangepicker'])
.controller('Addcoupontouser', function($scope,$http,$timeout,$state){
 
        $scope.data={}
     
      $scope.phoneNumber='';

      $http.post("/role1/addCouponsToUsers").success(function(response) {
        
        $scope.stats = response.data;
        console.log("here",$scope.stats)
    });
    $http.get("/role1/allParlorsUnderRedCategory").success(function(response, status) {
        console.log(response.data);
        $scope.redSalons=response.data
    });
    $http.post('/role1/allParlorsWithActive').success(function(response){
        $scope.parlors=response.data;
        console.log("parlors", $scope.parlors)
    })



       $scope.submitData=function(phoneNumber,couponType,code,parlorId){
           if(parlorId){
            var obj={"phone":phoneNumber,couponType:couponType,code:code,parlorId:parlorId}
            console.log("here",obj)
         $http.post("/role1/addCouponsToUsers",obj).success(function(response) {
             console.log("here",obj)
             alert(code  + "Coupon Added Successfully")
          }); 
           }else{
               alert("Please select salon.")
           }
              
       }

});
