'use strict';

angular.module('sbAdminApp', ['ui.calendar','ui.bootstrap','daterangepicker'])
.controller('trainingCompleted', function($scope,$http) {

  $http.get("/beuApp/getParlors").success(function(response) {
    // console.log(response);
    $scope.parlors=response.data;
  });

  $scope.activeEmployees=function() {
    $http.post("http://10.0.3.71:1337/beuApp/getActiveEmployees",{parlorId:$scope.parlors.selected._id}).success(function(response) {
      // console.log(response);
      $scope.employeelist=response.data;
      for (var i = 0; i < $scope.employeelist.length; i++) {
        $scope.employeelist[i].selectEmployee=false;
        // $scope.employeelist[i].theory=false;
        // $scope.employeelist[i].practical=false;
        if($scope.employeelist[i].lastName==null){
          $scope.employeelist[i].employeeName=$scope.employeelist[i].firstName;
        }
        else {
          $scope.employeelist[i].employeeName=$scope.employeelist[i].firstName+" "+$scope.employeelist[i].lastName;
        }
      }
      // console.log("$scope.employeelist",$scope.employeelist);
    });
  }

  $scope.sendDetails=function(empid) {

      // console.log(empid);
        $http.post("http://10.0.3.71:1337/beuApp/trainingsTakenByEmployee",{employeeId:empid}).success(function(response) {
        //  console.log(response);
          $scope.employeeDetails=response;
        })

  }

});
