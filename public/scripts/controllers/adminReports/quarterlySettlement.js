angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','isteven-multi-select','daterangepicker','ngSanitize', 'ngCsv'])

    .controller('quarterlySettlement', function ($scope, $compile, $http, $timeout, $window, $log,NgTableParams,Excel, $timeout) {
    

             $http.post("/role1/quarterlySupportData").success(function(res, status){
              
                    $scope.quartlyData = res.data;
                    console.log("final",$scope.quartlyData)
                });

    });

