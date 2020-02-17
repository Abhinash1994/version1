app.controller('ListingCtrl', ['$rootScope','$scope', '$http','$route','$routeParams','$location','ngProgressFactory','localStorageService','$mdDialog','Service','salonListingSearchBoxBooleanService','$log','$q',
    function($rootScope,$scope, $http,$route, $routeParams, $location,ngProgressFactory,localStorageService,$mdDialog,Service,salonListingSearchBoxBooleanService,$log,$q) {


//        $scope.$watch("selectedItem",function(n,o){
//            //console.log(n)
//        })
        salonListingSearchBoxBooleanService.setFlag(true);
        $scope.progressbar = ngProgressFactory.createInstance();
        $scope.progressbar.setColor("#d2232a");
        $scope.progressbar.start();
        $scope.checkVariable="";
        $scope.salons = [];
        $scope.gend="F";
        $scope.group1="";
        $scope.group2="";
        $scope.group3="";
        var serv=[{"name":"Hair Cut For Him","price":"100"},{"name":"Hair Cut for her","price":"120"},{"name":"Nail Paint","price":"130"},{"name":"Spa","price":"140"},{"name":"Facial","price":"150"},{"name":"Waxing","price":"160"}]
        $scope.group4="";
        $scope.checked_categories = [];
        $scope.filteredArray=[];
        $scope.originalParlorArray=[];
        $scope.sortDistanceFlag=false;
        $scope.listingBufferFlag=true;
        $scope.propertyToBeSorted="distance";
        $scope.requiredLat=localStorageService.get('requiredLat');
        $scope.requiredLong=localStorageService.get('requiredLong');
        //localStorageService.set('cartParlorId',undefined)
        $scope.urlHomeSliderImages="/api/homeSlider";
        $http.get($scope.urlHomeSliderImages,{cache:false}).then(function(response) {
            ////console.log("this is the homeSlider data");

            $scope.homeSliderImagesContent=response.data.data;
            ////console.log($scope.homeSliderImagesContent);
            $scope.dataArray=$scope.homeSliderImagesContent
        });
        $scope.serviceCodesParameter='';
        if(localStorageService.get('serviceCodeHomeSearch')!=undefined){
            $scope.serviceCodesParameter="&serviceCodes=["+localStorageService.get('serviceCodeHomeSearch')+"]"
        }
        /*=========================================User Detected Or Searched Location=================Start=============================================*/
        if(localStorageService.get("requiredLat")!=''){

            $http.get('/api/search?lat='+ localStorageService.get('requiredLat')+'&lng='+localStorageService.get('requiredLong')).success(function(data){
               // //console.log("this is place name");
               // //console.log(data.data[0].formatted_address);
                if(localStorageService.get("requiredLat")==='28.52457'){
                    $scope.myPositionName='Search parlor or location'
                }else{
                    $scope.myPositionName=data.data[0].formatted_address;
                }

            });
        }else if((localStorageService.get("requiredLat")=='')&&(localStorageService.get("userDetectedLatitude")!=undefined )){
            $scope.requiredLat=localStorageService.get("userDetectedLatitude");
            $scope.requiredLong=localStorageService.get("userDetectedLongitude");
            //console.log("jkdshd")
            localStorageService.set("requiredLat",localStorageService.get("userDetectedLatitude"));
            localStorageService.set("requiredLong",localStorageService.get("userDetectedLongitude"));
            $http.get('/api/search?lat='+localStorageService.get("userDetectedLatitude")+'&lng='+localStorageService.get("userDetectedLongitude")).success(function(data){
                ////console.log("this is place name");
                ////console.log(data.data[0].formatted_address);
                $scope.myPositionName=data.data[0].address_components[2].long_name+ ' '+data.data[0].address_components[4].long_name;;



            });
        }else if((localStorageService.get("requiredLat")=='')&&(localStorageService.get("userDetectedLatitude")==undefined )){
            localStorageService.set("requiredLat",'28.52457');
            localStorageService.set("requiredLong",'77.206615');
            $scope.myPositionName='Search parlor or location'
        }
       // //console.log("these are the required lat and long---parlor detail------", localStorageService.get('requiredLat'),localStorageService.get('requiredLong'));

        /*=========================================User Detected Or Searched Location=================Stop=============================================*/

        /*---------------------------Carousel Variables and Functions---------------Start-------------------------*/

        /* $scope.dataArray = [
         {
         src: '/website/images/1920headerdealssample.jpg'
         },
         {
         src: '/website/images/1920headerdealssample2.jpg'
         },
         {
         src: '/website/images/1920headerdealssample3.jpg'
         }
         ];*/


        /*---------------------------Carousel Variables and Functions---------------Stop-------------------------*/
        ga('set', 'page', '/SalonListing');
        ga('send', 'pageview');

        ////console.log("$scope.serviceCodesParameter"+$scope.serviceCodesParameter);
        $http.get("/api/parlorsListForWebsite?latitude="+ localStorageService.get("requiredLat")+"&longitude="+localStorageService.get("requiredLong")+$scope.serviceCodesParameter).success(function(data){
           //console.log(data);
            $scope.dummyData=data.data.parlors;
            //console.log($scope.dummyData);


           /* if(document.body.offsetWidth<500){
                $scope.sizeLessThan500Flag=true;
                $scope.evenCount=1;
                $scope.oddCount=2;
            }else{
                $scope.sizeLessThan500Flag=false;
                $scope.evenCount='';
                $scope.oddCount='';
            }*/
            $scope.dummyData.forEach(function(dep) {
                dep.distance = parseFloat(dep.distance);

                /*dep.parlorservices.forEach(function(x){
                    dep.parlorservices.oddCount='';
                    dep.parlorservices.evenCount='';
                })*/
            });
            /*==========================See more See less work Starts =====================initialization part=================================*/
            for(var i=0;i<$scope.dummyData.length;i++){
                    if(document.body.offsetWidth<500){
                        $scope.dummyData[i].evenCount=1;
                        $scope.dummyData[i].oddCount=2;
                        $scope.dummyData[i].seeMoreLessContent='more';
                        $scope.sizeLessThan500Flag=true;
                        //alert( $scope.dummyData[i].name);
                    }else{
                        $scope.dummyData[i].evenCount='';
                        $scope.dummyData[i].oddCount='';
                        $scope.dummyData[i].seeMoreLessContent='more';
                        $scope.sizeLessThan500Flag=false;

                    }
            }
            /*==========================See more See less work Starts ======================initialization part================================*/
            //alert($scope.requiredLat)

            //$scope.salons = data;
            /* $scope.dummyData=[
             {"parlorId":"57863fba2377bf5a72a51a0a","price":1,"rating":1,"distance":6,"gender":"M"},
             {"parlorId":"57863fba2377bf5a72a51a0a","price":10,"rating":2,"distance":15,"gender":"F"},
             {"parlorId":"8","price":198,"rating":4,"distance":14,"gender":"M"},
             {"parlorId":"7","price":1,"rating":1,"distance":7,"gender":"M"},
             {"parlorId":"6","price":1986,"rating":1,"distance":9,"gender":"F"},
             {"parlorId":"5","price":10022,"rating":3,"distance":19,"gender":"UNISEX"},
             {"parlorId":"4","price":122,"rating":2,"distance":24,"gender":"M"},
             {"parlorId":"3","price":3,"rating":5,"distance":100,"gender":"UNISEX"},
             ];*/
            //$scope.originalParlorArray= $scope.dummyData;


            $scope.salons= $scope.dummyData;
            $scope.listingBufferFlag=false;
           // //console.log("this is the item card to be filtered");
           // //console.log($scope.salons);


            $scope.originalParlorArray= $scope.salons;
            $scope.progressbar.complete();
            ////console.log( $scope.salons);
            for(var i=0;i<$scope.salons.length;i++){
                $scope.salons[i].serv=serv;

            }
        });

        $scope.parlorDetails=function(value){
                if((value.parlorId)!=(localStorageService.get('requiredParlorId'))){
                Service.setNumber(0);
                localStorageService.set("cartQuantity",undefined);
            }
            localStorageService.set('requiredParlorId',value.parlorId);
           /* var str=value.name;
            str=str.replace(/ /g,'-');*/
            var str=value.link;
            $location.path('/parlor-detail/'+str);
            ga('send', {
                hitType: 'event',
                eventCategory: 'click on salon listing',
                eventAction: 'parlor details',
                eventLabel: 'Fall Campaign'
            });


}

        $scope.url="/api/parlorHome?parlorId=587088445c63a33c0af62727";
        $scope.serviceNames=[];
        $http.get($scope.url).then(function(response) {

            ////console.log(response.data);

            $scope.depts=response.data.services;
            /*for(var i=0;i<$scope.depts.length;i++){
             $scope.serviceNames.push()
             }*/
           // //console.log("detail list");


            /* $scope.depts.forEach(function(dep) {
             dep.categories.forEach(function(cat) {
             $scope.allCategories.push(cat);
             });
             });*/
        });



        $scope.showFilterDialog = function(ev) {
            $scope.bufferFlag=false;
            $mdDialog.show({
                controller: DialogController,
                templateUrl: '/website/views/listingDialog.html',
                scope: $scope,        // use parent scope in template
                preserveScope: true,
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            })
                .then(function(answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function() {
                    $scope.status = 'You cancelled the dialog.';
                });
        };


        function DialogController($scope, $mdDialog,$auth,$rootScope) {
            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.cancel = function() {
                $mdDialog.cancel();
            };
            $scope.filterParlorListObject= {
                services: [],
                dataFromRadio:""
            }
            $scope.radiodata= {
                Budget:"",
                Distance:"",
                Gender:"",
                Rating:""
            };




            $scope.filterServices = function (item, list) {
                var idx = list.indexOf(item);
                if (idx > -1) {
                    list.splice(idx, 1);
                }
                else {
                    list.push(item);
                }

                ////console.log("filterParlorListObject.services",$scope.filterParlorListObject.services);

            };




            $scope.filterParlorList=function(){
                //console.log("filterParlorListObject.services",$scope.filterParlorListObject.services);
                $scope.filteredArray=[];
                $scope.salons=[];
                if($scope.filterParlorListObject.services.length!=0){
                   // //console.log("inside category filter");
                    $scope.bufferFlag=true;
                    $http.get("/api/parlorsListForWebsite?latitude="+ localStorageService.get("requiredLat")+"&longitude="+localStorageService.get("requiredLong")+"&filter param="+$scope.filterParlorListObject.services).success(function(data){
                        ////console.log("this is the required data aftergetiing filtered from category id");
                       // //console.log(data);
                        $scope.salons=data.data.parlors;
                        $scope.filterParlorListObject.dataFromRadio=$scope.radiodata;
                        ////console.log($scope.filterParlorListObject);
                       // //console.log("$scope.salons",$scope.salons);
                        $scope.salons.forEach(function(dep) {
                            dep.distance = parseFloat(dep.distance);
                        });

                        for(var i=0;i<$scope.salons.length;i++){
                            //$scope.salons=$scope.originalParlorArray;
                            ////console.log($scope.salons[i].price);
                            $scope.rounderRating=Math.ceil($scope.salons[i].rating);
                            if((($scope.radiodata.Budget==$scope.salons[i].price)||($scope.radiodata.Budget==""))&&((($scope.radiodata.Distance<=$scope.salons[i].distance)&&($scope.salons[i].distance<=parseFloat($scope.radiodata.Distance)+5))||($scope.radiodata.Distance==""))&&(($scope.radiodata.Gender==$scope.salons[i].gender)||($scope.radiodata.Gender==""))&&(($scope.radiodata.Rating==$scope.rounderRating)||($scope.radiodata.Rating==""))){
                                //  alert("matched");
                                $scope.filteredArray.push($scope.salons[i]);
                            }
                            else{
                                //console.log("$scope.salons[i].price.toString().length",$scope.salons[i].price.toString().length);

                            }
                        }
                       // //console.log($scope.filteredArray)

                        $scope.salons=$scope.filteredArray;
                        /*this loop is added for temporary services */
                        for(var i=0;i<$scope.salons.length;i++){

                            $scope.salons[i].serv=serv;
                        }
                        /*this loop is added for temporary services */
                        $mdDialog.hide();
                    });
                }else{
                    ////console.log("not inside category filter");
                    $scope.salons=$scope.originalParlorArray;
                    $scope.filterParlorListObject.dataFromRadio=$scope.radiodata;
                   // //console.log($scope.filterParlorListObject);

                    for(var i=0;i<$scope.salons.length;i++){
                        var a=(parseFloat($scope.radiodata.Distance)+5);
                        //$scope.salons=$scope.originalParlorArray;
                        ////console.log($scope.salons[i].price);

                        $scope.rounderRating=Math.ceil($scope.salons[i].rating);
                        if((($scope.radiodata.Budget==$scope.salons[i].price)||($scope.radiodata.Budget==""))&&((($scope.radiodata.Distance<=$scope.salons[i].distance)&&($scope.salons[i].distance<=parseFloat($scope.radiodata.Distance)+5))||($scope.radiodata.Distance==""))&&(($scope.radiodata.Gender==$scope.salons[i].gender)||($scope.radiodata.Gender==""))&&(($scope.radiodata.Rating==$scope.rounderRating)||($scope.radiodata.Rating==""))){
                            //  alert("matched");
                            $scope.filteredArray.push($scope.salons[i]);
                        }
                        else{
                           // //console.log("$scope.salons[i].price.toString().length",$scope.salons[i].price.toString().length);
                        }
                    }
                    $scope.salons=$scope.filteredArray;
                    $mdDialog.hide();
                }
            };

            $scope.exists = function (item, list) {
                ////console.log(item)
                return list.indexOf(item) > -1;
            };

        }

        $scope.sortDistanceToggle=function(value){
            if($scope.propertyToBeSorted!=value){
                $scope.propertyToBeSorted=value;
                $scope.sortDistanceFlag=false;
            }
            else if($scope.propertyToBeSorted==value){
                $scope.sortDistanceFlag=!$scope.sortDistanceFlag;
            }
            ////console.log("propertyToBeSorted",$scope.propertyToBeSorted)
           // //console.log("Required Flag",$scope.sortDistanceFlag);
        }



        /*---------------------------Search Box Work ----------------------------Starts------------------------------------*/
        /*--------------------------- ----------------------------------------------------------------*/
        /*--------------------------- ----------------------------------------------------------------*/
        /*--------------------------- ----------------------------------------------------------------*/
        /*--------------------------- ----------------------------------------------------------------*/
        /*--------------------------- ----------------------------------------------------------------*/
        /*--------------------------- ----------------------------------------------------------------*/
        /*--------------------------- ----------------------------------------------------------------*/
        var autocompleteService = new google.maps.places.AutocompleteService();
        $scope.simulateQuery = false;
        $scope.isDisabled    = false;
        $scope.showSearchBoxVariable=salonListingSearchBoxBooleanService;

        $scope.selectedItemChange = selectedItemChange;
        //console.log($scope.selectedItemChange )
        $scope.searchTextChange   = searchTextChange;
        $scope.panes=[true,false,false];


        $scope.search = function(input, cb) {
            if (!input) {
                return;
            }
            getResults(input).then(function(places) {
               // //console.log(places);
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
                        ////console.log(lists);
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
                ////console.log($scope.userSearchedServ);

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
                    //`//console.log(element);
                });
            }
            var results = query ? $scope.repos.filter( createFilterFor(query) ) : $scope.repos,deferred;
            results.forEach(function(element) {
                var item1={name:element.name, type:"Outlet",parlorId:element.parlorId,link:element.link};
                fis.push(item1);
                ////console.log(element);
            });
           // //console.log(results);
            deferred = $q.defer();
            $scope.search(query, function(places) {
                ////console.log(places);
                if (places!=null) {

                    places.forEach(function (element) {
                        var item2 = {name: element.description, type: "Location", place_id: element.place_id};
                        fis.push(item2);
                        ////console.log(item2);
                    });
                }
               // //console.log(fis);
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
            ////console.log("this is the place to use the localStorage from search")
            ////console.log(text);

            /*--------------------------------place to store the localStorage for parlorDetais-------------Stop------------------*/
        }

        function selectedItemChange(item) {
            //console.log(item)

            if(item.type=="Location")
            {
                //alert("Location");
                ////console.log("item",item);
                localStorageService.set("userQuery",item.name);
               // //console.log("this is users final query",localStorageService.get("userQuery"));
               // //console.log("You selected a location");

                $scope.placeIdUrl='/api/placeDetail?placeId='+item.place_id;
                /*$scope.placeIdUrl='https://maps.googleapis.com/maps/api/place/details/json?placeid='+item.place_id+'&key=AIzaSyCUO8lvZlCuXz2wYclFI05QA5EJBwxyBUs';*/

                $http.get($scope.placeIdUrl).success(function(data){

                    //alert("in location jsonp");
                    var result = data;
                   // //console.log(result);
                    $scope.salons='';
                    $scope.listingBufferFlag=true;
                    $http.get("/api/parlorsListForWebsite?latitude="+result.data.geometry.location.lat+"&longitude="+result.data.geometry.location.lng+"&filter param=[]").success(function(data){
                        localStorageService.set("requiredLat",result.data.geometry.location.lat)
                        localStorageService.set("requiredLong",result.data.geometry.location.lng)
                      //  //console.log(data)
                        $scope.listingBufferFlag=false;

                        $scope.dummyData= data.data.parlors;
                        /*==========================See more See less work Starts ===================starts PART 2===================================*/
                        for(var i=0;i<$scope.dummyData.length;i++){
                                if(document.body.offsetWidth<500){
                                    $scope.dummyData[i].evenCount=1;
                                    $scope.dummyData[i].oddCount=2;
                                    $scope.dummyData[i].seeMoreLessContent='more';
                                    $scope.sizeLessThan500Flag=true;
                                }else{
                                    $scope.dummyData[i].evenCount='';
                                    $scope.dummyData[i].oddCount='';
                                    $scope.dummyData[i].seeMoreLessContent='more';
                                    $scope.sizeLessThan500Flag=false;
                                }
                        }
                        /*==========================See more See less work Starts =======================stops PART 2===============================*/
                        $scope.salons= $scope.dummyData;
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
                ////console.log("this is users final query",localStorageService.get("userQuery"));
                ////console.log(item);
                localStorageService.set('requiredParlorId',item.parlorId);
                ////console.log(localStorageService.get('requiredParlorId'));
               // //console.log("this is users final query",localStorageService.get("userQuery"));
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
                   // //console.log(data)
                    $scope.listingBufferFlag=false;
                    $scope.salons=data.data.parlors;
                    $scope.sizeLessThan500Flag=false;
                });
                /* //console.log("this is users final query",localStorageService.get("userQuery"));
                 //console.log("You selected a service");

                 if($scope.myPosition==undefined){
                 localStorageService.set('requiredLat',undefined);
                 localStorageService.set('requiredLat',undefined);

                 $http.get('https://maps.googleapis.com/maps/api/place/details/json?placeid=ChIJ3T8F3fDhDDkRnxNgWBpc2Zc&key=AIzaSyDVZbwL-5XowF28mB_1s2vpbbeyBwCpnJM').success(function(data){
                 var result = data;
                 //console.log(result.result.geometry.location);

                 localStorageService.set('requiredLat',result.result.geometry.location.lat);
                 localStorageService.set('requiredLong',result.result.geometry.location.lng);
                 //console.log("localstorage lat and long--------------"+localStorageService.get('requiredLat'),localStorageService.get('requiredLong'));
                 //console.log("this is users final query",localStorageService.get("userQuery"));
                 $location.path('/salon-listing');
                 });

                 }else{
                 localStorageService.set('requiredLat',$scope.myPosition.latitude);
                 localStorageService.set('requiredLong',$scope.myPosition.longitude);
                 //console.log($scope.myPosition.latitude,$scope.myPosition.longitude);
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
            ////console.log($scope.bestParlorsList)
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

        $http.get("/api/getServicesForWebsite").success(function(data){

            $scope.userSearchedServ=data;
            // $scope.userSearchedServ=[];
            // $scope.userSearchedServ1.forEach(function(cat){
            //     cat.services.forEach(function(serv){
            //         $scope.userSearchedServ.push(serv);
            //     });
            // });
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
            ////console.log(item);

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

                if(document.body.offsetWidth<500){
                    for(var i=0;i<$scope.dummyData.length;i++){
                            $scope.dummyData[i].evenCount=1;
                            $scope.dummyData[i].oddCount=2;
                    }
                    $scope.sizeLessThan500Flag=true;
                    $scope.evenCount=1;
                    $scope.oddCount=2;

                }else{
                    for(var i=0;i<$scope.dummyData.length;i++){
                            $scope.dummyData[i].evenCount='';
                            $scope.dummyData[i].oddCount='';
                    }
                    $scope.sizeLessThan500Flag=false;
                    $scope.evenCount='';
                    $scope.oddCount='';
                }
        });

        $scope.seeMoreServices=function(s){
            //console.log(s)
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


        $scope.togglemobile=function(a){
            $scope.salons=$scope.salons.map(function(c,i){
                            if(a==i)
                        {
                            c.state= !c.state;
                        }
                return c
            })
//            $scope.state = !$scope.state;
}
 //console.log($scope.selectedItem);
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
