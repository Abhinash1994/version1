'use strict';

angular.module('sbAdminApp', ['ui.calendar','ui.bootstrap','ngTable','daterangepicker'])
.controller('revenueReport', function($scope,$http,$timeout,Excel){
  $scope.formats = ['EEEE,d,MMMM,yy'];
  $scope.format = $scope.formats[0];
  $scope.dateRangeSelected={startDate: moment().startOf('month'), endDate: moment()};
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
  d.setDate(d.getDate());
  $scope.limitDate=d;
  $scope.dateChange=function(){
    console.log("working" , $scope.dateRangeSelected);
  }
  $scope.dateSelected=function() {
    var query={
      startDate:$scope.dateRangeSelected.startDate._d,
      endDate:$scope.dateRangeSelected.endDate._d,

    }
    // console.log(query);
    $http.post("/beuApp/revenueReport2", query).success(function(res){
      // console.log(res);
      $scope.revenue=res;
    })
  }

  $scope.exportToExcel = function (tableId) { // ex: '#my-table'
      var exportHref = Excel.tableToExcel(tableId, 'WireWorkbenchDataExport');
      $timeout(function () {
          location.href = exportHref;
      }, 100); // trigger download
  }

});
