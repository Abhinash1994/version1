'use strict';

/* App Module */


var app = angular.module('app', [
  'oc.lazyLoad',
  'ngRoute',
  'ngResource',
  'ngMaterial',
  'vAccordion',
  'ngMdIcons',
  'ngAnimate',
  'duScroll',
  'ngProgress',
  'material.svgAssetsCache',
  'ngMessages',
  'LocalStorageModule',
  'satellizer',
  'mdPickers',
  'socialLogin',
  'ngGeolocation',
  'jkAngularCarousel',
  'ui.carousel',
  '720kb.fx',
    'ngSanitize',
    'updateMeta',
    'mdPickers'
]);

app.factory("LatLong",function($http){
    var url='/api/search?lat=';
    var b='&lng=';
    var getLatLong={}
    getLatLong.getNamefromlatlong=function(lat,long){
       return $http.get(url+lat+b+long);
    }
    return getLatLong;
})


app.run(['$anchorScroll', function($anchorScroll) {
  $anchorScroll.yOffset = 50;   // always scroll by 50 extra pixels
}])
app.run(['Carousel', function(Carousel) {
    Carousel.setOptions({});
}]);
app.service("filterProduct",function()
{
    var thisOne=this;
    this.filterParlorTypes=function(param,param2){
                var temp=param;
                if(! Array.isArray(param2))
            {
                param2=[];
            }
        return param2
    },
    this.getThefilterService=function(temporaryObject){
      var  onetwothree = [{type:0},{type:1},{type:2}]
        var temporary={refineProduct:[], refineBrands:[], refineServices:[]}
     for(var i=0;i<temporaryObject.selectors[0].services.length;i++)
    {
        var  onetwothreeService = [{type:0},{type:1},{type:2}]
        for (var j=0;j<temporaryObject.selectors[0].services[i].brands.length;j++)
        {
             var  onetwothreeBrand = [{type:0},{type:1},{type:2}]
                var brandFlag=false;
            for(var k=0;k<temporary.refineBrands.length;k++)
            {
                if(temporary.refineBrands[k].brandId==temporaryObject.selectors[0].services[i].brands[j].brandId)
                        {
                                        brandFlag=true;
                        }
            }
                for(var l=0;l<temporaryObject.selectors[0].services[i].brands[j].products.length;l++)
            {
                 var  onetwothreeProduct = [{type:0},{type:1},{type:2}]
                    var productFlag=false;
                for(var m=0;m<temporary.refineProduct.length;m++)
                    {
                    if(temporary.refineProduct[m].productId==temporaryObject.selectors[0].services[i].brands[j].products[l].productId)
                        {
                            productFlag=true
                            break;
                        }
                    }
                 console.log(temporaryObject.selectors[0].services[i].brands[j].products[l].parlorTypes)
                if(Array.isArray(temporaryObject.selectors[0].services[i].brands[j].products[l].parlorTypes))
                {
                    for(var products=0;products<temporaryObject.selectors[0].services[i].brands[j].products[l].parlorTypes.length;products++){
                                onetwothreeProduct[temporaryObject.selectors[0].services[i].brands[j].products[l].parlorTypes[products].type]=temporaryObject.selectors[0].services[i].brands[j].products[l].parlorTypes[products];
                    };
                }

                    if(!productFlag)
                {
                    temporaryObject.selectors[0].services[i].brands[j].products[l].parlorTypes=onetwothreeProduct;
                        temporary.refineProduct.push(temporaryObject.selectors[0].services[i].brands[j].products[l]);
                }
          }
            if(Array.isArray(temporaryObject.selectors[0].services[i].brands[j].parlorTypes))
            {
               for(var products=0;products<temporaryObject.selectors[0].services[i].brands[j].parlorTypes.length;products++){
                 if(temporaryObject.selectors[0].services[i].brands[j].parlorTypes[products]==null)
                     {
                         break;
                     }
                   onetwothreeBrand[temporaryObject.selectors[0].services[i].brands[j].parlorTypes[products].type]=temporaryObject.selectors[0].services[i].brands[j].parlorTypes[products];
                            };
            }

                             if(!brandFlag)
                            {
                              temporaryObject.selectors[0].services[i].brands[j].parlorTypes=onetwothreeBrand;
                              temporary.refineBrands.push(temporaryObject.selectors[0].services[i].brands[j]);
                            }
                 }
         for(var products=0;products<temporaryObject.selectors[0].services[i].parlorTypes.length;products++){
             onetwothreeService[temporaryObject.selectors[0].services[i].parlorTypes[products].type]=temporaryObject.selectors[0].services[i].parlorTypes[products];
                            };

            if(temporaryObject.selectors[0].services[i].parlorTypes.length>0)
            {
                temporaryObject.selectors[0].services[i].parlorTypes=onetwothreeService;
            }

        temporary.refineServices.push(temporaryObject.selectors[0].services[i])
    }

    return temporary;


    },
    this.getThefilterSubcategory=function(temporaryObject){
         var tempObject={refineBrands:[],refineProduct:[],refineServices:[]}
    for(var i=0;i<temporaryObject.selectors[0].brands.length;i++)
    {
        var tempBrands=[{type:0},{type:1},{type:2}]
        var productFlag=false;
        for(var j=0;j<temporaryObject.selectors[0].brands[i].products.length;j++)
        {
              var tempsForParlors=angular.copy(temporaryObject.selectors[0].brands[i].products[j])
             var tempProducts=[{type:0},{type:1},{type:2}]
            var serviceFlag=false;
             for(var productLoop=0;productLoop<tempObject.refineProduct.length;productLoop++ )
                 {
                     if(tempObject.refineProduct[productLoop].productId==temporaryObject.selectors[0].brands[i].products[j].productId)
                    {
                        productFlag=true;
                        break;
                    }
                 }
            if(!productFlag && temporaryObject.selectors[0].brands[i].products[j].productId!=null)
            {
                tempObject.refineProduct.push(temporaryObject.selectors[0].brands[i].products[j]);
            }
            for(var k=0;k<temporaryObject.selectors[0].brands[i].products[j].services.length;k++)
            {
                var tempsForParlors=angular.copy(temporaryObject.selectors[0].brands[i].products[j].services[k])
                var tempServices=[]
                if(tempsForParlors.parlorTypes.length>0){
                     console.log(tempsForParlors)
                    tempServices=[{type:0},{type:1},{type:2}]
                    if(tempsForParlors.parlorTypes.length>0)
                {
                   console.log(tempsForParlors)
                   for(var products=0;products<tempsForParlors.parlorTypes.length;products++)
                    {
                        console.log(tempsForParlors)
                        tempServices[tempsForParlors.parlorTypes[products].type]=tempsForParlors.parlorTypes[products]
                    }
                }

                }

               for(var l=0;l<tempObject.refineServices.length;l++)
                {
        if(tempObject.refineServices[l].serviceCode==temporaryObject.selectors[0].brands[i].products[j].services[k].serviceCode){
                        serviceFlag=true;
                    }

                }

                console.log(tempServices)
                temporaryObject.selectors[0].brands[i].products[j].services[k].parlorTypes=angular.copy(tempServices);

                 if(!serviceFlag)
                    {
                        tempObject.refineServices.push(temporaryObject.selectors[0].brands[i].products[j].services[k])
                    }
            }
        }
        if(temporaryObject.selectors[0].brands[i].brandId!=null)
        {
            tempObject.refineBrands.push(temporaryObject.selectors[0].brands[i])
        }

    }

    return tempObject;

    }
    this.getFinalProduct=function(levels,selected,wholeObject)
    {
        console.log(levels);
        var sendObject={deals:{dealId:wholeObject.dealId}};
            if(wholeObject.selectors[0].type=='service')
                {
                             if(levels.levelTwo.length==0)
                    {
                        sendObject.type="service"
                        var temp=levels.levelOne.filter(function(data){
                           return selected.group1==data.serviceCode;
                        })
                        sendObject.deals.services=[];
                        sendObject.deals.services.push(temp[0])
                    }
                    else
                    {
                        if(levels.levelThree.length==0)
                        {
                           if(levels.levelOne.length==0)
                            {
                                selected.group1=wholeObject.selectors[0].services[0].serviceCode;
                                 levels.levelOne=angular.copy(wholeObject.selectors[0].services)
                            }
                            sendObject.deals.services=levels.levelOne.filter(function(data){
                                            data.brands=data.brands.filter(function(datas){
                                                return   datas.brandId==selected.group2;
                                            })
                                            return data.serviceCode==selected.group1;
                            })
                            sendObject.type="Brand";


                        }
                        else{

                            if(levels.levelOne.length==0)
                            {
                                selected.group1=wholeObject.selectors[0].services[0].serviceCode;
                                levels.levelOne=angular.copy(wholeObject.selectors[0].services)
                            }
                              console.log(levels)
                             sendObject.deals.services=levels.levelOne.filter(function(data){
                                            data.brands=data.brands.filter(function(datas){
                                               datas.products=datas.products.filter(function(datass){
                                                   return datass.productId==selected.group3
                                               })
                                                return   datas.brandId==selected.group2;
                                            })
                                            return data.serviceCode==selected.group1;
                            })
                            sendObject.type="Product";
                        }

                    }

                }
            else{
                            if(levels.levelThree.length==0)
                            {
                                sendObject.type="Brand";
                                var temp=[];
                                temp=levels.levelTwo.filter(function(data){
                                            data.products=data.products.map(function(datas){
                                                datas.services=datas.services.filter(function(datass){
                                                    return datass.serviceCode==selected.group1
                                                })
                                                return datas
                                            })
                                       return  data.brandId==selected.group2;
                                })
                                console.log(temp)
                                sendObject.deals.services=[];
                                sendObject.deals.services.push(temp[0].products[0].services[0]);
                                sendObject.deals.services[0].brands=[];
                                sendObject.deals.services[0].brands=temp.map(function(data){
                                    return {
                                        brandId:data.brandId,
                                        brandName:data.brandName,
                                        parlorTypes:data.parlorTypes

                                    }
                                })
                            }
                            else{
                                sendObject.type="Product"
                                var temp=levels.levelTwo.filter(function(data){
                                            data.products=data.products.filter(function(datas){
                                                datas.services=datas.services.filter(function(datass){
                                                    return datass.serviceCode==selected.group1
                                                })
                                                return datas.productId==selected.group3
                                            })
                                       return  data.brandId==selected.group2;
                                })

                                 sendObject.deals.services=[];
                                sendObject.deals.services.push(temp[0].products[0].services[0]);
                                sendObject.deals.services[0].brands=[];
                                sendObject.deals.services[0].brands=temp.map(function(data){
                                    return {
                                        brandId:data.brandId,
                                        brandName:data.brandName,
                                        parlorTypes:data.parlorTypes,
                                        products:data.products
                                        }
                                })
                            }
                }

        return  sendObject;

    }

})
app.service('latitudeandlongitude',function(localStorageService){

    this.getlatlong=function(){
        var a={}
        if(localStorageService.get("newSalonDealLat")==undefined || localStorageService.get("newSalonDealLong")=='')
            {
                        a.latitude='28.52457'
                        a.longitude= '77.206615'
                    localStorageService.set("newSalonDealLat",a.latitude)
                    localStorageService.set("newSalonDealLong",a.longitude)
            }
        else{
                        a.latitude=localStorageService.get("newSalonDealLat")
                        a.longitude=localStorageService.get("newSalonDealLong")
            }

        return a
    }
})

