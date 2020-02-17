app.controller('ParlorDetailCtrl', ['$rootScope','$scope', '$http','$route','$routeParams','$location','$mdDialog','$anchorScroll','ngProgressFactory','localStorageService', '$mdpDatePicker', '$mdpTimePicker','$timeout','Service','$document','$window','salonListingSearchBoxBooleanService','mySharedService',
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
        ////console.log("this is the araay of string of url");
        ////console.log($scope.urlArray)
        var parlorDetailsOpeningLink=$scope.urlArray[$scope.urlArray.length-1];
        //alert(parlorDetailsOpeningLink)


        /*-------------------------------Refresh Work--------Starts--------------Part-1------------------------*/
      //  //console.log("this is the deals object passed from the deals page",localStorageService.get("dealFilterForSalonsRefreshObeject"));
        if(localStorageService.get('cart')!=0){
            /*alert("cart full")*/
            var calculatedCartQuantityLocalStorage=0;
            $scope.cart=localStorageService.get('cart');
            $scope.cartIds=localStorageService.get('cartIds');
            for(var i=0;i<$scope.cart.length;i++){
                calculatedCartQuantityLocalStorage=calculatedCartQuantityLocalStorage+$scope.cart[i].quantity;
            }
            localStorageService.set("cartQuantity",calculatedCartQuantityLocalStorage);
        }else{
            /*alert("cart empty")*/
            localStorageService.set("cartQuantity",0);
        }

        if(localStorageService.get("cartObjectStored")!=undefined){
            $scope.cartObject=localStorageService.get("cartObjectStored");
        }
        else{
            $scope.cartObject=[];
        }
        ////console.log("this is the required object");
       // //console.log(localStorageService.get('requiredParlorId'));
        var parlorDetailsOpening=localStorageService.get('requiredParlorId');

        var placeOfParlorId=$scope.cartObject.indexOf(parlorDetailsOpening);
        if(placeOfParlorId>-1){
            $scope.cartObject.push({"parlorId":parlorDetailsOpening})
        }

        if(localStorageService.get("cartQuantity")!=undefined){
            Service.setNumber(localStorageService.get("cartQuantity"))
            $scope.testCartNumber=Service.getNumber();
        }else{
            $scope.testCartNumber=0;
        }
        ////console.log("parlor detail");
        //
        /*-------------------------------Refresh Work---------Stops-------------Part-1------------------------*/




       /* if(localStorageService.get('requiredParlorId')==undefined){

        }else{
            alert("else")
            $scope.url="/api/parlorHome?parlorId="+parlorDetailsOpening;
            $scope.dealUrl="/api/deals?parlorId="+parlorDetailsOpening;
        }*/

        $scope.url="/api/parlorHome?parlorLink="+parlorDetailsOpeningLink;
        $scope.dealUrl="/api/deals?parlorLink="+parlorDetailsOpeningLink;


        $http.get($scope.url).then(function(response) {
            ////console.log(response.data);
            ////console.log(response.data.closingTime.replace(/:/g,''));
            ////console.log(response.data.openingTime.replace(/:/g,''));
            $scope.dummyStoreMorningTime=response.data.openingTime.replace(/:/g,'');
            $scope.dummyStoreNightTime=response.data.closingTime.replace(/:/g,'');
            $scope.progressbar.complete();
            $scope.parlor=response.data;
            $scope.headingParlorName=$scope.parlor.name;
            $scope.headingParlorAddress1=$scope.parlor.address1;
            $scope.headingParlorAddress2=$scope.parlor.address2;
            $scope.headingParlorRating=$scope.parlor.rating;
            if((localStorageService.get('requiredParlorId')==undefined)||(localStorageService.get('requiredParlorId')!=$scope.parlor.parlorId)){
                Service.setNumber(0);
                localStorageService.set("cartQuantity",undefined);
                localStorageService.set('requiredParlorId',$scope.parlor.parlorId);
                //alert($scope.parlor.parlorId)
            }else{
                $location.path('parlor-detail/'+$scope.parlor.link);
            }
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
            $scope.dealAndServiceArray=[];

            $http.get($scope.dealUrl).then(function(dataRecieved) {
                ////console.log("This is the deals object");
                ////console.log( dataRecieved.data.data);
                $scope.dealsDeparment.categories=dataRecieved.data.data;
                ////console.log("This is the deals obejct");
               // //console.log($scope.dealsDeparment);
                $scope.dealAndServiceArray.push($scope.dealsDeparment);
                for(var i=0;i<response.data.services.length;i++){
                    $scope.dealAndServiceArray.push(response.data.services[i]);
                }
                ////console.log("this is t final depts object");
               // //console.log($scope.dealAndServiceArray)

                $scope.depts=$scope.dealAndServiceArray;
                for (var i=0;i<$scope.depts.length;i++){
                    $scope.depts[i].openFlag=false;
                }
                ////console.log($scope.depts);
                $scope.catSat=[];
                var c,s=0;

               // //console.log($scope.parlor);
                $scope.depts.forEach(function(dep) {
                    dep.categories.forEach(function(cat) {
                        var serviceIdRequired=0;

                        if(dep.name=="Deals"){
                            ////console.log("hello");
                            cat.superCategory="Deals";
                        }
                        $scope.allCategories.push(cat);
                        cat.services.forEach(function(ser){
                            if(dep.name=="Deals"){

                                if(ser.dealType.name=="combo")
                                    $scope.allCombos.push(ser);
                                else if(ser.dealType.name=="frequency")
                                    $scope.allFrequencies.push(ser);
                            }else{
                                $scope.dealFilterServiceObject.push(ser);
                                $scope.quantity[ser.serviceCode]=0;
                                ser.weekDay="1";
                                if(($scope.cart.length>0)&&(localStorageService.get("cartParlorId")==(localStorageService.get("requiredParlorId")))){
                                    for(var m=0;m<$scope.cart.length;m++){
                                        if($scope.cart[m].serviceCode==ser.serviceCode){
                                           // //console.log("match",$scope.quantity[ser.serviceCode],$scope.cart[m].quantity);
                                            $scope.quantity[ser.serviceCode]=$scope.quantity[ser.serviceCode]+$scope.cart[m].quantity

                                        }
                                    }
                                }
                                var sim = {cid:c, sid:s};
                                $scope.catSat[ser.serviceCode]=(sim);
                            }
                            ser.serviceIdRequired=serviceIdRequired;
                            serviceIdRequired++;
                            s++;
                            count++;

                        });
                        c++;

                    });
                });
               // //console.log("$scope.allCategories0");
               // //console.log($scope.allCategories);
               // //console.log( $scope.dealFilterServiceObject);
               // //console.log("$scope.depts",$scope.depts)

                /* if($scope.cart.length>0){

                 for(var m=0;m<$scope.cart.length;m++){
                 // alert("here")
                 for(var i=0;i<$scope.depts.length;i++){
                 if($scope.depts[i].name!='Deals'){

                 for(var j=0;j<$scope.depts[i].categories.length;j++){
                 for(var k=0;k<$scope.depts[i].categories[j].services.length;k++){
                 if($scope.depts[i].categories[j].services[k].serviceCode==$scope.cart[m].serviceCode){
                 alert("match");
                 $scope.depts[i].categories[j].services[k].quantity=$scope.cart[m].quantity;
                 //console.log($scope.depts[i].categories[j].services[k]);
                 }
                 }
                 }
                 }
                 }
                 }

                 for(var i=0;i<$scope.cart.length;i++ ){
                 //alert($scope.cart[i].serviceCode);
                 for(var j=0;j<$scope.allCategories.length;j++){
                 if($scope.allCategories[j].superCategory!='Deals'){
                 //console.log($scope.allCategories[j].superCategory);
                 for(var k=0;k<$scope.allCategories[j].services.length;k++){
                 if($scope.allCategories[j].services[k].serviceCode==$scope.cart[i].serviceCode){
                 alert("match");
                 $scope.allCategories[j].services[k].quantity=$scope.cart[i].quantity;
                 //console.log( $scope.allCategories[j].services[k])
                 }
                 }
                 }
                 }
                 }
                 }
                 */
            });


        });




        $scope.addButton=function($event,currService,index,catID,serID,serviceOrDeal){
            ga('send', {
                hitType: 'event',
                eventCategory: 'Service added',
                eventAction: 'click',
                eventLabel: 'services'
            });
            //console.log("hello")
            $scope.checkoutErrorFlagCart=false;
           // //console.log(localStorageService.get('cartParlorId'))
            if((localStorageService.get('cartParlorId')==null)||(localStorageService.get('cart').length==0)){
                localStorageService.set('cartParlorId',localStorageService.get('requiredParlorId'));
                localStorageService.set('cartParlorLink',parlorDetailsOpeningLink);
                ////console.log("This is the cart parlor id ",localStorageService.get('cartParlorId'))
            }else if((localStorageService.get('cartParlorId')!=localStorageService.get('requiredParlorId'))&&(localStorageService.get('cart').length!=0)){
                //alert("Modal required");
                //$scope.showClearCartDialog($event,currService,index,index1);
                $scope.showClearCartDialog($event,currService,index,catID,serID,serviceOrDeal);

            }

            if((localStorageService.get('cartParlorId')==localStorageService.get('requiredParlorId'))||(localStorageService.get('cart').length==0)){
               // //console.log("currService",currService);
                ////console.log("catID",catID);
               // //console.log("serID",serID);
                if(serviceOrDeal=='deal'){

                    var flag=0;
                    if(currService.services.length==1){
                        $scope.dealFilterServiceObject.forEach(function(se){
                            if(se.serviceCode==currService.services[0].serviceCode){
                                if(se.deals.length>1)flag=1
                            }
                        })

                    }
                    if((currService.services.length>1 || flag) && (currService.dealType.name!="combo") && ( currService.dealType.name!="frequency")){

                        $scope.serv1=currService;
                        decider="add";
                        serv2=currService;
                        $scope.showDealDialog($event,currService);
                        $scope.sid=serID;
                        ////console.log("this is sid",$scope.sid)
                        $scope.cid=catID;
                    }else{
                        $scope.addService($event,currService,index,100);
                    }
                }else if(serviceOrDeal=='service'){
                    ////console.log("Inside Service");
                    if(currService.prices.length>1 || currService.prices[index].additions.length){
                        $scope.serv1=currService;
                        decider="add";
                        serv2=currService;
                        $scope.showDialog($event);
                        $scope.sid=serID;
                        //console.log("this is sid",$scope.sid)
                        $scope.cid=catID;
                    }
                    else{
                        $scope.addService($event,currService,index,100);
                    }
                }
            };


        };
        $scope.removeButton=function($event,currService,index){
            if(currService.dealPrice!=undefined){
                ////console.log("Inside Deal");
                if(currService.services.length>1 && (currService.dealType.name!="combo") && ( currService.dealType.name!="frequency")){

                    $scope.serv1=currService;
                    decider="remove";
                    serv2=currService;
                    $scope.showDealDialog($event,currService);

                }else{
                    $scope.removeService(currService,index);
                }
            }else if(currService.prices[0].price!=undefined){
                ////console.log("Inside Service");
                if(currService.prices.length>1 || currService.prices[index].additions.length){
                    decider="remove";
                    $scope.serv1=currService;
                    serv2=currService;
                    $scope.showDialog($event);
                }
                else{
                    var sid=currService.serviceCode + "100";
                    var place=$scope.cartIds.indexOf(sid);
                    if(place>-1){
                        $scope.removeService(currService,index);
                    }
                    else{
                        ////console.log($scope.cartIds);
                       // //console.log(sid);
                       // //console.log(place);
                       // //console.log("yeh chala");
                        alert("The item is not in cart");
                    }
                }
            }


        };


        function callAddService($event,ser,index,index1){
            $scope.addService($event,ser,index,index1)
        };
        function callRemoveService(ser,index,index1){
            $scope.removeService(ser,index,index1)
        };
        function getCurrServiceObj(currService, index,index1){
            var week=0;
            if(currService.weekDay!=undefined){
                week=currService.weekDay;
            }
            ////console.log(index);
           // //console.log(index1);
           // //console.log(currService);
            if(index1<50){
                var menuPrice1=0;
                var weekcal=0;
                if(currService.menuPrice){
                    menuPrice1=currService.menuPrice;
                }
                if(currService.weekDay){
                    weekcal=currService.weekDay;
                }

                return {
                    name : currService.name +'-'+ currService.prices[index].additions[0].types[index1].name ,
                    typeIndex:index1,
                    menuPrice:menuPrice1,
                    type:currService.type,
                    serviceCode:currService.serviceCode,
                    serviceId:currService.serviceId,
                    code:currService.prices[index].code,
                    additions:currService.prices[index].additions[0].types[index1].additions,
                    price : currService.prices[index].price,
                    quantity : 1,
                    weekDay:weekcal,
                    detail : currService.prices[index].name
                };
            }
            else if(index1==60){
                return {
                    name : currService.name  ,
                    serviceCode:currService.serviceCode,
                    code:currService.prices[index].code,
                    additions:0,
                    typeIndex:index1,
                    serviceId:currService.serviceId,
                    price : currService.prices[index].price,
                    quantity : 1,
                    detail : currService.prices[index].name
                };
            }
            else{
                if( currService.prices!=undefined){
                    var price1=currService.prices[0].price;
                    var type="service";
                    var menuPrice1=0;
                    var k=0;
                   // //console.log(currService);
                    if($scope.weekdayOrWeekend==0 || $scope.weekdayOrWeekend==6 ){
                        k=3;
                    }else{
                        k=2;
                    }
                    currService.deals.forEach(function(deal){
                        var dealName=deal.dealType.name;
                        if((dealName=="chooseOne" || dealName=="dealPrice") && ((deal.weekDay==1) || (deal.weekDay==k)) ){
                            ////console.log("Condition");
                            price1=deal.dealType.price;
                            type=dealName;
                            menuPrice1=deal.menuPrice;
                        }
                        else if((dealName=="chooseOnePer") && ((deal.weekDay==1) || (deal.weekDay==k)) ){
                            price1=currService.prices[0].price*(1-(deal.dealType.price/100));
                            type=dealName;
                            menuPrice1=deal.menuPrice;
                        }
                    });
                    return {
                        name : currService.name,
                        serviceCode:currService.serviceCode,
                        serviceId:currService.serviceId,
                        code:currService.prices[index].code,
                        additions:0,
                        type:type,
                        menuPrice:menuPrice1,
                        typeIndex:index1,
                        price : price1,
                        quantity : 1,
                        detail : currService.prices[index].name
                    };
                }else {
                    var sId="";
                    if(currService.dealId){
                        sId=currService.dealId;
                    }else{
                        sId=currService.serviceId;
                    }
                    return {
                        name : currService.name,
                        serviceCode:currService.services[index].serviceCode,
                        code:currService.services[index].serviceCode,
                        additions:0,
                        typeIndex:index1,
                        price : currService.dealPrice,
                        dealPrice : currService.dealPrice,
                        menuPrice : currService.menuPrice,
                        quantity : 1,
                        serviceId:sId,
                        weekDay :week,
                        type:currService.dealType.name,
                        detail : currService.services[index].name
                    };
                }

            }
        }
        $scope.addService=function($event,currService,index,index1){

            /*----------Refresh Work----Start------Part2----------*/

            //localStorageService.set('cartParlorId',undefined)

            /*----------Refresh Work----Stop------Part2----------*/
            $scope.testCartNumber++;
            /*localStorageService.set("cartQuantity",$scope.testCartNumber)*/
            localStorageService.set("cartQuantity",$scope.testCartNumber)
            Service.setNumber($scope.testCartNumber);
           // //console.log(index);
           // //console.log(currService);
            if( currService.prices!=undefined){
                if(index1<50){

                    var sid=currService.serviceCode + index.toString()+index1.toString();
                    var code=currService.serviceCode;
                }
                else{

                    var sid=currService.serviceCode.toString()+"100";
                    var code=currService.serviceCode;


                }
            }else {
                if(index1<50){

                    var sid=currService.serviceId + currService.prices[index].price.toString()+currService.prices[index].additions[0].types[index1].additions.toString();
                }
                else{
                    var sm="";
                    if(currService.dealType){
                        if(currService.dealType.name=="combo"){
                            currService.services.forEach(function(se){
                                sm+=se.serviceCode;
                            })
                            var sid=sm;
                        }else{
                            var sid=currService.services[index].serviceCode.toString()+"100";
                            var code=currService.services[0].serviceCode;
                        }

                    }else{
                        var sid=currService.services[index].serviceCode.toString()+"100";
                        var code=currService.services[index].serviceCode;
                    }



                }
            }

            var place=$scope.cartIds.indexOf(sid);
            if(place<0){
                $scope.cartIds.push(sid);
                currService.quantity=1;
               // //console.log(currService);
                if(currService.prices==undefined){
                    if(currService.dealType.name=="combo" || currService.dealType.name=="frequency"){
                        ////console.log(currService);
                        $scope.dealQuan[currService.dealIdParlor]=1;
                        //currService.name=currService.deals[0].name;
                        index=0;
                    }else{
                        $scope.quantity[code]++;
                    }
                }

                else{
                    $scope.quantity[code]++;
                }
                $scope.cart.push(getCurrServiceObj(currService, index,index1));
                ////console.log($scope.cart);

            }
            else{
                if(currService.prices==undefined){
                    if(currService.dealType.name=="combo" || currService.dealType.name=="frequency"){
                        $scope.dealQuan[currService.dealIdParlor]++;
                        index=0;
                    }
                    else{
                        $scope.quantity[code]++;
                    }
                }
                else{
                    $scope.quantity[code]++;
                }


                $scope.cart[place].quantity++;
            }
           // //console.log($scope.cartIds);
        }
        $scope.showClearCartDialog = function(ev,currService,index,catID,serID,serviceOrDeal) {
            //$scope.showClearCartDialog($event,currService,index,catID,serID,serviceOrDeal);
            $scope.continuedClearCartCurrService=currService;
            $scope.continuedClearCartIndex=index;
            $scope.continuedClearCartcatID=catID;
            $scope.continuedClearCartserID=serID;
            $scope.continuedClearCartserviceOrDeal=serviceOrDeal;
            $scope.continuedEvent=ev;

            $mdDialog.show({
                controller: clearCartController,
                templateUrl: '/website/views/clearCartDialog.html',
                scope: $scope,        // use parent scope in template
                preserveScope: true,
                parent: angular.element(document.body),
                targetEvent:ev,
                clickOutsideToClose:true,
                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            })
                .then(function(answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function() {
                    $scope.status = 'You cancelled the dialog.';
                });
        };
        function clearCartController($scope, $mdDialog) {


            $scope.hide = function () {
                $mdDialog.hide();
            };

            $scope.cancel = function () {
                $mdDialog.cancel();
            };
            $scope.takeMeBack=function(){
                localStorageService.set('requiredParlorId',localStorageService.get('cartParlorId'));
               // //console.log(localStorageService.get('requiredParlorId'));
               // alert(localStorageService.get('cartParlorLink'))
                $location.path('parlor-detail/'+localStorageService.get('cartParlorLink'));
               // $window.location.reload();
            };
            $scope.keepMeHere=function(){
                $scope.cart=[];
                $scope.cartIds=[];
                localStorageService.set('cart',0);
                localStorageService.set('cartIds',0);
                localStorageService.set("cartQuantity",0);
                $scope.testCartNumber=0;
                localStorageService.set('cartParlorId',localStorageService.get('requiredParlorId'));
                $scope.currentPathToBeChanged=$location.path();
                $scope.urlArrayToBeChanged=$scope.currentPathRequired.split('/');


                localStorageService.set('cartParlorLink',$scope.urlArrayToBeChanged[$scope.urlArrayToBeChanged.length-1]);
                // $scope.addService($scope.continuedEvent, $scope.continuedClearCartCurrService, $scope.continuedClearCartIndex,$scope.continuedClearCartIndex1)
                $scope.addButton($scope.continuedEvent, $scope.continuedClearCartCurrService, $scope.continuedClearCartIndex,$scope.continuedClearCartcatID,$scope.continuedClearCartserID,$scope.continuedClearCartserviceOrDeal)

                $scope.hide();
            }
        };


        $scope.removeService=function(currService,index,index1){
            if($scope.testCartNumber>0){
                $scope.testCartNumber--;
                localStorageService.set("cartQuantity",$scope.testCartNumber)
                Service.setNumber($scope.testCartNumber);
            }
            // alert(Service.getNumber());
           // //console.log(currService);
           // //console.log(index);
            if( currService.prices!=undefined){
                if(index1<50){
                    var sid=currService.serviceCode + index.toString()+index1.toString();
                }
                else{
                    var sid=currService.serviceCode + "100";
                }
            }else{
                var sm="";
                if(currService.dealType){
                    if(currService.dealType.name=="combo"){
                        currService.services.forEach(function(se){
                            sm+=se.serviceCode;
                        })
                        var sid=sm;
                    }else{
                        var sid=currService.services[index].serviceCode.toString()+"100";
                    }

                }else{
                    var sid=currService.services[index].serviceCode.toString()+"100";
                }

            }

            var place=$scope.cartIds.indexOf(sid);
           // //console.log(place);
            if(place<0){
                alert("The item is not in cart");
            }
            else{
               // //console.log("minus mai pahuch gaya");
                $scope.cart[place].quantity--;
                if(currService.prices==undefined){
                    if(currService.dealType.name=="combo" || currService.dealType.name=="frequency"){
                        $scope.dealQuan[currService.dealIdParlor]--;
                    }else{
                        $scope.quantity[$scope.cart[place].serviceCode]--;
                    }
                }
                else{
                    $scope.quantity[$scope.cart[place].serviceCode]--;
                }
                ////console.log($scope.cart[place]);


                var quan=$scope.cart[place].quantity;
                if(!quan){
                    $scope.cart.splice(place, 1);
                    $scope.cartIds.splice(place, 1);

                };
            }
        };
        $scope.cartAddButton=function(index){
            $scope.testCartNumber++;
            localStorageService.set("cartQuantity",$scope.testCartNumber)
            Service.setNumber($scope.testCartNumber);
            //  alert(Service.getNumber());
            $scope.cart[index].quantity++;
            $scope.quantity[$scope.cart[index].serviceCode]++;
            $scope.allCategories[c1].services[s1].quantity++;


            //$scope.allCategories[c1].services[s1].quantity++;

        };
        $scope.cartRemoveButton=function(index){
            if($scope.testCartNumber>0){
                $scope.testCartNumber--;
                localStorageService.set("cartQuantity",$scope.testCartNumber)
                Service.setNumber($scope.testCartNumber);
            }
            localStorageService.set("cartQuantity",$scope.testCartNumber)
            Service.setNumber($scope.testCartNumber);
            // alert(Service.getNumber());
            $scope.cart[index].quantity--;
            $scope.quantity[$scope.cart[index].serviceCode]--;
            //$scope.allCategories[c1].services[s1].quantity--;
            var quan=$scope.cart[index].quantity;
            if(!quan){
               // //console.log("chala");
                $scope.cart.splice(index, 1);
                $scope.cartIds.splice(index, 1);
                ids.splice(index, 1);
            };
        };
        $scope.accordionCount=0;
        $scope.showDialog = function(ev) {
            $scope.accordionCount++;
            $scope.dialog1Event=ev;

            $mdDialog.show({
                controller: DialogController,
                templateUrl: '/website/views/dialog1.html',
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
        function DialogController($scope, $mdDialog) {
            $scope.meraPrice=undefined;
            $scope.serv1=serv2;
            $scope.in1=undefined;
            $scope.in2=undefined;
            $scope.in3=undefined;

            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.priceFunction=function(index,ser){
                $scope.in3=index;
                if(ser.prices[0].additions[0].name=='Length'){
                    $scope.accordionCount.toggle(1)
                }else{
                    $scope.accordionCount.toggle(2)
                }

                if(ser.prices[0].additions.length){
                    if(ser.prices[0].additions[0].name=='Length'){
                        $scope.disableFilter=false;
                    }
                }
                else{
                    $scope.in1=60;
                }
            };
            $scope.thickFunction=function(index){
                if(index==0){
                    $scope.in2="Normal";
                }
                else{
                    $scope.in2="Thick";
                }
                $scope.accordionCount.toggle(2);
            };
            $scope.checkPrice = function(currService,dealServicePI,dealServiceTI,index2) {
                $scope.index3=dealServiceTI;
                if(index2=="Thick"){
                    dealServiceTI=dealServiceTI+5;
                    $scope.index3=dealServiceTI;
                }
                var dealName="";
                ////console.log(currService);
                currService.options=[];
                if(currService.deals.length){
                    var dealName="";
                    currService.deals.forEach(function(deal){

                        if((deal.dealType.name=="chooseOne" || deal.dealType.name=="dealPrice" || deal.dealType.name=="chooseOnePer") ){
                            dealName=deal.dealType.name;
                            $scope.displayDealPrice1=deal;
                        }
                    });
                   // //console.log(currService);
                    if((dealName=="chooseOne" || dealName=="dealPrice") ){

                        if(currService.prices[dealServicePI].additions[0].types[dealServiceTI].additions+currService.prices[dealServicePI].price>$scope.displayDealPrice1.dealType.price){

                            $scope.meraPrice=$scope.displayDealPrice1.dealType.price ;
                        }
                        else{
                            $scope.meraPrice=0 ;
                        }

                    }
                    else if(dealName=="chooseOnePer"){
                        $scope.meraPrice =(($scope.subServices.prices[index].price+$scope.currService.additions)*$scope.deals[ins[i]].dealType.price)/100;


                    }
                    currService.deals.forEach(function(deal){
                        if(deal.dealType.name=="combo" ){
                            var message="Add ";
                            message+=deal.name+" for Rs " +(deal.dealType.price-$scope.meraPrice)+" only.";
                            deal.message=message;
                            currService.options.push(deal);
                        }else if(deal.dealType.name=="frequency"){
                            var message="Add " +deal.dealType.frequencyRequired+" ";
                            message+=deal.name+" for Rs " +(deal.dealType.price-$scope.meraPrice)+" only.";
                            deal.message=message;
                            currService.options.push(deal);
                        }
                    });


                }
            };
            $scope.addCombo=function($event,currService,index,catID,serID,serviceOrDeal,type,in1){
                var s1=angular.copy(currService);
                ////console.log(currService);
                var x=s1.options[index];
                s1.deals=[];
                s1.deals[0]=x;
                delete s1.prices;
                $scope.dealsDeparment.categories.forEach(function(cat){
                    cat.services.forEach(function(deal){
                        if(deal.dealId==s1.deals[0].dealId){
                            s1.services=deal.services;
                            s1.dealIdParlor=deal.dealIdParlor;
                        }
                    })
                })
                ////console.log(s1);
                s1.name=s1.deals[0].name;
                if(type=="combo"){
                    ////console.log(s1);
                    s1.dealType=s1.deals[0].dealType;
                    s1.menuPrice=s1.deals[0].menuPrice;
                    s1.dealPrice=s1.deals[0].dealType.price;
                }else if(type=="frequency"){
                    s1.dealId=s1.deals[0].dealId;
                    s1.dealType=s1.deals[0].dealType;
                    s1.menuPrice=s1.deals[0].menuPrice;
                    s1.dealPrice=s1.deals[0].dealType.price;
                }

                $scope.addButton($event,s1,index,catID,serID,serviceOrDeal);
                $mdDialog.hide();
            }


            $scope.additionFunction=function(index){
                $scope.in1=index;
            };
            $scope.selectPrice = function(currService,dealServicePI,dealServiceTI,index2) {
                if(index2=="Thick"){
                    dealServiceTI=dealServiceTI+5;
                }
                var dealName="";
                var se1=angular.copy(currService);
               // //console.log(currService);
                ////console.log(dealServiceTI);
                if(currService.deals.length){
                    var dealName="";
                    currService.deals.forEach(function(deal){

                        if((deal.dealType.name=="chooseOne" || deal.dealType.name=="dealPrice" || deal.dealType.name=="chooseOnePer")){
                            dealName=deal.dealType.name;
                            $scope.displayDealPrice1=deal;
                        }
                    });
                   // //console.log(currService);
                    if((dealName=="chooseOne" || dealName=="dealPrice") ){
                        if(currService.prices[dealServicePI].additions[0].types[dealServiceTI].additions+currService.prices[dealServicePI].price>$scope.displayDealPrice1.dealType.price){
                            se1.menuPrice =currService.prices[dealServicePI].additions[0].types[dealServiceTI].additions+currService.prices[dealServicePI].price;
                            se1.prices[dealServicePI].price =$scope.displayDealPrice1.dealType.price ;
                            se1.prices[dealServicePI].additions[0].types[dealServiceTI].additions=0;
                            se1.serviceId = $scope.displayDealPrice1.dealId;
                        }
                    }
                    else if(dealName=="chooseOnePer" ){
                        se1.menuPrice =$scope.subServices.prices[index].price
                        se1.price =$scope.subServices.prices[index].price*(1-($scope.displayDealPrice1.dealType.price)/100);
                        se1.additions =currService.prices[dealServicePI].additions[0].types[dealServiceTI].additions*(1-($scope.displayDealPrice1.dealType.price)/100);
                        se1.type=dealName;
                        se1.serviceId = $scope.displayDealPrice1.dealId;
                    }

                }
                se1.type=dealName;
                if(decider=="add"){
                   // //console.log(se1);
                    callAddService( $scope.dialog1Event,se1,dealServicePI,dealServiceTI);
                    $mdDialog.hide();
                }
                else{
                    callRemoveService(se1,dealServicePI,dealServiceTI);
                    $mdDialog.hide();
                }

                $mdDialog.hide();
            };

        }


        /*---------------------------------Deal Dialogue start-------------------------------------------*/
        $scope.showDealDialog = function(ev,currService) {
            $scope.radioNameDealService="";
            $scope.additionsServicePrice="";
            $scope.displayDealPrice=currService;
            $scope.filteredDealServiceArray=[];
            $scope.dealDialogEvent=ev;
            ////console.log("currService",currService);
            ////console.log("$scope.dealFilterServiceObject",$scope.dealFilterServiceObject);
            for(var i=0;i<currService.services.length;i++){
                for(var j=0;j<$scope.dealFilterServiceObject.length;j++){
                    // //console.log($scope.dealFilterServiceObject[j].prices);
                    if(currService.services[i].serviceCode==$scope.dealFilterServiceObject[j].serviceCode){
                        var s=angular.copy($scope.dealFilterServiceObject[j]);
                        s.options=[];
                        ////console.log(s);
                        for(var k=0;k<s.deals.length;k++){
                            ////console.log(s.deals[k]);
                            ////console.log(currService);
                            if(s.deals[k].dealId==currService.dealId){
                                var tl=0;
                                if($scope.dealFilterServiceObject[j].prices[0].additions.length){
                                    var tl1=$scope.dealFilterServiceObject[j].prices[0].additions[0].types.length-1;
                                  //  //console.log(tl1);
                                    tl=$scope.dealFilterServiceObject[j].prices[0].additions[0].types[tl1].additions;
                                   // //console.log(tl);
                                }
                                if(s.deals[k].dealType.name=="chooseOnePer"){
                                    s.menuPrice=$scope.dealFilterServiceObject[j].prices[0].price+tl;
                                    s.serviceId=s.deals[k].dealId;

                                    s.dealPrice=$scope.dealFilterServiceObject[j].prices[0].price*(1-(s.deals[k].dealType.price/100));
                                }else if(s.deals[k].dealType.name=="chooseOne"   || s.deals[k].dealType.name=="dealPrice"){
                                    s.menuPrice=$scope.dealFilterServiceObject[j].prices[0].price+tl;
                                    s.dealPrice=s.deals[k].dealType.price;
                                    s.serviceId=s.deals[k].dealId;
                                    //console.log(s.dealPrice);

                                   // //console.log("sadsad");
                                }
                            }
                        }
                        for(var k=0;k<s.deals.length;k++){
                            if(s.deals[k].dealType.name=="combo" || s.deals[k].dealType.name=="frequency"){
                                var message="Add a ";
                                $scope.dealsDeparment.categories.forEach(function(cat){
                                    cat.services.forEach(function(serv){
                                        if(serv.dealId==s.deals[k].dealId){
                                            serv.services.forEach(function(dealService){
                                                if(dealService.serviceCode!=s.serviceCode){
                                                    ////console.log(s.dealPrice);
                                                   // //console.log(s);

                                                    ////console.log(serv.dealType.price);
                                                    message+=dealService.name+" for Rs " +(serv.dealType.price-s.dealPrice)+" only.";
                                                    s.deals[k].message=message;
                                                    s.options.push(s.deals[k]);
                                                }
                                            });

                                        }
                                    });
                                });

                            }
                        }
                        ////console.log(s);
                        ////console.log($scope.dealFilterServiceObject[j]);
                        $scope.filteredDealServiceArray.push(s);
                        ////console.log($scope.filteredDealServiceArray);

                    }

                }
            };
            ////console.log($scope.filteredDealServiceArray);
            ////console.log("$scope.filteredDealServiceArray",$scope.filteredDealServiceArray);
            $mdDialog.show({
                controller: dealDialogController,
                templateUrl: '/website/views/dealDialog.html',
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
        function dealDialogController($scope, $mdDialog) {
            //$scope.serv1=serv2;
            $scope.dealServicesAdditionsNames=[];
            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.cancel = function() {
                $mdDialog.cancel();
            };
            $scope.addCombo=function($event,currService,index,catID,serID,serviceOrDeal){
                var s1=angular.copy(currService);
                ////console.log(currService);
                var x=s1.options[index];
                s1.deals=[];
                s1.deals[0]=x;
                delete s1.prices;
                $scope.dealsDeparment.categories.forEach(function(cat){
                    cat.services.forEach(function(deal){
                        if(deal.dealId==s1.deals[0].dealId){
                            s1.services=deal.services;
                            s1.dealIdParlor=deal.dealIdParlor;
                        }
                    })
                })
               // //console.log(s1);
                s1.name=s1.deals[0].name;
                s1.serviceId=s1.deals[0].dealId;
                s1.menuPrice=s1.deals[0].menuPrice;
                s1.dealType=s1.deals[0].dealType;
                s1.dealPrice=s1.deals[0].dealType.price;
                $scope.addButton($event,s1,index,catID,serID,serviceOrDeal);
                $mdDialog.hide();
            }
            $scope.dealServicePI=0;
            $scope.serviceSelected=function(currService,dealServicePI,dealServiceTI){
                ////console.log(currService);
                var dealName=$scope.displayDealPrice.dealType.name;
                if((dealName=="chooseOne" || dealName=="dealPrice") ){
                    ////console.log(currService.prices[dealServicePI]);

                    currService.prices[dealServicePI].price =$scope.displayDealPrice.dealType.price ;
                    currService.prices[dealServicePI].additions[0]=0;
                    currService.serviceId = $scope.displayDealPrice.dealId;

                    currService.type=dealName;
                }
                else if(dealName=="chooseOnePer" ){
                    currService.prices[dealServicePI].price =currService.prices[dealServicePI].price*(1-($scope.displayDealPrice.dealType.price/100));
                    if(currService.prices[dealServicePI].additions.length)
                        currService.additions =currService.prices[dealServicePI].additions[0].types[dealServiceTI].additions*(1-($scope.displayDealPrice.dealType.price))/100

                    currService.type=dealName;
                    currService.serviceId = $scope.displayDealPrice.dealId;
                }
                else if((dealName=="combo") ){
                    var curComboIds=[];
                    $scope.deals[ins[i]].services.forEach(function(element){
                        curComboIds.push(element.serviceCode);

                    });
                    var con=1;
                    for(var k=0;k<curComboIds.length;k++){
                        var x=$scope.cartIds.indexOf(curComboIds[k]);
                        if(x<0){
                            con=0;
                        }
                    }
                    if(con){
                        $scope.combos.push($scope.deals[ins[i]]);
                        $scope.currService.type=dealName;
                    }
                }
                else if((dealName=="frequency") ){

                }

                $mdDialog.hide();
                currService.type=dealName;
                if(decider=="add"){
                   // //console.log(currService);
                    callAddService( $scope.dealDialogEvent,currService,dealServicePI,dealServiceTI);
                }
                else{
                    callRemoveService(currService,dealServicePI,dealServiceTI);
                }
            };

        }




        /*------------------------------Deal Dialogue Stop--------------------------------*/
        $scope.gotoAnchor = function(id) {
            var newHash = id;
            if ($location.hash() !== newHash) {
                // set the $location.hash to `newHash` and
                // $anchorScroll will automatically scroll to it
                $location.hash(id);
            } else {
                // call $anchorScroll() explicitly,
                // since $location.hash hasn't changed
                $anchorScroll();
            }
        };

        $scope.genderFilter=function(ge){
            $scope.gend=ge;
            ////console.log(ge);
        };
        $scope.expandCallback = function (index) {
            if(index==0){
                $scope.one=true;
                $scope.two=false;
                $scope.three-false;
            }
            else if(index==1){
                $scope.one=false;
                $scope.two=true;
                $scope.three-false;
            }
            else if(index==2){
                $scope.one=false;
                $scope.two=false;
                $scope.three=true;
            }
        };

        $scope.currentDateGenerated = new Date();
        $scope.appTime=new Date();
        if(localStorageService.get('currentDateStored')!=undefined){
            $scope.currentDate=new Date(localStorageService.get('currentDateStored'));

            if($scope.currentDate=='Invalid Date'){
                $scope.currentDate="BOOKING DATE";
            }

        }else{
            $scope.currentDate="BOOKING DATE";
        }

        $scope.currentTime="BOOKING TIME";
        if(localStorageService.get('previousdayWeekendWeekday')!=undefined){
            $scope.weekdayOrWeekend=localStorageService.get('previousdayWeekendWeekday');
        }else{

            $scope.weekdayOrWeekend='10';
        }
        $scope.containsWeekdayWeekend = function(expected, actual){
            // //console.log("actual",actual);
            //onsole.log("expected",expected);
            return actual.indexOf(expected) > -1;
        };

        $scope.showDatePicker = function(ev,currService,index,catID,serID,serviceOrDeal) {
            if($scope.currentTime!="BOOKING TIME"){
                $scope.currentTime="BOOKING TIME"
            }
            $scope.checkoutErrorFlagBooking=false;
            $scope.currServiceUndefinedFlag=false;
            $scope.previousDayCheckVariable= $scope.weekdayOrWeekend;
            if((currService==undefined)) {
                var currService={};
                currService.name='First Time Selection';
                //alert($scope.weekdayOrWeekend);
                localStorageService.set('previousdayWeekendWeekday',$scope.weekdayOrWeekend);
                if((localStorageService.get('previousdayWeekendWeekday')==0)||(localStorageService.get('previousdayWeekendWeekday')==6)){
                    currService.weekDay=0;
                }else{
                    currService.weekDay=3;
                }
                if($scope.cart.length>0){
                    $scope.currServiceUndefinedFlag=false;
                }else{
                    $scope.currServiceUndefinedFlag=true;
                }

            }

            /*The above code is written to handle weekdays and weekends
             * currServiceUndefinedFlag helps in identifying wether the date is selected from cart direct or on plus sign.
             * in the combination with that cart length loop is made to check if after the date is selected directly without clicking the plus sign
             * when user selects some service different from the day selected (week or weekend) on plus sign a pop up comes out which
             * comes from the code where kaan is written .
             * */
            $mdpDatePicker($scope.currentDateGenerated , {
                targetEvent: ev,
                minDate:$scope.currentDateGenerated,
            }).then(function(selectedDate) {
                //alert(selectedDate.getDay())

                if(($scope.previousDayCheckVariable==0)||($scope.previousDayCheckVariable==6)){
                    $scope.userPreviousSelectedTo='weekend';
                }else
                if(($scope.previousDayCheckVariable==1)||($scope.previousDayCheckVariable==2)||($scope.previousDayCheckVariable==3)||($scope.previousDayCheckVariable==4)||($scope.previousDayCheckVariable==5)) {
                    $scope.userPreviousSelectedTo='weekday'
                }

                if(((selectedDate.getDay()==6)||(selectedDate.getDay()==0))&&((currService.weekDay==2))&&($scope.currentDate=='BOOKING DATE')&&(currService.name!='First Time Selection')){
                    $scope.serviceNotForThisDayDialog(ev);
                    //alert("bhagg jaa");
                }else if(((selectedDate.getDay()!=6)&&(selectedDate.getDay()!=0))&&((currService.weekDay==3))&&($scope.currentDate=='BOOKING DATE')&&(currService.name!='First Time Selection')){
                    $scope.serviceNotForThisDayDialog(ev);
                    //alert("bhagg jaa returns");


                    /*
                     * The above loops helps in finding out if a person selects a service
                     * which is available on weekday but he tries to avail that on weekend
                     * so a pop up serviceNotForThisDayDialog opens to indicate him
                     * */


                } else{
                    $scope.currentDate = selectedDate;

                    // alert($scope.currentDateGenerated.toLocaleString())
                    ////console.log(selectedDate);
                    $scope.appTime.setDate(selectedDate.getDate());
                    $scope.appTime.setMonth(selectedDate.getMonth());
                    $scope.appTime.setFullYear(selectedDate.getFullYear());
                    $scope.weekdayOrWeekend=selectedDate.getDay();

                    /*======================================Weekday Weekend Decisions==============Start==============================*/
                    if(($scope.weekdayOrWeekend==6)||($scope.weekdayOrWeekend==0)){

                        $scope.selectedDay = "1, 3";



                        //$scope.weekdayOrWeekend='1||3';
                        ////console.log($scope.weekdayOrWeekend);
                    }else{
                        $scope.selectedDay = "1, 2";
                        ////console.log($scope.weekdayOrWeekend);
                    }// this is a loop used to filter weekdays and weekends in ng repeat with an added function name containsWeekdayWeekend

                    if((selectedDate.getDay()==0)||(selectedDate.getDay()==6)){
                        $scope.userCurrentlySelectedTo='weekend';
                    }else
                    if((selectedDate.getDay()==1)||(selectedDate.getDay()==2)||(selectedDate.getDay()==3)||(selectedDate.getDay()==4)||(selectedDate.getDay()==5)) {
                        $scope.userCurrentlySelectedTo='weekday'
                    }
                    // alert($scope.currServiceUndefinedFlag)

                    if((($scope.userPreviousSelectedTo=='weekend')&&($scope.userCurrentlySelectedTo=='weekday'))&&(($scope.currServiceUndefinedFlag==false))){
                        //alert("weekend to weekday kaand")
                        var dealsToBeRemoved=[];
                        var y=0;
                        for(var i=0;i<$scope.cart.length;i++){
                            if($scope.cart[i].type!="service"){
                                if($scope.cart[i].weekDay==3){
                                    dealsToBeRemoved.push($scope.cart[i]);

                                    if($scope.cart[i].type!="combo"){
                                        $scope.quantity[$scope.cart[i].serviceCode]=0;
                                    }else{
                                        $scope.dealQuan[$scope.cart[i].dealIdParlor]=0;
                                    }
                                    $scope.cart.splice(i,1);
                                    //currService.name=currService.deals[0].name;
                                    index=0;
                                    y++;
                                }
                                if(y==1)
                                {
                                    $scope.weekendToWeekdayDialog(ev);
                                }
                            }
                        }
                       // //console.log(dealsToBeRemoved);
                    }else if((($scope.userPreviousSelectedTo=='weekday')&&($scope.userCurrentlySelectedTo=='weekend'))&&(($scope.currServiceUndefinedFlag==false))){

                        // alert("weekday to weekend kaand");
                        var dealsToBeRemoved=[];
                        var x=0;
                        for(var i=0;i<$scope.cart.length;i++){
                            if($scope.cart[i].type!="service"){
                                if($scope.cart[i].weekDay==2){
                                    dealsToBeRemoved.push($scope.cart[i]);

                                    if($scope.cart[i].type!="combo"){
                                        $scope.quantity[$scope.cart[i].serviceCode]=0;
                                    }else{
                                        $scope.dealQuan[$scope.cart[i].dealIdParlor]=0;
                                    }
                                    $scope.cart.splice(i,1);
                                    x++;
                                }
                                if(x==1)
                                {
                                    $scope.weekdayToWeekendDialog(ev);
                                }
                            }

                        }
                       // //console.log(dealsToBeRemoved);
                    }
                    /*
                     * The above loops are made to find out if a user if selected some services on weekday
                     *  selects weekend then it makes the cart empty
                     * and tells him about it
                     * this has two pop ups weekendToWeekdayDialog and weekdayToWeekendDialog
                     * */
                    /*======================================Weekday Weekend Decisions==============Stops==============================*/
                    $scope.bookingTimeButtonFlag=false;
                   // //console.log(dealsToBeRemoved);
                    /*if((currService==undefined)) {
                     if(($scope.cartEmptyCheckWeekdayWeekend==0)||($scope.cartEmptyCheckWeekdayWeekend==6)){
                     if($scope.cartEmptyCheckWeekdayWeekend==$scope.weekdayOrWeekend){
                     //console.log('nothing');
                     }else{
                     $scope.currentDate = selectedDate;
                     $scope.cart=[];
                     $scope.cartIds=[];
                     }
                     }
                     }*/
                   // //console.log(dealsToBeRemoved);
                   // //console.log("jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj",currService)
                    if( ($scope.currentDate!="BOOKING DATE")&&(currService!=undefined)&&(catID!=undefined)){
                        $scope.addButton(ev,currService,index,catID,serID,serviceOrDeal)

                        /*
                         * This loop is called when user selects 1) addbutton and 2) direct date selection
                         * but it reaches here only when a date is selected
                         * thus this function is called once because the addbutton has two functions which are called on the condional basis
                         * which can be seen in the code itself
                         * */
                    }

                }


            });
        };
        $scope.serviceNotForThisDayDialog = function(ev) {

            $mdDialog.show({
                controller: serviceNotForThisDayController,
                templateUrl: '/website/views/serviceNotForThisDay.html',
                scope: $scope,        // use parent scope in template
                preserveScope: true,
                parent: angular.element(document.body),
                targetEvent:ev,
                clickOutsideToClose:true,
                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            })
                .then(function(answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function() {
                    $scope.status = 'You cancelled the dialog.';
                });
        };
        function serviceNotForThisDayController($scope, $mdDialog) {
            $scope.hide = function() {
                $mdDialog.hide();

            };

            $scope.close=function(){
                $scope.hide();
            }
        };


        $scope.weekdayToWeekendDialog = function(ev) {

            $mdDialog.show({
                controller: weekdayToWeekendController,
                templateUrl: '/website/views/weekdayToWeekendSwitching.html',
                scope: $scope,        // use parent scope in template
                preserveScope: true,
                parent: angular.element(document.body),
                targetEvent:ev,
                clickOutsideToClose:true,
                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            })
                .then(function(answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function() {
                    $scope.status = 'You cancelled the dialog.';
                });
        };
        function weekdayToWeekendController($scope, $mdDialog) {
            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.close=function(){
                $scope.hide();
            }
        };


        $scope.weekendToWeekdayDialog = function(ev) {

            $mdDialog.show({
                controller: weekendToWeekdayController,
                templateUrl: '/website/views/weekendToWeekdaySwitching.html',
                scope: $scope,        // use parent scope in template
                preserveScope: true,
                parent: angular.element(document.body),
                targetEvent:ev,
                clickOutsideToClose:true,
                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            })
                .then(function(answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function() {
                    $scope.status = 'You cancelled the dialog.';
                });
        };
        function weekendToWeekdayController($scope, $mdDialog) {
            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.close=function(){
                $scope.hide();
            }
        };



        $scope.checkString1="1234";
        $scope.checkstring2="2135";
        ////console.log( $scope.dummyStoreMorningTime);
       // //console.log( $scope.dummyStoreNightTime);
        parseInt($scope.checkstring2);

        ////console.log(typeof parseInt($scope.checkString1));

        /* $scope.dummyStoreMorningTime="09:59";
         $scope.dummyStoreNightTime="20:00";*/


        /*$scope.dummyStoreMorningTime=response.data.openingTime.replace(/:/g,'');
        $scope.dummyStoreNightTime=response.data.closingTime.replace(/:/g,'');

        these are the variables used for initialising the opening and closing time*/

        $scope.showTimePicker = function(ev) {
            var currentStoreTime="";
            var currentCheckTime="";
            $scope.checkoutErrorFlagBooking=false;
            $mdpTimePicker($scope.currentTime, {
                targetEvent: ev
            }).then(function(selectedDate) {
                $scope.currentTime = selectedDate;

               // //console.log(selectedDate);
                if(selectedDate.getMinutes()<10){
                    var checkStoreTime=selectedDate.getHours()+""+"0"+selectedDate.getMinutes();
                   // //console.log("if selectedDate.getMinutes()<10"+checkStoreTime);

                }
                else{
                    var checkStoreTime=selectedDate.getHours()+""+selectedDate.getMinutes();
                    ////console.log("if selectedDate.getMinutes()>>>>>>>10 "+checkStoreTime);
                }
                currentStoreTime= $scope.currentDateGenerated;
                if(currentStoreTime.getMinutes()<10){
                    currentCheckTime=(parseInt(currentStoreTime.getHours())+1)+""+"0"+currentStoreTime.getMinutes();

                }
                else{
                    currentCheckTime=(parseInt(currentStoreTime.getHours())+1)+""+currentStoreTime.getMinutes();
                }



                ////console.log("currentCheckTime"+currentCheckTime);
                ////console.log("$scope.currentDate.toLocaleDateString()"+$scope.currentDate.toLocaleDateString());
                ////console.log("currentStoreTime.toLocaleDateString()"+currentStoreTime.toLocaleDateString());
               // //console.log("$scope.dummyStoreMorningTime"+$scope.dummyStoreMorningTime);
               // //console.log("$scope.dummyStoreNightTime"+$scope.dummyStoreNightTime);
                if($scope.currentDate.toLocaleDateString()==currentStoreTime.toLocaleDateString()){
                    if((parseInt($scope.dummyStoreMorningTime)<=parseInt(checkStoreTime))&&(parseInt($scope.dummyStoreNightTime)>parseInt(checkStoreTime))&&(parseInt(checkStoreTime)>parseInt(currentCheckTime))){
                        // alert("time is perfect ");
                        $scope.incorrectTimeOrDateFlag=false;
                    }else{
                        $scope.currentTime="BOOKING TIME";
                        $scope.incorrectTimeOrDateFlag=true;
                        //// alert("not perfect")
                    }
                }else{
                    // alert("select any")
                   // //console.log(parseInt($scope.dummyStoreMorningTime));
                    ////console.log(parseInt(checkStoreTime));
                    if((parseInt($scope.dummyStoreMorningTime)<=parseInt(checkStoreTime))&&(parseInt($scope.dummyStoreNightTime)>parseInt(checkStoreTime))){
                        $scope.incorrectTimeOrDateFlag=false;
                    }else{
                        $scope.incorrectTimeOrDateFlag=true;
                        $scope.currentTime="BOOKING TIME";


                    }
                }

                $scope.appTime.setHours(selectedDate.getHours());

                $scope.appTime.setMinutes(selectedDate.getMinutes());
                ////console.log($scope.appTime);
            });

            ga('send', {
                hitType: 'event',
                eventCategory: 'time',
                eventAction: 'click',
                eventLabel: 'time'
            });
        };
        $scope.submitAppt=function(){
            ////console.log($scope.appTime);
            ////console.log($scope.cart);
            $scope.appt.datetime=$scope.appTime;
            localStorageService.set('dateTime',$scope.appt.datetime);
            $scope.appt.services=$scope.cart;
            $scope.appt.userId=localStorageService.get("userId");
            $scope.appt.parlorId=$scope.parlor.parlorId;
            $scope.appt.accessToken=localStorageService.get('accessToken');
            localStorageService.set("appt", $scope.appt);
           // //console.log(" localStorageService.set $scope.appt ",$scope.appt);
            ////console.log($scope.appt);
           // //console.log("localStorageService.get('lullFlag') "+localStorageService.get("lullFlag"))
            if((localStorageService.get("accessToken")!=undefined)&&((localStorageService.get("accessToken")!=null))&&(localStorageService.get("accessToken")!='')){
                $location.path('/checkoutPage');

            }
        };

        $scope.$watch('cart', function() {

            $scope.selectedCombos=[];
            /* if(localStorageService.get('cart')!=undefined){

             }else{
             alert("cart is empty");
             }*/

            localStorageService.set('cart',$scope.cart);
            localStorageService.set('cartIds', $scope.cartIds);


            ////console.log(localStorageService.get('cart'));
            if($scope.cart.length>2){
                var cartElementCaptured= (angular.element(document.getElementById("cartScrollBarStyle")));
                cartElementCaptured.css('overflow-y',"scroll");
                cartElementCaptured.css('overflow-x',"hidden");
            }else{
                var cartElementCaptured= (angular.element(document.getElementById("cartScrollBarStyle")));
                cartElementCaptured.css('overflowY',"hidden");
            }
            ////console.log($scope.allCombos);

           // //console.log(localStorageService.get('cart'));
            localStorageService.set('currentDateStored',$scope.currentDate);
            localStorageService.set('previousdayWeekendWeekday',$scope.weekdayOrWeekend);

        }, true);
        $scope.$watch('currentDate', function() {
            localStorageService.set('currentDateStored',$scope.currentDate);
        }, true);

        $scope.addCombo=function(currService,index){
            ////console.log(currService);
        }
        $scope.goToCheckOutPage=function(ev){
            ga('send', {
                hitType: 'event',
                eventCategory: 'Checkout',
                eventAction: 'click',
                eventLabel: 'chekoutdone'
            });
            //alert("weekends price will be different"+$scope.weekdayOrWeekend);
            if((localStorageService.get('cart').length!=0)&&($scope.currentTime!="BOOKING TIME")&&($scope.currentDate!="BOOKING DATE")){
                var i=0;
                while(i<$scope.cart.length){
                   // //console.log($scope.cart[i].weekDay)
                    if((($scope.weekdayOrWeekend==6)||($scope.weekdayOrWeekend==0))&&($scope.cart[i].weekDay==0)){
                        //alert("weekends price will be different");
                        $mdDialog.show({
                            controller: weekdayWeekendDialogController,
                            templateUrl: '/website/views/weekdayWeekendDiaolog.html',
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
                        if($scope.openWeekendDialogFlag){


                        }
                       // //console.log("its Weekend",$scope.cart);
                        $scope.openWeekendDialogFlag=true;
                        break;
                    }else{
                       // //console.log("its Weekday",$scope.cart);
                        if(localStorageService.get('userId')==null){ //this is called if user is not signed in
                            //localStorageService.set("lullFlag",true);  //it is used  to check if their is a need to open login or not
                            $scope.submitAppt(); //it is just called to make the appt object to be set in he localstorage
                            mySharedService.broadcastItem();
                            //$window.location.reload();
                        }else{
                           // localStorageService.set("lullFlag",false);
                            $scope.submitAppt(); //this is called if user is already signed in
                        }
                        break;
                    }
                    i++;
                }


            }
            else{
                if(localStorageService.get('cart').length==0){
                    $scope.checkoutErrorFlagCart=true;
                    $scope.checkoutErrorFlagBooking=false;
                }else if(($scope.currentTime=="BOOKING TIME")||($scope.currentDate=="BOOKING DATE")){
                    $scope.checkoutErrorFlagBooking=true;
                    $scope.checkoutErrorFlagCart=false;
                }
                //alert("Please check your enteries");

            }


            /* var i=0;
             while(i<$scope.cart.length){
             //console.log($scope.cart[i].weekDay)
             if((($scope.weekdayOrWeekend==6)||($scope.weekdayOrWeekend==0))&&($scope.cart[i].weekDay==0)){
             //alert("weekends price will be different");
             $mdDialog.show({
             controller: weekdayWeekendDialogController,
             templateUrl: '/website/views/weekdayWeekendDiaolog.html',
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
             if($scope.openWeekendDialogFlag){


             }
             //console.log("its Weekend",$scope.cart);
             $scope.openWeekendDialogFlag=true;
             }else{
             //console.log("its Weekday",$scope.cart);
             }
             i++;
             }
             */


        }

        function weekdayWeekendDialogController($scope, $mdDialog) {
            //$scope.serv1=serv2;
            $scope.weekendDialogIndexCart=[];
            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.keepThisWeekendItem=function(item){
                var i=0;
                var idx=$scope.weekendDialogIndexCart.indexOf(item);
                if(idx>-1){
                    $scope.weekendDialogIndexCart.splice(idx,1);

                    ////console.log($scope.weekendDialogIndexCart);
                }else{
                    $scope.weekendDialogIndexCart.push(item);

                    ////console.log($scope.weekendDialogIndexCart);
                }
            }
            /*$scope.removeSelectedWeekendItems=function(){
                var i=0;
                while(i<$scope.weekendDialogIndexCart.length){
                    $scope.cart.splice($scope.weekendDialogIndexCart[i]);
                    i++;
                }
                //console.log("This is the final cart", $scope.cart);
                $scope.hide();

                if(localStorageService.get('userId')==null){
                    localStorageService.set("lullFlag",true);
                    $window.location.reload();
                }else{
                    $scope.submitAppt();
                }
            }*/

          /*  $scope.removeAllWeekendItems=function(){
                var i=0;
                while(i<$scope.cart.length){
                    if($scope.cart.weekDay==0){
                        $scope.cart.splice(i,1);
                    }
                    i++;
                }

                if(localStorageService.get('userId')==null){
                    localStorageService.set("lullFlag",true);
                    $window.location.reload();
                }else{
                    $scope.submitAppt();
                }
            }*/
        }

        $rootScope.$on('duScrollspy:becameActive', function($event, $element, $target){
            var section=[];
            var nameOfCategoryRequired="";
            var tempDeptName="";
            // //console.log($scope.depts)
            ////console.log(angular.element(document.getElementsByClassName("active")));
            nameOfCategoryRequired=(angular.element(document.getElementsByClassName("active")))[0].id;


            for(var i=0;i<$scope.depts.length;i++){
                if($scope.depts[i].categories.length==undefined){

                }

                for(var j=0;j<$scope.depts[i].categories.length;j++){
                    var concatSrollSpy="scrollSpyId"+$scope.depts[i].categories[j].categoryId;
                    ////console.log("concatSrollSpy",concatSrollSpy);
                    if(concatSrollSpy==nameOfCategoryRequired){
                        tempDeptName=$scope.depts[i].name;
                        var paneTobeOpenend= (angular.element(document.getElementById("paneToBeOpened"+$scope.depts[i].name)));
                        paneTobeOpenend.css('display',"block");
                        $scope.depts[i].openFlag=true;
                        if(i==$scope.depts.length-1){
                            //alert("here")
                            var sideMenuChangeProperty=(angular.element(document.getElementById("sideMenuId")));
                            sideMenuChangeProperty.addClass('sideMenuAbsolute');

                        }else{
                            var sideMenuChangeProperty=(angular.element(document.getElementById("sideMenuId")));
                            sideMenuChangeProperty.removeClass('sideMenuAbsolute');
                        }

                        ////console.log($scope.depts[i].name,$scope.depts[i].openFlag)
                    }
                }
                if($scope.depts[i].name!=tempDeptName){
                    $scope.depts[i].openFlag=false;
                    var paneTobeOpenend= (angular.element(document.getElementById("paneToBeOpened"+$scope.depts[i].name)));
                    paneTobeOpenend.css('display',"none");
                    ////console.log($scope.depts[i].name,$scope.depts[i].openFlag);
                }

            }
            $scope.$apply();

        });
        $scope.duScrollVpaneHeader="";
        $scope.closeOpenedVpaneContent=function(index){
            //alert($scope.depts[index].openFlag)
            if($scope.depts[index].openFlag==true){
                $scope.duScrollVpaneHeader=$scope.depts[index].categories[0].categoryId;
                //$scope.depts[index].openFlag=true;
                var paneTobeOpenend= (angular.element(document.getElementById("paneToBeOpened"+$scope.depts[index].name)));
                paneTobeOpenend.css('transition',"all 0.90s ease");
                paneTobeOpenend.css('display',"block");
            }else{
                $scope.depts[index].openFlag=false;
                $scope.duScrollVpaneHeader="";
                var paneTobeOpenend= (angular.element(document.getElementById("paneToBeOpened"+$scope.depts[index].name)));
                paneTobeOpenend.css('transition',"all 0.90s ease");
                paneTobeOpenend.css('display',"none");
            }


        }

        $scope.activateShowFloatingCart=function(){
            $scope.showFloatingCart= !$scope.showFloatingCart;
            $scope.showFloatingCartXs=!$scope.showFloatingCartXs;
        }
        $scope.testScroll="";

        $scope.servicesDropdownMenuToggle=function(){
            $scope.servicesDropdownMenuFlag=!$scope.servicesDropdownMenuFlag;
        }

        $scope.tryScroll=function(id){
            ////console.log("here");

            $scope.testScroll=id;
           // //console.log("$scope.testScroll",$scope.testScroll)
            $scope.servicesDropdownMenuFlag=!$scope.servicesDropdownMenuFlag;
            /* $timeout( $scope.servicesDropdownMenuToggle(), 100000 );*/
        }
        ////console.log();
        $scope.dealQuan=new Array(20).fill(0);
        ////console.log($scope.dealQuan);
        $scope.dealQuantity=function(serv){
            var quan=0;
            if(serv.dealType.name!="combo" && serv.dealType.name!="frequency"){
                serv.services.forEach(function(se){
                    quan=$scope.quantity[se.serviceCode]+quan;
                });

            }else{
                quan=$scope.dealQuan[serv.dealIdParlor];
            }
            return quan;
        }
        $scope.checkDeal=function(serv){
            serv.deals.forEach(function(deal){
                if(deal.dealType.name =="chooseOne" || deal.dealType.name=="dealPrice"){
                    return deal.dealType.price
                }
                else if(deal.dealType.name =="chooseOnePer" ){
                    return (1-(deal.dealType.price/100))
                }

            })

        };

        $scope.lastScrollTop = 0;
        $scope.direction = "";
        angular.element($window).bind("scroll", function() {
            $scope.st = window.pageYOffset;
            if ($scope.st > $scope.lastScrollTop) {
                $scope.direction = "down";

            } else {
                $scope.direction = "up";

            }

            $scope.lastScrollTop = $scope.st;
            $scope.$apply();
            // //console.log($scope.direction);
        });
        $scope.servicesArrowFlag=false;
        $scope.turnArrow=function(){
            $scope.servicesArrowFlag=!$scope.servicesArrowFlag;
        }


    }]).value('duScrollOffset', 200);
