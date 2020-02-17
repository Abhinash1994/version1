app.controller('SalonDetailCtrl', ['$rootScope','$scope', '$http','$route','$routeParams','$location','$mdDialog','$anchorScroll','ngProgressFactory','localStorageService', '$mdpDatePicker', '$mdpTimePicker','$timeout','Service','$document','$window','salonListingSearchBoxBooleanService','mySharedService',
function($rootScope,$scope, $http,$route, $routeParams, $location ,$mdDialog,$anchorScroll,ngProgressFactory,localStorageService, $mdpDatePicker, $mdpTimePicker,$timeout,Service,$document,$window,salonListingSearchBoxBooleanService,mySharedService) {
    salonListingSearchBoxBooleanService.setFlag(false);
   // //console.log("this is service test");
    $scope.progressbar = ngProgressFactory.createInstance();
    $scope.progressbar.setColor("#d2232a");
    $scope.progressbar.start();
    var decider="";
    $scope.cart=[];
    $scope.appt={};
    $scope.cartIds=[];
    var ids=[];
    $scope.one=true;
    $scope.two=false;
    $scope.three=false;
    $scope.allCategories=[];
    var serv2={};
    $scope.gend="F";
    $scope.allFrequencies=[];
    $scope.allCombos=[];
    $scope.mySection=true;
    $scope.checkoutErrorFlagBooking=false;
    $scope.checkoutErrorFlagCart=false;
    $scope.incorrectTimeOrDateFlag=false;
    var count=0;
    var checker=[1,2,3,4,5];
    $scope.bookingTimeButtonFlag=true;
    $scope.showFloatingCart=false;
    $scope.showFloatingCartXs=false;
    $scope.servicesDropdownMenuFlag=false;
    $scope.depts=[];
    $scope.dealFilterServiceObject=[];
    $scope.weekdayOrWeekend="123";

    /*$scope.dummyStoreMorningTime="1000";
    $scope.dummyStoreNightTime="2000";*/

    /*   $http.get("/api/allParlor").success(function(data){
     $scope.parlorListObtained=data.data;
     $scope.currentPathRequired=$location.path();
     $scope.urlArray=$scope.currentPathRequired.split('/');
     //console.log("this is the araay of string of url");
     //console.log($scope.urlArray)
     });*/
    $scope.currentPathRequired=$location.path();
    $scope.urlArray=$scope.currentPathRequired.split('/');
    //console.log("url",$scope.urlArray)
    ////console.log("this is the araay of string of url");
    ////console.log($scope.urlArray)
    var parlorDetailsOpeningLink=$scope.urlArray[$scope.urlArray.length-1];


    $scope.url="/api/parlorHomeForWebsite?parlorLink="+parlorDetailsOpeningLink;
    $scope.dealUrl="/api/deals?parlorLink="+parlorDetailsOpeningLink;

    $http.get($scope.url).then(function(response) {
        //console.log('hi',response)
        $scope.dummyStoreMorningTime=response.data.openingTime.replace(/:/g,'');
        $scope.dummyStoreNightTime=response.data.closingTime.replace(/:/g,'');
        $scope.progressbar.complete();
        $scope.parlor=response.data;
        $scope.palorImg=response.data.images[0]

        console.log( $scope.parlor)

        
        $scope.pageTitle='Best Salon Near Me | Hair And Beauty Salon In Delhi | '+ $scope.parlor.name+ ' Salon';
        //$scope.pageDescription=$scope.parlor.name + 'Salon in '+$scope.parlor.address2  +' find salon near you listed under Ladies and Men's Beauty Parlours offering services like Hair Straightening, Hair Rebonding, Bridal package, Manicure, Makeup and much more. Visit - beusalon.com for Address, Contact Number, Reviews & Ratings, Photos, Maps of'+ $scope.parlor.name+  ' ,'+ $scope.parlor.address2 
        $scope.pageDescription="des"
        $scope.headingParlorName=$scope.parlor.name;
        $scope.headingParlorAddress1=$scope.parlor.address1;
        $scope.headingParlorAddress2=$scope.parlor.address2;
        $scope.headingParlorRating=$scope.parlor.rating;
        $scope.headingParlorImage="";
        if($scope.headingParlorRating<=1){
            $scope.ratingText="Blah!";
            $scope.headingParlorImage="Blah1";
        }else
        if($scope.headingParlorRating<=2){
            $scope.ratingText="Not Bad";
            $scope.headingParlorImage="Blah1 red";
        }else
        if($scope.headingParlorRating<=3){
            $scope.ratingText="Decent";
            $scope.headingParlorImage="Decent3";
        }else
        if($scope.headingParlorRating<=4){
            $scope.ratingText="Very Good";
            $scope.headingParlorImage="Decent3 red";
        }else
        if(4<=$scope.headingParlorRating<=5){
            $scope.ratingText="Awesome";
            $scope.headingParlorImage="Decent3 red";
        }
        $scope.quantity=[];

        $scope.dealsDeparment={
            "categories":[],
            "name":"Deals",
            "openFlag":false
        }
       
    });




    


}])
