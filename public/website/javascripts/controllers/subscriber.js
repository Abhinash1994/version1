app.controller('subscriber', ['$scope', '$http','$route','$routeParams','$location','ngProgressFactory','localStorageService','$mdDialog','$geolocation','Service','salonListingSearchBoxBooleanService','$rootScope','offerPageSearchLocation','$timeout',
function($scope, $http,$route, $routeParams, $location,ngProgressFactory,localStorageService,$rootScope,$sce,$timeout) {


    $scope.bkcolor={
      'background-color':'#d2232a'
    }

    $scope.loader=true
    $scope.determinateValue=30;

    $scope.progressbar = ngProgressFactory.createInstance();
    $scope.progressbar.setColor("#d2232a");
    $scope.progressbar.start();
    $scope.panes=[];
      $scope.userId=localStorageService.get("userId");
      //console.log($scope.userId);
      $scope.accessToken=localStorageService.get("accessToken");
      //console.log($scope.accessToken);
      var query=$routeParams;
      //console.log($routeParams);

        $http.post("/api/showSubscriptionForWebsite",query).success(function(response) {
          //console.log("response from api",response);
          $scope.userInfo=response.data.selectSubscription.subscribedData;
          $scope.loader=false;

        })

        $scope.newSalonDeals = function() {
            window.scrollTo(0, 0);
            $location.path('/salon-deals');
        };

    $http.get('/api/showSubscription').success(function(data) {
        //console.log(data);
        $scope.data=data;
        //console.log($scope.data);
        $scope.loader=false;
        $scope.panes=$scope.data.data.faq.questions;
        $scope.faq=$scope.data.data.faq.heading;
        $scope.title=data.data.selectSubscription;
        // var o=data.data.selectSubscription.subscriptionCount;
        // var p=o.substring(0,17)
        // var l=o.substring(17,40)
        // $scope.sub1=l;
        $scope.sub=data.data.selectSubscription.subscriptionCount;
        //console.log($scope.sub)

        // var only=$scope.sub;

        $scope.selectedSub=data.data.selectSubscription.tile[0];

        //console.log($scope.selectedSub)
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

        //console.log($scope.availSteps)
        $scope.heading=data.data.detail.tnc;
        // $scope.renderHtml = function(heading){
        //     return $sce.trustAsHtml(heading);
        //   };
      //console.log("$scope.heading",$scope.heading);

    });

    $scope.paySubscription=function(amount,title){
        var options = {
            "key": "rzp_test_3mvVpwXZztUJYb",
            "amount": JSON.stringify(amount*100), // 2000 paise = INR 20
            "name": "Be U Salons",
            "description": 'Buy ' +title+ ' Subscription @ '+ amount,
            "image": "http://res.cloudinary.com/dyqcevdpm/image/upload/v1491484496/beu-logo_srvetg.png",
            "handler": function (response){
                $http.post("/api/captureSubscriptionPayment",{amount:amount*100,paymentId:response.razorpay_payment_id}).success(function(res) {
                    //console.log("Payment Completed",response);
                    alert("Payment Completed"+ amount*100)
                });

            },
            "prefill": {
            },
            "notes": {
                "address": "Hello World"
            },
            "theme": {
                "color": "#ff0000"
            }
        };
        var rzp1 = new Razorpay(options);
        rzp1.open();
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


}]);
app.filter('trustAsHtml',['$sce', function($sce) {
  return function(text) {
    return $sce.trustAsHtml(text);
  };
}]);
