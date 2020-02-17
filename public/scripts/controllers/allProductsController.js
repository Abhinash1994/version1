'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # LeaveController
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp',['ngCsv'])
  .controller('allProducts',['$scope','$http','NgTableParams', function($scope, $http, NgTableParams) {
    console.log('allProducts controller');

	$scope.makeCSVData = makeCSVData;
    console.log(inventoryItems)

        $scope.data = inventoryItems;
        var index = 0;
        var parameters = {
            page : 1
        };

        var settings = {
            counts : [],
            dataset: $scope.data
        };

        $scope.tableParams = new NgTableParams(parameters, settings);
        console.log($scope);

        //$log.debug('Params : ',$scope.tableParams);

        function makeCSVData(){
            var csvData = $scope.data;
           // csvData.unshift({name:'name', id:'Product Id',sp:'Selling Price',bb:'Best Before(months)',cap:'Capacity'});
            return csvData;
        }
      $scope.order = [ 'name', 'itemId','sellingPrice','bestBefore','capacity'];

        $scope.addProduct = function(){
            console.log($scope.newItem);
            $http.post("/role2/inventory", $scope.newItem).success(function(response, status){
                $scope.newItem = {};
                console.log(response);
                $scope.data.forEach(function(item, key){
                    if(item.itemId == response.data.itemId){
                        $scope.data[key].quantity = response.data.quantity;
                    }
                });
                inventoryItems.forEach(function(item, key){
                    if(item.itemId == response.data.itemId){
                        index = key;
                    }
                });
                inventoryItems[index].quantity = response.data.quantity;
                inventoryItems[index].minimumQuantity = response.data.minimumQuantity;
                $('#addProduct').modal('hide');
              });
        };

        $scope.add =  function(id){
            var index=0;
            var count=0;
            $scope.data.forEach(function(prod){
               if(prod.itemId==id) {
                   index=count;
               }
                count++;
            });
            $scope.newItem = {};
            $scope.formData = $scope.data[index];
            console.log($scope.formData);
            $scope.newItem.itemId = $scope.formData.itemId;
          $('#addProduct').modal('show');
        }





  }]);