app.config(['$routeProvider','$locationProvider','$ocLazyLoadProvider',
  function($routeProvider, $locationProvider,$ocLazyLoadProvider) {
 $ocLazyLoadProvider.config({
        debug: false,
        events: true,
    });

    $routeProvider
      .when('/', {
        templateUrl: '/website/views/home1.html',
        controller: 'HomeCtrl',
         resolve:{
           loadMyFiles: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app',
                        files: ['/website/javascripts/controllers/homeControllers.js?v=1']
                    })
                },}
      })
      .when('/home', {
        templateUrl: '/website/views/home1.html',
        controller: 'HomeCtrl',
         resolve:{
           loadMyFiles: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app',
                        files:
                        [
                            '/website/javascripts/controllers/homeControllers.js?v=1',
                            '/node_modules/angular-ui-carousel/dist/ui-carousel.js'
                          ]
                    })
                },
        }
      })
//    .when('/salon-listing/:variable', {
//        templateUrl: '/website/views/listing.html',
//        controller: 'ListingCtrl',
//        reloadOnSearch: false,
//        resolve:{
//           loadMyFiles: function($ocLazyLoad) {
//                    return $ocLazyLoad.load({
//                        name: 'app',
//                        files: [
//                            'website/javascripts/controllers/salonListingCtrl.js'
//
//                        ]
//                    })
//                },
//        }
//      })
          .when('/salon-listing/:variable', {
        templateUrl: '/website/views/salonListingNew.html',
        controller: 'ListingCtrl',
        reloadOnSearch: false,
        resolve:{
           loadMyFiles: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app',
                        files: [
                            'website/javascripts/controllers/salonListingCtrl.js'

                        ]
                    })
                },
        }
      })

  .when('/loginSalonDeals', {
    templateUrl: '/website/views/loginSalonDeals.html',
    controller: 'loginSalonDeals',
    reloadOnSearch: false,
    resolve:{
       loadMyFiles: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'app',
                    files: [
                        'website/javascripts/controllers/loginSalonDeals.js'

                    ]
                })
            },
    }
    })

  .when('/scheduleAppointment', {
    templateUrl: '/website/views/scheduleAppointment.html',
    controller: 'scheduleAppointment',
    reloadOnSearch: false,
    resolve:{
       loadMyFiles: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'app',
                    files: [
                        'website/javascripts/controllers/scheduleAppointment.js'

                    ]
                })
            },
    }
    })
    // .when('/salon-deal-listing', {
    //   templateUrl: '/website/views/salon-deal-listing.html',
    //   controller: 'ListingCtrl',
    //   reloadOnSearch: false,
    //   resolve:{
    //      loadMyFiles: function($ocLazyLoad) {
    //               return $ocLazyLoad.load({
    //                   name: 'app',
    //                   files: [
    //                       'website/javascripts/controllers/salonListingCtrl.js'
    //
    //                   ]
    //               })
    //           },
    //   }
    //   })
