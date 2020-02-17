'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp',[])
.controller('uptargetEditCtrl', function ($scope, $modalInstance,items) {
  $scope.items=items;

 connsole.log('in modal controller');
  $scope.cancel = function () {
  $modalInstance.dismiss('Close');
  };
});
