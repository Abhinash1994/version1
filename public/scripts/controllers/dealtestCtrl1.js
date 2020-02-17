'use strict';

angular.module('sbAdminApp', ['ui.calendar','ui.bootstrap','daterangepicker','ngSanitize','ngTable'])
.controller('salarySheet', function($scope,$http,$timeout) {
$scope.selected='';
  $http.get("/beuApp/getParlors").success(function(response){
    console.log(response);
    $scope.items=response.data;
  })

  $scope.today = function() {
  $scope.dt = new Date();
};

  $scope.b=[]
  $scope.today();
   $scope.popup1 = {
    opened: false
  };

     $scope.formats = ['MMMM,yy'];
  $scope.format = $scope.formats[0];

    $scope.open1 = function() {
    $scope.popup1.opened = true;
  };

  $scope.$watch('popup1.opened',function(a,b){
      console.log($scope.dt);
      if(b==true)
      {
          $scope.buttonclick();
      }

  })

  $scope.buttonclick=function() {
    console.log($scope.dt);
    $scope.month=$scope.dt.getMonth();
    console.log($scope.month);

    $scope.year = $scope.dt.getFullYear();
    console.log($scope.year);
    console.log($scope.selected);
    $http.get("/beuApp/getParlors").success(function(response){
      console.log(response);
      $scope.items=response.data;
    })
    $http.post("/beuApp/salarySheet",{month:$scope.month,year:$scope.year,parlorId:$scope.selected._id}).success(function(response){
    console.log(response);
    $scope.salaryData=response;
    // console.log($scope.);
    });
  }


});