//       .when('/salon-listing/:variable', {
//           templateUrl: '/website/views/salonListingNew.html',
//           controller: 'ListingCtrl',
//           reloadOnSearch: false
//         })
    .when('/parlor-detail/:variable', {
        templateUrl: '/website/views/parlor-detail.html',
        controller: 'ParlorDetailCtrl',
          resolve:{
           loadMyFiles: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app',
                        files: ['website/javascripts/controllers/parlorDetailCtrl.js']})
                },
        }
       
      }).when('/userProfile', {
            templateUrl: '/website/views/userProfile.html',
            controller: 'userProfileCtrl',
             resolve:{
           loadMyFiles: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app',
                        files: ['website/javascripts/controllers/userProfileCtrl.js']})
                },
        }
      }) .when('/salon-near-me/:variable', {
        templateUrl: '/website/views/salon-detail.html',
        controller: 'SalonDetailCtrl',
          resolve:{
           loadMyFiles: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app',
                        files: ['website/javascripts/controllers/salonDetailCtrl.js']})
                },
        }
    })

      .when('/offerPage/:variable', {
        templateUrl: '/website/views/offerPage.html',
        controller: 'offerCtrl',
         resolve:{
           loadMyFiles: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app',
                        files: ['website/javascripts/controllers/offerCtrl.js']})
                },
        }
      })
      //subscription
      .when('/subscription/:campaign', {
        templateUrl: '/website/views/subscription.html',
        controller: 'subscriptionCtrl',
         resolve:{
           loadMyFiles: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app',
                        files: ['website/javascripts/controllers/subscriptionCtrl.js']})
                },
        }
      })
       .when('/subscription/', {
    redirectTo:'/subscription/default'
      })
    .when('/Subscription/', {
    redirectTo:'/subscription/default'
      })
       
      .when('/subscriber?', {
        templateUrl: '/website/views/subscriber.html',
        controller: 'subscriber',
         resolve:{
           loadMyFiles: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app',
                        files: ['website/javascripts/controllers/subscriber.js']})
                },
        }
      })
          .when('/salon-pass', {
        templateUrl: '/website/views/salonPass.html',
        controller: 'salonPass',
         resolve:{
           loadMyFiles: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app',
                        files: ['website/javascripts/controllers/salonPass.js']})
                },
        }
      })
           .when('/salon-pass-register', {
        templateUrl: '/website/views/affiliateRegisterNow.html',
        controller: 'salonPass',
         resolve:{
           loadMyFiles: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app',
                        files: ['website/javascripts/controllers/salonPass.js']})
                },
        }
      })

        .when('/salon-honer', {
        templateUrl: '/website/views/salon-honer.html',
        controller: 'salonPass',
         resolve:{
           loadMyFiles: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app',
                        files: ['website/javascripts/controllers/salonPass.js']})
                },
        }
      })
          .when('/new-payment-page/:apptId', {
        templateUrl: '/website/views/newPaymentPage.html',
        controller: 'newPaymentPage',
         resolve:{
           loadMyFiles: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app',
                        files: ['website/javascripts/controllers/newPaymentPageCtrl.js']})
                },
        }
      })
          .when('/terms-condition', {
        templateUrl: '/website/views/termCondition.html',
        controller: 'salonPass',
         resolve:{
           loadMyFiles: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app',
                        files: ['website/javascripts/controllers/salonPass.js']})
                },
        }
      })
      //salons deal page start-->


        .when('/salon-deals/:params/:gender/:serviceCode/:dealId', {
        templateUrl: '/website/views/newsalondeal.html',
        controller: 'newsalondealCtrl',
        pageTitle: 'Salon Deal Title',
         resolve:{
           loadMyFiles: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app',
                        files: ['website/javascripts/controllers/newsalondealCtrl.js']})
                },
        }
      })

      .when('/salon-deals?', {
        templateUrl: '/website/views/newsalondeal.html',
        controller: 'newsalondealCtrl',
         resolve:{
           loadMyFiles: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app',
                        files: ['website/javascripts/controllers/newsalondealCtrl.js']})
                },
        }
      })
      .when('/flash-sale', {
        templateUrl: '/website/views/flashSale.html',
        controller: 'flashSaleCtrl',
         resolve:{
           loadMyFiles: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app',
                        files: ['website/javascripts/controllers/flashSaleCtrl.js']})
                },
        }
      })


      // parlorLayout

      .when('/parlorLayout/:parlorId', {
      templateUrl: '/website/views/parlorLayout.html',
      controller: 'parlorLayout',
       resolve:{
         loadMyFiles: function($ocLazyLoad) {
                  return $ocLazyLoad.load({
                      name: 'app',
                      files: ['website/javascripts/controllers/parlorLayout.js']})
              },
      }
    })

    // parlorLayout

    // servicesDetails

          .when('/salon-services', {
          templateUrl: '/website/views/salonServices.html',
          controller: 'salonServices',
           resolve:{
             loadMyFiles: function($ocLazyLoad) {
                      return $ocLazyLoad.load({
                          name: 'app',
                          files: ['website/javascripts/controllers/salonServices.js']})
                  },
          }
        })
    // servicesDetails


    // salons deal page end-->

      .when('/popular-deals', {
        templateUrl: '/website/views/salonDeals.html',
        controller: 'salonDeals',
         resolve:{
           loadMyFiles: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app',
                        files: ['website/javascripts/controllers/salonDeals.js']})
                },
        }
      })
      .when('/best-hair-salon-app', {
        templateUrl: '/website/views/salonDeals1.html',
        controller: 'salonDeals',
         resolve:{
           loadMyFiles: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app',
                        files: ['website/javascripts/controllers/salonDeals.js']})
                },
        }
      })     
      // .when('/besthairsalonapp', {
      //   templateUrl: '/website/views/salonDeals1.html',
      //   controller: 'salonDeals'
      // })

      .when('/checkoutPage',{
        templateUrl:'/website/views/checkOut.html',
        controller:'headerCtrl'
    }).when('/aboutUs',{
        templateUrl:'/website/views/companyInfo/aboutUs.html',
        controller:''
    }).when('/contactUs',{
        templateUrl:'/website/views/companyInfo/contactUs.html',
        controller:'contactUs',
          resolve:{
           loadMyFiles: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app',
                        files: [
                            'website/javascripts/controllers/contactUs.js'

                        ]
                    })
                },
        }
    })
    .when('/franchise-enquiry',{
        templateUrl:'/website/views/companyInfo/submitFrenchiesEquery.html',
        controller:'submitFrenchiesEquery',
          resolve:{
           loadMyFiles: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app',
                        files: [
                            'website/javascripts/controllers/submitFrenchiesEquery.js'

                        ]
                    })
                },
        }
    }).when('/website-Query',{
        templateUrl:'/website/views/companyInfo/websiteAskQuery.html',
        controller:'websiteAskQuery',
          resolve:{
           loadMyFiles: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app',
                        files: [
                            'website/javascripts/controllers/websiteAskQueryCtrl.js'

                        ]
                    })
                },
        }
    }).when('/disclaimer',{
        templateUrl:'/website/views/companyInfo/disclaimer.html',
        controller:''
    }).when('/privacyPolicy',{
        templateUrl:'/website/views/companyInfo/privacyPolicy.html',
        controller:''
    }).when('/returnRefund',{
        templateUrl:'/website/views/companyInfo/returnRefund.html',
        controller:''
    }).when('/termsConditions',{
        templateUrl:'/website/views/companyInfo/termsConditions.html',
        controller:''
    }).when('/freeBees',{
        templateUrl:'/website/views/freeBeesPage.html',
        controller:'freeBeesCtrl',
          resolve:{
           loadMyFiles: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app',
                        files: [
                            'website/javascripts/controllers/freeBeesCtrl.js'

                        ]
                    })
                },
        }
    }).when('/faq',{
        templateUrl:'/website/views/companyInfo/faq.html',
        controller:''
    }).when('/appfaq',{
        templateUrl:'/website/views/companyInfo/appfaq.html',
        controller:'appfaqCtrl',
          resolve:{
           loadMyFiles: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app',
                        files: [
                            'website/javascripts/controllers/appfaqController.js'

                        ]
                    })
                },
        }
    }).when('/appTermsConditions',{
        templateUrl:'/website/views/companyInfo/appTermsConditions.html',
        controller:'appTermsConditionsCtrl',
          resolve:{
           loadMyFiles: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app',
                        files: [
                            'website/javascripts/controllers/appTermsConditionsController.js'

                        ]
                    })
                },
        }
    }).when('/search-beauty-export',{
        templateUrl:'/website/views/companyInfo/search-beauty-export.html',
        controller:'search-beauty-exportCtrl',
          resolve:{
           loadMyFiles: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app',
                        files: [
                            'website/javascripts/controllers/search-beauty-export.js'

                        ]
                    })
                },
        }
    }).when('/saerch-list/:param/:text',{
        templateUrl:'/website/views/companyInfo/saerch-list.html',
        controller:'search-listCtrl',
        resolve:{
           loadMyFiles: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app',
                        files: [
                            'website/javascripts/controllers/search-list.js'

                        ]
                    })
                },
        }
    })
    .when('/news',{
        templateUrl:'/website/views/companyInfo/news.html',
        controller:'news',
          resolve:{
           loadMyFiles: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app',
                        files: ['website/javascripts/controllers/newsCtrl.js']})},
        }
    })
      .otherwise({
        redirectTo: '/'
      });

