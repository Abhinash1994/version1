'use strict'

angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','isteven-multi-select','daterangepicker','ngSanitize', 'ngCsv'])
    .controller('trainingSessionRepor', function ($scope, $compile, $http, $timeout, $window, $log,NgTableParams,Excel,$rootScope) {
        // console.log('inside trainingSessionRepor controller ');

        $scope.dateRangeSelected = {startDate: moment().startOf('month'), endDate: moment()};
        $scope.parlors='';
        $scope.selectedParlor=[];
        $scope.parlorsToBeShown=[];

        $scope.onlinePaymentParlors='';
        $http.post("/role1/allParlors").success(function(response, status){
            // console.log("parlors list obtained");
            // console.log(response.data);
            $scope.parlors=response.data;
            //$scope.parlors = response.data;
        });
        
    
        // console.log($scope.dateRangeSelected)

        $scope.submitParlor=function(){
            // console.log($scope.selectedParlor)
            $scope.newPalor=[]
            $scope.selectedParlor.forEach(function(e){
                $scope.newPalor.push(e.parlorId)
                // console.log($scope.newPalor)
            })
            // console.log($scope.newPalor)
            // console.log($scope.dateRangeSelected.startDate._d);
            // console.log($scope.dateRangeSelected.endDate._d);
            $http.post("/role1/getTrainingData",{'parlorIds':$scope.newPalor,'startDate':$scope.dateRangeSelected.startDate._d,'endDate':$scope.dateRangeSelected.endDate._d}).success(function(response, status){
               
                // console.log(response);
                $scope.traingData=response.data;
        
             },function(err){
                // console.log(err);
             })
        }
    
     
      
    });