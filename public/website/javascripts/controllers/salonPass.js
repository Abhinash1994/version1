'use strict';

/* Controllers */



app.controller('salonPass',
    function($rootScope, $scope, $timeout, $route, $routeParams, $location,$http, $mdDialog, $window, Carousel, localStorageService, $geolocation) {
    
                // $scope.dataArray = [
                //       'http://res.cloudinary.com/dyqcevdpm/image/upload/v1531112228/elegance_v8uqhz.jpg',
                //       'http://res.cloudinary.com/dyqcevdpm/image/upload/v1524563992/fgallv7wsap5q7qe5uma.jpg',
                //       'http://res.cloudinary.com/dyqcevdpm/image/upload/v1531112228/elegance_v8uqhz.jpg',
                //       'http://res.cloudinary.com/dyqcevdpm/image/upload/v1531112228/elegance_v8uqhz.jpg',
                //       'http://res.cloudinary.com/dyqcevdpm/image/upload/v1531112228/elegance_v8uqhz.jpg',
                //       'http://res.cloudinary.com/dyqcevdpm/image/upload/v1531112228/elegance_v8uqhz.jpg',
                //       'http://res.cloudinary.com/dyqcevdpm/image/upload/v1531112228/elegance_v8uqhz.jpg',
                //       'http://res.cloudinary.com/dyqcevdpm/image/upload/v1531112228/elegance_v8uqhz.jpg'
                     
                //     ];
            $scope.currentDate = new Date();
            $scope.twoDays= new Date();
            $scope.threeMonths= new Date();
             $scope.twoDays.setDate($scope.twoDays.getDate() + 2);
             $scope.threeMonths.setDate($scope.threeMonths.getDate() + 2);
             $scope.threeMonths.setMonth($scope.threeMonths.getMonth() + 3)
            $scope.loader=true;
            $scope.determinateValue=30;
            $scope.registerNow=function(){
                
                window.scrollTo(0,0);
                $location.path('/salon-pass-register');
                    $scope.loader=false;
            }
             $scope.salonHoner=function(){
                
                window.scrollTo(0,0);
                $location.path('/salon-honer');
                    $scope.loader=false;
            }
            $scope.goToSubscription=function(){

                window.scrollTo(0,0);
                $location.path('/subscription');
            };
        $scope.parlorListObtained = "";
        $http.get("/api/allParlorWebsite").success(function(data) {
            // //////console.log("Best parlors"); 
            $scope.parlorListObtained = data.data;
          console.log($scope.parlorListObtained)

            $scope.bestParlorsList = data.data;
            ////////console.log("parlor length", $scope.bestParlorsList);
            //$scope.repos = loadAll();
           
            $scope.arr = [];
            for (var i = 0; i < $scope.bestParlorsList.length; i++) {
                $scope.arr.push($scope.bestParlorsList[i]);
            }
            $scope.autoplay = {
             slides: $scope.arr
            
            };
           // //////console.log("autoplay slides", $scope.arr);
        });
       
        var id=window.innerHeight;
        var w=window.innerWidth;
        console.log(w)
           if (id<=635) {
                console.log("this is ok")
           }
           else{
             console.log("this is not ok")
           }
  
        $scope.scrollWin=function() {

            window.scrollBy(0, 580);
            
  
        }
        $scope.pay=function(){
            console.log("payment called");
            $scope.loader=true;
            var options = {
                "key": "rzp_live_c8wcuzLEGSGlJ5",
                "amount": JSON.stringify(354000), // 2000 paise = INR 20
                "name": "Be U Salons",
                "description": 'SalonPass Affiliate',
                "image": "http://res.cloudinary.com/dyqcevdpm/image/upload/v1491484496/beu-logo_srvetg.png",
                "handler": function (response){
                    console.log("api for salon pass successfull registration",response);
                    $http.post("/api/captureSalonPassPayment",{paymentId:response,amount:3540}).success(function(res) {
                        $scope.loader=false;
                        alert("Amount Received. You will get an activation message shortly.");
                        //console.log("path","/subscriber?userId=");
                    });
                },
                "prefill": {

                },
    
                "notes": {
                    "address": "Hello World"
                },
                "theme": {
                    "color": "#ff0000"
                },
                "modal":{
                  "ondismiss":function(){
                    $scope.loader=false;
                  }
                }
            };
    
            var rzp1 = new Razorpay(options);
            rzp1.open();
            $scope.loader=true;
            e.preventDefault();
        }
      $scope.termCondition=function(){

                window.scrollTo(0,0);
                $location.path('/terms-condition');

      }

    });
