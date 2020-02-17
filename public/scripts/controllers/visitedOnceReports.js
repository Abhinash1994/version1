'use strict';

angular.module('sbAdminApp', ['ui.calendar','ui.bootstrap','ngTable','daterangepicker'])
.controller('visitedOnceReports', function($scope,$http,$timeout,$state,$stateParams) {

    $scope.formats = ['EEEE,d,MMMM,yy'];
    $scope.format = $scope.formats[0];
    $scope.dateRangeSelected='';
    $scope.dateRangeSelected = {};

      $scope.today = function() {
        $scope.dt ="";
      };
      $scope.b=[""]
      $scope.today();
      $scope.popup1 = {
        opened: false
      };
      $scope.open1 = function(index) {
        $scope.popup1.opened = true;
      };

      var d = new Date();
      $scope.limitDate=d;

      $scope.categoryButton=function(categoryName) {
        if(categoryName=='Not Contacted'){
          $state.go('dashboard.visitedOnce');
        }else if (categoryName=='Contacted') {
          $state.go('dashboard.visitedOnceContacted');
        }else if (categoryName=='Converted'){
          $state.go('dashboard.visitedOnceConverted');
        }
        else if (categoryName=='Reports'){
          $state.go('dashboard.visitedOnceReports');
        }
        else if (categoryName=='divasAndMachosCustomers'){
          $state.go('dashboard.divasAndMachosCustomers');
        }
        else if (categoryName=='afterThreeMonths'){
          $state.go('dashboard.afterThreeMonths');
        }
        else if (categoryName=='Website Queries'){
          $state.go('dashboard.websiteQueries');
        }
        else if (categoryName=='Subscription Queries'){
          $state.go('dashboard.subscriptionQueries');
        }
        else {
          $state.go('dashboard.razorPayNonSubscriber');
        }

      }

    $scope.submitButton=function() {
        var query = {};
        query.startTime = $scope.dateRangeSelected.startDate._d;
        query.endTime = $scope.dateRangeSelected.endDate._d;
        console.log($scope.dateRangeSelected.startDate._d+""+$scope.dateRangeSelected.endDate._d);
        $http.post("/beuApp/customerCareReport",query).success(function(response){
            console.log(response);
            $scope.reportsData=response;
        });
        $http.post("/beuApp/totalContacted",query).success(function(response){
            console.log("new table",response);
            $scope.reportsDataNew=response.data;
        });
    }
});
