app.controller('offerCtrl', ['$scope', '$http','$route','$routeParams','$location','ngProgressFactory','localStorageService','$mdDialog','$geolocation','Service','salonListingSearchBoxBooleanService','$rootScope','offerPageSearchLocation',
    function($scope, $http,$route, $routeParams, $location,ngProgressFactory,localStorageService,$mdDialog,$geolocation,Service,salonListingSearchBoxBooleanService,$rootScope,offerPageSearchLocation) {

        salonListingSearchBoxBooleanService.setFlag(false);
        $scope.progressbar = ngProgressFactory.createInstance();
        $scope.progressbar.setColor("#d2232a");
        //$scope.progressbar.start();
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
        $scope.sortDistanceFlag="";
        $scope.propertyToBeSorted="";
        $scope.myPosition={};
        $scope.displayPleaseSelectDeals=true;
		$scope.searchTextChange=function(searchText){
			////console.log("New Text");
		};
		$scope.selectedItemChange=function(item){
			////console.log(item);
		};
		$scope.querySearch=function(searchText){
		var lists=[{"name":"Shailendra"},{"name":"manoj"},{"name":"Vikas"},{"name":"Jigs"},{"name":"Saloni"}];
			return lists;
		};

		/*=================================Getting default parlors===============STARTS================================*/

        $scope.callDefaultParlorsForDeals=function (lt,lng) {
            $scope.filteredSalonsArray='';
            $http.get("/api/parlorsForDeals?latitude="+lt+"&longitude="+lng).success(function(data){
                ////console.log(typeof ($scope.myPosition.latitude));
                //console.log(data)
                $scope.filteredSalonsArray=data.data;
                $scope.accordion.expand(0);// this is put here because the accordion doesnt expand til its content is loaded
            });
        }

        /*=================================Getting default parlors===============STOPS================================*/



        /*-------------------------------------------------------------------------------------------------------------------------------*/





        $scope.urlOffer="/api/offer";
        $http.get($scope.urlOffer).then(function(response) {
            ////console.log("this is the offer data");
            $scope.offers=response.data.data;
            ////console.log($scope.offers);

        });



        ////console.log("these are the required lat and long---parlor detail------", localStorageService.get('requiredLat'),localStorageService.get('requiredLong'));

        /*-----------variables declaration start-----------------*/

        $scope.accordionExists=false;


          $scope.chipListDealServices = [];

        if(localStorageService.get("accordionDealsRefreshObeject")!=undefined) {
            $scope.accordionDeals = localStorageService.get("accordionDealsRefreshObeject");
            $scope.accordionExists = true;                                                   //----calls refresh dealFilterForSalonsRefreshObeject
            $scope.displayPleaseSelectDeals=false;

            }

        /*-----------variables declaration stop-----------------*/

        /*==========================Location on Refresh======================STARTS=================================*/

        if( !$scope.accordionExists){
            if((localStorageService.get("userDetectedLatitude"))!=undefined){
                $scope.myPosition.latitude=localStorageService.get("userDetectedLatitude");
                $scope.myPosition.longitude=localStorageService.get("userDetectedLongitude");
            }else{
                $scope.myPosition.latitude='28.52457';
                $scope.myPosition.longitude='77.206615';
            }

        }
    /*    var lt='28.52457';
        var lng='77.206615';
        //console.log($scope.myPosition.latitude+" "+$scope.myPosition.longitude)*/

        /*==========================Location on Refresh======================STOPS=================================*/



        /*------------------function declaration start-------------------------*/
        //$scope.dealUrl="/api/deals?parlorId=5870828f5c63a33c0af62721";

        $scope.dealUrl="/api/alldeals";
        if(!$scope.accordionExists){
            $scope.displayPleaseSelectDeals=false;
            $http.get($scope.dealUrl).then(function(dataRecieved) {
                ////console.log("This is the deals object");
                ////console.log(dataRecieved.data.data);
               // //console.log(localStorageService.get("accordionDealsRefreshObeject"));
                    $scope.accordionDeals=dataRecieved.data.data;
                $scope.dealFilterForSalons={
                    "latitude": $scope.myPosition.latitude,
                    "longitude": $scope.myPosition.longitude,
                    "deals":[]
                };

                $scope.dealFilterForSalonsDealsObject={
                    "dealId":"",
                    "dealIdParlor":"",
                    "dealType":"",
                    "serviceCode":"",
                    "quantity":""
                }
                ////console.log($scope.accordionDeals)
                for(var i=0;i<$scope.accordionDeals.length;i++){
                    for(var j=0;j<$scope.accordionDeals[i].services.length;j++){
                        $scope.accordionDeals[i].services[j].quantity=0;
                        if( $scope.accordionDeals[i].services[j].services.length>1){
                            var k=0;
                            while(k<$scope.accordionDeals[i].services[j].services.length){
                                $scope.accordionDeals[i].services[j].services[k].quantity=0;
                                k++;
                            }
                        }else{
                            $scope.accordionDeals[i].services[j].services[0].quantity=0;
                        }
                    }

                }
                ////console.log(" $scope.accordionDeals", $scope.accordionDeals);
                $scope.callDefaultParlorsForDeals($scope.myPosition.latitude, $scope.myPosition.longitude);
                /*if(($scope.dealFilterForSalons.deals.length==0)||($scope.dealFilterForSalons.deals.length==undefined)){
                    $scope.accordion.expand(0);
                }*/

            });
        }



        $scope.addDeal=function(ev,dealObject){
            ////console.log("dealObject",dealObject.dealType.name);

            if((dealObject.services.length>1)&&(dealObject.dealType.name!="combo")){
                $scope.showDealPageDialog(ev,dealObject,'add');
            }else if((dealObject.services.length==1)||(dealObject.dealType.name=="combo")){
                dealObject.quantity++;
                if(dealObject.dealType.name=="combo"){
                    $scope.dealFilterForSalonsDealsObject={
                        "dealId":dealObject.dealIdParlor,
                        "dealIdParlor":dealObject.dealIdParlor,
                        "dealType":dealObject.dealType,
                        "serviceCode":"",
                        "quantity":dealObject.quantity,
                        "name":dealObject.name
                    };
                }else{
                    $scope.dealFilterForSalonsDealsObject={
                        "dealId":dealObject.dealIdParlor,
                        "dealIdParlor":dealObject.dealIdParlor,
                        "dealType":dealObject.dealType,
                        "serviceCode":dealObject.services[0].serviceCode,
                        "quantity":dealObject.quantity,
                        "name":dealObject.name
                    };
                }
                var idx = $scope.chipListDealServices.indexOf(dealObject);
                ////console.log("index of service",idx)
                if (idx == -1) {
                    $scope.chipListDealServices.push(dealObject);
                    //list.splice(idx, 1);
                }


                $scope.matchFlag=false;
                ////console.log( $scope.dealFilterForSalonsDealsObject)
                if($scope.dealFilterForSalons.deals.length==0){
                    $scope.dealFilterForSalons.deals.push($scope.dealFilterForSalonsDealsObject);
                }else{
                    var idx1=0;
                    while(idx1<$scope.dealFilterForSalons.deals.length){
                        ////console.log("in here ")
                        if(($scope.dealFilterForSalons.deals[idx1].serviceCode==dealObject.services[0].serviceCode)&&(dealObject.dealType.name!="combo")){
                            $scope.dealFilterForSalons.deals[idx1].quantity=dealObject.quantity;
                            $scope.matchFlag=true;
                        }else if(($scope.dealFilterForSalons.deals[idx1].dealIdParlor==dealObject.dealIdParlor)&&(dealObject.dealType.name=="combo")){
                            $scope.dealFilterForSalons.deals[idx1].quantity=dealObject.quantity;
                            $scope.matchFlag=true;
                        }
                        idx1++;
                    }
                    if($scope.matchFlag==false){
                        $scope.dealFilterForSalons.deals.push($scope.dealFilterForSalonsDealsObject);
                    }
                }
               // //console.log("$scope.dealFilterForSalons",$scope.dealFilterForSalons);
                ////console.log("latitude",$scope.dealFilterForSalons.latitude)
               // //console.log( "longitude",$scope.dealFilterForSalons.longitude);
               // //console.log("dealIds",$scope.dealFilterForSalons.deals);
                $scope.callDealDetailsApi($scope.dealFilterForSalons);


            }
        };

        $scope.removeDeal=function(ev,dealObject){
            ////console.log("dealObject",dealObject);
            if((dealObject.services.length>1)&&(dealObject.dealType.name!="combo")){
                $scope.showDealPageDialog(ev,dealObject,'remove');
            }else if((dealObject.services.length==1)||(dealObject.dealType.name=="combo")){
                var idx = $scope.chipListDealServices.indexOf(dealObject);
                if ((idx > -1)&&(dealObject.quantity==1)){
                    //$scope.chipListDealServices.push(dealObject);
                    $scope.chipListDealServices.splice(idx, 1);
                }
                dealObject.quantity--;
                if(dealObject.dealType.name=="combo"){
                    $scope.dealFilterForSalonsDealsObject={
                        "dealId":dealObject.dealIdParlor,
                        "dealIdParlor":dealObject.dealIdParlor,
                        "dealType":dealObject.dealType,
                        "serviceCode":"",
                        "quantity":dealObject.quantity,
                        "name":dealObject.name
                    };
                }else{
                    $scope.dealFilterForSalonsDealsObject={
                        "dealId":dealObject.dealIdParlor,
                        "dealIdParlor":dealObject.dealIdParlor,
                        "dealType":dealObject.dealType,
                        "serviceCode":dealObject.services[0].serviceCode,
                        "quantity":dealObject.quantity,
                        "name":dealObject.name
                    };
                }
                ////console.log( $scope.dealFilterForSalonsDealsObject)
                if($scope.dealFilterForSalons.deals.length==0){
                    alert("nothing");//$scope.dealFilterForSalons.deals.push($scope.dealFilterForSalonsDealsObject);
                }else{
                    var idx1=0;
                    while(idx1<$scope.dealFilterForSalons.deals.length){
                        ////console.log("in here ",$scope.dealFilterForSalons.deals[idx1].dealType)
                        if(($scope.dealFilterForSalons.deals[idx1].serviceCode==dealObject.services[0].serviceCode)&&(dealObject.dealType.name!="combo")){
                            $scope.dealFilterForSalons.deals[idx1].quantity=dealObject.quantity;
                            if($scope.dealFilterForSalons.deals[idx1].quantity==0){
                                $scope.dealFilterForSalons.deals.splice(idx1, 1);
                            }
                        }else if(($scope.dealFilterForSalons.deals[idx1].dealIdParlor==dealObject.dealIdParlor)&&(dealObject.dealType.name=="combo")){
                            $scope.dealFilterForSalons.deals[idx1].quantity=dealObject.quantity;
                           //alert("here"+dealObject.quantity)
                            if($scope.dealFilterForSalons.deals[idx1].quantity==0){
                                $scope.dealFilterForSalons.deals.splice(idx1, 1);
                            }
                        }
                        idx1++;
                    }
                }
                ////console.log("$scope.dealFilterForSalons",$scope.dealFilterForSalons);
                $scope.callDealDetailsApi($scope.dealFilterForSalons);
                ////console.log("$scope.chipListDealServices",$scope.chipListDealServices)
                ////console.log($scope.chipListDealServices)
            }
        };

        $scope.goToParlorDetail=function(salonPassed) {
            if($scope.dealFilterForSalons.deals.length==0){
                localStorageService.set('requiredParlorId',salonPassed.parlorId);
            }else{
                $scope.cartToBeSent=[];
                $scope.cartIdToBeSent=[];
                localStorageService.set('requiredParlorId',salonPassed.parlorId);
                localStorageService.set("cartParlorId",salonPassed.parlorId);
                localStorageService.set('cartParlorLink',salonPassed.link);
                idx=0;
                while(idx<salonPassed.deals.length){
                    if(salonPassed.deals[idx].name!=''){
                        var cartCreated={
                            "name":salonPassed.deals[idx].name,
                            "serviceCode":salonPassed.deals[idx].serviceCode,
                            "code":salonPassed.deals[idx].serviceCode,
                            "additions":0,
                            "typeIndex":100,
                            "price":salonPassed.deals[idx].price,
                            "dealPrice":salonPassed.dealPrice,
                            "menuPrice":salonPassed.deals[idx].menuPrice,
                            "quantity":salonPassed.deals[idx].quantity,
                            "serviceId":salonPassed.deals[idx].serviceId,
                            "weekDay":salonPassed.deals[idx].weekDay,
                            "type":"upcoming",
                            "detail":salonPassed.deals[idx].name
                        }

                        $scope.cartIdToBeSent.push(salonPassed.deals[idx].serviceCode+'100');
                        $scope.cartToBeSent.push(cartCreated);
                    }

                    idx++;


                }

                ////console.log("cart produced ");
                ////console.log( $scope.cartToBeSent);
                ////console.log("cart id produced");
               // //console.log( $scope.cartIdToBeSent);
                localStorageService.set('cart',$scope.cartToBeSent);
                localStorageService.set('cartIds', $scope.cartIdToBeSent);
                /*[
                 {
                 "name":"Female Hair Cut",
                 "serviceCode":202,
                 "code":202,
                 "additions":0,
                 "typeIndex":100,
                 "price":300,
                 "dealPrice":300,
                 "menuPrice":670,
                 "quantity":1,
                 "serviceId":"5881d4fba56ea117784bd80f",
                 "weekDay":2,
                 "type":"dealPrice",
                 "detail":"Female Hair Cut"
                 }
                 ]*/
            }

            $location.path('/parlor-detail/'+salonPassed.link);
        }

        $scope.genderFilter=function(ge){
            $scope.gend=ge;
            ////console.log(ge);
        }
        /*------------------function declaration stop-------------------------*/


        /*------------------dealPageDialog declaration starts-------------------------*/

        $scope.showDealPageDialog= function(ev,dealObject,addRemoveFlag) {
            $scope.addRemoveFlag=addRemoveFlag;
            $scope.dealSubServiceCode="";
            $scope.dealPageDialogDealObject=dealObject;
            $mdDialog.show({
                controller: dealPageDialogController,
                templateUrl: '/website/views/dealPageDialog.html',
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
        function dealPageDialogController($scope, $mdDialog) {

            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.cancel = function() {
                $mdDialog.cancel();
            };
           // //console.log("here",$scope.dealPageDialogDealObject.services)
            var i=0;
            while(i<$scope.dealPageDialogDealObject.services.length){
               // //console.log($scope.dealPageDialogDealObject.services[i].name);
                i++;
            }

            $scope.selectSubService=function(dealSubServiceCode){
                ////console.log("dealSubServiceList",dealSubServiceCode);
                if($scope.addRemoveFlag=='add'){
                    var idx = $scope.chipListDealServices.indexOf($scope.dealPageDialogDealObject);
                   // //console.log("index of service",idx)
                    if (idx == -1) {
                        $scope.chipListDealServices.push($scope.dealPageDialogDealObject);
                        //list.splice(idx, 1);
                    }
                    for(var i=0;i<$scope.dealPageDialogDealObject.services.length;i++){
                       // //console.log("1",dealSubServiceCode);
                       // //console.log("2",$scope.dealPageDialogDealObject.services[i].serviceCode)
                        if($scope.dealPageDialogDealObject.services[i].serviceCode==$scope.dealSubServiceCode){
                            $scope.dealPageDialogDealObject.services[i].quantity++;
                            /*----------------------Creating the object to be sent for parlor filter--------START---------ADDITION--------*/
                            $scope.dealFilterForSalonsDealsObject={
                                "dealId":$scope.dealPageDialogDealObject.dealIdParlor,
                                "dealIdParlor":$scope.dealPageDialogDealObject.dealIdParlor,
                                "dealType":$scope.dealPageDialogDealObject.dealType,
                                "serviceCode":$scope.dealPageDialogDealObject.services[i].serviceCode,
                                "quantity":$scope.dealPageDialogDealObject.services[i].quantity,
                                "name":$scope.dealPageDialogDealObject.services[i].name
                            };
                           // //console.log("Creating the array to be sent ADDITION pop up",$scope.dealFilterForSalonsDealsObject);
                            $scope.matchFlag=false;
                            ////console.log( $scope.dealFilterForSalonsDealsObject)
                            if($scope.dealFilterForSalons.deals.length==0){
                                $scope.dealFilterForSalons.deals.push($scope.dealFilterForSalonsDealsObject);
                            }else{
                                var idx1=0;
                                while(idx1<$scope.dealFilterForSalons.deals.length){
                                    ////console.log("in here ")
                                    if($scope.dealFilterForSalons.deals[idx1].serviceCode==$scope.dealFilterForSalonsDealsObject.serviceCode){
                                        $scope.dealFilterForSalons.deals[idx1].quantity=$scope.dealFilterForSalonsDealsObject.quantity;
                                        $scope.matchFlag=true;
                                    }
                                    idx1++;
                                }
                                if($scope.matchFlag==false){
                                    $scope.dealFilterForSalons.deals.push($scope.dealFilterForSalonsDealsObject);
                                }
                            }
                          //  //console.log("Creating the object to be sent ADDITION pop up", $scope.dealFilterForSalons);
                            $scope.callDealDetailsApi($scope.dealFilterForSalons);

                            /*----------------------Creating the object to be sent for parlor filter--------STOP---------ADDITION--------*/
                        }
                    }
                    var j=0;
                    $scope.dealPageDialogDealObject.quantity=0;
                    while(j<$scope.dealPageDialogDealObject.services.length){
                        $scope.dealPageDialogDealObject.quantity= $scope.dealPageDialogDealObject.quantity+$scope.dealPageDialogDealObject.services[j].quantity;
                        j++;
                    }
                    ////console.log("$scope.dealPageDialogDealObject",$scope.dealPageDialogDealObject);
                }else{
                    var matchFlag=false;
                    var idx = $scope.chipListDealServices.indexOf($scope.dealPageDialogDealObject);

                    for(var i=0;i<$scope.dealPageDialogDealObject.services.length;i++){
                        ////console.log("1",dealSubServiceCode);
                       // //console.log("2",$scope.dealPageDialogDealObject.services[i].serviceCode)
                        if(($scope.dealPageDialogDealObject.services[i].serviceCode==$scope.dealSubServiceCode)&&($scope.dealPageDialogDealObject.services[i].quantity>0)){
                            $scope.dealPageDialogDealObject.services[i].quantity--;
                            if ((idx > -1)&&($scope.dealPageDialogDealObject.quantity==1)){
                                $scope.chipListDealServices.splice(idx, 1);
                            }
                            matchFlag=true;

                            /*----------------------Creating the object to be sent for parlor filter--------STOP---------SUBTRACTION--------*/
                            $scope.dealFilterForSalonsDealsObject={
                                "dealId":$scope.dealPageDialogDealObject.services[i].dealIdParlor,
                                "dealIdParlor":$scope.dealPageDialogDealObject.services[i].dealIdParlor,
                                "dealType":$scope.dealPageDialogDealObject.services[i].dealType,
                                "serviceCode":$scope.dealSubServiceCode,
                                "quantity":$scope.dealPageDialogDealObject.services[i].quantity,
                                "name":$scope.dealPageDialogDealObject.services[i].name
                            };
                           // //console.log("Creating the array to be sent SUBTRACTION pop up",$scope.dealFilterForSalonsDealsObject);
                            ////console.log( $scope.dealFilterForSalonsDealsObject)
                            if($scope.dealFilterForSalons.deals.length==0){
                                alert("nothing");//$scope.dealFilterForSalons.deals.push($scope.dealFilterForSalonsDealsObject);
                            }else{
                                var idx1=0;
                                while(idx1<$scope.dealFilterForSalons.deals.length){
                                    ////console.log("in here ")
                                    if($scope.dealFilterForSalons.deals[idx1].serviceCode==$scope.dealSubServiceCode){
                                        $scope.dealFilterForSalons.deals[idx1].quantity=$scope.dealPageDialogDealObject.services[i].quantity;
                                        if($scope.dealFilterForSalons.deals[idx1].quantity==0){
                                            $scope.dealFilterForSalons.deals.splice(idx1, 1);
                                        }
                                    }
                                    idx1++;
                                }
                                ////console.log("Creating the array to be sent SUBTRACTION pop up",$scope.dealFilterForSalons);
                                $scope.callDealDetailsApi($scope.dealFilterForSalons);

                            }
                            /*----------------------Creating the object to be sent for parlor filter--------STOP---------SUBTRACTION--------*/
                        }
                    }
                    if(matchFlag==false){
                        alert("not found")
                    }else{
                        var j=0;
                        $scope.dealPageDialogDealObject.quantity=0;
                        while(j<$scope.dealPageDialogDealObject.services.length){
                            $scope.dealPageDialogDealObject.quantity= $scope.dealPageDialogDealObject.quantity+$scope.dealPageDialogDealObject.services[j].quantity;
                            j++;
                        }
                    }
                   // //console.log("$scope.dealPageDialogDealObject",$scope.dealPageDialogDealObject);
                }
                ////console.log($scope.dealPageDialogDealObject);
                $mdDialog.hide();
            }
        }

        $scope.chipRemove=function(dealSubServiceChipRemove,index){
            ////console.log("index",index)
            ////console.log("object",dealSubServiceChipRemove)
           // //console.log("$scope.dealFilterForSalons.deals.indexOf(dealSubServiceChipRemove)",$scope.dealFilterForSalons.deals)
            $scope.callDealDetailsApi($scope.dealFilterForSalons);
            /****************************************************************************************************************/


            /*------------------remove from chip part--------------------------------------start----------------*/
            /*var idx =  $scope.dealFilterForSalons.deals.indexOf(dealSubServiceChipRemove);
            //console.log(idx)
            if (idx > -1){
                alert("here")

                //$scope.chipListDealServices.push(dealObject);
                $scope.chipListDealServices.splice(idx, 1);
            }*/
            /*------------------remove from chip part-----------------------------------------stop----------------*/


            /****************************************************************************************************************/



            /*----------------making quantity in the v accordion 0 of the removed service ----------------start-----------------------*/


            for(var k=0;k<$scope.accordionDeals.length;k++) {

                for (var j = 0; j < $scope.accordionDeals[k].services.length; j++) {
                    if (dealSubServiceChipRemove.dealIdParlor == $scope.accordionDeals[k].services[j].dealIdParlor) {
                        //alert("here"+$scope.accordionDeals[k].services[j].services.length+" "+$scope.accordionDeals[k].services[j].dealType.name)
                        if(($scope.accordionDeals[k].services[j].services.length>1)&&($scope.accordionDeals[k].services[j].dealType.name!="combo")){
                            $scope.accordionDeals[k].services[j].quantity = 0;
                            for(var a=0;a<$scope.accordionDeals[k].services[j].services.length;a++){
                                if (dealSubServiceChipRemove.serviceCode == $scope.accordionDeals[k].services[j].services[a].serviceCode){
                                    $scope.accordionDeals[k].services[j].services[a].quantity=0;
                                }else{
                                    $scope.accordionDeals[k].services[j].quantity=$scope.accordionDeals[k].services[j].quantity+$scope.accordionDeals[k].services[j].services[a].quantity;
                                }
                            }
                        }else{
                            $scope.accordionDeals[k].services[j].quantity = 0;
                        }
                    }
                }
            }
            /*----------------making quantity in the v accordion 0 of the removed service ----------------stop-----------------------*/


            /****************************************************************************************************************/


            /*------------------------------Creating the object to be sent for parlor filter--------START--------------------*/

            //var tempArray=[];
            for( i = 0; i < $scope.dealFilterForSalons.deals.length; i++ ){
               // //console.log("$scope.dealFilterForSalons.deals.length",$scope.dealFilterForSalons.deals.length+"    "+dealSubServiceChipRemove.dealIdParlor)
                /*if($scope.dealFilterForSalons.deals.length==0){
                    break;
                }*/
                ////console.log("$scope.dealFilterForSalons.deals[removeIndex].dealIdParlor",$scope.dealFilterForSalons.deals[removeIndex].dealIdParlor);
                // //console.log("dealSubServiceChipRemove.dealIdParlor",dealSubServiceChipRemove.dealIdParlor);
                if(($scope.dealFilterForSalons.deals[i].dealIdParlor==dealSubServiceChipRemove.dealIdParlor)&&($scope.dealFilterForSalons.deals[i].serviceCode==dealSubServiceChipRemove.serviceCode)){
                   // //console.log("here")
                   // tempArray.push($scope.dealFilterForSalons.deals[i]);
                    $scope.dealFilterForSalons.deals.splice(i,1);
                }else{

                }
            }
           // $scope.dealFilterForSalons.deals=tempArray;
            ////console.log("Object to be sent created after removing chip",$scope.dealFilterForSalons);
            /*------------------------------Creating the object to be sent for parlor filter--------STOP--------------------*/

        }
        /*------------------dealPageDialog declaration stop-------------------------*/

        /*--------------$watch work------Starts--------------------*/

        $scope.$watch('accordionDeals', function() {
            localStorageService.set("accordionDealsRefreshObeject",$scope.accordionDeals);
            //console.log(localStorageService.get("accordionDealsRefreshObeject"))
        }, true);

        $scope.$watch('dealFilterForSalons', function() {
            localStorageService.set("dealFilterForSalonsRefreshObeject", $scope.dealFilterForSalons);

        }, true);

        /*--------------$watch work------Stops--------------------*/





        /*=====================latitude="+28.5537183+"&longitude="+77.2692391===========Common function for dealDetail Api===========Starts===========================*/
            $scope.callDealDetailsApi=function(object){

                if((object.deals.length==0)||(object.deals.length==undefined)){

                    $scope.callDefaultParlorsForDeals(object.latitude,object.longitude);
                }else{
                    ////console.log("Object to be sent to Api");
                    ////console.log(object);
                    var  data={
                        "latitude":object.latitude,
                        "longitude":object.longitude,
                        "dealIds":object.deals
                    }
                    ////console.log(data);
                    $scope.filteredSalonsArray='';
                    $http({
                        url: '/api/dealsDetail',
                        method: 'POST',
                        data:{
                            "latitude":object.latitude,
                            "longitude":object.longitude,
                            "dealIds":object.deals
                        }
                    }).then(function(response) {
                       // //console.log(response.data.data);
                        $scope.filteredSalonsArray=response.data.data;
                    });
                }



            }
        /*================================Common function for dealDetail Api===========Stops===========================*/


        /*====================================Enter function of search bar =========starts=====================*/
        $scope.filterSalonsOnEnter=function(placeObject){
           // //console.log(placeObject)
            $scope.dealFilterForSalons.latitude=placeObject.latitude;
            $scope.dealFilterForSalons.longitude=placeObject.longitude;
           // alert("here")
            if($scope.dealFilterForSalons.deals!=undefined){
               // //console.log(placeObject);
                var completePlaceObject={
                    "deals":$scope.dealFilterForSalons.deals,
                    "latitude":placeObject.latitude,
                    "longitude":placeObject.longitude,
                };
            }else if($scope.dealFilterForSalons.deals==undefined){
               // //console.log(placeObject);
                if(localStorageService.get("userDetectedLatitude")==undefined){
                    var completePlaceObject={
                        "deals":$scope.dealFilterForSalons.deals,
                        "latitude":  $scope.myPosition.latitude,
                        "longitude": $scope.myPosition.longitude
                    };
                }else{
                    var completePlaceObject={
                        "deals":$scope.dealFilterForSalons.deals,
                        "latitude":  $scope.myPosition.latitude,
                        "longitude": $scope.myPosition.longitude
                    };
                }

            }


            $scope.callDealDetailsApi(completePlaceObject);
            if($scope.dealFilterForSalons.deals.length==0){

                $scope.callDefaultParlorsForDeals(placeObject.latitude,placeObject.longitude);
            }


        }

        /*====================================Enter function of search bar =========stops=====================*/

        /*-------------------------Refresh part for user query starts--------------------------------------------*/
        if(localStorageService.get("accordionDealsRefreshObeject")!=undefined) {
            $scope.myPosition.latitude=localStorageService.get("dealFilterForSalonsRefreshObeject").latitude;
            $scope.myPosition.longitude=localStorageService.get("dealFilterForSalonsRefreshObeject").longitude;
           // alert($scope.myPosition.latitude)
            $scope.dealFilterForSalons={
                "latitude": $scope.myPosition.latitude,
                "longitude": $scope.myPosition.longitude,
                "deals":localStorageService.get("dealFilterForSalonsRefreshObeject").deals
            };

            $scope.callDealDetailsApi($scope.dealFilterForSalons);

        }

        $rootScope.myy=function(item){
            //console.log(item);
            $scope.filterSalonsOnEnter(item)
        }
        /*--------------------------Refresh part for user query stops-------------------------------------*/


        $scope.detectUserLocation=function(){
            $geolocation.getCurrentPosition({
                timeout: 60000
            }).then(function successCallback(position) {
                $scope.myPosition = position.coords;
                localStorageService.set("userDetectedLatitude", $scope.myPosition.latitude);
                localStorageService.set("userDetectedLongitude", $scope.myPosition.longitude)
                ////console.log($scope.myPosition);
                $scope.dealFilterForSalons.latitude=$scope.myPosition.latitude;
                $scope.dealFilterForSalons.longitude= $scope.myPosition.longitude;

                $scope.callDealDetailsApi($scope.dealFilterForSalons)
                $http.get('/api/search?lat='+localStorageService.get("userDetectedLatitude")+'&lng='+ localStorageService.get("userDetectedLongitude")).success(function(data){
                   // //console.log(data.data[0].formatted_address)
                   // //console.log("this is place name");
                    offerPageSearchLocation.setOfferLocation(data.data[0].formatted_address);
                   // //console.log(data.data[0].formatted_address);
                    $rootScope.setNgModel(data.data[0].formatted_address,$scope.dealFilterForSalons.latitude,$scope.dealFilterForSalons.longitude);
                   // alert("here")
                });
                //$scope.getPlaceNameFromLatLong($scope.myPosition.latitude,$scope.myPosition.longitude);

                /*$http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+localStorageService.get("userDetectedLatitude")+','+ localStorageService.get("userDetectedLongitude")+'&key=AIzaSyCUO8lvZlCuXz2wYclFI05QA5EJBwxyBUs')*/

            }, function errorCallback(position) {
                ////console.log(position)

                $scope.myPosition.latitude="28.7041";
                $scope.myPosition.longitude="77.1025";
                $scope.callDealDetailsApi($scope.dealFilterForSalons)

            });
        }

    }]);
