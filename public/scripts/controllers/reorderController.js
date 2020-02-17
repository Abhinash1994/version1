'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # LeaveController
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp',['ngCsv'])
  .controller('reorder',function($scope, $http, NgTableParams
,Excel,$timeout) {
    console.log('reorder controller');

	$scope.makeCSVData = makeCSVData;

        $scope.data = inventoryItems;

        var parameters = {
            page : 1
        };

        var settings = {
            counts : [],
            dataset: $scope.data
        };

        $scope.tableParams = new NgTableParams(parameters, settings);

        //$log.debug('Params : ',$scope.tableParams);

        function makeCSVData(){
            var csvData = $scope.data;
            //csvData.unshift({name:'name', id:'Product Id',cq:'Current Quantity',mq:'Minimum Quantity'});
            return csvData;
        }
      
        $scope.order = [ 'name', 'itemId','quantity','minimumQuantity'];


        $scope.remove = function(idx){
          $http({
        method: 'DELETE',
        url: '/role2/inventory',
        data: {itemId : $scope.data[idx].itemId},
        headers: {'Content-Type': 'application/json;charset=utf-8'}
    })
          .success(function(response, status){
              console.log($scope.data[idx].quantity );
              $scope.data[idx].quantity = undefined;
              inventoryItems[idx].quantity = undefined;
            });
        };
        
     $scope.exportToExcel = function (tableId) { // ex: '#my-table'
            var exportHref = Excel.tableToExcel(tableId, 'WireWorkbenchDataExport');
            $timeout(function () {
                location.href = exportHref;
            }, 100); // trigger download
        }

  });
