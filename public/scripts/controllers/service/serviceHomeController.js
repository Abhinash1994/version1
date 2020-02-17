'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # LeaveController
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp',['nvd3'])
  .controller('serviceHomeController',['$scope','$http','NgTableParams', function($scope, $http,NgTableParams) {


$scope.onTimePeriodChange = function(){
/*  $http.get("/role3/serviceAnalytics?timePeriod=" + $scope.timePeriod).success(function(response, status){
          $scope.data =  response.data;
          $scope.clusterNumber = $scope.data.numberCluster;
          $scope.clusterRevenue = $scope.data.revenueCluster;
          $scope.clusterType = 1;
          console.log($scope.data);
  });*/
};
$scope.timePeriods = [{'value' : 1, 'name' : 'Yesterday'}, {'value' : 2, 'name' : 'This Week'}, {'value' : 3, 'name' : 'This Month'}];
$scope.clusterTypes = [{'value' : 1, 'name' : 'Number'}, {'value' : 2, 'name' : 'Revenue'}];

$scope.changeCluster = function(type){
 // console.log(type);

};
$scope.timePeriod = 1;
$scope.onTimePeriodChange();
    //console.log('Service Home controller');
	$scope.options1 = {
            chart: {
                type: 'sunburstChart',
                height: 450,
				mode:'size',
                color: d3.scale.category10(),
                duration: 250
            }
        };
        $scope.options2 = {
                  chart: {
                      type: 'sunburstChart',
                      height: 450,
					  mode:'size',
                      color: d3.scale.category20c(),
                      duration: 250
                  }
              };
  }]);
