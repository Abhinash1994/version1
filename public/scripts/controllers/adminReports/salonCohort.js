'use strict';

angular.module('sbAdminApp', ['ui.calendar','ui.bootstrap','daterangepicker'])
.controller('salonCohort', function($scope,$http,$timeout,Excel) {

  $http.post("/beuApp/revenueCohort2").success(function(response) {
    // console.log(response);
    $scope.salonCohortData=response;
  $scope.salonCohortData=  $scope.salonCohortData.map(function(a,i){
            for(var c=a.cohortData.length;c<12;c++)
            {
                a.cohortData.push({});
            }
            return a
    })

    // console.log($scope.salonCohortData)
  });

  $scope.exportToExcel = function (tableId) { // ex: '#my-table'
      var exportHref = Excel.tableToExcel(tableId, 'WireWorkbenchDataExport');
      $timeout(function () {
          location.href = exportHref;
      }, 100); // trigger download
  }


});
