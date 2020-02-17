'use strict';

angular.module('sbAdminApp', ['ui.calendar','ui.bootstrap','ngTable','daterangepicker'])
.controller('previouSubscribers', function($scope,$http,$timeout,$state){
  
   // console.log("/role1/newClientReportOfGurgaonSalons")
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
        var monthNames = [ "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December" ];

        $scope.dts = new Date(today.getFullYear(), today.getMonth() - 2, 1);

        $scope.dte = new Date();  
        var date = new Date();      
        $scope.months=[1,2,3,4,5,6,7,8,9,10,11,12];

        $scope.applyFilter = function () {
            $scope.monthName=monthNames[$scope.dts.getMonth()]
            var reqObj = {
                startDate: $scope.dts,
                endDate: $scope.dte,
            };
       $http.post("role1/subscriptionSaleReportForResale", reqObj).success(function(response, status){
             console.log("final data",response)
                $scope.stats = response.data.subscriptions;
                
          });
        }
  


});
