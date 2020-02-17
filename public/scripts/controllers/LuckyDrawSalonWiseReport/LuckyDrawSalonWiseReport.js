'use strict';

angular.module('sbAdminApp', ['ui.calendar','ui.bootstrap','ngTable','daterangepicker'])
.controller('LuckyDrawSalonWiseReport', function($scope,$http,$timeout,$state){
  
$scope.popup1 = {
            opened: false
        };

        $scope.popup2 = {
            opened: false
        };

        $scope.open1 = function () {
            $scope.popup1.opened = true;
        };
        $scope.open2 = function () {
            $scope.popup2.opened = !$scope.popup2.opened;
        };
        var today = new Date();
        $scope.dts = new Date(today.getFullYear(), today.getMonth() - 2, 1);

        $scope.dte = new Date();  
        var date = new Date();      
        
        $scope.applyFilter = function () {

            var reqObj = {
                startDate: $scope.dts,
                endDate: $scope.dte,
            };
       $http.post("/role1/claimedUnclaimedStatusSalonWiseReport", reqObj).success(function(response, status){
              // console.log(response)
                $scope.stats = response;
                
          });
        }
  


});
