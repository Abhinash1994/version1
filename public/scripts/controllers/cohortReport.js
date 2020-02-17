'use strict';

angular.module('sbAdminApp', ['isteven-multi-select','ui.bootstrap','daterangepicker','ngMap','ngSanitize','ngTable','uiGmapgoogle-maps'])
.controller('cohortReport', function($scope,$http,$timeout,Excel) {

      $http.post("/beuApp/cohortReport").success(function(response){
        console.log(response);
        $scope.cohortData=response;

      })
      $scope.exportToExcel = function (tableId) { // ex: '#my-table'
          var exportHref = Excel.tableToExcel(tableId, 'WireWorkbenchDataExport');
          $timeout(function () {
              location.href = exportHref;
          }, 100); // trigger download
      }

});