/*      $locationProvider.html5Mode({
  enabled: true,
});*/

      $locationProvider.html5Mode(true);
  }]);


app.config(['localStorageServiceProvider',function(localStorageServiceProvider){
    localStorageServiceProvider.setPrefix('app');
}]);

    app.config(function($authProvider) {

        $authProvider.facebook({
            clientId: '1683006838636602'
        });

        // Optional: For client-side use (Implicit Grant), set responseType to 'token' (default: 'code')
        $authProvider.facebook({
            clientId: '332716867100293',
            responseType: 'token'
        });

        $authProvider.google({
            clientId: '793471872530-6pmdkjaq6lbmc1ah2mc3helbvg0mrs9v.apps.googleusercontent.com'
        });

        $authProvider.github({
            clientId: 'GitHub Client ID'
        });

       /* $authProvider.linkedin({
            clientId: 'LinkedIn Client ID'
        });*/

        $authProvider.instagram({
            clientId: 'Instagram Client ID'
        });

        $authProvider.yahoo({
            clientId: 'Yahoo Client ID / Consumer Key'
        });

        $authProvider.live({
            clientId: 'Microsoft Client ID'
        });

        $authProvider.twitch({
            clientId: 'Twitch Client ID'
        });

        $authProvider.bitbucket({
            clientId: 'Bitbucket Client ID'
        });

        $authProvider.spotify({
            clientId: 'Spotify Client ID'
        });

        // No additional setup required for Twitter

        $authProvider.oauth2({
            name: 'foursquare',
            url: '/auth/foursquare',
            clientId: 'Foursquare Client ID',
            redirectUri: window.location.origin,
            authorizationEndpoint: 'https://foursquare.com/oauth2/authenticate'
        });
        $authProvider.google({
            url: '/auth/google',
            authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
            redirectUri: window.location.origin,
            requiredUrlParams: ['scope'],
            optionalUrlParams: ['display','access_type'],
            scope: ['profile', 'email'],
            scopePrefix: 'openid',
            scopeDelimiter: ' ',
            display: 'popup',
            oauthType: '2.0',
            popupOptions: { width: 452, height: 633 },
            accessType: 'offline'
        });

    });
    app.config(function(socialProvider){


    socialProvider.setGoogleKey("793471872530-6pmdkjaq6lbmc1ah2mc3helbvg0mrs9v.apps.googleusercontent.com");


    socialProvider.setGoogleKey("YOUR GOOGLE CLIENT ID");
    //socialProvider.setLinkedInKey("YOUR LINKEDIN CLIENT ID");

    socialProvider.setFbKey({appId: "1683006838636602", apiVersion: "v2.1"});

    });



   app.controller('footerCtrl', ['$scope', '$http','$route','$routeParams','$location','ngProgressFactory','localStorageService','$rootScope',
    function($scope, $http,$route, $routeParams, $location,ngProgressFactory,localStorageService,$rootScope) {
        console.log($rootScope)
    $rootScope.$on('$locationChangeSuccess', function(event){
    $scope.currentPath=$location.path();
})
     
        // console.log("this",$scope.currentPath);
        //alert($scope.currentPath)
        /*if($scope.currentPath=="/salon-listing/"){

            alert("habad dabad")
        }*/
        $scope.hideFooterFlag=false;
        if(($scope.currentPath=='/appfaq')||($scope.currentPath=='/appTermsConditions')){
                $scope.hideFooterFlag=true;
        }
        console.log("inside user profile controller");


        $scope.goToAboutUs=function(){
            window.scrollTo(0,0);
            $location.path( '/aboutUs' );
        };


        $scope.goToContactUs=function(){
            window.scrollTo(0,0);
            $location.path('/contactUs' );
        };

        $scope.goToDisclaimer=function(){
            window.scrollTo(0,0);
            $location.path('/disclaimer' );
        };

        $scope.goToPrivacyPolicy=function(){
            window.scrollTo(0,0);
            $location.path('/privacyPolicy');
        };

        $scope.goToReturnRefund=function(){
            window.scrollTo(0,0);
            $location.path('/returnRefund');
        };

        $scope.goToTermsCondiions=function(){
            window.scrollTo(0,0);
            $location.path('/termsConditions');
        };
        $scope.goToFaq=function(){
            window.scrollTo(0,0);
            $location.path('/faq');
        };
         $scope.goToNews=function(){

            window.scrollTo(0,0);
            $location.path('/news');
        };
     $scope.goToDeals=function(){
            window.scrollTo(0,0);
            $location.path( '/salon-deals' );
        };
        
//          $scope.goToDeals=function(){
//            window.scrollTo(0,0);
//            $location.path( '/search-beauty-export' );
//        };
//        
        
        $scope.goToSubmitfrenchiseEnquery=function(){
               window.scrollTo(0,0);
               $location.path( '/franchise-enquiry' );
           };
             $scope.goToServiceDetails=function(){
               window.scrollTo(0,0);
               $location.path( '/salon-services' );
           };


    }]);

