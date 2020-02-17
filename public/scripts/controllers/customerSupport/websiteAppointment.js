angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','isteven-multi-select','daterangepicker','ngSanitize', 'ngCsv'])

    .controller('websiteAppointment', function ($scope, $compile, $http, $timeout, $window, $log,NgTableParams,Excel, $timeout) {
        // console.log();
        var today=new Date();
        $scope.dateRangeSelected = {startDate: moment().startOf('month'), endDate: moment()};


        $scope.newCustomer=function(){

               $http.post("/role1/websiteAppointments",{ 'startDate':$scope.dateRangeSelected.startDate._d,
                    'endDate':$scope.dateRangeSelected.endDate._d} ).success(function(response, status){
                      $scope.stats=response.data;
                      console.log( "final data",$scope.stats)
                
          });

        }
    

    });

