'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('CreateParlorCtrl', function($scope, $position, $http, $state) {
    
    
     $scope.data = {}
     $scope.cities=[{cityName:"Delhi",cityId:1},{cityName:"Banglore",cityId:2},{cityName:"Pune",cityId:3}]
     $scope.data.smsCredits = 10000;
     $scope.data.dailyParlorHour = 12;
     $scope.data.smscode = "BEUSLN";
     $scope.data.parlorGender = "1";
     $scope.data.images= [{imageUrl:'',appImageUrl:''}];
 
    $scope.owners = [];
    $http.get('/role1/owners').success(function(response, status){
        $scope.owners = response.data;
    });
        
      
     $http.post("/role1/parlorList").success(function(response, status){
        $scope.parlorss = response.data;
        console.log($scope.parlorss);
    });
   
    $scope.createParlor = function(){
      console.log($scope.data);
      $http.post("/role1/createParlor", $scope.data).success(function(response, status){
          $state.go('dashboard.parlors');
          $scope.parlors = response.data;
          console.log($scope.parlors);
        });
    };

  });
