"use strict";
app.controller('newsalondealCtrl', ['$scope', '$http','$route','$routeParams','$location','$document','ngProgressFactory','localStorageService','$mdDialog','$geolocation','Service','salonListingSearchBoxBooleanService','$rootScope','offerPageSearchLocation','filterProduct','latitudeandlongitude','$q','LatLong','$sce','$timeout',function($scope, $http,$route, $routeParams, $location,$document,ngProgressFactory,localStorageService,$mdDialog,$geolocation,Service,salonListingSearchBoxBooleanService,$rootScope,offerPageSearchLocation,filterProduct,latitudeandlongitude,$q,LatLong,$stateParams,$sce,$timeout) {
        $scope.items=[];
        $scope.user={};
        $scope.selectedItem={};
        $scope.gend='F';
        gtag('event', 'page_view', {
            'send_to': 'AW-870359358',
            'ecomm_pagetype': 'MainSalonDeal',
            'ecomm_prodid': 'MainPage',
            'ecomm_totalvalue': 100
          });
    $scope.initialiseAnimator=function(){
        setTimeout(function(){$scope.x=2},0)
    }
    
        
        $scope.searchMyQuery=function(a){
            var temporaryObj=angular.copy($scope.salondealdepartment);
            var item=[];
            var items=temporaryObj.deals.filter(function(gender){
                    gender.departments=gender.departments.filter(function(departments){
                        departments.categories=departments.categories.filter(function(categories){
                                categories.departmentId=departments.departmentId;
                                return (categories.name.substring(0,a.length).toLowerCase()==a.toLowerCase())&&(categories.name!='Packages'); 
                        })
                        return departments.categories.length>0;})
                        return $scope.gender.gend==gender.gender;
            })
            if(items.length>0){
                 items=items[0].departments.filter(function(dummmyDepartments){
                       return dummmyDepartments.categories.length>0
            })
                items=items.map(function(m){
                        m.categories.forEach(function(c){item.push(c)})
                         return m   
                })}
            return item;}
        $scope.myPosition=latitudeandlongitude.getlatlong();
        var servicePosition= {}
         LatLong.getNamefromlatlong( $scope.myPosition.latitude,$scope.myPosition.longitude).then(function(res){
                $scope.refinelocation(res);})
        var autocompleteService= new google.maps.places.AutocompleteService();
        var southWest = new google.maps.LatLng(28.387202, 76.850534);
        var northEast = new google.maps.LatLng(28.748991, 77.550923);
        var delhiNCRBounds = new google.maps.LatLngBounds(southWest, northEast);
        var getResults = function(address) {
            var deferred = $q.defer();
            var request = {bounds: delhiNCRBounds, input: address, types: ['geocode'], componentRestrictions: { country: 'in' },};
            autocompleteService.getPlacePredictions(request, function(data) {
                deferred.resolve(data);
            });
            return deferred.promise;
        };
        $scope.setPassingData=function(a,b){
            $scope.passingObject.determinateValue=a;
            $scope.passingObject.showIt=b;
        }
        $scope.search = function(input, cb) {
            if (!input) {return;}
            $scope.items=getResults(input).then(function(places) {
                return places;
            });};
        $scope.selectedItemChange=function(item){
            $http.get('/api/placeDetail?placeId='+item.place_id).success(function(data){
                      var result = data;
                      try{
                          $scope.saveOnlocation(result.data.geometry.location.lat,result.data.geometry.location.lng)
                            servicePosition.latitude=result.data.geometry.location.lat;
                            servicePosition.longitude=result.data.geometry.location.lng;
                      }
                      catch(exception){
                       ////console.log("something is undefined")
                  }
                            $scope.listingFunction();

                ////console.log($scope.items)

                  }).error(function(err){
                      $scope.listingFunction();
                  })
        }
        $scope.getLocation=function(){
                                $geolocation.getCurrentPosition({
                                timeout: 60000
                            }).then(function successCallback(position) {
                $scope.myPosition = position.coords;
            LatLong.getNamefromlatlong($scope.myPosition.latitude, $scope.myPosition.longitude).then(function(res){
                        $scope.refinelocation(res);
                        try{
                            if($scope.items.length==0)
                                {
                                     ////console.log("kakjdsk")
                                }
                            else{
                                $scope.selectedItem.display=$scope.searchPosition
                            }
                        }
                    catch(e){

                    }
               });
                                    servicePosition.latitude= $scope.myPosition.latitude
                                    servicePosition.longitude=$scope.myPosition.longitude
                                    $scope.saveOnlocation($scope.myPosition.latitude,$scope.myPosition.longitude)


 }, function errorCallback(position) {
                LatLong.getNamefromlatlong(28.52457, 77.206615).then(function(res){
                                 $scope.refinelocation(res);
                 });
                                         servicePosition.latitude= $scope.myPosition.latitude
                                         servicePosition.longitude=$scope.myPosition.longitude
                                      $scope.saveOnlocation($scope.myPosition.latitude,$scope.myPosition.longitude)
            });

        }
        $scope.refinelocation=function(data){
                                $scope.searchPosition = data.data.data[0].address_components[2].long_name+ ' '+data.data.data[0].address_components[4].long_name;
            $scope.selectedItem.display=$scope.searchPosition;
        }
        if(localStorageService.get("newSalonDealLat")!='' || localStorageService.get("newSalonDealLat")!=undefined){
            LatLong.getNamefromlatlong(localStorageService.get("newSalonDealLat"), localStorageService.get("newSalonDealLong")).then(function(res){
                $scope.refinelocation(res);})}
        $scope.cart={cartProduct:[],totalPrice:0,totalQuantity:0}
        $scope.finalData={};
        $scope.progressbar = ngProgressFactory.createInstance();
        $scope.progressbar.setColor("#d2232a");
        $scope.progressbar.start();
        $scope.insertion={
                        getTheLowestPrice:function(flag,dummyData){
                                            var i=0;
                                            ////console.log(dummyData)
                                    
                                            var b=dummyData.parlorTypes.filter(function(m){return !isNaN(m.startAt)})
                                            i=Math.min.apply(Math,b.map(function(v){return v.startAt}))
                                            if(!i || i== Infinity)
                                            {i=dummyData.price;}
                                                return i;}
                    };
        $scope.manageCart={
                            insertIntoCart:function(wholeObject){
                               $scope.hideNextButton=false;
                                var flag=$scope.manageCart.checkIntoCart(wholeObject);
                                    if(flag.insertionFlag)
                                {
                                    $scope.cart.cartProduct[flag.index].quantity++;
                                }
                                else
                                {
                                  var temporary=$scope.manageCart.refineCart(wholeObject);
                                    temporary.price=$scope.insertion.getTheLowestPrice(true,$scope.temporaryObject);
                                    temporary.menuPrice=$scope.temporaryObject.menuPrice;
                                    $scope.cart.cartProduct.push(temporary);
                                    ////console.log(temporary)
                                    $scope.x=2000;
                                }

                                        $scope.manageCart.refreshCart();
                                        $scope.manageCart.calculateQuantityandPrice();
                                        localStorageService.set("cartProducts",$scope.cart);
                        },
                            removeFromCart:function(wholeObject){
                                var flag=$scope.manageCart.checkIntoCart(wholeObject);
                                if(flag.insertionFlag)
                                {
                                    if($scope.cart.cartProduct[flag.index].quantity>1)
                                    {
                                       $scope.cart.cartProduct[flag.index].quantity--;
                                    }
                                    else{
                                           $scope.cart.cartProduct.splice(flag.index,1);
                                        }
                                  }
                                else
                                {
                                    alert("Item Doesn't exist");
                                }
                                $scope.manageCart.refreshCart();
                                $scope.manageCart.calculateQuantityandPrice();
                            if($scope.cart.cartProduct.length==0)
                            {
                                $scope.cart.status="default";
                                $scope.cart.progress=0;
                            }
                            localStorageService.set("cartProducts",$scope.cart);
                        },
                            checkIntoCart:function(Param) {
                            var flag={insertionFlag:false}
                            var temp=[];
                             if(Param.type=="deals")
                            {
                                temp= $scope.cart.cartProduct.filter(function(data,index){
                                    data.index=index;
                                     return data.dealId==Param.deals.dealId;
                                 })
                            }
                                else if(Param.type=="service")
                            {
                                 temp= $scope.cart.cartProduct.filter(function(data,index){
                                    data.index=index;
                                     return data.services[0].serviceCode==Param.deals.services[0].serviceCode;
                                 })
                            }
                                else if(Param.type=="Brand")
                            {
                                 temp= $scope.cart.cartProduct.filter(function(data,index){
                                    data.index=index;
                                     return data.services[0].serviceCode==Param.deals.services[0].serviceCode && Param.deals.services[0].brands[0].brandId==data.services[0].brandId;
                                 })

                            }
                                else
                            {
                                temp= $scope.cart.cartProduct.filter(function(data,index){
                                    data.index=index;
                                     return data.services[0].serviceCode==Param.deals.services[0].serviceCode && Param.deals.services[0].brands[0].brandId==data.services[0].brandId && Param.deals.services[0].brands[0].products[0].productId==data.services[0].productId;
                                 })
                            }
                                    if(temp.length>0)
                                {
                                    flag.insertionFlag=true;
                                    flag.index=temp[0].index;
                                }
                                    return flag;
                        },
                            refineCart:function(Param){
                            var sendObject={quantity:1}
                                    sendObject.dealId=Param.deals.dealId;
                            if(Param.type=="deals")
                            {
                                sendObject.name=Param.deals.name;
                                sendObject.shortDescription=Param.deals.shortDescription;
                                ////console.log("cart funcrion",Param.deals.selectors[0]);
                                sendObject.services=angular.copy(Param.deals.selectors[0].services);
                            }
                                else if(Param.type=="service")
                            {
                               sendObject.services=angular.copy(Param.deals.services);
                            }
                                else if(Param.type=="Brand")
                            {
                                sendObject.services=Param.deals.services.map(function(data){
                                                            ////console.log(data)
                                                        return {        name:data.name,
                                                                        serviceCode:data.serviceCode,
                                                                        serviceId:data.serviceId,
                                                                        brandId:data.brands[0].brandId,
                                                                        brandName:data.brands[0].brandName} })
                            }
                                else
                            {sendObject.services=Param.deals.services.map(function(data){
                                                        return {        name:data.name,
                                                                        serviceCode:data.serviceCode,
                                                                        serviceId:data.serviceId,
                                                                        brandId:data.brands[0].brandId,
                                                                        brandName:data.brands[0].brandName,
                                                                        productName:data.brands[0].products[0].productName,
                                                                        productId:data.brands[0].products[0].productId
                                                                }})}
                            return sendObject;
                        },
                            refreshCart:function(){
                                    $scope.salondeal.categories.forEach(function(a){
                                    a.deals.forEach(function(b){
                                        b.quantity=0
                                        $scope.cart.cartProduct.forEach(function(c){
                                            if(c.dealId==b.dealId)
                                            {
                                                b.quantity=c.quantity+b.quantity;
                                            }
                                        })
                                    })
                                })
                                if($scope.cart.cartProduct.length>0)
                                {
                                    $scope.setPassingData(17,"default")
                                }
                                else{
                                    $scope.setPassingData(0,"default")
                                }
                    },
                            currentCart : function(services){
                                $scope.finalServices = [];
                                var finalData={}
                                for(var a in services)
                                {if(a!='cartProduct' && a!='cartProducts' && a!='previousPrice' && a!='status' && a!='progress')
                                    {
                                        finalData[a]=services[a];
                                    }
                                }
                        finalData.datetime=new Date(services.selectedTimeSlot);
                        finalData.date=new Date(services.selectedTimeSlot);
                        finalData.dealPrice=$scope.cart.totalPrice;
                        finalData.latitude=servicePosition.latitude;
                        finalData.longitude=servicePosition.longitude;
                        for (var i = 0; i < services.cartProduct.length; i++) {
                          var temp=""
                          if(services.cartProduct[i].name)
                        {
                            temp=services.cartProduct[i].name
                        }
                          else
                          {
                               temp=services.cartProduct[i].services[0].name
                        }
                        $scope.finalServices.push({
                          quantity : services.cartProduct[i].quantity,
                          serviceId : services.cartProduct[i].services[0].serviceId,
                          serviceCode : services.cartProduct[i].services[0].serviceCode,
                          price:services.cartProduct[i].price,
                          menuPrice:services.cartProduct[i].menuPrice,
                          addition : 0,
                          name:temp,
                          frequencyUsed : false,
                          type :"newPackage",
                          typeIndex:0,
                          brandId:services.cartProduct[i].services[0].brandId,
                          productId:services.cartProduct[i].services[0].productId
                        })
                      }
                        finalData.services=angular.copy($scope.finalServices);
                        var sum=0;
                      sum  =finalData.services.reduce(function(a,val){
                            var temp=val.menuPrice*val.quantity;
                            a=a+temp;
                            return a
                        },sum)
                       finalData.menuPrice=sum;
                        return finalData
                    },
                            manipulationOnFinalAction:function(){
                                $scope.finalData.services=[];
                             $scope.finalData.dealPrice=$scope.cart.totalPrice;   
                            for(var i=0;i<$scope.cart.cartProduct.length;i++)
                            {
                                var temp=''
                                if($scope.cart.cartProduct[i].name)
                                {
                                 temp=$scope.cart.cartProduct[i].name   
                                }
                                else{
                                    temp=$scope.cart.cartProduct[i].services[0].name;
                                }
                            
                                   $scope.finalData.services.push({quantity : $scope.cart.cartProduct[i].quantity,
                          serviceId : $scope.cart.cartProduct[i].services[0].serviceId,
                          serviceCode : $scope.cart.cartProduct[i].services[0].serviceCode,
                          price:$scope.cart.cartProduct[i].price,
                          menuPrice:$scope.cart.cartProduct[i].menuPrice,
                          addition : 0,
                          name:temp,
                          frequencyUsed : false,
                          type :"newPackage",
                          typeIndex:0,
                          brandId:$scope.cart.cartProduct[i].services[0].brandId,
                          productId:$scope.cart.cartProduct[i].services[0].productId
                        })
                }
                             var sum=0;
                      sum  =$scope.finalData.services.reduce(function(a,val){
                            var temp=val.menuPrice*val.quantity;
                            a=a+temp;
                            return a
                        },sum)
                       $scope.finalData.menuPrice=sum;   
                      },
                            calculateQuantityandPrice:function(){
                                var a={price:0,quantity:0,menuPrice:0};
                                a=$scope.cart.cartProduct.reduce(function(sum,val){
                                                                    var a=val.quantity*val.price;
                                                                    var b=val.quantity*val.menuPrice;
                                                                    sum.price=sum.price+a;
                                                                    sum.quantity=sum.quantity+val.quantity;
                                                                    sum.menuPrice=sum.menuPrice+b
                                                                    return sum},a)
                                        $scope.cart.totalPrice=a.price;
                                        $scope.cart.totalQuantity=a.quantity;
                                        $scope.cart.totalMenuPrice=a.menuPrice;
                                    ////console.log($scope.cart)
                    },
                            pushPriceAccordingtoSalon:function(cart){
                               $scope.cart.previousPrice=[];
                                $scope.cart.previousMenuPrice=[];
                               $scope.cart.cartProduct= $scope.cart.cartProduct.map(function(param){
                                    $scope.cart.previousPrice.push(param.price)
                                    $scope.cart.previousMenuPrice.push(param.menuPrice);
                                    var flag=false;
                                    for(var i=0;i<cart.deals.length;i++)
                                    {
                                        if(cart.deals[i].productId)
                                        {
                                            if(param.services[0].productId==cart.deals[i].productId)
                                            {
                                                flag=true;
                                            }
                                        }
                                        else if(cart.deals[i].brandId)
                                        {
                                            if(param.services[0].brandId==cart.deals[i].brandId)
                                                {
                                                    flag=true;
                                                }
                                        }
                                        else{
                                                if(param.services[0].serviceId==cart.deals[i].serviceId)
                                                {
                                                    flag=true;
                                                }
                                            }
                                        if(flag)
                                        {
                                            param.price=cart.deals[i].dealPrice/cart.deals[i].quantity;
                                            param.menuPrice=cart.deals[i].menuPrice/cart.deals[i].quantity;
//                                            param.price=cart.deals[i].dealPrice;
//                                            param.menuPrice=cart.deals[i].menuPrice;
                                            break;
                                        }
                                    }
                                    return param;
                                })
                                $scope.manageCart.calculateQuantityandPrice();
                                localStorageService.set("cartProducts",$scope.cart)
                            },
                            refreshBack:function(cart){
                                    var temp=[];
                                    ////console.log($scope.cart)
                                 if($scope.cart.previousPrice.length>0 )
                                 {
                                        $scope.cart.cartProduct.map(function(data,index){
                                                    data.price=$scope.cart.previousPrice[index];
//                                                 delete data.menuPrice;
                                                 return data;
                                        })
                                 }
                                 if($scope.cart.previousMenuPrice.length>0 )
                                 {
                                        $scope.cart.cartProduct.map(function(data,index){
                                             data.menuPrice=$scope.cart.previousMenuPrice[index];
                                                return data;
                                        })
                                 }
                                $scope.manageCart.calculateQuantityandPrice();
                                localStorageService.set("cartProducts",$scope.cart);
                             },
                            instantlyRemoveFromCart:function(data,medium){
                               $scope.removeFlag=false;
                                    $scope.cart.cartProduct=$scope.cart.cartProduct.map(function(m,index){
                                                var flag=0
                                               if(medium=='service'){
                                                    if(m.services[0].serviceCode==data)
                                                    {flag=1}}
                                                else if(medium=='brand'){if(m.services[0].brandId==data){flag=1}
                                            }
                                            else{
                                                if(m.services[0].productId==data)
                                                    {
                                                      flag=1 
                                                    }
                                                }
                                                        if(flag==1){m.quantity--;
                                                                    if(m.quantity==0)
                                                                    {
                                                                        $scope.removeFlag=true;
                                                                    }
                                                                    }
                                        
                                        return m;})
                                                    if($scope.removeFlag)
                                                {
                                                        $scope.cart.cartProduct.splice($scope.cart.cartProduct.findIndex(function(m){return m.quantity==0}),1)
                                                }
                                                $scope.manageCart.calculateQuantityandPrice();
                             localStorageService.set("cartProducts",$scope.cart);
                            },
                            instantlyAddToCart:function(data,medium){
                                    $scope.cart.cartProduct=$scope.cart.cartProduct.map(function(m,index){
                                            var flag=0
                                                    if(medium=='service'){
                                                        if(data==m.services[0].serviceCode){flag=1}}
                                                    else if(medium=='brand'){
                                                if(data==m.services[0].brandId){flag=1}    
                                            }
                                                else{if(data==m.services[0].productId){flag=1}}
                                                if(flag==1){m.quantity++}
                                                return m
                                        })
                                $scope.manageCart.calculateQuantityandPrice()
                                localStorageService.set("cartProducts",$scope.cart);
                                }
}
        $scope.finalDataManiPulation={
            calculatePriceAccordingToTax:function(){
            var tempTax=$scope.cart.tax;
            $scope.finalData.taxAmount=(tempTax/100)*$scope.finalData.dealPrice;
                                            $scope.finalData.serviceAmount=$scope.finalData.dealPrice-$scope.finalData.taxAmount;
                                            $scope.finalData.discount=$scope.finalData.menuPrice-$scope.finalData.serviceAmount;
                                            $scope.finalData.save=(($scope.finalData.menuPrice-$scope.finalData.dealPrice)/$scope.finalData.menuPrice)*100;
            },
            calculatePrice:function(){
                                            $scope.finalDataManiPulation.calculatePriceAccordingToTax();
            },
            setfinaldata:function(){
                                            $scope.finalData.accessToken=localStorageService.get("accessToken");
                                            var customObject=localStorageService.get("loginData");
                                            $scope.finalData.userId=customObject.userId;
                                            $scope.finalData.useLoyalityPoints=0;
                                            $scope.finalData.useMembershipCredits=0;
                                            var a=localStorageService.get("finalData");
                                                if(!a.appointmentData)
                                            {a.appointmentData={}}
                                            $scope.finalData.appointmentData=a.appointmentData;
                                            $scope.finalData.paymentOption=a.paymentOption;
                                        }
        }
        $scope.salonData={};
        $scope.accordionA={}
        $scope.temporaryObject={};
        $scope.passingObject={};
        $scope.setPassingData(0,"default");
        $scope.gender={};
        $scope.gender.gend='F';
        
        $scope.deals=function(flag){
        $http.get("api/dealsDepartment").then(function(response) {
          $scope.salondealdepartment=response.data.data;
          var c={}
                if(flag)
               {
                 $scope.salondealdepartment.deals.forEach(function(gender,i){

                    if($routeParams.gender==gender.gender)
                        $scope.gender.gend=$routeParams.gender;
                      {gender.departments.forEach(function(category){
                                if(category.name==$routeParams.params)
                                {c=angular.copy(category)}
                    })
                }
                 })

                 $scope.getServices(c,$routeParams.gender,c,false,true)
               }
            else{
$scope.getServices($scope.salondealdepartment.deals[0].departments[0],$scope.gender.gend,$scope.salondealdepartment.deals[0].departments[0])
}

});}
        $scope.filterNow=function(a,b,c){
                        ////console.log($scope.gend)
                    $scope.getServices(a,$scope.gender.gend,a);
        }
        $scope.getServices=function(a,b,c,flag,flags){
            var customObjextNow=this;
            ////console.log(this.checkItNow);
            var abcd=angular.copy($scope.salondealdepartment)
            var customObject=angular.copy(a)
            var newObj00=angular.copy(a)
            $scope.salondealdepartment={};
            $scope.salondealdepartment=angular.copy(abcd);
            $scope.salondeal={}
            $scope.loader=true;
    $http.get("/api/dealsDepartmentWise?departmentId="+c.departmentId+"&gender="+b+'&latitude='+parseFloat(localStorageService.get("newSalonDealLat"))+"&longitude="+parseFloat(localStorageService.get("newSalonDealLong"))+'&brandType=1').then(function(response) {
         ////console.log(response)
                $scope.loader=false;
                a=customObject
         $scope.paramFlag=false;
                if(flags)
      {
         
          $scope.salondeal=angular.copy(response.data.data);
          ////console.log($scope.salondeal)
            var a=response.data.data.categories.filter(function(data){
                data.deals=data.deals.filter(function(datas){
                                return datas.dealId==$routeParams.dealId;
                })
                return data.deals.length>0;
            })
            var obj=angular.copy(a[0].deals[0])
                    var newObj={}
                     newObj.price=$scope.insertion.getTheLowestPrice(true,a[0].deals[0]);
                        newObj.menuPrice=a[0].deals[0].menuPrice;
                        newObj.dealId=a[0].deals[0].dealId;
                        newObj.services=[];
                        newObj.services[0]={};
                        newObj.quantity=1;
                    if(a[0].deals[0].selectors[0].type=='service')
                   {
                          a[0].deals[0].selectors[0].services=a[0].deals[0].selectors[0].services.filter(function(data01){
                                return data01.serviceCode==$routeParams.serviceCode;
                            })

                       newObj.services[0].name=a[0].deals[0].selectors[0].services[0].name;
                        newObj.services[0].serviceCode=a[0].deals[0].selectors[0].services[0].serviceCode;
                       newObj.services[0].serviceId=a[0].deals[0].selectors[0].services[0].serviceId;
                        if(a[0].deals[0].selectors[0].services[0].brands.length>0 || obj.selectors[0].services.length>1)
                            {

                                if(a[0].deals[0].selectors[0].services[0].brands.length>0)
                                    {
                                       newObj.services[0].brandId=a[0].deals[0].selectors[0].services[0].brands[0].brandId;
                                        newObj.services[0].brandName=a[0].deals[0].selectors[0].services[0].brands[0].brandName;
                                         if(a[0].deals[0].selectors[0].services[0].brands[0].products.length>0){
                            newObj.services[0].productId=a[0].deals[0].selectors[0].services[0].brands[0].products[0].productId;
                        newObj.services[0].productName=a[0].deals[0].selectors[0].services[0].brands[0].products[0].productName;
                                        }
                                    }
                                else{

                                }}
                           else{
                                      newObj.name=a[0].deals[0].name;
                                newObj.shortDescription=a[0].deals[0].shortDescription;} }
          else{
                           a[0].deals[0].selectors[0].brands= a[0].deals[0].selectors[0].brands.filter(function(data01){
                                    data01.products=data01.products.filter(function(data02){
                                        data02.services=data02.services.filter(function(data03){
                                            return data03.serviceCode==$routeParams.serviceCode;})
                                        return data02.services.length>0;
                                    })
                                    return data01.products.length>0;
                           })
                            newObj.services[0].brandName=a[0].deals[0].selectors[0].brands[0].brandName;
                            newObj.services[0].brandId=a[0].deals[0].selectors[0].brands[0].brandId;
                            newObj.services[0].serviceCode=a[0].deals[0].selectors[0].brands[0].products[0].services[0].serviceCode;
                            newObj.services[0].serviceId=a[0].deals[0].selectors[0].brands[0].products[0].services[0].serviceId
                        if(a[0].deals[0].selectors[0].brands[0].products[0].productId)
                        {
                            newObj.services[0].productName=a[0].deals[0].selectors[0].brands[0].products[0].productName;
                            newObj.services[0].productId=a[0].deals[0].selectors[0].brands[0].products[0].productId;
                        }

                                ////console.log(a)
                   }
//                    ////console.log(newObj)
                     $scope.cart.cartProduct[0]=newObj;
                    $scope.cart.totalPrice=newObj.price;
                    $scope.cart.totalMenuPrice=newObj.menuPrice;
                    $scope.cart.totalQuantity=newObj.quantity;
               localStorageService.set("cartProducts",$scope.cart);
           gtag('event', 'page_view', {
                                        'send_to': 'AW-870359358',
                                        'ecomm_pagetype': 'Salon Deal',
                                        'ecomm_prodid':$scope.cart.cartProduct[0].dealId ,
                                        'ecomm_totalvalue':$scope.cart.cartProduct[0].price
                                    });
        fbq('track', 'AddToCart',{
                                        value:$scope.cart.cartProduct[0].price,
                                        currency:'INR',
                                        content_ids:[$scope.cart.cartProduct[0].services[0].serviceCode],
                                        content_type:'Service Added To Cart'
                                    });
          ga('send', {
                hitType: 'event',
                eventCategory: 'serviceSelected',
                eventAction: 'redirect',
                eventLabel: 'serviceSelected'
            });
               $scope.setPassingData(17,"default");
                    $scope.salondealdepartment.deals= $scope.salondealdepartment.deals.map(function(data){
                        if(data.gender==b)
                        {
                            data.departments=data.departments.map(function(data1){
                                        if(data1.departmentId==c.departmentId)
                                        {
                                            data1.openFlag=true;
                                        }
                                    else{
                                            data1.openFlag=false
                                        }
                                        return data1
                            })
                        }
                        return data;

                    })
                    $scope.categories =  $scope.salondeal.categories;
                    for (var i = 0; i < $scope.categories.length; i++) {
                        for (var j = 0; j < $scope.categories[i].deals.length; j++) {
                            $scope.onetwothree = [{type:0},{type:1},{type:2}];
                            for (var k = 0; k < $scope.categories[i].deals[j].parlorTypes.length; k++) {
                                $scope.onetwothree[$scope.categories[i].deals[j].parlorTypes[k].type] = $scope.categories[i].deals[j].parlorTypes[k];
                            }
                            $scope.categories[i].deals[j].parlorTypes =$scope.onetwothree;
                        }
                    }
                    $scope.salondeal.categories = $scope.categories;
                    var tempId="";
                    $scope.salondeal.categories=$scope.salondeal.categories.map(function(h,i){
                        for(var iterator=0;iterator<newObj00.categories.length;iterator++)
                        {
                            if(newObj00.categories[iterator].name==h.name)
                            {
                                h.id=newObj00.categories[iterator].categoryId;
                                break;
                            }
                        }
                        return h
                    })
                    $scope.manageCart.refreshCart();
                    $scope.container = angular.element(document.getElementById('scroll'));
                    $scope.container.scrollTop(10, 1500);
          }
        else   if(flag)
    {
        
        for(var adc=0;adc<response.data.data.categories.length;adc++)
               {
                   var dc= response.data.data.categories[adc].deals.filter(function(m){
                       return m.dealId==a.dealId
                   })
                   if(dc.length>0)
                   {
                       break;
                   }
               }
                var temps=dc[0];
                dc=angular.copy(temps);
                ////console.log(dc)
               a.price=$scope.insertion.getTheLowestPrice(true,dc)
                a.menuPrice=dc.menuPrice;
                $scope.cart.totalPrice=a.price;
                $scope.cart.totalQuantity=a.quantity;

               if(dc.selectors[0].type=='service')
               {
                            if(a.services[0].productId)
                            {
                                    for(var i=0;i<dc.selectors[0].services.length;i++)
                                    {
                                        for(var j=0;j<dc.selectors[0].services[i].brands.length;j++)
                                        {
                                            for(k=0;k<dc.selectors[0].services[i].brands[j].products.length;k++)
                                                {
                                                    if(dc.selectors[0].services[i].brands[j].products[k].productId==a.services[0].productId)
                                                    {
                                                        a.services[0].productName=dc.selectors[0].services[i].brands[j].products[k].productName;
                                                        break;
                                                    }
                                                }
                                                if(dc.selectors[0].services[i].brands[j].brandId==a.services[0].brandId)
                                                {
                                                    a.services[0].brandName=dc.selectors[0].services[i].brands[j].brandName;
                                                }
                                        }
                                        if(a.services[0].serviceCode==dc.selectors[0].services[i].serviceCode)
                                        {
                                            a.services[0].name=dc.selectors[0].services[i].name;
                                            a.services[0].serviceId=dc.selectors[0].services[i].serviceId;
                                        }
                                    }
                            }
                         else  if(a.services[0].brandId)
                            {
                                for(var i=0;i<dc.selectors[0].services.length;i++)
                                {
                                    for(var j=0;j<dc.selectors[0].services[i].brands.length;j++)
                                    {
                                        if(dc.selectors[0].services[i].brands[j].brandId==a.services[0].brandId)
                                        {
                                            a.services[0].brandName=dc.selectors[0].services[i].brands[j].brandName;
                                            break;
                                        }
                                    }
                                    if(a.services[0].serviceCode==dc.selectors[0].services[i].serviceCode)
                                    {
                                        a.services[0].name=dc.selectors[0].services[i].name;
                                        a.services[0].serviceId=dc.selectors[0].services[i].serviceId;
                                    }
                                }
                            }
                            else if(a.services[0].serviceCode){
                                a.name=dc.name;
                                a.shortDescription=dc.shortDescription;
                                a.services[0].serviceId=dc.selectors[0].services[0].serviceId;
                            }
               }
                             else{
                                 ////console.log(dc)
                   if(a.services[0].productId){
                       ////console.log(a)
                             for(var i=0;i< dc.selectors[0].brands.length;i++)
                             {
                                 for(var j=0;j<dc.selectors[0].brands[i].products.length;j++)
                                 {
                                     for(var k=0;k<dc.selectors[0].brands[j].products[j].services.length;k++)
                                     {

                                         if(dc.selectors[0].brands[i].products[j].services[k].serviceCode==a.services[0].serviceCode)
                                         {
                                             a.services[0].name=dc.selectors[0].brands[i].products[j].services[k].name;
                                             a.services[0].serviceId=dc.selectors[0].brands[i].products[j].services[k].serviceId;
                                         }
                                     }

                                     if(dc.selectors[0].brands[i].products[j].productId==a.services[0].productId)
                                     {
                                         ////console.log(a)
                                         a.services[0].productName=dc.selectors[0].brands[i].products[j].productName;
                                     }
                                 }

                                 if(dc.selectors[0].brands[i].brandId==a.services[0].brandId)
                                 {
                                     a.services[0].brandName=dc.selectors[0].brands[i].brandName
                                 }
                             }
                        }
                        else{
                       for(var i=0;i< dc.selectors[0].brands.length;i++)
                       {
                           for(var j=0;j<dc.selectors[0].brands[i].products.length;j++)
                           {
                               for(var k=0;dc.selectors[0].brands[j].products[j].services.length;k++)
                               {
                                   if(dc.selectors[0].brands[i].products[j].services[k].serviceCode==a.services[0].serviceCode)
                                   {
                                       a.services[0].name=dc.selectors[0].brands[i].products[j].services[k].name;
                                       a.services[0].serviceId=dc.selectors[0].brands[i].products[j].services[k].serviceId
                                       break;
                                   }
                               }
                            }

                           if(dc.selectors[0].brands[i].brandId==a.services[0].brandId)
                           {
                                a.services[0].brandName=dc.selectors[0].brands[i].brandName
                           }
                       }
                   }
               }
                ////console.log(a)
               $scope.cart.cartProduct[0]=a;
               localStorageService.set("cartProducts",$scope.cart);
               $scope.setPassingData(17,"default");
               $scope.next();
    }
else{
                    $scope.salondealdepartment.deals= $scope.salondealdepartment.deals.map(function(data){
                        if(data.gender==b)
                        {data.departments=data.departments.map(function(data1){
                            if(data1.departmentId==c.departmentId){
                                    data1.openFlag=true;
                                }
                            else{
                                    data1.openFlag=false}
                                        return data1})}
                        return data;})
                    $scope.salondeal=response.data.data;
                    $scope.categories =  angular.copy($scope.salondeal.categories);
                    for (var i = 0; i < $scope.categories.length; i++) {
                        for (var j = 0; j < $scope.categories[i].deals.length; j++) {
                            $scope.onetwothree = [{type:0},{type:1},{type:2}];
                            for (var k = 0; k < $scope.categories[i].deals[j].parlorTypes.length; k++) {
                                $scope.onetwothree[$scope.categories[i].deals[j].parlorTypes[k].type] = $scope.categories[i].deals[j].parlorTypes[k];}
                            $scope.categories[i].deals[j].parlorTypes =$scope.onetwothree;}
                    }

                    $scope.salondeal.categories = $scope.categories;
                    var tempId="";
                    $scope.salondeal.categories=$scope.salondeal.categories.map(function(h,i){
                        for(var iterator=0;iterator<a.categories.length;iterator++)
                        {
                            if(a.categories[iterator].name==h.name){
                                h.id=a.categories[iterator].categoryId;
                                break;}}
                        return h
                    })
                    $scope.manageCart.refreshCart();
        if(customObjextNow.checkItNow){
           
            $scope.paramFlag=true;
             $scope.container= angular.element(document.getElementById('scroll'));
            setTimeout(function(){
            var defg=angular.copy($scope.salondeal)
            var temporary=angular.copy($scope.salondealdepartment);
            var fgh=temporary.deals.filter(function(mkn){
                       mkn.departments= mkn.departments.filter(function(mknl){
                           mknl.categories=mknl.categories.filter(function(mknln,index){
                               mknln.index=index;
                               return mknln.name==c.name;
                           })
                           return mknl.categories.length>0
                       })
                return mkn.gender==$scope.gender.gend});
                $scope.paramObj=fgh.map(function(op){
                                                        return{
                                                            gender:$scope.gender.gend,
                                                            index:op.departments[0].categories[0].index,
                                                            departmentId:c.departmentId,
                                                            name:op.departments[0].categories[0].name,
                                                        }
                                        })
//                ////console.log($scope.paramObj);
                
            ////console.log(c)
            ////console.log(defg)
           var abcd=defg.categories.filter(function(dummy){return dummy.name==c.name})
            ////console.log(abcd);
            ////console.log();
            var mynew=angular.element(document.getElementById(abcd[0].id))
               $scope.container.scrollToElement(mynew,0,800);  
            },500)
          
            }
        else{
          $scope.container = angular.element(document.getElementById('scroll'));
            $scope.container.scrollTop(10, 1500);  
        }
        
 }
    });
    }
        $scope.btnflag1="true";
        $scope.btnflag2="false";

        $scope.additem=function(deal){
            ////console.log(deal)

    }
        $scope.genderFilter=function(abc){
    $scope.getServices($scope.salondealdepartment.deals[0].departments[0],abc,$scope.salondealdepartment.deals[0].departments[0])
   }
        $scope.removeItem=function(dealParentObject,deal,event){
            $scope.x=0;
        $scope.temporaryObject=angular.copy(deal)
        $scope.temporaryObject.flag=0;
         if(deal.selectors[0].services.length==1 && deal.selectors[0].services[0].brands.length==0){
              var c={};
                  c.type='deals';
                  c.deals=angular.copy(deal)
             $scope.manageCart.removeFromCart(c)
         }
         else{
                   $scope.removeDialogController(event)
         }

    }
        $scope.removeDialogController=function(ev){
        var options={templateUrl:"/website/views/dealDialog12.html",targetEvent:ev,controller:dealDialogController,temporary:$scope.temporaryObject,clickOutsideToClose:true};
            $mdDialog.show(options).then(function(answer){
                                    if(answer.type){
                                        $scope.manageCart.removeFromCart(answer)
                                    }})
            }
        $scope.next=function(a){
            if(a=='clicked')
            {
                ga('send', {
                hitType: 'event',
                eventCategory: 'serviceNextButton',
                eventAction: 'Click',
                eventLabel: 'serviceNextButton'
            });

            }
            $scope.activeDay=undefined;
            $scope.activeSlot=undefined
                window.scrollTo(0,0);
              $scope.selectedDeals=$scope.cart.cartProduct.map(function(mk){
                               return mk;
              })

        if($scope.passingObject.determinateValue==17){
            ////console.log($scope.cart.cartProduct.map(function(data){return data.services[0].serviceCode}));
            $scope.setPassingData(34,"newsalondealListing")

                    $scope.hideNextButton=true;
                  $scope.refreshlocalStorage($scope.passingObject.showIt,$scope.passingObject.determinateValue)
                    $scope.listingFunction();
              }
              else if($scope.passingObject.showIt=="scheduleAppointment"){
                       $scope.hideNextButton=true;
                       $scope.setPassingData(76,"loginPage")
                  $scope.refreshlocalStorage($scope.passingObject.showIt,$scope.passingObject.determinateValue)
                       if(localStorageService.get("accessToken")!='' && localStorageService.get("accessToken")!=undefined)
                        {
                                    $scope.next();
                        }}
        else if($scope.passingObject.showIt=="loginPage")
            {
                $scope.setPassingData(86,"SalonDealsBillsummary")
                $scope.finalData.paymentOption=1;
                $scope.finalData.bookingMethod=5;
                $scope.finalData.mode=5;
                $scope.createAppointment('','initialise','forEvent');
                $scope.refreshlocalStorage($scope.passingObject.showIt,$scope.passingObject.determinateValue)
                $scope.hideNextButton=true
            }
}
        $scope.showDealDialog = function(ev,currService) {
        var options={templateUrl:"/website/views/dealDialog12.html",targetEvent:ev,controller:dealDialogController,temporary:$scope.temporaryObject,clickOutsideToClose:true};
            $mdDialog.show(options).then(function(answer){
                        if(answer.type)
                        {
                            $scope.manageCart.insertIntoCart(answer)
                        }
                        })};
        function dealDialogController($scope, $mdDialog,temporary,filterProduct){
            $scope.data={};
            $scope.combinedObject={};
            $scope.levels={};
            $scope.onBrandChange=function(a,b){
            $scope.data.group1="";
            $scope.data.group3="";
            $scope.levels.levelOne=$scope.levels.levelOne.map(function(data){
            data.flag=false;
            return data;})
               $scope.levels.levelThree=$scope.levels.levelThree.map(function(data){
                   data.flag=false;
                   return data
               })
                        for(var d=0;d<a.length;d++)
                       {
                           var g=false;
                           if(b==a[d].brandId)
                           {
                               for(var e=0;e<a[d].products.length;e++)
                               {
                                   for(var i=0;i<$scope.levels.levelThree.length;i++)
                                       {if($scope.levels.levelThree[i].productId==a[d].products[e].productId)
                                                   { $scope.levels.levelThree[i].flag=true;}}
                                    for(var f=0;f<a[d].products[e].services.length;f++){
                                          for(var h=0;h<$scope.levels.levelOne.length;h++){
                                            if($scope.levels.levelOne[h].serviceCode==a[d].products[e].services[f].serviceCode){
                                                       $scope.levels.levelOne[h].flag=true;
                                                   }}
                                        }
                               }
                              break;

                           }
                       }
                                    ////console.log($scope.levels.levelOne)
                                    ////console.log($scope.levels.levelOne.findIndex(function(element){return element.flag==true}))
                                $scope.data.group1=$scope.levels.levelOne[$scope.levels.levelOne.findIndex(function(element){return element.flag==true})].serviceCode;
                                ////console.log($scope.data.group1);

                       }


 $scope.getLevels=function(combinedObject,params){
   var levels={};
    levels.levelTwo=angular.copy(combinedObject.refineBrands);
    levels.levelThree=angular.copy(combinedObject.refineProduct);
     if(params==0)
       {
                   if(combinedObject.refineServices.length>1)
               {
                       levels.levelOne=angular.copy(combinedObject.refineServices);
               }
               else{
                           levels.levelOne=[];
                   }

                   if(levels.levelOne.length>0)
               {
                           $scope.data.group1=levels.levelOne[0].serviceCode
                           if(levels.levelTwo.length>0)
                           {
                              $scope.data.group2=levels.levelTwo[0].brandId;
                           }

                           if(levels.levelThree.length>0)
                           {
                            $scope.data.group3=levels.levelThree[0].productId
                           }
                   }
               else{
                           $scope.data.group2=levels.levelTwo[0].brandId;
                           if(levels.levelThree.length>0)
                           {
                            $scope.data.group3=levels.levelThree[0].productId
                           }
                   }
       }

       else{
           $scope.data.group2=levels.levelTwo[0].brandId;
             if(combinedObject.refineServices.length>0)
               {
                       levels.levelOne=angular.copy(combinedObject.refineServices);
               }
           if(levels.levelThree.length>0)
            {
                ////console.log(levels)
                $scope.data.group3=levels.levelThree[0].productId;
            }

       }
        var i=0;
           for(var a in levels)
           {
               if(levels[a].length>0)
               {
                   i++;
               }
           }


               levels.levelRange=i;
       return levels;
}
$scope.temporaryObject=angular.copy(temporary)

               if($scope.temporaryObject.selectors[0].type=='service')
               {
                    $scope.combinedObject=filterProduct.getThefilterService($scope.temporaryObject);
                   $scope.levels=$scope.getLevels($scope.combinedObject,0);
                   ////console.log($scope.levels)
               }
           else{
                       $scope.combinedObject=filterProduct.getThefilterSubcategory($scope.temporaryObject);
                        $scope.levels=$scope.getLevels($scope.combinedObject,1);
                        $scope.onBrandChange($scope.levels.levelTwo,$scope.data.group2)
                        if($scope.levels.levelThree.length>0)
                    {
                        $scope.data.group3=$scope.levels.levelThree[0].productId
                    }
               }
               $scope.closeDialog=function()
           {
                           $mdDialog.hide();
                   $scope.data={};
           }
           $scope.submit=function(){
               $scope.finalProduct=filterProduct.getFinalProduct($scope.levels,$scope.data,$scope.temporaryObject)
               ////console.log($scope.finalProduct);
            $mdDialog.hide($scope.finalProduct,temporary);
           }



               $scope.filterProduct=function(a,b,c) {

                        var flag=false;
               for(var i=0;i<$scope.temporaryObject.selectors[0].services.length;i++)
               {
                   for(var j=0;j<$scope.temporaryObject.selectors[0].services[i].brands.length;j++)
                       {
                                   if($scope.temporaryObject.selectors[0].services[i].brands[j].brandId==a){
                                       for(var k=0;k<$scope.temporaryObject.selectors[i].services[i].brands[j].products.length;k++)
                                           {
                                               if(b.productId==$scope.temporaryObject.selectors[0].services[i].brands[j].products[k].productId)
                                                   {
                                                       flag=true;
                                                       break;
                                                   }
                                           }
                                       break;
                                   }
                       }
                   if(flag){
                       break;
                   }
               }

                        return flag;
               }
               $scope.filterservice=function(a,b,c)
               {
                            ////console.log("hello")
                            var flag=false;
                            for(var i=0;i<c.length;c++) {
                                if (c[i].brandId == a) {
                                    for (var j = 0; j < c[i].products.length; j++) {
                                        for (var k = 0; k < c[i].products[j].services.length; k++) {
                                        if (c[i].products[j].services[k].serviceCode == b) {
                                                         flag = true;
                                            }}}
                                        }}
                                                return flag;
                }
}
        $scope.createAppointment=function(flag,b,m) {
            
            if(m=='forEvent')
               {
                 fbq('track','InitiateCheckout');
                  ga('send', {
                hitType: 'event',
                eventCategory: 'createAppointment',
                eventAction: 'Click',
                eventLabel: 'createAppointment'
                });
               }
            
            if(b=='initialise'){
                $scope.finalData.useLoyalityPoints=1;
                $scope.finalData.useMembershipCredits=1;
                $scope.finalData.useSubscriptionCredits=1
            }
            $scope.bookedAppointment=true
               ////console.log($scope.finalData);
                var a=$scope.filterFinalData();
                ////console.log(a)
                 if(a.useLoyalityPoints==undefined)
                {
                    a.useLoyalityPoints=0;
                }
            if(a.useMembershipCredits==undefined)
                {
                    a.useMembershipCredits=0
                }
            if(a.useSubscriptionCredits==undefined)
                {
                   a.useSubscriptionCredits=0
                }
                $http.post("/loggedapi/appointmentv3",a).success(function(res){

                    $scope.finalData.appointmentData=res.data;
                    ////console.log(res)
                    $scope.finalData.subscriptionAmount=$scope.finalData.appointmentData.subscriptionAmount;
                    $scope.saveOnChange()
            $scope.finalData.appointmentData.membersipCreditsLeft=parseInt($scope.finalData.appointmentData.membersipCreditsLeft)
                    if(b=='initialise')
            {
                    $scope.finalData.useMembershipCredits=$scope.finalData.appointmentData.membersipCreditsLeft?1:0
                     $scope.finalData.useLoyalityPoints=$scope.finalData.appointmentData.usableLoyalityPoints?1:0
                      $scope.finalData.useSubscriptionCredits=$scope.finalData.appointmentData.redeemableSubscriptionLoyality?1:0;
                      $scope.bookedAppointment=false;
             }
            else{
                            $scope.bookedAppointment=false;
                      localStorageService.set("finalData",$scope.finalData);
                    }
              }).error(function(err){
                if(err=='Forbidden')
                {
                  localStorageService.set("accessToken",'');
                  $scope.back();
                }
              })

}
    $scope.back=function() {
            $scope.x=0;
                window.scrollTo(0,0);
                $scope.timeArray=[];
                $scope.selectedDeals=angular.copy($scope.cart.cartProduct);
                if($scope.passingObject.determinateValue==34){
        $scope.setPassingData(17,"default")
         $scope.refreshlocalStorage($scope.passingObject.showIt,$scope.passingObject.determinateValue)
        $scope.deals();
        $scope.hideNextButton=false;}
  else  if($scope.passingObject.determinateValue==67){
        $scope.setPassingData(34,"newsalondealListing")
      $scope.manageCart.refreshBack();
        $scope.listingFunction();
      $scope.refreshlocalStorage($scope.passingObject.showIt,$scope.passingObject.determinateValue)
      if($scope.cart.cartProduct.length==0)
        {
            $scope.back();
        }}

  else  if($scope.passingObject.determinateValue==76) {
        $scope.setPassingData(67,"scheduleAppointment")
         $scope.refreshlocalStorage($scope.passingObject.showIt,$scope.passingObject.determinateValue)
        $scope.runscheduleApp()}

   else if($scope.passingObject.determinateValue==86) {
        $scope.setPassingData(76,"loginPage")
        if(localStorageService.get("accessToken")!='' && localStorageService.get("accessToken")!=undefined)
        { $scope.back()}
   }
}       
        
        
   
        $scope.listingFunction=function() {
        $scope.loader=true;
          

        $http.post("/api/newDealsDetail",{selectedDeals:$scope.selectedDeals,latitude:parseFloat(localStorageService.get("newSalonDealLat")),longitude:parseFloat(localStorageService.get("newSalonDealLong"))})
        .success(function(res){
             ////console.log($scope)
            ////console.log(res)
            $scope.loader=false;
            $scope.salons=res.data.parlors;
            ////console.log($scope.salons)
      if(res.data.parlors.length>0){
            $scope.salons=$scope.salons.map(function(abc,dbc){
            abc.parlorservices=abc.deals.map(function(nameParlor){
            var temp={};
            for(var j=0;j<$scope.cart.cartProduct.length;j++)
            { if($scope.cart.cartProduct[j].dealId==nameParlor.dealId)
             {temp.name=$scope.cart.cartProduct[j].services[0].name;
                 break;}}
            nameParlor.name=temp.name;
            nameParlor.price=nameParlor.dealPrice;
            return nameParlor
                })
                return abc;})

 var custom={}
                custom=$scope.salons.reduce(function(custom,deals,index){
                            if(deals.distance<20 && $scope.salons[index+1].distance<20){
                                        ////console.log(deals.dealPrice);
                                        if(custom.index!=undefined){
                                                 if(deals.dealPrice<custom.customObj.dealPrice)
                                    {
                                             ////console.log(deals.dealPrice);
                                        custom.index=index;
                                        custom.customObj=angular.copy(deals);
                                    }
                                    
                                }
                                else{
                                        custom.index=index;
                                        custom.customObj=angular.copy(deals);
                                    }
                                   
                                }
                            return custom;
                },{})
                            ////console.log(custom)
                $scope.salons.splice(custom.index,1);
                $scope.salons.splice(0,1,custom.customObj)

            }

        })



    }
       

        $scope.parlorDetails=function(value,param2){
        window.scrollTo(0,0);
            if(param2=='clicked')
        {
                ga('send', {
                hitType: 'event',
                eventCategory: 'salonSelected',
                eventAction: 'Click',
                eventLabel: 'salonSelected'
            });

                fbq('track','AddToWishlist');
        }
        var temporaryObject=$scope.salons.find(function(params){
            return params.parlorId==value;
        })

        $scope.cart.parlorOpeningTime=temporaryObject.openingTime;
        $scope.cart.parlorClosingTime=temporaryObject.closingTime;
        $scope.cart.tax=temporaryObject.tax;
        $scope.cart.rating=temporaryObject.rating;
        $scope.manageCart.pushPriceAccordingtoSalon(temporaryObject);
        localStorageService.set("cartProducts",$scope.cart);
        $scope.setPassingData(67,"scheduleAppointment")
        $scope.hideNextButton=true;
    $scope.hideFooter=false;
    $scope.selectedParlor=temporaryObject;
    $scope.cart.address1=temporaryObject.address1;
    $scope.cart.address2=temporaryObject.address2;
    $scope.cart.dayClosed=temporaryObject.dayClosed;
    $scope.cart.parlorId=temporaryObject.parlorId
    $scope.cart.progress=$scope.passingObject.determinateValue;
    $scope.cart.status=$scope.passingObject.showIt;
    $scope.cart.dealPrice=$scope.selectedParlor.dealPrice;
    $scope.cart.menuPrice=$scope.selectedParlor.menuPrice;
    $scope.cart.name=$scope.selectedParlor.name;
    localStorageService.set("cartProducts",$scope.cart);

    $scope.runscheduleApp();


}
        $scope.runscheduleApp=function(){
            $scope.week=[];
            $scope.dateToday=new Date();

            $scope.check=false;
           $scope.activeDay=undefined;
           $scope.activeSlot=undefined;
            var plusTwo=$scope.dateToday.getHours()+1;
            var currentTime=new Date();
            if(currentTime.getMinutes()>30)
            {
                    currentTime.setMinutes(30)
            }
            else{
                currentTime.setMinutes(0)
            }
                 var closingTime=new Date();
                closingTime.setHours(parseInt($scope.cart.parlorClosingTime.substring(0,$scope.cart.parlorClosingTime.indexOf(":"))));
                closingTime.setMinutes(parseInt($scope.cart.parlorClosingTime.substring($scope.cart.parlorClosingTime.indexOf(":")+1)));
                currentTime.setHours(currentTime.getHours()+2)
    if (currentTime<closingTime) {
      $scope.week.push({
        day:new Date()
      });
      var days=6;
    }
    else {var days=7;$scope.check=true;}
        for (var i = 0; i < days; i++) {$scope.week.push({day: new Date($scope.dateToday.setDate($scope.dateToday.getDate() + 1))})}
}
        $scope.checkToday = function areSameDate(d1,d2,d3) {
        return (d1.getFullYear() == d2.getFullYear()
            && d1.getMonth() == d2.getMonth()
            && d1.getDate() == d2.getDate())

}
        var hours=function(t) {
    return Math.trunc((Math.abs(t))/(60*60*1000));
    }
        $scope.createTimeIntervals=function(day) {

     $scope.timeSetter=new Date(day);
        if($scope.checkToday(new Date(),new Date(day))){
        var d = new Date();
        var currentMinute=d.getMinutes();
        d.setTime(d.getTime() + 120*60000)
        if (currentMinute<30) {
          d.setMinutes(0);
        }
        else {
          d.setMinutes(30);
        }
        var temporaryOpeningTime=new Date(d);
        var tempOpeningTime=new Date();
        tempOpeningTime.setHours(parseInt($scope.cart.parlorOpeningTime.substring(0,$scope.cart.parlorOpeningTime.indexOf(":"))));
        tempOpeningTime.setMinutes(parseInt($scope.cart.parlorOpeningTime.substring($scope.cart.parlorOpeningTime.indexOf(":")+1)))
        if(temporaryOpeningTime<tempOpeningTime){
            d.setHours(parseInt($scope.cart.parlorOpeningTime));
            var index=$scope.cart.parlorOpeningTime.indexOf(":");
            var val=$scope.cart.parlorOpeningTime.substring(index+1);
            d.setMinutes(val);
        }

        var toCompare = new Date(d.getFullYear(),d.getMonth(),d.getDate(),parseInt($scope.cart.parlorClosingTime),0,0);
        var floatedValueForOpeningValue=parseFloat($scope.cart.parlorOpeningTime.replace(":",'.'));
        var floatedValueForClosingValue=parseFloat($scope.cart.parlorClosingTime.replace(":",'.'));
        if (d.getMinutes<30) {
                var h = (hours(toCompare-d)*2);
                if(h!=0)
                {
                    h=h+2;
                }
        }
        else {
          var h = (hours(toCompare-d)*2);
          if(h!=0)
          {
              h=h+1;
          }
        }
        var fullHours=h;
        var temp=floatedValueForClosingValue-parseInt(floatedValueForClosingValue);
        if(temp>0.2 && temp <0.4)
        {
            fullHours=h+1
        }
            $scope.timeArray = [];
            for (var i = 0; i < fullHours; i++){
                            $scope.timeArray.push({fromTime : new Date(d),toTime : new Date(d.setTime(d.getTime() + 30*60000))});
                }
      }
      else{
            $scope.timeArray = [];
            var floatedValueForOpeningValue=parseFloat($scope.cart.parlorOpeningTime.replace(":",'.'));
            var floatedValueForClosingValue=parseFloat($scope.cart.parlorClosingTime.replace(":",'.'));
            $scope.openingTime=parseFloat($scope.cart.parlorOpeningTime)
            var till = parseFloat($scope.cart.parlorClosingTime)-parseFloat($scope.cart.parlorOpeningTime)
            var fullHours=till*2;
            var temp01=floatedValueForOpeningValue-parseInt(floatedValueForOpeningValue);
            var setMin=0;
            if(temp01>0.2 && temp01 <0.4)
            {
                fullHours=fullHours-1
                setMin=30
            }
        $scope.timeSetter.setHours($scope.openingTime);
        $scope.timeSetter.setMinutes(setMin);
        $scope.timeSetter.setSeconds(0);
        var temp=floatedValueForClosingValue-parseInt(floatedValueForClosingValue);
        if(temp>0.2 && temp <0.4)
        {
            fullHours=fullHours+1
        }
        for (var i = 0; i < fullHours; i++) {
            $scope.timeArray.push({
            fromTime : new Date($scope.timeSetter),
            toTime : new Date($scope.timeSetter.setTime($scope.timeSetter.getTime() + 30*60000))
          });
        }
            ////console.log("time",$scope.timeArray);
      }



    }
        $scope.showTimeOfDay=function(index){
            ////console.log(new Date($scope.week[index].day).getDay()+1)
            ////console.log($scope.cart.dayClosed)
                if($scope.cart.dayClosed==0 || new Date($scope.week[index].day).getDay()+1!=$scope.cart.dayClosed)
            {
//                    $scope.activeSlot=0;
                $scope.activeSlot=undefined;
                $scope.activeDay=index;
                $scope.selectedDay=$scope.week[index];
                $scope.createTimeIntervals($scope.selectedDay.day);
            }
            else{
                alert("Parlor will be closed on this day");
            }


}
        $scope.selectedTimeSlot=function(index,selectedTime) {
            ga('send', {
                hitType: 'event',
                eventCategory: 'timeSelected',
                eventAction: 'Click',
                eventLabel: 'timeSelected'
            });
             ga('send', {
                hitType: 'event',
                eventCategory: 'dateSelected',
                eventAction: 'Click',
                eventLabel: 'dateSelected'
            });
                    $scope.activeSlot=index;
                    $scope.selectedTimeSlotValue=selectedTime;
                    $scope.cart.selectedTimeSlot=selectedTime;
                    localStorageService.set("cartProducts",$scope.cart);
                    $scope.finalData=$scope.manageCart.currentCart($scope.cart)
                     $scope.finalDataManiPulation.calculatePrice();
                if(localStorageService.get("accessToken")!='' &&localStorageService.get("accessToken")!=undefined )
                {
                             $scope.finalDataManiPulation.setfinaldata()
                    }
    $scope.finalData.appointmentData={};

    localStorageService.set("finalData",$scope.finalData)
            $scope.next();
}
        $scope.disableButton=true;
        $scope.enableLogin=function() {
        if($scope.user.phoneNumber!=undefined)
        {
         $scope.phoneString=$scope.user.phoneNumber.toString();
         if($scope.phoneString.length>9) {
                $scope.disableButton=false;
        }
        else{
            $scope.disableButton=true
        }
    }}
        $scope.smsLogin=function (ev) {
$scope.loaderProgress=true;
    $http.post("/api/sendOtpWeb",{phoneNumber:$scope.user.phoneNumber})
         .success(function(res){
                ////console.log(res)
                if(res.success)
                {
                    $scope.loaderProgress=false;
                     $scope.showOtp(ev)
                    ga('send', {
                        hitType: 'event',
                        eventCategory: 'sendOtp',
                        eventAction: 'Click',
                        eventLabel: 'sendOtp'
                    });
                    fbq("track","Lead")

                }
                else{
                    alert(res.message)
                   $scope.loaderProgress=false;
                }
    })
    $scope.finalDataManiPulation.calculatePrice();
}
        $scope.showDetails = function(ev) {
var options={templateUrl:"/website/views/showDetails.html",targetEvent:ev,controller:showDetailsCtrl,temporary:$scope.finalData,clickOutsideToClose:true};
            $mdDialog.show(options)
        }
        function showDetailsCtrl($scope,temporary){
                                                $scope.finalData=angular.copy(temporary);
                                                $scope.cancel=function(){
                                                    $mdDialog.hide()
                                                }
                                        }
        $scope.showOtp=function(ev){
        var options={templateUrl:"/website/views/enterOtp.html",targetEvent:ev,controller:otpSubmitted,temp:$scope.user.phoneNumber};
$mdDialog.show(options).then(function(res){
                        if(res)
                        { $scope.finalData.accessToken=res.accessToken;
                            $scope.finalData.userId=res.userId;
                            $scope.finalData.paymentOption=5;
                            $scope.finalData.useLoyalityPoints=false;
                            $scope.finalData.useMembershipCredits=false;
                            $scope.saveOnChange()
                            localStorageService.set("accessToken",res.accessToken)
                            $scope.accessToken=res.accessToken;
                            $scope.next();
                        }})
}
        function otpSubmitted($scope,temp){
    $scope.loadingProgress=false;
    $scope.user={};
    $scope.cancel=function(){
        $mdDialog.hide();
    }
    $scope.verifyOtp=function(){
        $scope.loadingProgress=true;
        $http.post("/api/verifyOtpForWebUser",{phoneNumber:temp,otp:$scope.user.otp,name:$scope.user.name})
            .success(function(res){
            ////console.log(res)
            $scope.loadingProgress=false;
            if(res.success)
            {
                ga('send', {
                    hitType: 'event',
                    eventCategory: 'submitOtp',
                    eventAction: 'Click',
                    eventLabel: 'submitOtp'
                });
                fbq('track','CompleteRegistration');
                ////console.log(res)
                localStorageService.set("loginData",res.data);
                $mdDialog.hide(res.data)
            }
            else{
                }
        }).error(function(res){
             $scope.loadingProgress=false;
        })
}
    $scope.resendOtp=function(){
        $scope.loadingProgress=true;
        $http.post("/api/sendOtpWeb",{phoneNumber:temp}).success(function(res){
                if(res.success)
                {$scope.loadingProgress=false;}
                else{$scope.loadingProgress=false;
                    alert(res.message)
                }
            })
    }
}
        $scope.bookAppointment=function() {
            if(!$scope.finalData.subscriptionAmount)
                {
                   $scope.finalData.subscriptionAmount=0;
                }
          
                ////console.log("$scope.finalData",$scope.finalData.subscriptionAmount + $scope.finalData.appointmentData.payableAmount);
    $scope.bookedAppointment=true;
            if(!$scope.finalData.useLoyalityPoints)
                {
                    $scope.finalData.useLoyalityPoints=0;
                }
            if(!$scope.finalData.useMembershipCredits)
                {
                    $scope.finalData.useMembershipCredits=0
                }
            if(!$scope.finalData.useSubscriptionCredits)
                {
                   $scope.finalData.useSubscriptionCredits=0
                }
if($scope.finalData.paymentOption==1){
 $http.post("/loggedapi/bookAndCapturePayment",{amount:$scope.finalData.appointmentData.payableAmount,appointmentId:$scope.finalData.appointmentData.appointmentId,accessToken:$scope.finalData.accessToken,paymentMethod:$scope.finalData.paymentOption,userId:$scope.finalData.userId,useLoyalityPoints:$scope.finalData.useLoyalityPoints}).success(function(response){
                        ////console.log(response)
                $scope.bookedAppointment=false
                if(response.success)
                {
                      fbq('track', 'Purchase',{
                          value:$scope.finalData.appointmentData.payableAmount+$scope.finalData.subscriptionAmount,
                          currency:'INR',
                          content_ids:$scope.cart.cartProduct.map(function(datas){return datas.services[0].serviceCode}),
                          content_type:'Service Purchased'
                      });
                        ga('send', {
                hitType: 'event',
                eventCategory: 'apptBooked',
                eventAction: 'Click',
                eventLabel: 'apptBooked',
                eventValue: $scope.finalData.subscriptionAmount + $scope.finalData.appointmentData.payableAmount
            });
                    alert("Your Appointment Booked Successfully")
                    $scope.cart={cartProduct:[]};
                    $scope.setPassingData(0,'default')
                    $scope.deals()
                    localStorageService.set("cartProducts",$scope.cart)
                }
            })
        }else
        {
            if($scope.finalData.subscriptionAmount>0)
                {
                    $scope.finalData.appointmentData.payableAmount=$scope.finalData.appointmentData.payableAmount+$scope.finalData.subscriptionAmount;
                }
             $scope.loader=true;
            var options = {
                "key": "rzp_live_c8wcuzLEGSGlJ5",
                "amount": JSON.stringify($scope.finalData.appointmentData.payableAmount*100), // 2000 paise = INR 20
                "name": "Be U Salons",
                "description": 'Appointment',
                "image": "http://res.cloudinary.com/dyqcevdpm/image/upload/v1491484496/beu-logo_srvetg.png",
                "handler": function (response){
                    alert("payment done");
                    ////console.log("razorpay response",response);
                    $http.post("/loggedapi/bookAndCapturePayment",{amount:$scope.finalData.appointmentData.payableAmount*100,appointmentId:$scope.finalData.appointmentData.appointmentId,accessToken:$scope.finalData.accessToken,razorpay_payment_id:response.razorpay_payment_id,paymentMethod:$scope.finalData.paymentOption,userId:$scope.finalData.userId,useLoyalityPoints:0}).success(function(response){
                        ////console.log("captured payment response",response)
                $scope.bookedAppointment=false
                        if(response.success)
                        {
                             fbq('track','Purchase',{
                          value:$scope.finalData.appointmentData.payableAmount+$scope.finalData.subscriptionAmount,
                           currency:'INR',
                          content_ids:$scope.cart.cartProduct.map(function(datas){return datas.services[0].serviceCode}),
                          content_type:'Service Purchased'
                      });
                                  ga('send', {
                hitType: 'event',
                eventCategory: 'apptBooked',
                eventAction: 'Click',
                eventLabel: 'apptBooked',
                eventValue: $scope.finalData.subscriptionAmount + $scope.finalData.appointmentData.payableAmount
            });
                            alert("Your Appointment Booked Successfully")
                            $scope.cart={cartProduct:[]};
                            $scope.setPassingData(0,'default')
                            $scope.deals();
                            localStorageService.set("cartProducts",$scope.cart)
                        }
                })


                },
                "prefill": {
                },
                "notes": {
                    "appointmentId":$scope.finalData.appointmentData.appointmentId
                },
                "theme": {
                    "color": "#ff0000"
                },
                "modal":{
                  "ondismiss":function(){
                    $scope.loader=false;
                      $scope.bookedAppointment=false
                  }
                }
            };
            var rzp1 = new Razorpay(options);
            rzp1.open();
            $scope.loader=true;
            e.preventDefault();




        }
//        $http.post("http://www.beusalons.com/loggedapi/boo")


/********************************************book appointment code stop********************************************/
  }
        $scope.viewCart=function(a,ev,thirdParam){
                var options={templateUrl:"/website/views/viewCart.html",targetEvent:ev,controller:viewCart,temporary:a,temporaryData:$scope.passingObject,checkFlag:thirdParam,cart:$scope.cart};
     $mdDialog.show(options).then(function(param,temp,c,index,operation){
                ////console.log(param)
                    if(!Array.isArray(param))
                    {
                                    if(param.flag)
                            {
                                $scope.manageCart.manipulationOnFinalAction();
                                $scope.finalDataManiPulation.calculatePriceAccordingToTax();
                                $scope.createAppointment();
                            }
                               
                    }
                else{
                       if(param.length==0)
                        {
                                    $scope.cart.totalPrice=0;
                                $scope.cart.totalQuantity=0;
                                $scope.cart.progress=0;
                                $scope.cart.status="default";
                                $scope.setPassingData(0,"default")
                                if($scope.passingObject.determinateValue>17){
                                    $scope.deals(); 
                                }
                            else{
                                  $scope.manageCart.calculateQuantityandPrice();
                                $scope.manageCart.refreshCart()
                            }
                               
                               
                        }
                        else
                        {
                            $scope.cart.cartProduct=angular.copy(param);
                            $scope.cart.temp=angular.copy(temp);
                            $scope.manageCart.calculateQuantityandPrice();
                            if($scope.passingObject.showIt=="default")
                            {
                               $scope.manageCart.refreshCart();
                            }
                            else if($scope.passingObject.determinateValue==34)
                            {
//                                $scope.selectedDeals=$scope.cart.cartProduct.map(function(mk){
//                               return mk;})
//                                $scope.listingFunction();
//                                ////console.log($scope.cart)

                            }
                         }
                            localStorageService.set("cartProducts",$scope.cart);
                    
                    
                }
                         

            })
}
        function viewCart(temporary,$scope,temporaryData,checkFlag,cart){
            $scope.checkFlag=checkFlag;
            if(!checkFlag){
                 $scope.progress=temporaryData;
        $scope.cartProducts=temporary;
        var a=localStorageService.get("cartProducts");
        $scope.totalPrice=$scope.cartProducts.reduce(function(a,val){
                a=(val.price*val.quantity)+a;
                return a},0)
    $scope.totalMenuPrice=$scope.cartProducts.reduce(function(b,val){
                b=(val.menuPrice*val.quantity)+b;
                return b;
            },0)
  
        
        
        }
else{
                    $scope.cartProducts=temporary.services;
                    $scope.totalPrice=$scope.cartProducts.reduce(function(a,val){
                        a=(val.price*val.quantity)+a;
                return a},0)
            $scope.totalMenuPrice=$scope.cartProducts.reduce(function(b,val){
                b=(val.menuPrice*val.quantity)+b;
                return b;
            },0)
            }
            $scope.myFunction=function(m){   if(checkFlag){  
                    var data={param:'addButtonInCart',index:m,flag:true}
                        $scope.cartProducts[m].quantity++;
                        if($scope.cartProducts[m].productId){$scope.addToCartNow('product',$scope.cartProducts[m].productId)}else if($scope.cartProducts[m].brandId){$scope.addToCartNow('brand',$scope.cartProducts[m].brandId)}else{$scope.addToCartNow('service',$scope.cartProducts[m].serviceCode)}
                }else{$scope.add(m)
                }}
$scope.substractIt=function(m){
                if(checkFlag)
                {
                    if($scope.cartProducts.length==1 && $scope.cartProducts[0].quantity==1)
                    {
                            alert('You must have at least one service in your cart in order to proceed with your payment.')
                    }
                    else{
                        $scope.changingFlag=true;
                       var data={param:'substractButtonInCart',index:m,flag:true}
                        $scope.cartProducts=$scope.cartProducts.map(function(dummy,index){
                        if(m==index){dummy.quantity--;
                        if(dummy.productId){
                $scope.removeFromDummyCart('product',dummy.productId,index)                 }
                    else if(dummy.brandId){
                    $scope.removeFromDummyCart('brand',dummy.brandId,index)}
                    else {
                        $scope.removeFromDummyCart('service',dummy.serviceCode,index)
                    };}
                        return dummy;});
                    if($scope.cartProducts[m].quantity==0){$scope.cartProducts.splice(m,1)} 
                        
                        
                    }
                        
                }
                else
                { $scope.substract(m)
                }
            }
$scope.removeFromDummyCart=function(c,d,e){
            $scope.removeFlag=false;
                                    cart.cartProduct=cart.cartProduct.map(function(m,index){
                                                var flag=0
                                               if(c=='service'){
                                                    if(m.services[0].serviceCode==d)
                                                    {flag=1}}
                                                else if(c=='brand'){if(m.services[0].brandId==d){flag=1}
                                            }
                                            else{
                                                if(m.services[0].productId==d)
                                                    {
                                                      flag=1 
                                                    }
                                                }
                                                        if(flag==1){m.quantity--;
                                                                    if(m.quantity==0)
                                                                    {$scope.removeFlag=true;}
                                                                    }
                                        
                                        return m;})
                                                    if($scope.removeFlag)
                                                {
                                                    cart.cartProduct.splice(cart.cartProduct.findIndex(function(m){return m.quantity==0}),1)
                                                  cart.previousPrice.splice(cart.cartProduct.findIndex(function(m){return m.quantity==0}),1);
                                                    cart.previousMenuPrice.splice(cart.cartProduct.findIndex(function(m){return m.quantity==0}),1)
                                                }
                                            $scope.calculatePrice();
                                        ////console.log($scope.cartProducts);
                                        ////console.log(cart)
//                                                $scope.manageCart.calculateQuantityandPrice();
                             localStorageService.set("cartProducts",cart);
        }
$scope.addToCartNow=function(medium,data){
    $scope.changingFlag=true;
     cart.cartProduct=cart.cartProduct.map(function(m,index){
                                            var flag=0
                                                    if(medium=='service'){
                                                        if(data==m.services[0].serviceCode){flag=1}}
                                                    else if(medium=='brand'){
                                                if(data==m.services[0].brandId){flag=1}    
                                            }
                                                else{if(data==m.services[0].productId){flag=1}}
                                                if(flag==1){m.quantity++}
                                                return m
                                        })
                                        $scope.calculatePrice();
//                                $scope.manageCart.calculateQuantityandPrice()
                                localStorageService.set("cartProducts",cart);
}

$scope.calculatePrice=function(){
                                                var a={price:0,quantity:0,menuPrice:0};
                                                    a=cart.cartProduct.reduce(function(sum,val){
                                                    var a=val.quantity*val.price;
                                                    var b=val.quantity*val.menuPrice;
                                                    sum.price=sum.price+a;
                                                    sum.quantity=sum.quantity+val.quantity;
                                                                    sum.menuPrice=sum.menuPrice+b
                                                                    return sum},a)
                                       cart.totalPrice=a.price;
                                        cart.totalQuantity=a.quantity;
                                        cart.totalMenuPrice=a.menuPrice;
                                    $scope.totalPrice=cart.totalPrice;
                                    $scope.totalMenuPrice=cart.totalMenuPrice;
}
$scope.add=function(i){
        $scope.cartProducts[i].quantity++
        $scope.totalPrice=$scope.cartProducts.reduce(function(a,val){
                a=(val.price*val.quantity)+a;
                return a
            },0)
            $scope.totalMenuPrice=$scope.cartProducts.reduce(function(b,val){
                b=(val.menuPrice*val.quantity)+b;

                return b;
            },0)
    }
$scope.cancel=function(){
                    if(checkFlag){
                        $mdDialog.hide({flag:$scope.changingFlag?true:false})}
                    else{ $mdDialog.hide($scope.cartProducts,a)}}
$scope.substract=function(i){
        $scope.cartProducts[i].quantity--;
        if($scope.cartProducts[i].quantity==0)
        {
            $scope.cartProducts.splice(i,1)
                if(a.temp!=undefined)
            {
                a.splice(i,1);
            }

        }

            $scope.totalPrice=$scope.cartProducts.reduce(function(a,val){
                 a=(val.price*val.quantity)+a;
                return a
            },0)
            $scope.totalMenuPrice=$scope.cartProducts.reduce(function(b,val){
                 b=(val.menuPrice*val.quantity)+b;
                return b;
            },0)
        if($scope.cartProducts.length==0)
        {
            $scope.cancel();
        }
    }}
        $scope.togglemobile=function(a){
            ga('send', {
                hitType: 'event',
                eventCategory: 'salonServicesViewed',
                eventAction: 'Click',
                eventLabel: 'salonServicesViewed'
            });
      $scope.salons=$scope.salons.map(function(c,i){
                      if(a.parlorId==c.parlorId)
                  {
                      c.state= !c.state;
                  }
          return c
      })
  }
        $scope.refreshlocalStorage=function(a,b){
        $scope.cart.status=a;
        $scope.cart.progress=b;
        localStorageService.set("cartProducts",$scope.cart)
    }
        $scope.filterFinalData=function(){
            ////console.log($scope.finalData)
                   var a={};
                    if($scope.finalData.couponCodeId)
                    {
                            a.couponCodeId=$scope.finalData.couponCodeId
                             a.couponCode=$scope.finalData.code;
                    }
                    if($scope.finalData.buySubscriptionId)
                    {
                            a.buySubscriptionId=$scope.finalData.buySubscriptionId
                    }
                    if($scope.finalData.useSubscriptionCredits==0)
                    {
                           delete a.buySubscriptionId ;
                    }
                        a.mode=$scope.finalData.mode;
                        a.bookingMethod=$scope.finalData.bookingMethod;
                        a.useLoyalityPoints=$scope.finalData.useLoyalityPoints;
                        a.useMembershipCredits =$scope.finalData.useMembershipCredits ;
                        a.useSubscriptionCredits=$scope.finalData.useSubscriptionCredits;
                        a.parlorId=$scope.finalData.parlorId;
                        a.datetime=$scope.finalData.datetime;
                        a.paymentMethod=$scope.finalData.paymentOption;
                        a.userId=$scope.finalData.userId;
                        a.accessToken=$scope.finalData.accessToken;
                        a.services=$scope.finalData.services;
                        return a
            }
        $scope.refreshOnPage=function(){
    $scope.accessToken=localStorageService.get("accessToken")
        if(Array.isArray($scope.cart.cartProduct))
        {
             $scope.selectedDeals=$scope.cart.cartProduct.map(function(mk){
                               return mk;
              })
        }

        if($scope.cart.progress)
        {
            $scope.hideNextButton=true;
            $scope.setPassingData($scope.cart.progress,$scope.cart.status)
            if($scope.cart.progress==34)
                {
                     $scope.listingFunction();
                }
                else if($scope.cart.progress==67)
                {
                    $scope.runscheduleApp();
                }
                else if($scope.cart.progress==76)
                {
                    $scope.finalData=localStorageService.get("finalData");
                }
        else if($scope.cart.progress==86)
            {
                $scope.finalData=localStorageService.get("finalData");
                ////console.log($scope.finalData);
                    $scope.createAppointment('','initialise');
            }
            else{
                $scope.hideNextButton=false;
                $scope.deals();
            }
        }
        else{
            $scope.deals();
        }};
        $scope.runWhenroutesavail=function(temp){
        $scope.getServices(temp,temp.gender,temp,true)
}
        $scope.saveOnChange=function(){
    localStorageService.set("finalData",$scope.finalData);
}
        $scope.saveOnlocation=function(a,b){
     localStorageService.set('newSalonDealLat', a);
    localStorageService.set('newSalonDealLong', b);
    }
            if($routeParams.params) {
                    $scope.deals(true)
                   localStorageService.set("cartProducts",{})
            }
else  if($routeParams.serviceCode!=undefined && $routeParams.dealId!=undefined && $routeParams.depId!=undefined ){
            localStorageService.set("cartProducts",{})
            var temp={}
            temp.dealId=parseInt($routeParams.dealId);
            temp.departmentId=$routeParams.depId;
            temp.gender=$routeParams.gender;
            temp.quantity=1;
            temp.services=[{serviceCode:parseInt($routeParams.serviceCode)}]
            if($routeParams.productId)
                {
                        temp.services[0].productId=$routeParams.productId;
                }
                 if($routeParams.brandId)
                {
                    temp.services[0].brandId=$routeParams.brandId;
                }
                $scope.runWhenroutesavail(temp);
 }
        else if(!localStorageService.get("cartProducts")){$scope.deals();}
        else {
            $scope.cart=angular.copy(localStorageService.get("cartProducts"))
            if($scope.cart.cartProduct==undefined)
                {
                    $scope.cart.cartProduct=[];
                }
            $scope.refreshOnPage()
        }
    
    $scope.selectedServicesChange=function(item){
        try{
        var singleObject=angular.copy($scope.salondealdepartment)
        $scope.getServices.bind({checkItNow:true})(singleObject.deals.filter(function(abc){abc.departments=abc.departments.filter(function(def){ return def.departmentId==item.departmentId});
            return abc.gender==$scope.gender.gend;}).map(function(data){return data.departments[0]})[0],$scope.gender.gend,item);
        }
        catch(exception){}
 
    }
    $scope.couponCode=function(event){
var options={templateUrl:"/website/views/couponCode.html",clickOutsideToClose:true,targetEvent:event,controller:couponCode,temporary:$scope.finalData.couponCodeList};
            $mdDialog.show(options).then(function(res){
                ////console.log("he")
                    if(res){
                           if(res.length>0){
                               $scope.finalData.couponCodeId=res[0].couponId;
                                $scope.finalData.code=res[0].code;
                            $scope.createAppointment(true)
                        }
                 }

                })
}
    $rootScope.$on('duScrollspy:becameActive', function($event, $element, $target){
        ////console.log($scope.paramFlag)
        if($scope.paramFlag==true)
        {
              
              
        }
        else{
               var filtered= $scope.salondealdepartment.deals.filter(function(data){
                return data.gender==$scope.gender.gend;
             });
           var  array=[];
        filtered[0].departments.forEach(function(datas){
                 if(datas.openFlag)
                {
                        array.push(datas.name)
                }
             })

    var abc= $scope.salondealdepartment.deals.filter(function(s){
                                    return s.gender==$scope.gender.gend;
                                    })


    abc[0].departments.forEach(function(data){
                                    if(array[0]==data.name)
                                {
                                            data.categories.forEach(function(data1,index){
                                if(data1.categoryId!=1 && $element.attr('id')!=data1.categoryId+index.toString() && document.getElementById(data1.categoryId+index.toString())!=null)
                    {if(document.getElementById(data1.categoryId+index.toString()).classList.contains("active"))
                    {document.getElementById(data1.categoryId+index.toString()).classList.remove("active") }}})
    }
    })
              angular.element($event.target).addClass("active")
        }})
function couponCode($scope,temporary){
                $scope.couponCodes=angular.copy(temporary);
                $scope.assign=function(a){
                        $scope.codes=a
                }
                $scope.applied=function(){
                if($scope.codes!='' && $scope.codes!=undefined)
                {var a=$scope.couponCodes.filter(function(a){
                        return a.code==$scope.codes;
                    })
                    $mdDialog.hide(a)
                }}
                $scope.cancel=function(){
                $mdDialog.hide()
            }
        }
$scope.checkItsClass=function(a,b,c){
            function aFunctionName(){
                        if(angular.element(a.target).hasClass('active'))
                            {
                            }else{
var abc= $scope.salondealdepartment.deals.filter(function(s){
                            return s.gender==$scope.gender.gend;
        })
        abc[0].departments.forEach(function(data){
if(b==data.name)
{
                                        data.categories.forEach(function(data1,index){
if(data1.categoryId!=1 &&document.getElementById(data1.categoryId+index.toString())!=null)
{
    if(document.getElementById(data1.categoryId+index.toString()).classList.contains("active"))
{
            document.getElementById(data1.categoryId+index.toString()).classList.remove("active")
}}
                                        })
                                }
})
                                angular.element(a.target).addClass("active")
                            }
}
                    setTimeout(aFunctionName, 800 );
}
 $scope.addButtonInCart=function(index){
            $scope.finalData.services[index].quantity++;
             if($scope.finalData.services[index].productId)
            {$scope.manageCart.instantlyAddToCart($scope.finalData.services[index].productId,'product')}
            else if($scope.finalData.services[index].brandId){
                $scope.manageCart.instantlyAddToCart($scope.finalData.services[index].brandId,'brand')
            }
            else{$scope.manageCart.instantlyAddToCart($scope.finalData.services[index].serviceCode,'service')}
            $scope.manageCart.manipulationOnFinalAction();
            $scope.finalDataManiPulation.calculatePriceAccordingToTax()
            
            if($scope.passingObject.determinateValue==86)
            {
                $scope.createAppointment();
            }
        }
$scope.substractButtonInCart=function(index){
            $scope.finalData.services[index].quantity--;
            if($scope.finalData.services[index].quantity==0)
            {
                    $scope.cart.previousPrice.splice(index,1)
                    $scope.cart.previousMenuPrice.splice(index,1);
               }
            if($scope.finalData.services[index].productId)
            {
                $scope.manageCart.instantlyRemoveFromCart($scope.finalData.services[index].productId,'product')
            }
            else if($scope.finalData.services[index].brandId){
                $scope.manageCart.instantlyRemoveFromCart($scope.finalData.services[index].brandId,'brand')
            }
            else{
                 $scope.manageCart.instantlyRemoveFromCart($scope.finalData.services[index].serviceCode,'service')
            }
            if($scope.finalData.services[index].quantity==0){$scope.finalData.services.splice(index,1)}
            $scope.manageCart.manipulationOnFinalAction();
            $scope.finalDataManiPulation.calculatePriceAccordingToTax()
      }
$scope.viewDetails=function(m){
        $scope.viewCart($scope.finalData,m,true)
    }
$scope.sideCartAdd=function(m){
       
            if($scope.passingObject.determinateValue<=34)
        {
            $scope.cart.cartProduct[m].quantity++;
            if($scope.passingObject.determinateValue<34)
            {
                 $scope.manageCart.calculateQuantityandPrice();
                    $scope.manageCart.refreshCart()
                   
            }
            else{
//                         $scope.manageCart.refreshBack(); 
                          $scope.manageCart.calculateQuantityandPrice();
                }
                localStorageService.set('cartProducts',$scope.cart)
        }
        else{
            if($scope.passingObject.determinateValue>67)
                {$scope.addButtonInCart(m);}
                    else{
                                $scope.cart.cartProduct[m].quantity++
                                $scope.manageCart.calculateQuantityandPrice(); 
                                localStorageService.set("cartProducts",$scope.cart)
                    }
            } 
            
    
       
    }
$scope.sideCartSubstract=function(m){
        $scope.x=0;
        if($scope.passingObject.determinateValue<34)
    {
            $scope.cart.cartProduct[m].quantity--;

        if($scope.passingObject.determinateValue<34)
            {
                $scope.manageCart.calculateQuantityandPrice();
                if($scope.cart.cartProduct[m].quantity==0)
                {
                     $scope.cart.cartProduct.splice(m,1); 
                }
                
                    $scope.manageCart.refreshCart()
            }
         localStorageService.set('cartProducts',$scope.cart)
    }
    else{
     
        if($scope.passingObject.determinateValue==34){
               $scope.cart.cartProduct[m].quantity-- ;
            
            if($scope.cart.cartProduct[m].quantity==0){
                 $scope.cart.cartProduct.splice(m,1);
                if($scope.cart.cartProduct.length==0)
                    {
                       $scope.cart.totalPrice=0;
                                $scope.cart.totalQuantity=0;
                                $scope.cart.progress=0;
                                $scope.cart.status="default";
                                $scope.setPassingData(0,"default");
                        $scope.deals();
                    }
               
            }
            $scope.manageCart.calculateQuantityandPrice()
             localStorageService.set('cartProducts',$scope.cart)
            }
        else  if($scope.passingObject.determinateValue==67){
            $scope.cart.cartProduct[m].quantity--;
              $scope.manageCart.calculateQuantityandPrice();
            if($scope.cart.cartProduct[m].quantity==0){
                $scope.cart.cartProduct.splice(m,1)
            $scope.cart.previousPrice.splice(m,1);
            $scope.cart.previousMenuPrice.splice(m,1); 
            }
           
            ////console.log($scope.cart)
              if($scope.cart.cartProduct.length==0)
                    {
                       $scope.cart.totalPrice=0;
                                $scope.cart.totalQuantity=0;
                                $scope.cart.progress=0;
                                $scope.cart.status="default";
                                $scope.setPassingData(0,"default");
                        $scope.deals();
                    }
                  localStorageService.set('cartProducts',$scope.cart)                                          
            }
    else{
        $scope.substractButtonInCart(m);
        ////console.log($scope.cart)
        if($scope.cart.cartProduct.length==0)
                    {
                       $scope.cart.totalPrice=0;
                                $scope.cart.totalQuantity=0;
                                $scope.cart.progress=0;
                                $scope.cart.status="default";
                                $scope.setPassingData(0,"default");
                                  localStorageService.set('cartProducts',$scope.cart) 
                        $scope.deals();
                    }
    }
}
 
    }
$scope.buySubscription=function(){
ga('send', {
              hitType: 'event',
              eventCategory: 'subscriptionAdded',
              eventAction: 'Click',
              eventLabel: 'subscriptionAdded'
          });
$scope.finalData.buySubscriptionId=angular.copy($scope.finalData.appointmentData.subscriptionSuggestion.subscriptionId);
$scope.finalData.useSubscriptionCredits=1;
$scope.createAppointment();
}

$scope.filterBy=function(){
    
    
    var options={templateUrl:"/website/views/filterpop.html",controller:filterPrices};
     $mdDialog.show(options).then(function(){
           
      
       
            })
  
  $scope.name="parloer";
      ////console.log($scope.name)
          
}
function filterPrices($scope){
    
     $scope.cancel = function () {
         ////console.log('close');
                $mdDialog.hide();
            };
    
}


}]).value('duScrollOffset',30).value('duScrollCancelOnEvents', false);
