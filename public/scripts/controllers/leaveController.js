'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # LeaveController
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('LeaveCtrl', function($scope,$position, $http, $state, $stateParams) {
    console.log('shishir here');

    // $scope.back = function(){
    //     $state.go('dashboard.team');
    // }

    $scope.leaves = [];
    var page = 1;
    $http.post("/role3/leaves?page="+page+"&id="+$stateParams.userId).success(function(response, status){
        $scope.leaves = response.data;
      });

      $scope.addLeave = function(){
          $http.post("/role3/createLeave", $scope.data).success(function(response, status){
              // $scope.customers = response.data;
              page = 1;
              $scope.data = {};
              $http.post("/role3/leaves?page="+page+"&id="+$stateParams.userId).success(function(response, status){
                  $scope.leaves = response.data;
                });
              $('#addLeave').modal('hide');
              // $state.reload();
            });
      };

      // $scope.openCustomerDetail = function(userId, name){
      //     $state.go('dashboard.customer-home', {userId : userId, userName : name});
      // };
  });
