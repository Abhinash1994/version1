'use strict';

angular.module('sbAdminApp', ['isteven-multi-select'])
    .controller('addOwnertoSalon', function ($scope, $http) {


       $scope.apply = function(x){
                     $http.post("/role1/addOwnerToSalons", {phoneNumber : x.phoneNumber, parlorId : x.parlorId}).success(function(response, status){
                                // console.log(response)
                        });
                }

    /*    $scope.apply = function (x) {
           
            var reqObj = {
                phoneNumber : x.phoneNumber,
                parlorId : x.parlorId,
            };
            console.log("final obj", reqObj)
        }*/

        $http.post("/role1/parlorList").success(function (response, status) {
            $scope.parlors = response.data;
            console.log($scope.parlors);
        });

        $http.post("/role1/addOwnerToSalons").success(function(response, status){
            $scope.stat = response.data;
            // console.log(response)
        });

    })