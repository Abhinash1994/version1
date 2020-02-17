angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','isteven-multi-select','daterangepicker','ngSanitize', 'ngCsv'])
    .controller('cashOnlineReportCtrl', function($scope, $http, Excel, $timeout) { 

    var today=new Date();
    $scope.freeHairCutFlag=1;
    $scope.callApi=function(param){
        $scope.freeHairCutFlag=param;
        // console.log(param)
        $http.post("role1/report/cashOnlineReport",{withFreeHair:$scope.freeHairCutFlag}).success(function(response){
            // console.log(response.data);
            $scope.data=response.data;  
        });
    }
    $scope.callApi($scope.freeHairCutFlag)
    });