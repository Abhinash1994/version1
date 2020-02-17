'use strict';

angular.module('sbAdminApp', ['ui.calendar','ui.bootstrap','ngTable','daterangepicker'])
.controller('appointmentCancelBySalon', function($scope,$http,$timeout,$state){
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

        $http.post("/role1/parlorList").success(function (response, status) {
            $scope.parlors = response.data;
            // console.log($scope.parlors);
        });
      
    $scope.categoryButton=function(selectedCategory) {
      if(selectedCategory=="Re-Booked Appointment"){
        $scope.oldSelected=true;
        $scope.newSelected=false;
        $scope.salonWise=false;
      }
     if(selectedCategory=="Cancel Appointment Employee"){
        $scope.newSelected=true;
        $scope.oldSelected=false;
        $scope.salonWise=false;
      }
      if(selectedCategory=="Cancel Appointment Salon"){
        $scope.newSelected=false;
        $scope.oldSelected=false;
        $scope.salonWise=true;
      }
    }

    // parlor id selected
    $scope.changeParlor = function(selectedParlor){
        // console.log(selectedParlor);
        $scope.selectedParlor = selectedParlor;
    }


      $scope.salonwise = function () {
            var reqObj = {
                startDate: $scope.dts,
                endDate: $scope.dte,
            };
            // console.log("final obj", reqObj)
            $http.post('/role1/salonWiseCancelledApptDetail',reqObj).success(function(response, status) {
                $scope.data = response;
                // console.log(response);
            });
        }


          $scope.empwise = function () {
            var parlorId = $scope.selectedParlor.selectedParlor;
            // $scope.selectedParlor.forEach(function (parlor) {
            //     parlorId.push(parlor.parlorId)
            // }, this);
            var reqObj = {
                startDate: $scope.dts,
                endDate: $scope.dte,
                parlorId: parlorId,
            };
            $http.post('/role1/salonWiseCancelledApptDetail',reqObj).success(function(response, status) {
                $scope.stats = response;
            });
        }

         $scope.rebookwise = function () {
            var parlorId = $scope.selectedParlor.selectedParlor;
            // $scope.selectedParlor.forEach(function (parlor) {
            //     parlorId.push(parlor.parlorId)
            // }, this);
            var reqObj = {
                startDate: $scope.dts,
                endDate: $scope.dte,
                parlorId: parlorId,
            };
            $http.post('/role1/cancelledRebookedAppointment',reqObj).success(function(response, status) {
                $scope.rebooked = response;
                // console.log(response);
            });
        }

});
