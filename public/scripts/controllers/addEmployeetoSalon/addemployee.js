'use strict';

angular.module('sbAdminApp', ['isteven-multi-select'])
    .controller('addEmployeetoSalon', function ($scope, $http) {


             $scope.apply = function(x){
                     $http.post("/role1/changeEmployeeeSalon", {phoneNumber : x.phoneNumber, parlorId : x.parlorId}).success(function(response, status){
                                // console.log(response)
                        });
                
                 }

       
        $http.post("/role1/parlorList").success(function (response, status) {
            $scope.parlors = response.data;
            // console.log($scope.parlors);
        });

        $http.post("/role1/changeEmployeeeSalon").success(function(response, status){
           // console.log("here")
            $scope.stat = response.data;
            // console.log(response)
        });

    })