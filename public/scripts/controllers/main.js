'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','ngSanitize'])

    .controller('MainCtrl', function ($scope, $compile,$http, $timeout) {


//        console.log("this is home pages");
//    $http.post("employeeApp/salonSupportReport").success(function(res){
//        console.log(res);
//        $scope.homeData=res.data;
//        console.log("hell",$scope.homeData);
//        
//    })
    
        $http.get("/role2/parlorHomeData").success(function(response, status){
            $scope.stats = response.data;
           
        });

         $http.get("/role2/subscriberReportLastMonth").success(function(response, status){
            $scope.subscriberReport = response.data;
             console.log("subscriber report kpi",$scope.subscriberReport)
           
        });
          $http.get("/role2/salonKpiForApp").success(function(response, status){
            $scope.salonKPI = response.data;
            console.log("salon kpi",$scope.salonKPI)
           
        });




        $scope.dataset = [
                {
                    "month":20130101,
                    "sales":38
                },
                {
                    "month":20130201,
                    "sales":35
                },
                {
                    "month":20130301,
                    "sales":41
                },
                {
                    "month":20130401,
                    "sales":55
                },
                {
                    "month":20130501,
                    "sales":58
                },
                {
                    "month":20130601,
                    "sales":66
                },
                {
                    "month":20130701,
                    "sales":74
                },
                {
                    "month":20130801,
                    "sales":78
                },
                {
                    "month":20130901,
                    "sales":38
                },
                {
                    "month":20131001,
                    "sales":30
                },
                {
                    "month":20131101,
                    "sales":26
                },
                {
                    "month":20131201,
                    "sales":29
                }
            ];

        $scope.xLabel = "Date";
        $scope.yLabel = "Sales";

        $scope.minVal = $scope.dataset[0].sales;
        $scope.maxVal = $scope.dataset[0].sales;

        getMinMax();

        function getMinMax(){
            for (var i = 0; i < $scope.dataset.length; i++) {
                if($scope.minVal > $scope.dataset[i].sales){
                    $scope.minVal = $scope.dataset[i].sales;
                }
                if($scope.maxVal < $scope.dataset[i].sales){
                    $scope.maxVal = $scope.dataset[i].sales
                }
            }
        }

  });
