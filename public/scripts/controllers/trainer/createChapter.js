'use strict';

angular.module('sbAdminApp', ['ui.calendar','ui.bootstrap','daterangepicker'])
.controller('createChapter', function($scope,$http,$timeout) {

    $http.get("http://10.0.3.71:1337/beuApp/getUnits").success(function(response) {

        // console.log(response);
        $scope.units=response.data;
    });

    $scope.submitButton=function() {
      if($scope.units.selected==undefined || $scope.units.selected==""){
        $scope.message="Please Select Unit."
        return false;
      }
      else {
        $http.post("http://10.0.3.71:1337/beuApp/createTrainingChapter",{unitId:$scope.units.selected.id,chapterName:$scope.chapterName,chapterDescription:$scope.description}).success(function(response) {
            // console.log(response);
            $scope.showAlert=true;
            $scope.chapterName="";
            $scope.description="";
            $scope.units.selected="";
            $scope.message="Chapter Has Been successfully Added"
            $timeout(function() {
                   $scope.message = "";
                }, 5000);
        });

      }

    }

});