app.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});

app.directive('outerHeight', function($timeout){
  return{
    restrict:'A',
    link: function(scope, element){
       //using outerHeight() assumes you have jQuery
       //use Asok's method in comments if not using jQuery
       $timeout(function(){
        console.log(element[0].offsetHeight);
        var doc=document.getElementById(element[0].id)
        console.log(doc.offsetHeight);
        });

       if(element[0].id!='{{salon.name}}{{$index}}'){
        console.log(element[0].id);

       }

       //element[0].offsetHeight=500+'px';
    }
  };
});

/*app.service("Service", function () {
    var number = 0;

    function getNumber() {
        return number;
    }
    function setNumber(newNumber) {
        number = newNumber;
    }
    return {
        getNumber: getNumber,
        setNumber: setNumber,
    }
});*/
app.service('mySharedService', function($rootScope) {

    function prepForBroadcast () {
        broadcastItem();
    };

    function broadcastItem() {
        $rootScope.$broadcast('handleBroadcastForLoginPopUp');
    }


    return {
        prepForBroadcast: prepForBroadcast,
        broadcastItem: broadcastItem,
    }
});

app.service("Service", function () {
    var number=0;

    function getNumber() {
        return number;
    }
    function setNumber(newNumber) {
        number = newNumber;
    }
    return {
        getNumber: getNumber,
        setNumber: setNumber,
    }
});

