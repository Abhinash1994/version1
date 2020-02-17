'use strict'

angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','isteven-multi-select','daterangepicker','ngSanitize', 'ngCsv'])
    .controller('addSlabCtrl', function ($scope, $compile, $http, $timeout, $window, $log,NgTableParams,Excel,$rootScope) {
        // console.log('inside add slab controller ');

        /*=======================Variables start=========================*/
        $scope.rangeObject={'range1':0,'range2':'','discount':''};
        $scope.rangeArray=[];
        $scope.slabObject={'ranges':$scope.rangeArray};  
        /*=======================Variables stop=========================*/

        /*=======================Functions start=========================*/
        function refreshSlabs(){
            $http.get("/role1/getDealSlabs").success(function(response, status){
                // console.log(response);
                $scope.apiSlab=response.data;
            });
        }
        refreshSlabs();
        $scope.addRange=function(){
            $scope.rangeArray.push(angular.copy($scope.rangeObject));
            var lastRange2=angular.copy($scope.rangeObject.range2);
            $scope.rangeObject={'range1':0,'range2':'','discount':''};
            $scope.rangeObject.range1=lastRange2;
        }
        $scope.createSlab=function(){
            $scope.slabObject.ranges=$scope.rangeArray;     //final object to be sent having ranges
            // console.log(angular.copy($scope.slabObject))
            $http.post("/role1/createDealSlabs",angular.copy($scope.slabObject)).success(function(response, status){
                // console.log(response);
            });                                             // this is the api for adding the slab
            refreshSlabs();                                 // api called for again refreshing the page
            $scope.rangeObject={'range1':0,'range2':'','discount':''};
            $scope.rangeArray=[];
            // console.log($scope.slabObject);
            $scope.apiSlab.push($scope.slabObject);         //here api will be called
            $scope.slabObject={'ranges':$scope.rangeArray};
            // console.log($scope.slabObject)
        }
        /*=======================Functions stop=========================*/
    });