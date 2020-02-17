app.controller('freeBeesCtrl', ['$scope', '$http','$route','$routeParams','$location','ngProgressFactory','localStorageService','$mdDialog','salonListingSearchBoxBooleanService',
    function($scope, $http,$route, $routeParams, $location,ngProgressFactory,localStorageService,$mdDialog,salonListingSearchBoxBooleanService) {
        salonListingSearchBoxBooleanService.setFlag(false);

       // //console.log("inside freeBees");
        $scope.urlHomeSliderImages="/api/homeSlider";
        $http.get($scope.urlHomeSliderImages,{cache:false}).then(function(response) {
            ////console.log("this is the homeSlider data");

            $scope.homeSliderImagesContent=response.data.data;
            ////console.log($scope.homeSliderImagesContent);
            $scope.dataArray=$scope.homeSliderImagesContent
        });


    }]);
