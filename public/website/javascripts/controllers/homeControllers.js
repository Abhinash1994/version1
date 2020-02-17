'use strict';

/* Controllers */



app.controller('HomeCtrl',
    function($rootScope, $scope, $timeout, $route, $routeParams, $location, $q, $log, $auth, $http, $mdDialog, $window, Carousel, localStorageService, $geolocation, Service, salonListingSearchBoxBooleanService, $mdSidenav) {
    
    
     ga('send', {
    hitType: 'event',
    eventCategory: 'Customers on Home Page',
    eventAction: 'Home Page Click',
    eventLabel: 'BeUSalons'
}); 
  $scope.showHelpText=true;
  $scope.showClose=false;
  $scope.showSlideUpChat=true;
  $scope.queryName="";
  $scope.queryEmail="";
  $scope.queryPhoneNumber="";
  $scope.queryComment="";
  gtag('event', 'page_view', {
    'send_to': 'AW-870359358',
    'ecomm_pagetype': 'Home Page',
    'ecomm_prodid': 'HomePage',
    'ecomm_totalvalue': 1
  });

  $scope.chatOpen=function() {
    $scope.showChatBox=true;
    $scope.showClose=true;
    $scope.showHelpText=false;
    $scope.showSlideUpChat=false;
    $scope.showPulseChat=false;
    //////console.log("chatOpen");
  }
  $scope.chatClose=function() {
    $scope.x=1;
    $scope.showHelpText=true;
    $scope.showChatBox=false;
    $scope.showClose=false;
    $scope.showPulseChat=true;

    //////console.log("chatClose");

}


  $timeout(function () {
       $scope.x = 3;
     }, 12000);
  $scope.initChatDiv=function() {

    $timeout(function () {
         $scope.y = 3;
         $scope.showPulseChat=true;
             //////console.log("ejklelknkl");
       }, 14000);
  }
  $scope.funCheck=function(index,id) {
      //////console.log("id",id);
      //////console.log("working",index);
          window.scrollTo(0, 0);
        $location.path('/subscription');
      if(index==1 || index==2 && id=='jkImage'){
        window.scrollTo(0, 0);
        $location.path('/subscription');
      }
      if(index==1 || index==2 && id=='jkImageMobile'){
        window.scrollTo(0, 0);
        $location.path('/subscription');
      }
  }
        // $scope.bannerCarouselWidth=function () {
        //   angular.element($window).bind('resize', function() {
        //     $scope.$apply(function() {
        //           if ($window.innerWidth>=1024) {
        //             $scope.maxWidth="1300px";
        //             // $scope.slidesToShow=3;
        //             // //////console.log($scope.slidesToShow);
        //           }
        //           else if ($window.innerWidth==768) {
        //             $scope.maxWidth="2000px";
        //               // $scope.slidesToShow=2;
        //               // //////console.log($scope.slidesToShow);
        //
        //           }
        //           else {
        //             $scope.maxWidth="2000px";
        //               // $scope.slidesToShow=1;
        //               // //////console.log($scope.slidesToShow);
        //
        //           }
        //     });
        // });
        // }



        // $scope.toggleLeft = buildToggler('left');
        //     $scope.toggleRight = buildToggler('right');
        //     function buildToggler(componentId) {
        //       return function() {
        //         $mdSidenav(componentId).toggle();
        //       };
        //     }
        $scope.websiteQuerySubmit=function() {
            //value 0 is for home page
            ga('send', 'event', "queryFormWebsitePage","click","Send",1);
            fbq('track', 'CompleteRegistration', { value: 0,currency: 'INR'});
            if($scope.queryName=="" || $scope.queryPhoneNumber=="")// $scope.cb==undefined || $scope.cb==false
            {
              //////console.log("please input all fields");
              $scope.message="Please Input All Fields*.";
              return false;
            }else{

                  var phoneNumberCheck = /^\d{10}$/;
                  var isValidNumber = phoneNumberCheck.test($scope.queryPhoneNumber);

                  if(!isValidNumber){
                    //////console.log("Please Enter a Valid Number.");
                    $scope.message="Please Enter a Valid Phone Number*.";
                    return false;
                  }

                  // var emailCheck = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                  //
                  // var isValidEmail = emailCheck.test($scope.queryEmail);
                  //
                  // if (!isValidEmail) {
                  //   //////console.log("Please Enter a valid email.");
                  //   $scope.message="Please Enter a Valid Email Address*.";
                  //    return false;
                  // }

                  $http.post("/beuApp/websiteQuery",{name:$scope.queryName,phoneNumber:$scope.queryPhoneNumber,email:$scope.queryEmail,queryText:$scope.queryComment}).success(function(response) {
                      //////console.log("Details Submitted");
                      $scope.queryName="";
                      $scope.queryEmail="";
                      $scope.queryPhoneNumber="";
                      $scope.queryComment="";
                      $scope.message="Thank You for the details. We would get back to you shortly.";
                        $timeout(function () {
                          $scope.message="";
                          //////console.log("ajsdflahds");
                        }, 2000);
                  });

            }
        }

        $scope.toggleLeft = buildToggler('left');
        $scope.toggleRight = buildToggler('right');

        function buildToggler(componentId) {
            return function() {
                $mdSidenav(componentId).toggle();
            };
        }

        $scope.goToAboutUs = function() {
            window.scrollTo(0, 0);
            $location.path('/aboutUs');
        };


        $scope.goToContactUs = function() {
            window.scrollTo(0, 0);
            $location.path('/contactUs');
        };

        $scope.goToDisclaimer = function() {
            window.scrollTo(0, 0);
            $location.path('/disclaimer');
        };

        $scope.goToPrivacyPolicy = function() {
            window.scrollTo(0, 0);
            $location.path('/privacyPolicy');
        };

        $scope.goToReturnRefund = function() {
            window.scrollTo(0, 0);
            $location.path('/returnRefund');
        };

        $scope.goToTermsCondiions = function() {
            window.scrollTo(0, 0);
            $location.path('/termsConditions');
        };
        $scope.goToFaq = function() {
            window.scrollTo(0, 0);
            $location.path('/faq');
        };
      $scope.goToFaq = function() {
            window.scrollTo(0, 0);
            $location.path('/faq');
        };
        $scope.goToNews = function() {

            window.scrollTo(0, 0);
            $location.path('/news');
        };
        ga('set', 'page', '/HomePage');
        ga('send', 'pageview');
        //$scope.setNumber = Service.setNumber(0);
        var testStr = "Domino's pizza, ok's";
        testStr = testStr.replace(/ /g, '-')
        testStr = testStr.replace(/,|'/g, '')
            // alert(testStr)
            /* localStorageService.set("lullFlag",false);*/
        salonListingSearchBoxBooleanService.setFlag(false);
        localStorageService.set("requiredLat", '')
        localStorageService.set("requiredLong", '')
        localStorageService.set('serviceCodeHomeSearch', undefined);


        /*---------------------------Carousel Variables and Functions---------------Start-------------------------*/

        $scope.urlHomeSliderImages = "/api/homeSlider";
        $http.get($scope.urlHomeSliderImages, { cache: false }).then(function(response) {
            // //////console.log("this is the homeSlider data");

            $scope.homeSliderImagesContent = response.data.data;
            // //////console.log($scope.homeSliderImagesContent);
            $scope.dataArray = $scope.homeSliderImagesContent
        });

        /*$scope.dataArray = [
         {
         src: 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1484663665/1920x800_header_deals2_vb1ocy.jpg'
         },
         {
         src: 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1484663668/1920x800_header_deals_jxrbrj.jpg'
         },

         ];*/
        $scope.openCarouselImageDeal = function() {
            // //////console.log("checked");
            localStorageService.set('offerPageSearchedLocation', undefined)
            $location.path('/offerPage/deals');
        }

        /*---------------------------Carousel Variables and Functions---------------Stop-------------------------*/
        /*--------------------------popular salobns images array ---------Start----------------------*/

        $scope.popularSalonsImagesArray = [{
                src: 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1484301334/Mi%20Gurgaon.jpg'
            },
            {
                src: 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1484301471/aalenes%20Gurgaon%204.jpg'
            },
            {
                src: '/website/images/snips.jpg'
            },
            {
                src: '/website/images/snips2.jpg'
            },
            {
                src: '/website/images/mi.jpg'
            },
            {
                src: '/website/images/mi.jpg'
            }
        ]

        $scope.myPositionName = "";
        $scope.userSearchedServ = "";
        $scope.enterFlag = false;
        $scope.bestParlorsList = '';
        $scope.getPlaceNameFromLatLong = function(lat, long) {

            $http.get('/api/search?lat=' + lat + '&lng=' + long).success(function(data) {
                ////////console.log("this is place name");
                //////console.log(data);

         $scope.myPositionName =data.data[0].address_components[2].long_name+ ' '+data.data[0].address_components[4].long_name;
                // $scope.selectedItem=$scope.myPositionName
                //////console.log($scope.myPositionName)
            });
        }


        $geolocation.getCurrentPosition({
            timeout: 60000
        }).then(function successCallback(position) {
            //////console.log("heljkljdksj")
            $scope.myPosition = position.coords;
            localStorageService.set("userDetectedLatitude", $scope.myPosition.latitude);
            localStorageService.set("userDetectedLongitude", $scope.myPosition.longitude);
            $scope.getPlaceNameFromLatLong($scope.myPosition.latitude, $scope.myPosition.longitude);
 }, function errorCallback(position) {

            $scope.myPositionName = "Search service, outlet or location";
            localStorageService.set("userDetectedLatitude",28.6643);
            localStorageService.set("userDetectedLongitude",77.2167);
             $scope.getPlaceNameFromLatLong(28.6643,77.2167);
        });

        /* $scope.myPosition = $geolocation.position;*/

        $scope.user = {};
        $scope.user.service = "all";
        $scope.go = function(path) {
            $location.path(path);
        };
        $scope.services = [{ "key": "all", "value": "All Services" }, { "key": "hair", "value": "Hair" }, { "key": "beauty", "value": "Beauty" }, { "key": "makeup", "value": "Make Up" }, { "key": "nail", "value": "Nail" }, { "key": "spa", "value": "Spa" }];
        ////////console.log($scope.user.location);
        $scope.offerPath1 = "/images/1.jpg";
        $scope.offerPath2 = "/images/2.jpg";
        $scope.offerPath3 = "/images/3.jpg";
        $scope.offerPath4 = "/images/4.jpg";
        $scope.offerPath5 = "/images/5.jpg";
        $scope.offerPath6 = "/images/6.jpg";
        $scope.whyus = [{ "title": "24 x 7 Appointments", "imagePath": "/website/images/logo1.png" }, { "title": "Trained Professionals", "imagePath": "/website/images/logo12.png" }, { "title": "Affordable Prices", "imagePath": "/website/images/logo3.png" }, { "title": "Near You", "imagePath": "/website/images/logo4.png" }, { "title": "Near You", "imagePath": "/website/images/logo5.png" }];
        $scope.beforeAfter = [
            { "imagePath": "http://res.cloudinary.com/dyqcevdpm/image/upload/v1484662644/Before%20and%20after/460_310a.jpg" },
            { "imagePath": "http://res.cloudinary.com/dyqcevdpm/image/upload/v1485771385/b_650_650_with_lines_afgkih.jpg" },
            { "imagePath": "http://res.cloudinary.com/dyqcevdpm/image/upload/v1484662643/Before%20and%20after/460_310b.jpg" },
            { "imagePath": "http://res.cloudinary.com/dyqcevdpm/image/upload/v1485845727/A_2_460x310_cuxhfn.jpg" },
            { "imagePath": "http://res.cloudinary.com/dyqcevdpm/image/upload/v1485845727/A_2_460x3102_ijmutp.jpg" },


        ];
        var autocompleteService = new google.maps.places.AutocompleteService();
        $scope.simulateQuery = false;
        $scope.isDisabled = false;

        $scope.selectedItemChange = selectedItemChange;
        $scope.searchTextChange = searchTextChange;
        $scope.panes = [true, false, false];
        $scope.search = function(input, cb) {
            if (!input) {
                return;
            }
            getResults(input).then(function(places) {
                //////console.log(places);
                return cb(places);
            });
        };

    function querySearch(query) {
            var fis = [];
            if (query != null) {
                $scope.searchText1 = function(query, lists) {
                    $scope.results123 = []
                    $scope.queryMatchFlag = false;
                    if (query == '') {
                        $scope.results123 = [];

                    } else {
                        //////console.log(lists);
                        $scope.results123 = [];
                        query = query.toLowerCase();
                        angular.forEach(lists, function(item) {
                            if (item.name.toLowerCase().search(query) >= 0) {
                                /*   if( item.name==query){
                                 $scope.results123=[];
                                 $scope.results123.push(item)
                                 }
                                 else{
                                 $scope.results123.push(item);
                                 $scope.queryMatchFlag=true;
                                 }*/
                                $scope.results123.push(item)
                            }
                        });
                    }
                        //////console.log($scope.results123)

                    return $scope.results123;
                };
                ////////console.log($scope.userSearchedServ);

                var serviceResults = $scope.searchText1(query, $scope.userSearchedServ);
                //query ? $scope.userSearchedServ.filter( createFilterFor(query) ) : $scope.userSearchedServ,deferred;
                /*  for(var i=0;i<3;i++){
                 /!*var item3 = {name: serviceResults[i].name, type: "Service"};
                 fis.push(item3)*!/
                 if(serviceResults[i].name.toLowerCase()==query){
                 var item3 = {name: serviceResults[i].name, type: "Service"};
                 //fis.push(item3);
                 fis=[];
                 fis.push(item3)
                 }else{
                 var item3 = {name: serviceResults[i].name, type: "Service"};
                 fis.push(item3)
                 }

                 }*/
                serviceResults.forEach(function(element) {
                    var item3 = { name: element.name, type: "Service", serviceCode: element.serviceCode ,datas:element.data};
                    fis.push(item3);
                    //`//////console.log(element);
                });
            }
            var results = query ? $scope.repos.filter(createFilterFor(query)) : $scope.repos,
                deferred;
            results.forEach(function(element) {
                var item1 = { name: element.serviceName, type: "Service", parlorId: element.parlorId, link: element.link };
                fis.push(item1);
                //////console.log(element);
            });
            //////console.log(results);
            deferred = $q.defer();
            $scope.search(query, function(places) {
                ////////console.log(places);
                if (places != null) {

                    places.forEach(function(element) {
                        var item2 = { name: element.description, type: "Location", place_id: element.place_id };
                        fis.push(item2);
                        //////console.log(item2);
                    });
                }
                ////////console.log(fis);
                if ($scope.enterFlag) {
                    //alert("here")
                    selectedItemChange(fis[0])
                }
                deferred.resolve(fis);
            });
            return deferred.promise;

        }

        function searchTextChange(text) {
            $log.info('Text changed to ' + text);
            /*--------------------------------place to store the localStorage for parlorDetais----------------Start-------------*/
            //////console.log("this is the place to use the localStorage from search")
            //////console.log(text);

            /*--------------------------------place to store the localStorage for parlorDetais-------------Stop------------------*/
        }

        $scope.enterHomeSearchBox = function(text) {
            //  alert($scope.enterFlag)
            $scope.enterFlag = true;
            querySearch(text);
        }

        function selectedItemChange(item) {
                //////console.log(item)
                if(item.datas)
                {
                    var param1=item.datas.departmentName;
                        if(item.datas.genders.length>1)
                        {
                             $location.path("/salon-deals/"+param1+'/F/'+item.serviceCode+'/'+item.datas.dealId);
                        }
                        else{
                           $location.path("/salon-deals/"+param1+'/'+item.datas.genders[0]+'/'+item.serviceCode+'/'+item.datas.dealId);
                        }
                  }
                else{
                                //////console.log(item)
                    $scope.placeIdUrl = '/api/placeDetail?placeId=' + item.place_id
                        $http.get($scope.placeIdUrl).success(function(data){

                            localStorageService.set("newSalonDealLat",data.data.geometry.location.lat);
                             localStorageService.set("newSalonDealLong",data.data.geometry.location.lng)
                             $location.path("/salon-deals");
                        })
                }
//            if (item.type == "Location") {
//                //alert("Location");
//                var str = item.name;
//                str = str.replace(/ /g, '-')
//                str = str.replace(/,/g, '')
//                    /* str = str.replace(' ', '-');*/
//
//                ////////console.log("item",item);
//                localStorageService.set("userQuery", item.name);
//                // //////console.log("this is users final query",localStorageService.get("userQuery"));
//                // //////console.log("You selected a location"+item.place_id);
//                $scope.placeIdUrl = '/api/placeDetail?placeId=' + item.place_id
//
//                $http.get($scope.placeIdUrl).success(function(data) {
//
//                    // alert("in location jsonp");
//                    var result = data;
//                    ////////console.log(result);
//                    localStorageService.set('requiredLat', result.data.geometry.location.lat);
//                    localStorageService.set('requiredLong', result.data.geometry.location.lng);
//                    ////////console.log("localstorage lat and long--------------"+localStorageService.get('requiredLat'),localStorageService.get('requiredLong'));
//                    ////////console.log("localstorage lat and long--------------"+localStorageService.get('requiredLat'),localStorageService.get('requiredLong'));
//                    ////////console.log("this is users final query",localStorageService.get("userQuery"));
//                    /*  $location.path('/salon-listing');*/
//
//                    $location.path("/salon-listing/salons-in-" + str);
//                }).
//                error(function(data) {
//                    // alert("ERROR: Could not get data.");
//                });
//
//            } else if (item.type == "Outlet") {
//                //alert("Outlet");
//                //localStorageService.set('requiredParlorId',"");
//                localStorageService.set("userQuery", item.name);
//                //////console.log("this is users final query", localStorageService.get("userQuery"));
//                //////console.log(item);
//                //localStorageService.set('requiredParlorId',item.parlorId);
//                ////////console.log(localStorageService.get('requiredParlorId'));
//                ////////console.log("this is users final query",localStorageService.get("userQuery"));
//                var str = item.name;
//                str = str.replace(/ /g, '-');
//                $location.path('/parlor-detail/' + item.link);
//            } else if (item.type == "Service") {
//                //alert("Service");
//                localStorageService.set("userQuery", item.name);
//                ////////console.log("this is users final query",localStorageService.get("userQuery"));
//                ////////console.log("You selected a service");
//                var str = item.name;
//                str = str.replace(/ /g, '-');
//                str = str.replace("/", '-');
//
//
//                if (localStorageService.get("userDetectedLatitude") == undefined) {
//                    localStorageService.set('requiredLat', '');
//                    localStorageService.set('requiredLat', '');
//
//                    $http.get('/api/placeDetail?placeId=ChIJ3T8F3fDhDDkRnxNgWBpc2Zc').success(function(data) {
//                        var result = data;
//                        //////console.log(result.result.geometry.location);
//
//                        localStorageService.set('requiredLat', result.result.geometry.location.lat);
//                        localStorageService.set('requiredLong', result.result.geometry.location.lng);
//                        ////////console.log("localstorage lat and long--------------"+localStorageService.get('requiredLat'),localStorageService.get('requiredLong'));
//                        // //////console.log("this is users final query",localStorageService.get("userQuery"));
//                        /*$location.path('/salon-listing');*/
//                        //localStorageService.set('serviceCodeHomeSearch',item.serviceCode);
//                        $location.path("/salon-listing/salons-offering-" + str + "-service");
//                    });
//
//                } else {
//                    localStorageService.set('requiredLat', $scope.myPosition.latitude);
//                    localStorageService.set('requiredLong', $scope.myPosition.longitude);
//                    ////////console.log($scope.myPosition.latitude,$scope.myPosition.longitude);
//                    /*  $location.path('/salon-listing');*/
//                    localStorageService.set('serviceCodeHomeSearch', item.serviceCode);
//                    $location.path("/salon-listing/salons-offering-" + str + "-service");
//                }
//            }
            // $location.path("/salon-deals");
        }

        $scope.searchSalonsDirect = function() {
            localStorageService.set('requiredLat', '');
            localStorageService.set('requiredLong', '');
            $location.path('/salon-deals');

//            ga('send', {
//                hitType: 'event',
//                eventCategory: 'Search Tab Click',
//                eventAction: 'Click',
//                eventLabel: 'Salon-Listing'
//            });
        }

        /**
         * Build `components` list of key/value pairs
         *
         * http://beusalon.com/api/allParlor
         */
        $scope.parlorListObtained = "";
        $http.get("/api/allParlorWebsite").success(function(data) {
            // //////console.log("Best parlors");
            $scope.parlorListObtained = data.data;
          /////console.log($scope.parlorListObtained)

            $scope.bestParlorsList = data.data;
            ////////console.log("parlor length", $scope.bestParlorsList);
            $scope.repos = loadAll();
            $scope.querySearch = querySearch;
            $scope.arr = [];
            for (var i = 0; i < $scope.bestParlorsList.length; i++) {
                $scope.arr.push($scope.bestParlorsList[i]);
            }
            $scope.autoplay = {
             slides: $scope.arr
            
            };
           // //////console.log("autoplay slides", $scope.arr);
        });

        function loadAll() {

            var repos = $scope.parlorListObtained
            return repos.map(function(repo) {
                repo.value = repo.name.toLowerCase();
                return repo;
            });
        }

        $http.get("/api/getAllDealsForWebsite").success(function(data) {
          //////console.log(data)
            $scope.userSearchedServ = data.data;
          //  $scope.userSearchedServ = [];
            // $scope.userSearchedServ1.forEach(function(cat) {
            //     cat.services.forEach(function(serv) {
            //         $scope.userSearchedServ.push(serv);
            //     });
            // });
            //////console.log($scope.userSearchedServ)

            $scope.reposServices = loadAll1();
            $scope.userSearchedServ=$scope.services;
            //////console.log($scope.userSearchedServ)
            $scope.querySearch = querySearch;
        });

        function loadAll1() {
            $scope.services=[];
            var repos = $scope.userSearchedServ;
            repos.forEach(function(datas){
                  datas.services.forEach(function(datas01){
                          var a=datas01;
                          a.data=datas;
                          a.name=a.serviceName;
                          delete a.serviceName;
                          delete a.data.services;
                          $scope.services.push(a);

                  })

            })

        }

        /**
         * Create filter function for a query string
         */
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);

            return function filterFn(item) {
                return (item.value.indexOf(lowercaseQuery) === 0);
            };
        };
        var southWest = new google.maps.LatLng(28.387202, 76.850534);
        var northEast = new google.maps.LatLng(28.748991, 77.550923);
        var delhiNCRBounds = new google.maps.LatLngBounds(southWest, northEast);
        var getResults = function(address) {

            var deferred = $q.defer();
            var request = {
                bounds: delhiNCRBounds,
                input: address,
                types: ['geocode'],
                componentRestrictions: { country: 'in' },
            };
            autocompleteService.getPlacePredictions(request, function(data) {
                deferred.resolve(data);
            });
            return deferred.promise;
        };


        $scope.openOfferPage = function() {
            $location.path('/offerPage/');
        }


        $scope.urlBlog = "/api/blog";

        $scope.urlBlog = "/api/blog";

        $http.get($scope.urlBlog, { cache: false }).then(function(response) {
            ////////console.log("this is the blog data");

            $scope.blogContent = response.data.data;
            ////////console.log($scope.blogContent);
        });

        $scope.openManoj = function() {
            $location.path('/manoj')
        }
        $scope.openBestParlor = function(bestParlors) {
            //////console.log("I am running")
            //////console.log(bestParlors);
            localStorageService.set('requiredParlorId', bestParlors.parlorId);
            //localStorageService.set('cartParlorLink',bestParlors.link);
            ////////console.log(localStorageService.get('requiredParlorId'));
            $location.path('/parlor-detail/' + bestParlors.link);
            ga('send', {
                hitType: 'event',
                eventCategory: 'Salon Partners',
                eventAction: 'Click',
                eventLabel: 'Partners page'
            });
        }

        $scope.urlDealsNearYou = "/api/dealsNearYou";
        $http.get($scope.urlDealsNearYou, { cache: false }).then(function(response) {
            ////////console.log("this is the urlDealsNearYou data");

            $scope.dealsNearYouContent = response.data.data;
            //////console.log($scope.dealsNearYouContent);
        });

        $scope.urlTrends = "/api/blogs";
        $http.get($scope.urlTrends, { cache: false }).then(function(response) {
            // //////console.log("this is the urlTrends data");

            $scope.trendsContent = response.data.data;
            ////////console.log($scope.trendsContent);
        });
        //dialog
        $scope.showCustom = function(event) {

            $mdDialog.show({
                clickOutsideToClose: true,
                scope: $scope,
                preserveScope: true,
                templateUrl: '/website/views/mainPageDialog.html',
                controller: function DialogController($scope, $mdDialog) {
                    $scope.closeDialog = function() {
                        $mdDialog.hide();
                    }
                }
            });

        };
        $scope.closeDialog = function() {
            $mdDialog.hide();
        };
     $scope.buyNowClicked=function(dealName,price){

         window.scrollTo(0, 0);
            $location.path('/salon-deals');
// =======
//             window.scrollTo(0, 0);
//             $location.path('/salonDeals');
// >>>>>>> a066702596f98762f5e55609e6715f9d10e1e00d
    }

    });
