app.controller('news', ['$scope','$http','$route','$routeParams','$location','ngProgressFactory','localStorageService','$mdDialog','$geolocation','Service',
    function($scope,$modal, $http,$route, $routeParams, $location,ngProgressFactory,localStorageService,$mdDialog,$geolocation,Service,$window) {
        //console.log("hello");

        $scope.newImage=function (url) {
           // var url = "http://res.cloudinary.com/dyqcevdpm/image/upload/v1499938788/Femina_Brides_Page_94_jvn0uq.jpg";
            window.open(url);
        }

    }]);