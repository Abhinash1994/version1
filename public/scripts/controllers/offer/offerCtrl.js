'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('OffersCtrl', ['$scope','$position', '$http', '$state', 'NgTableParams', function($scope,$position, $http, $state, NgTableParams) {

      $scope.offers = [];
      var page = 1;
      $http.get("/role2/offers").success(function(response, status){
        $scope.offers = response.data;
        // console.log("thsi is a offer pages" ,response);
          
      });


  }]);
