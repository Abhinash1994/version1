app.controller('salonDeals',['$rootScope','$scope', '$http','$route','$routeParams','$location','ngProgressFactory','localStorageService','$mdDialog','Service','salonListingSearchBoxBooleanService','$log','$q','$timeout',
  function($rootScope,$scope, $http,$route, $routeParams, $location,ngProgressFactory,localStorageService,$mdDialog,Service,salonListingSearchBoxBooleanService,$log,$q,$timeout) {
    console.log("controller");

    $scope.dialog = {};
    // mobile view chat button
    $scope.showProgressBar=true;
    $scope.showHelpText=true;
    $scope.showClose=false;
    $scope.showSlideUpChat=true;
    $scope.chatOpen=function() {
      $scope.showChatBox=true;
      $scope.showClose=true;
      $scope.showHelpText=false;
      $scope.showSlideUpChat=false;
      $scope.showPulseChat=false;
      console.log("chatOpen");
    }
    $scope.chatClose=function() {
      $scope.x=1;
      $scope.showHelpText=true;
      $scope.showChatBox=false;
      $scope.showClose=false;
      $scope.showPulseChat=true;

      console.log("chatClose");

  }


    $timeout(function () {
         $scope.x = 3;
       }, 12000);
    $scope.initChatDiv=function() {

      $timeout(function () {
           $scope.y = 3;
           $scope.showPulseChat=true;
         }, 14000);
    }
    // mobile view chat button

    console.log(fbq);
    $scope.searchTextChange   = searchTextChange;
    $scope.indexValue=null;
    $scope.activeButton=null;
    $scope.moreFunc=function(index) {
          console.log(index);
          $scope.indexValue=index;
          // $scope.showMore=true;
        }
    $scope.lessFunc=function(index) {
          $scope.indexValue=null;
        }
    // $scope.heartActive=function(index){
    //       $scope.activeButton=index;
    //     }
    // $scope.heartInactive=function() {
    //       $scope.activeButton=null;
    //     }

    $http.get("/beuApp/salonDeals").success(function(response){
      console.log(response);
      $scope.deals1=response.data;
      $scope.showProgressBar=false;

    });

    $scope.websiteQuerySubmit=function() {

        ga('send', 'event', "queryFormDealPage","click","Send",1);
        //value 1 is for deal page
        fbq('track', 'CompleteRegistration', { value: 1,currency: 'INR'});
        if($scope.dialog.queryName =="" || $scope.dialog.PhoneNumber == "")// $scope.cb==undefined || $scope.cb==false
        {
          console.log("please input all fields");
          console.log($scope.dialog);
          console.log($scope.dialog.queryName,$scope.dialog.PhoneNumber );
          $scope.message="Please Input All Fields*";
          return false;
        }else{

              var phoneNumberCheck = /^\d{10}$/;
              var isValidNumber = phoneNumberCheck.test($scope.dialog.queryPhoneNumber);

              if(!isValidNumber){
                console.log("Please Enter a Valid Number.");
                $scope.message="Please Enter a Valid Phone Number*.";
                console.log($scope.dialog);

                return false;
              }

              // var emailCheck = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

              // var isValidEmail = emailCheck.test($scope.queryEmail);
              //
              // if (!isValidEmail) {
              //   console.log("Please Enter a valid email.");
              //   $scope.message="Please Enter a Valid Email Address*.";
              //    return false;
              // }


              $http.post("/beuApp/websiteQuery",{name:$scope.dialog.queryName,phoneNumber:$scope.dialog.queryPhoneNumber,email:$scope.dialog.queryEmail,queryText:$scope.dialog.queryComment}).success(function(response) {

                  console.log("Details Submitted");
                  $scope.dialog.queryName="";
                  $scope.dialog.queryEmail="";
                  $scope.dialog.queryPhoneNumber="";
                  $scope.dialog.queryComment="";
                  $scope.message="Thank You for the details. We would get back to you shortly.";
                    $timeout(function () {
                      $scope.message="";
                      console.log("ajsdflahds");
                    }, 2000);
              });

        }
    }
    /*---------------------------Search Box Work ----------------------------Starts------------------------------------*/
    /*--------------------------- ----------------------------------------------------------------*/
    /*--------------------------- ----------------------------------------------------------------*/
    /*--------------------------- ----------------------------------------------------------------*/
    /*--------------------------- ----------------------------------------------------------------*/
    /*--------------------------- ----------------------------------------------------------------*/
    /*--------------------------- ----------------------------------------------------------------*/
    /*--------------------------- ----------------------------------------------------------------*/

    $scope.serviceCodesParameter='';
    if(localStorageService.get('serviceCodeHomeSearch')!=undefined){
        $scope.serviceCodesParameter="&serviceCodes=["+localStorageService.get('serviceCodeHomeSearch')+"]"
    }
    /*=========================================User Detected Or Searched Location=================Start=============================================*/
    if(localStorageService.get("requiredLat")!=''){
        $http.get('/api/search?lat='+ localStorageService.get('requiredLat')+'&lng='+localStorageService.get('requiredLong')).success(function(data){
           // console.log("this is place name");
           // console.log(data.data[0].formatted_address);
            if(localStorageService.get("requiredLat")==='28.52457'){
                $scope.myPositionName='Search parlor or location'
            }else{
                $scope.myPositionName=data.data[0].formatted_address;
            }

        });
    }else if((localStorageService.get("requiredLat")=='')&&(localStorageService.get("userDetectedLatitude")!=undefined )){
        $scope.requiredLat=localStorageService.get("userDetectedLatitude");
        $scope.requiredLong=localStorageService.get("userDetectedLongitude");
        localStorageService.set("requiredLat",localStorageService.get("userDetectedLatitude"));
        localStorageService.set("requiredLong",localStorageService.get("userDetectedLongitude"));
        $http.get('/api/search?lat='+localStorageService.get("userDetectedLatitude")+'&lng='+localStorageService.get("userDetectedLongitude")).success(function(data){
            //console.log("this is place name");
            //console.log(data.data[0].formatted_address);
            $scope.myPositionName=data.data[0].formatted_address;


        });
    }else if((localStorageService.get("requiredLat")=='')&&(localStorageService.get("userDetectedLatitude")==undefined )){
        localStorageService.set("requiredLat",'28.52457');
        localStorageService.set("requiredLong",'77.206615');
        $scope.myPositionName='Search parlor or location'
    }



    var autocompleteService = new google.maps.places.AutocompleteService();
    $scope.simulateQuery = false;
    $scope.isDisabled    = false;
    $scope.showSearchBoxVariable=salonListingSearchBoxBooleanService;

    $scope.selectedItemChange = selectedItemChange;
    $scope.searchTextChange   = searchTextChange;
    $scope.panes=[true,false,false];


    $scope.search = function(input, cb) {
        if (!input) {
            return;
        }
        getResults(input).then(function(places) {
           // console.log(places);
            return cb(places);
        });
    };



    function querySearch (query) {
        var fis = [];
        if (query != null){
            $scope.searchText1=function(query,lists){
                $scope.results123=[]
                $scope.queryMatchFlag=false;
                if(query==''){
                    $scope.results123=[];

                }else{
                    //console.log(lists);
                    $scope.results123=[];
                    query = query.toLowerCase();
                    angular.forEach(lists, function(item) {
                        if( item.name.toLowerCase().search(query) >= 0 ) {
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


                return $scope.results123;
            };
            //console.log($scope.userSearchedServ);

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
            serviceResults.forEach(function (element) {
                var item3 = {name: element.name, type: "Service",serviceCode:element.serviceCode};
                fis.push(item3);
                //`console.log(element);
            });
        }
        var results = query ? $scope.repos.filter( createFilterFor(query) ) : $scope.repos,deferred;
        results.forEach(function(element) {
            var item1={name:element.name, type:"Outlet",parlorId:element.parlorId,link:element.link};
            fis.push(item1);
            //console.log(element);
        });
       // console.log(results);
        deferred = $q.defer();
        $scope.search(query, function(places) {
            //console.log(places);
            if (places!=null) {

                places.forEach(function (element) {
                    var item2 = {name: element.description, type: "Location", place_id: element.place_id};
                    fis.push(item2);
                    //console.log(item2);
                });
            }
           // console.log(fis);
            if($scope.enterFlag){
                //alert("here")
                selectedItemChange(fis[0])
            }
            deferred.resolve( fis );
        });
        return deferred.promise;

    }

    function searchTextChange(text) {
        $log.info('Text changed to ' + text);
        /*--------------------------------place to store the localStorage for parlorDetais----------------Start-------------*/
        //console.log("this is the place to use the localStorage from search")
        //console.log(text);

        /*--------------------------------place to store the localStorage for parlorDetais-------------Stop------------------*/
    }

    function selectedItemChange(item) {
        //console.log(item)

        if(item.type=="Location")
        {
            //alert("Location");
            //console.log("item",item);
            localStorageService.set("userQuery",item.name);
           // console.log("this is users final query",localStorageService.get("userQuery"));
           // console.log("You selected a location");

            $scope.placeIdUrl='/api/placeDetail?placeId='+item.place_id;
            /*$scope.placeIdUrl='https://maps.googleapis.com/maps/api/place/details/json?placeid='+item.place_id+'&key=AIzaSyCUO8lvZlCuXz2wYclFI05QA5EJBwxyBUs';*/

            $http.get($scope.placeIdUrl).success(function(data){

                //alert("in location jsonp");
                var result = data;
               // console.log(result);
                $scope.salons='';
                $scope.listingBufferFlag=true;
                $http.get("/api/parlorsListForWebsite?latitude="+result.data.geometry.location.lat+"&longitude="+result.data.geometry.location.lng+"&filter param=[]").success(function(data){
                    localStorageService.set("requiredLat",result.data.geometry.location.lat)
                    localStorageService.set("requiredLong",result.data.geometry.location.lng)
                  //  console.log(data)
                    $scope.listingBufferFlag=false;
                });
            }).
            error(function(data) {
                alert("ERROR: Could not get data.");
            });

        }
        else if(item.type=="Outlet"){
            //alert("Outlet");
            //localStorageService.set('requiredParlorId',"");
            localStorageService.set("userQuery",item.name);
            //console.log("this is users final query",localStorageService.get("userQuery"));
            //console.log(item);
            localStorageService.set('requiredParlorId',item.parlorId);
            //console.log(localStorageService.get('requiredParlorId'));
           // console.log("this is users final query",localStorageService.get("userQuery"));
            /*var str=item.name;
            str=str.replace(/ /g,'-');*/
            $location.path('/parlor-detail/'+item.link);
        }
        else if(item.type=="Service"){
            //alert("Service");
            localStorageService.set("userQuery",item.name);
            $scope.salons='';
            $scope.listingBufferFlag=true;
            $http.get("/api/parlorsListForWebsite?latitude="+localStorageService.get("requiredLat")+"&longitude="+localStorageService.get("requiredLong")+"&serviceCodes=["+item.serviceCode+"]").success(function(data){
               // console.log(data)
                $scope.listingBufferFlag=false;
                $scope.salons=data.data.parlors;
                $scope.sizeLessThan500Flag=false;
            });
            /* console.log("this is users final query",localStorageService.get("userQuery"));
             console.log("You selected a service");

             if($scope.myPosition==undefined){
             localStorageService.set('requiredLat',undefined);
             localStorageService.set('requiredLat',undefined);

             $http.get('https://maps.googleapis.com/maps/api/place/details/json?placeid=ChIJ3T8F3fDhDDkRnxNgWBpc2Zc&key=AIzaSyDVZbwL-5XowF28mB_1s2vpbbeyBwCpnJM').success(function(data){
             var result = data;
             console.log(result.result.geometry.location);

             localStorageService.set('requiredLat',result.result.geometry.location.lat);
             localStorageService.set('requiredLong',result.result.geometry.location.lng);
             console.log("localstorage lat and long--------------"+localStorageService.get('requiredLat'),localStorageService.get('requiredLong'));
             console.log("this is users final query",localStorageService.get("userQuery"));
             $location.path('/salon-listing');
             });

             }else{
             localStorageService.set('requiredLat',$scope.myPosition.latitude);
             localStorageService.set('requiredLong',$scope.myPosition.longitude);
             console.log($scope.myPosition.latitude,$scope.myPosition.longitude);
             $location.path('/salon-listing');
             }*/



        }
    }

    /**
     * Build `components` list of key/value pairs
     *
     * http://beusalon.com/api/allParlor
     */
    $scope.parlorListObtained="";
    $http.get("/api/allParlor").success(function(data){
        $scope.parlorListObtained=data.data;
        $scope.bestParlorsList=data.data;
        //console.log($scope.bestParlorsList)
        $scope.repos         = loadAll();
        $scope.querySearch   = querySearch;
    });
    function loadAll() {

        var repos=$scope.parlorListObtained
        return repos.map( function (repo) {
            repo.value = repo.name.toLowerCase();
            return repo;
        });
    }

    $http.get("/api/services").success(function(data){

        $scope.userSearchedServ1=data.data.services;
        $scope.userSearchedServ=[];
        $scope.userSearchedServ1.forEach(function(cat){
            cat.services.forEach(function(serv){
                $scope.userSearchedServ.push(serv);
            });
        });
        $scope.reposServices = loadAll1();
        $scope.querySearch = querySearch;
    });
    function loadAll1() {

        var repos=$scope.userSearchedServ;
        return repos.map( function (repo) {
            repo.value = repo.name.toLowerCase();
            return repo;
        });
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
    var southWest = new google.maps.LatLng( 28.387202, 76.850534 );
    var northEast = new google.maps.LatLng( 28.748991, 77.550923 );
    var delhiNCRBounds = new google.maps.LatLngBounds( southWest, northEast );
    var getResults = function(address) {

        var deferred = $q.defer();
        var request = {
            bounds: delhiNCRBounds,
            input: address,
            types: ['geocode'],
            componentRestrictions: {country: 'in'},
        };
        autocompleteService.getPlacePredictions(request, function(data) {
            deferred.resolve(data);
        });
        return deferred.promise;
    };


    $scope.produceListingPageSalons=function(item){
        //console.log(item);

    }

    /* $scope.$watch('document.body.offsetWidth', function() {

    if(document.body.offsetWidth<600){
        alert("true")
    }
    }, true);*/
    /*==========================See more See less work Starts ===========================main===========================*/
    //
    //
    //other parts near 106(when page initialises in the begining) and 486(when a person searches the location)
    //
    //
    $scope.sizeLessThan500Flag=false;
    $scope.evenCount='';
    $scope.oddCount='';
    $scope.seeMoreSeeLessContent='more'
    angular.element(window).on('resize',function (){
            //
            // if(document.body.offsetWidth<500){
            //     for(var i=0;i<$scope.dummyData.length;i++){
            //             $scope.dummyData[i].evenCount=1;
            //             $scope.dummyData[i].oddCount=2;
            //     }
            //     $scope.sizeLessThan500Flag=true;
            //     $scope.evenCount=1;
            //     $scope.oddCount=2;
            //
            // }else{
            //     for(var i=0;i<$scope.dummyData.length;i++){
            //             $scope.dummyData[i].evenCount='';
            //             $scope.dummyData[i].oddCount='';
            //     }
            //     $scope.sizeLessThan500Flag=false;
            //     $scope.evenCount='';
            //     $scope.oddCount='';
            // }
    });

    $scope.seeMoreServices=function(s){
        console.log(s)
        if(s.seeMoreLessContent=='more'){
           s.evenCount='';
            s.oddCount='';
            s.seeMoreLessContent='less';
        }else if(s.seeMoreLessContent=='less'){
            s.evenCount=1;
            s.oddCount=2;
            s.seeMoreLessContent='more';
        }

    }
    $scope.buyNowClicked=function(dealName,price){
        ga('send', 'event', "buyNow","click","Buy Now",price);
        fbq('track', 'AddToWishlist', {
          value: price,
          currency: 'INR',
          content_type: dealName,
        });
    }
    $scope.androidLink=function(){
        ga('send', 'event', "androidAppDownload","click","Buy Now",1);
        //android is 1
        fbq('track', 'Lead', {
          value: 1,
          currency: 'INR',
        });
    }
    $scope.iphoneLink=function(){

        //android is 1
        ga('send', 'event', "IOSAppDownload","click","Buy Now",2);
        fbq('track', 'Lead', {
          value: 2,
          currency: 'INR',
        });
    }

    /*==========================See more See less work Stops ==============================main========================*/

    /*--------------------------- ----------------------------------------------------------------*/
    /*--------------------------- ----------------------------------------------------------------*/
    /*--------------------------- ----------------------------------------------------------------*/
    /*--------------------------- ----------------------------------------------------------------*/
    /*--------------------------- ----------------------------------------------------------------*/
    /*--------------------------- ----------------------------------------------------------------*/
    /*--------------------------- ----------------------------------------------------------------*/
    /*---------------------------Search Box Work ----------------------------Stops------------------------------------*/

  }]);
