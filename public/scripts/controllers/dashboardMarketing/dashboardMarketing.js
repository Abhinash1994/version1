'use strict';

angular.module('sbAdminApp', ['ui.calendar','ui.bootstrap','ngTable','daterangepicker'])
.controller('dashboardMarketing', function($scope,$http,$timeout,$state){
  $scope.stats = 0;
  $scope.credite=0;
  $scope.gender = "M";
  $scope.sendBtn = true;
  $scope.data = {message : "", limit : 0, offPercentage : 0};
  $scope.phoneNumbers = [];
  $scope.data.singleSelect = 1;
    $scope.getRequest2 = function(){
      // console.log("here");
      // console.log($scope.gender);
      // console.log($scope.data.singleSelect);
      let param = "";
      if($scope.gender != "all"){
        param = "gender=" + $scope.gender + "&";
      }
      param += "customerType="+ $scope.data.singleSelect+"&parlorId="+parlorId;
     $http.get("/role2/userForMarketing?" + param).success(function(response, status){
          // console.log(response.data)
            $scope.stats = response.data.count;
            $scope.phoneNumbers = response.data.phoneNumbers;
            $scope.sendBtn = false;
        });
    }

     $http.get("/role2/smsCountRemaining").success(function(response, status){
            $scope.credite = response.data.smsCrediteleft;
     });

     $scope.sendSms = function(){
        // console.log("here");
        var phoneNumbers = ["9695748822", "9810917227"];
        $scope.phoneNumbers.forEach(function(p){
          phoneNumbers.push(p.phoneNumber);
        });
        $http.post("/role2/createCustomCouponCodeSalonWise", {phoneNumbers : phoneNumbers, message : $scope.data.message, 
          limit : $scope.data.limit, offPercentage : $scope.data.offPercentage, parlorId : parlorId }).success(function(response, status){
            alert("message Sent");
        });
     }
    

});