app.service("salonListingSearchBoxBooleanService", function () {
    var flag=false;

    function getFlag() {
        return flag;
    }
    function setFlag(newFlag) {
        flag = newFlag;
    }
    return {
        getFlag: getFlag,
        setFlag: setFlag,
    }
});

app.service("headerOption", function () {
    var number;

    function getHeaderOption() {
        return number;
    }

    function setHeaderOption(newHeaderOption) {

        number = newHeaderOption;
    }
    return {
        getHeaderOption: getHeaderOption,
        setHeaderOption: setHeaderOption
    }
});

app.service("offerPageSearchLocation", function () {
    var offerLocation='Search parlor or location';

    function getOfferLocation() {
        return offerLocation;
    }

    function setOfferLocation(newHeaderOption) {

        offerLocation = newHeaderOption;
    }
    return {
        getOfferLocation: getOfferLocation,
        setOfferLocation: setOfferLocation
    }
});

app.factory("openSuccesfullDialogService",function(){
    var flag=false;

    function setFlag(passed){
        flag=passed;
    }

    function getFlag(){
        return flag;
    }

    return{
        setFlag:setFlag,
        getFlag:getFlag
    }
})


app.directive("scrollCheck", function ($window) {
    return function(scope, element, attrs) {
        angular.element($window).bind("scroll", function() {
            if (this.pageYOffset >= 200) {
                scope.boolChangeClass = true;
                console.log('Scrolled below header.');
            } else {
                scope.boolChangeClass = false;
                console.log('Header is in view.');
            }
            scope.$apply();
        });
    };
});

