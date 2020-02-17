app.controller('appfaqCtrl', ['$scope', '$http','$route','$routeParams','$location','ngProgressFactory','localStorageService','$mdDialog','$geolocation','Service','salonListingSearchBoxBooleanService','$rootScope','offerPageSearchLocation',
    function($scope, $http,$route, $routeParams, $location,ngProgressFactory,localStorageService,$mdDialog,$geolocation,Service,salonListingSearchBoxBooleanService,$rootScope,offerPageSearchLocation) {

        salonListingSearchBoxBooleanService.setFlag(false);
        $scope.progressbar = ngProgressFactory.createInstance();
        $scope.progressbar.setColor("#d2232a");
        //$scope.progressbar.start();
      // console.log("inside appfaq");

    }]);
