angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','isteven-multi-select','daterangepicker','ngSanitize', 'ngCsv'])

    .controller('primecustomer', function ($scope, $compile, $http, $timeout, $window, $log,NgTableParams,Excel, $timeout) {
       
        var today=new Date();
        $scope.dateRangeSelected = {startDate: moment().startOf('month'), endDate: moment()};

        $scope.primecustomer=function(){
               $http.post("/role1/primeCustomerReport",{ 'startDate':$scope.dateRangeSelected.startDate._d,
                    'endDate':$scope.dateRangeSelected.endDate._d} ).success(function(response, status){
                      $scope.stats=response.data;
                      console.log( "prime customer",$scope.stats)
                
          });

        }
    

    });