app.config(function (accordionConfig) {
        accordionConfig.expandAnimationDuration = 0;
    });

app.filter('capitalize', function() {
    return function(token) {
        return token.charAt(0).toUpperCase() + token.slice(1);
    }
});

app.directive('placeAutocomplete', function() {
        return {
            templateUrl: '/website/javascripts/directives/place-autocomplete.html',
            restrict: 'E',
            replace: true,
            scope: {
                'ngModel': '='
            },
            controller: function($scope, $q,$rootScope,localStorageService,$http,offerPageSearchLocation) {
                if (!google || !google.maps) {
                    throw new Error('Google Maps JS library is not loaded!');
                } else if (!google.maps.places) {
                    throw new Error('Google Maps JS library does not have the Places module');
                }
                var autocompleteService = new google.maps.places.AutocompleteService();
                var map = new google.maps.Map(document.createElement('div'));
                var placeService = new google.maps.places.PlacesService(map);
                $scope.ngModel = {};

                /**
                 * @ngdoc function
                 * @name getResults
                 * @description
                 *
                 * Helper function that accepts an input string
                 * and fetches the relevant location suggestions
                 *
                 * This wraps the Google Places Autocomplete Api
                 * in a promise.
                 *
                 * Refer: https://developers.google.com/maps/documentation/javascript/places-autocomplete#place_autocomplete_service
                 */
                var getResults = function(address) {
                    var deferred = $q.defer();
                    var request = {
                        input: address,
                        types: ['geocode'],
                        componentRestrictions: {country: 'in'},
                    };
                    autocompleteService.getPlacePredictions(request, function(data) {
                        deferred.resolve(data);
                    });
                    return deferred.promise;
                };

                /**
                 * @ngdoc function
                 * @name getDetails
                 * @description
                 * Helper function that accepts a place and fetches
                 * more information about the place. This is necessary
                 * to determine the latitude and longitude of the place.
                 *
                 * This wraps the Google Places Details Api in a promise.
                 *
                 * Refer: https://developers.google.com/maps/documentation/javascript/places#place_details_requests
                 */
                var getDetails = function(place) {
                    var deferred = $q.defer();
                    placeService.getDetails({
                        'placeId': place.place_id
                    }, function(details) {
                        deferred.resolve(details);
                    });
                    return deferred.promise;
                };

                $scope.search = function(input) {
                    console.log(input)
                    if (!input) {
                        return;
                    }
                    return getResults(input).then(function(places) {
                        console.log(places);
                        $scope.ngModel =places[0];

                        return places;
                    });
                };
                /**
                 * @ngdoc function
                 * @name getLatLng
                 * @description
                 * Updates the scope ngModel variable with details of the selected place.
                 * The latitude, longitude and name of the place are made available.
                 *
                 * This function is called every time a location is selected from among
                 * the suggestions.
                 */
                $rootScope.setNgModel=function(address,lat,long){
                    $scope.searchText = address;
                    localStorageService.set('offerPageSearchedLocation',address)

                }
                $scope.getLatLng = function(place) {
                    if (!place) {
                        $scope.ngModel = {};
                        return;
                    }
                    getDetails(place).then(function(details) {
                        $scope.ngModel = {
                            'name': place.description,
                            'latitude': details.geometry.location.lat(),
                            'longitude': details.geometry.location.lng(),
                        };
                        console.log($scope.ngModel);
                        localStorageService.set('offerPageSearchedLocation',$scope.ngModel.name);
                        $rootScope.myy($scope.ngModel)

                    });


                }
                if( localStorageService.get('offerPageSearchedLocation')!=undefined){
                    offerPageSearchLocation.setOfferLocation(localStorageService.get('offerPageSearchedLocation'));
                    $scope.searchText=offerPageSearchLocation.getOfferLocation();
                    console.log(offerPageSearchLocation.getOfferLocation())

                }else{
                    if(localStorageService.get("userDetectedLatitude")!=undefined){
                        $http.get('/api/search?lat='+localStorageService.get("userDetectedLatitude")+'&lng='+ localStorageService.get("userDetectedLongitude")).success(function(data){
                            console.log("this is place name");
                            console.log(data.data[0].formatted_address);
                            offerPageSearchLocation.setOfferLocation(data.data[0].formatted_address);
                            $scope.offerPlaceholder=offerPageSearchLocation.getOfferLocation();
                           // $scope.offerPlaceholder=data.results[0].formatted_address;

                        });
                    }else{
                        $scope.offerPlaceholder=offerPageSearchLocation;
                    }

                }

            }
        };
    });
