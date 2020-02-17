app.controller('subscriptionCtrl', ['$scope', '$http','$route','$routeParams','$location','ngProgressFactory','localStorageService','$mdDialog','$geolocation','Service','salonListingSearchBoxBooleanService','$rootScope','offerPageSearchLocation',
function($scope, $http,$route, $routeParams, $location,ngProgressFactory,localStorageService,$mdDialog,$rootScope,$sce,$updateMeta) {

//console.log("this calling");

// function upperCaseF(a){
//     setTimeout(function(){
//         a.value = a.value.toUpperCase();
//     }, 1);
// }
$scope.validphoneNumbr = /^\+?\d{2}[- ]?\d{3}[- ]?\d{5}$/;
$scope.user={}
$scope.tFlag=false
$scope.card1=true;
$scope.card2=false;
$scope.paymentMethod="razor"
$scope.couponApplied=false;
$scope.discount=0
  $scope.couponCode={couponCode:''}
//console.log("hi",$scope.couponCode);

// $scope.couponFlag=false;
// $scope.couponFlagTO=true;
$scope.applyCouponCode=function(){

console.log($scope.couponCode);

console.log("kal",{'amount':$scope.selectedSub.amount,'couponCode':$scope.couponCode.couponCode});
console.log($scope.couponCode);
 
      $http.post("api/checkCouponCode",{amount:$scope.selectedSub.amount,couponCode:$scope.couponCode.couponCode}).success(function(res) {
            console.log(res);
            $scope.applyCouponCodeData=res.data;
            
            if(res.success){
                $scope.discount=$scope.selectedSubscription.amount- res.data.amount;
                alert("Coupon Code Applied");
            }else{
                $scope.discount=0
                alert("Invalid Coupon Code")
            }
        }).error(function (error) {
            console.log(error)
           
        });
}



    $scope.bkcolor={
      'background-color':'#d2232a'
    }
    ga('set', 'page', '/Subscription');
    ga('send', 'pageview');
    
    //console.log($routeParams);

    $scope.loader=true;
    $scope.determinateValue=30;

    $scope.progressbar = ngProgressFactory.createInstance();
    $scope.progressbar.setColor("#d2232a");
    $scope.progressbar.start();
    $scope.panes=[];

    $scope.paytmPhone="";
    $http.get('/api/showSubscription').success(function(data) {
        console.log(data);
        $scope.data=data;
        console.log($scope.data);
        $scope.loader=false;
        $scope.panes=$scope.data.data.faq.questions;
        $scope.faq=$scope.data.data.faq.heading;
        $scope.title=data.data.selectSubscription;
        // var o=data.data.selectSubscription.subscriptionCount;
        // var p=o.substring(0,17)
        // var l=o.substring(17,40)
        // $scope.sub1=l;
        $scope.sub=data.data.selectSubscription.subscriptionCount;
        console.log($scope.sub)

        // var only=$scope.sub;

        $scope.selectedSub=data.data.selectSubscription.tile[0];
         $scope.selectedSub2=data.data.selectSubscription.tile[1];

        console.log($scope.selectedSub)
          console.log($scope.selectedSub2)
        $scope.detail=data.data.detail;
        $scope.availSteps=data.data.availSteps;
        var a=data.data.availSteps.heading;
        var b=a.substring(0,35)
        $scope.s=b;
        //console.log(b)
          var c=a.substring(35,60)
          $scope.haf=c;
          //console.log($scope.haf)


        // var a = $scope.availSteps.substring(0, 2);
        // //console.log(a)
        $scope.heading=data.data.detail.tnc;
        // $scope.renderHtml = function(heading){
        //     return $sce.trustAsHtml(heading);
        //   };
// $scope.applyCouponCode();

    });
    $scope.showPage=function(){
      //console.log("called");
      $scope.loader=false;
    }

    $scope.initPaytmPayment = function(ev,amount,titile){
      //console.log("paytm function");
       
            ga('send', {
                        hitType: 'event',
                        eventCategory: 'PaySubscription',
                        eventAction: 'Click',
                        eventLabel: $routeParams.campaign
});
            fbq('track', 'PaySubscription', {value:$routeParams.campaign});
        
       
      var options={
                    templateUrl:"/website/views/enterPhone.html",
                    targetEvent:ev,
                    clickOutsideToClose:true,
                    controller:phoneCtrl};

      function phoneCtrl($scope){
        $scope.cancel=function(){
            $mdDialog.hide()
        }
        $scope.phoneNumberPaytm=function(phone) {
          //console.log("working");
     
              fbq('track', 'Purchase',{
                          value:amount,
                          currency:'INR',
                          content_type:'Service Purchased',
                        content_ids:$routeParams.campaign
                      });
                      fbq('track', 'PaySubscription', { value:amount ,currency: 'INR',source:$routeParams.campaign});
                      
                      //console.log("amount",amount)
            $http.post('/api/initPaytmPayment', { phoneNumber:phone,amount:amount,couponCode:$scope.couponCode.couponCode}).success(function(re){
                fbq('track', 'Purchase',{
                    value:amount,
                    currency:'INR',
                    content_type:'Service Purchased',
                  content_ids:$routeParams.campaign
                });
              var paytmVar = re.data;
              console.log(paytmVar);
              var formData = "";
              for(var i=0; i<Object.keys(paytmVar).length; i++){
                  formData += '<input type="hidden" name="' + Object.keys(paytmVar)[i] +'" value="' + paytmVar[Object.keys(paytmVar)[i]] + '">';
              }
              document.getElementById('paytm').innerHTML += formData;
              document.getElementById('paytm').submit();
          });
        }
      }

      $mdDialog.show(options).then(function(res){
          //console.log("finished");
                              })
  };

    $scope.paySubscription=function(e,amount,title){
        fbq('track', 'PaySubscription', { value:amount ,currency: 'INR',source:$routeParams.campaign});
        fbq('track', 'Purchase',{
           value:amount,
           currency:'INR',
           content_type:'Purchased',
             content_ids:$routeParams.campaign
             });

//            fbq('track', 'Campaign', {value:$routeParams.campaign});
        ga('send', {
         hitType: 'event',
         eventCategory: 'PaySubscription',
         eventAction: 'Click',
         eventLabel: $routeParams.campaign
             });
        
       
//      ga('send', 'event', "PaySubscription","click","Send",amount);
      $scope.loader=true;
        var options = {
            "key": "rzp_live_c8wcuzLEGSGlJ5",
            "amount": JSON.stringify(amount*100), // 2000 paise = INR 20
            "name": "Be U Salons",
            "description": 'Buy ' +title+ ' Subscription @ '+ amount,
            "image": "http://res.cloudinary.com/dyqcevdpm/image/upload/v1491484496/beu-logo_srvetg.png",
            "handler": function (response){
                $http.post("/api/captureSubscriptionPayment",{amount:amount*100,paymentId:response.razorpay_payment_id,source:$routeParams.campaign,couponCode:$scope.couponCode.couponCode}).success(function(res) {
                    fbq('track', 'PaySubscription', { value:amount ,currency: 'INR',source:$routeParams.campaign});
                    fbq('track', 'Purchase',{
                       value:amount,
                       currency:'INR',
                       content_type:'Purchased',
                         content_ids:$routeParams.campaign
                         });
            
            //            fbq('track', 'Campaign', {value:$routeParams.campaign});
                    ga('send', {
                     hitType: 'event',
                     eventCategory: 'PaySubscription',
                     eventAction: 'Click',
                     eventLabel: $routeParams.campaign
                         });
                    $scope.loader=false;
                    alert("Subscription Purchased Successfully");
                   
   
                    $location.path("/subscriber").search({userId:res.userId});
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
                fbq('track', 'PaySubscriptionCancel', { value:amount ,currency: 'INR'});
                ga('send', 'event', "PaySubscriptionCancel","click","Send",amount);
              }
            }
        };

        var rzp1 = new Razorpay(options);
        rzp1.open();
        $scope.loader=true;
        e.preventDefault();
    }

    $scope.expandCallback=function(index){
            //console.log(index);
            $scope.panes.forEach(function(m){
                m.flag=false;
            })
            $scope.panes[index].flag=true;
    }

    $scope.collapseCallback=function(index){
        $scope.panes[index].flag=false;
    }
    $scope.subscriptionCheck=function(m){

//console.log(m)
$scope.selectedSub=m;

}
$scope.buySubscription=function(index){
  $scope.tFlag=false
    $scope.card1=!$scope.card1;
    $scope.card2=!$scope.card2;
    console.log("switch called");
    $scope.selectedSubscription=$scope.title.tile[index];
    console.log("selected sub",$scope.selectedSubscription)
}
$scope.paymentOptionApply=function(e,method){
    if(method=="razor"){
        console.log("razor payment");
        console.log("selected sub",$scope.selectedSubscription);
        $scope.paySubscription(e,$scope.selectedSubscription.amount- $scope.discount,$scope.selectedSubscription.title)
    }else if(method=="paytm"){
        console.log("paytm payment");
        console.log("selected sub",$scope.selectedSubscription);
        $scope.initPaytmPayment(e,$scope.selectedSubscription.amount- $scope.discount,$scope.selectedSubscription.title)

    }
     $scope.showPage();
}

 $scope.subCode=function(){
  console.log("click")
  $scope.tFlag=true;
 }
 $scope.contactMe=function(){
  console.log("this is click");
  console.log($scope.user.name)
    console.log($scope.user.number)
    $http.post(" /api/newWebsiteQuery",{name:$scope.user.name,phoneNumber:$scope.user.number}).success(function(res){

       alert(res.data)
       

    })
     $scope.user=''
 }

}]);


app.filter('trustAsHtml',['$sce', function($sce) {
  return function(text) {
    return $sce.trustAsHtml(text);
  };


}])
