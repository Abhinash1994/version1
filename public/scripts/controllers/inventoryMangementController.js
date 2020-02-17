'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # LeaveController
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp', ['ngCsv'])
  .controller('inventoryMangement',['$scope','$http','NgTableParams','Excel','$timeout', function($scope, $http, NgTableParams,Excel,$timeout) {
    console.log('inventoryMangement controller' );

	// $scope.makeCSVData = makeCSVData;

        $scope.data = inventoryItems;
        console.log(inventoryItems)

        var parameters = {
            page : 1
        };
        var index = 0;

        var settings = {
            counts : [10],
            dataset: $scope.data
        };

        $scope.tableParams = new NgTableParams(parameters, settings);
          console.log($scope);

 $scope.itemIdd='';
        $scope.add = function(idx, factor, itemId,parlorItemId){
          index = idx;
          $scope.newQuantity = {};
          $scope.itemIdd=itemId;
          $scope.parlorItemId=parlorItemId
            if(factor== -1){
                $('#consumeQuantity').modal('show');
            }else{
              $('#addQuantity').modal('show');
            }
        }

        $scope.addQuantity = function(factor,arg){
          console.log(  $scope.itemIdd)
          $scope.newQuantity.amount *=  factor;

          $scope.newQuantity.itemId =  angular.copy($scope.itemIdd);
          $scope.newQuantity.Id= angular.copy($scope.parlorItemId)
          console.log($scope.newQuantity);

          $http.put("/role2/consumeItem", $scope.newQuantity).success(function(response, status){console.log($scope.data[index].quantity);
            console.log( $scope.newQuantity.amount);

             $http.get("/role2/inventory").success(function(res, status){
            console.log("response",res)
            $scope.data = res.data;
            console.log(response);
            console.log(status);
              $scope.data[index].quantity = response.data.quantity;
              console.log(response);
              inventoryItems[index].quantity = response.data.quantity;
              $scope.newQuantity = {};
              if(factor == -1)$('#consumeQuantity').modal('hide');
              else $('#addQuantity').modal('hide');
            
            
        });

            
            });
        };
  
  $scope.order = [ 'name', 'itemId','quantity','minimumQuantity'];
      // $scope.tableParams = new NgTableParams({count: 10}, {counts: [10, 20], dataset: $scope.data});

        // $log.debug('Params : ',$scope.tableParams);

        // function makeCSVData(){
        //     var csvData = $scope.data;
        //     csvData.unshift({name:'name', id:'Product Id',cq:'Current Quantity',mq:'Minimum Quantity'});
        //     return csvData;
        // }
      $scope.exportToExcel = function (tableId) { // ex: '#my-table'
            var exportHref = Excel.tableToExcel(tableId, 'WireWorkbenchDataExport');
            $timeout(function () {
                location.href = exportHref;
            }, 100); // trigger download
        }
$scope.edit=function(c){
  $scope.editMinQuantity={}
     $scope.editMinQuantity.quantity=c.minimumQuantity;
     $scope.editMinQuantity.itemId=c.itemId;
        $('#editQuantity').modal('show');


}


$scope.editQuantity=function(){

    $http.post("/role2/editMinimumQuantity",$scope.editMinQuantity).success(function(res){
        console.log(res)
          $http.get("/role2/inventory").success(function(response, status){
            console.log($scope)
            $scope.data = response.data;
              var settings = {
            counts : [10],
            dataset: $scope.data
        };

        $scope.tableParams = new NgTableParams(parameters, settings);
            
            
        });


 $('#editQuantity').modal('hide');

    })


}





  }]);
