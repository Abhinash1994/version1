'use strict'

angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap'])

    .controller('PreviousExpenseCtrl', function ($scope, $compile, $http, $timeout, $window, $log, NgTableParams) {

     $scope.datas = [{"sno":1,"date":"27th July 2016","amount":100,"billno":3903,"ecat":"fixed","esubcat":"rent"}];
        var index = 0;
        var parameters = {
            page : 1
        };

        var settings = {
            counts : [],
            dataset: $scope.data
        };

        $scope.tableParams = new NgTableParams(parameters, settings);


      //  function makeCSVData(){
      //      var csvData = $scope.data;
     //       csvData.unshift({name:'name', id:'Product Id',sp:'Selling Price',bb:'Best Before(months)',cap:'Capacity'});
      //      return csvData;
      //  }   

    });

