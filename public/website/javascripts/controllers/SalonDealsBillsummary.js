app.controller('SalonDealsBillsummary', ['$rootScope','$scope', '$http','$route','$routeParams','$location','ngProgressFactory','localStorageService','$mdDialog','Service','salonListingSearchBoxBooleanService','$log','$q',
    function($rootScope,$scope, $http,$route, $routeParams, $location,ngProgressFactory,localStorageService,$mdDialog,Service,salonListingSearchBoxBooleanService,$log,$q) {
      $scope.query={};
      $scope.disableButton=true;
      $scope.enableLogin=function() {
        $scope.phoneString=$scope.query.phoneNumber.toString();
        if($scope.phoneString.length<10){
          $scope.disableButton=true;
        }
        else {
          $scope.disableButton=false;
        }
      }


}]);
