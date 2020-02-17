'use strict';

angular.module('sbAdminApp', ['isteven-multi-select','ui.calendar','ui.bootstrap','daterangepicker'])
.controller('trainingSession', function($scope,$http) {

    $http.get("http://10.0.3.71:1337/beuApp/getUnits").success(function(response){

      $scope.units=response.data;

    });

    $http.get("/beuApp/getParlors").success(function(response) {
      // console.log(response);
      $scope.parlors=response.data;
    })

    $scope.showChapters=function() {
      $http.post("http://10.0.3.71:1337/beuApp/getChapters",{unitId:$scope.units.selected.id}).success(function(response) {
        // console.log(response);
        $scope.chapters=response.data;
      });
    }
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

    $scope.sendEmpList=function(){
      $scope.listToBeSent=[];
      for (var i = 0; i < $scope.employeelist.length; i++) {
        console.log($scope.employeelist[i].selectEmployee);
        if($scope.employeelist[i].selectEmployee==true){//$scope.employeelist[i].practical==true || $scope.employeelist[i].theory==true
          $scope.listToBeSent.push($scope.employeelist[i]);
          // console.log("true");

        }
      }

              console.log($scope.listToBeSent);
    }

    $scope.submitButton=function() {
      $scope.sendEmpList();
      $http.post("",{}).success(function(response) {

      });
    }

});
