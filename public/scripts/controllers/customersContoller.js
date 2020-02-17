'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
var app=angular.module('sbAdminApp',['ngJsonExportExcel'])
  .controller('CustomersCtrl', ['$scope','$position', '$http', '$state', 'NgTableParams','$timeout','Excel','readFileData', function($scope,$position, $http, $state, NgTableParams, $timeout,Excel, readFileData) {

      init();
        $scope.mydata={name:"Customer Name",phoneNumber:"Phone Number"};
        $scope.dataList=[];
      function init(){
          $scope.name = 'Shailendra Nagvani';
          $scope.membershipId = 'P001';
          $scope.membershipDate = new Date().setDate(10);
          $scope.membershipType = 'Gold Member';
          $scope.phoneNumber = '+(91) ' + '8826345311';
          $scope.email = 'shailendra2011991@gmail.com';
      }


    $scope.uploadCustomer = function(){
        console.log("dsaas");
        $http.post("/role3/uploadCustomer").success(function(response, status){

            console.log(response);
        });
    };
      $scope.customers = [];
      var page = 1;
      $http.post("/role3/customers?page="+page).success(function(response, status){
        $scope.customers = response.data;
        console.log($scope.customers);
        $scope.dataList=angular.copy($scope.customers)
          $scope.tableParams = new NgTableParams({ count: 10,sorting: { noOfAppointments: "desc" }  }, { counts: [5, 10, 20], dataset: $scope.customers,});
      });

      $scope.addCustomer = function(){
          $http.post("/role3/createCustomer", $scope.user).success(function(response, status){
              $scope.customers = response.data;
              page = 1;
              $scope.user = {};
              $('#addCustomer').modal('hide');
            });
      };

      $scope.openCustomerDetail = function(userId, name){
          $state.go('dashboard.customer-home', {userId : userId, userName : name});
      };


      $scope.makeCSVData = makeCSVData;
      

        $scope.data = [
            {name: "Rohan", age: 21},
            {name: "Vishal", age: 22},
            {name: "Nikhil", age: 23},
            {name: "Rahul", age: 21},
            {name: "Prashant", age: 20},
            {name: "Shrikant", age: 18},
            {name: "Sachin", age: 25},
            {name: "Varun", age: 24}
        ];

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
            csvData.unshift({name:'name', age:'age'});
            return csvData;
        }

      
         $scope.exportToExcel = function (tableId) {
         var exportHref = Excel.tableToExcel(tableId);
          $timeout(function () {
              location.href = exportHref;
          }, 100); // trigger download

       
        }
         console.log('readFileData')
         
             $scope.fileDataObj = {};
    
    $scope.uploadFile = function() {
      if ($scope.fileContent) {
        $scope.fileDataObj = readFileData.processData($scope.fileContent);
      
        $scope.fileData = JSON.stringify($scope.fileDataObj);
          console.log($scope.fileData)
      }
    }
      
   
    
    
  }]);
 app.directive('fileReaderDirective', function() {
    return {
        restrict: "A",
        scope: {
            fileReaderDirective: "=",
        },
        link: function(scope, element) {
            $(element).on('change', function(changeEvent) {
                var files = changeEvent.target.files;
                if (files.length) {
                    var r = new FileReader();
                    r.onload = function(e) {
                        var contents = e.target.result;
                        scope.$apply(function() {
                            scope.fileReaderDirective = contents;
                        });
                    };
                    r.readAsText(files[0]);
                }
            });
        }
    };
});
    
app.factory('readFileData', function() {
    return {
        processData: function(csv_data) {
            var record = csv_data.split(/\r\n|\n/);
            var headers = record[0].split(',');
            var lines = [];
            var json = {};

            for (var i = 0; i < record.length; i++) {
                var data = record[i].split(',');
                if (data.length == headers.length) {
                    var tarr = [];
                    for (var j = 0; j < headers.length; j++) {
                        tarr.push(data[j]);
                    }
                    lines.push(tarr);
                }
            }
            
            for (var k = 0; k < lines.length; ++k){
              json[k] = lines[k];
            }
            return json;
        }
   
    };

   
});
