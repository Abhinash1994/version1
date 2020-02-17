'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
app.controller('membershipDetailCtrl',function($scope,$log,$timeout, $http, $state, $stateParams, $window) {

    $scope.membershipId = $stateParams.membershipId;
    $scope.name = $stateParams.name;

    $scope.customers = [];
    
    $http.get("/role2/membershipCustomer?membershipId="+$scope.membershipId).success(function(response, status){
        $scope.customers = response.data;
        console.log("Data",response.data);
    });

    console.log("customers",$scope.customers);
    $scope.back = function(){
        $window.history.back();
    }

    $scope.openCustomerDetail = function(userId, name){
        $state.go('dashboard.customer-home', {userId : userId, userName : name});
    };

});
