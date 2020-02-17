"use strict";
app.controller('newPaymentPage', ['$scope', '$http', '$route', '$routeParams', '$location', '$document', 'ngProgressFactory', 'localStorageService', '$mdDialog', '$geolocation', 'Service', 'salonListingSearchBoxBooleanService', '$rootScope', 'offerPageSearchLocation', 'filterProduct', 'latitudeandlongitude', '$q', 'LatLong', '$sce', '$timeout', function ($scope, $http, $route, $routeParams, $location, $document, ngProgressFactory, localStorageService, $mdDialog, $geolocation, Service, salonListingSearchBoxBooleanService, $rootScope, offerPageSearchLocation, filterProduct, latitudeandlongitude, $q, LatLong, $stateParams, $sce, $timeout) {

    console.log("hi");
    $scope.finalData={};
    console.log("route params",$routeParams.apptId);
    if($routeParams.apptId){
        console.log("id received");
        $http.get('/api/appointmentDetail?appointmentId=' + $routeParams.apptId).success(function (data) {
            var result = data;
            console.log("bahar data",data);
            $scope.finalData.appointmentData=data.data;
            $scope.finalData.appointmentData.totalSave=0;
            $scope.finalData.paymentOption=5;
            $scope.finalData.appointmentData.totalMenuPrice=0
            $scope.finalData.appointmentData=data.data;
            console.log("api response",data.data);
            $scope.finalData.appointmentData.services.forEach(function(element) {
                $scope.finalData.appointmentData.totalSave+=element.actualPrice-element.price;
                $scope.finalData.appointmentData.totalMenuPrice=element.actualPrice
            }, this);
            
        }).error(function (err) {
            alert("Incorrect Link In Error");
        })
    }
    $scope.bookAppointment = function () {
        if (!$scope.finalData.subscriptionAmount) {
            $scope.finalData.subscriptionAmount = 0;
        }

        ////console.log("$scope.finalData",$scope.finalData.subscriptionAmount + $scope.finalData.appointmentData.payableAmount);
        $scope.bookedAppointment = true;
        if (!$scope.finalData.useLoyalityPoints) {
            $scope.finalData.useLoyalityPoints = 0;
        }
        if (!$scope.finalData.useMembershipCredits) {
            $scope.finalData.useMembershipCredits = 0
        }
        if (!$scope.finalData.useSubscriptionCredits) {
            $scope.finalData.useSubscriptionCredits = 0
        }
        
            if ($scope.finalData.subscriptionAmount > 0) {
                $scope.finalData.appointmentData.payableAmount = $scope.finalData.appointmentData.payableAmount + $scope.finalData.subscriptionAmount;
            }
            $scope.loader = true;
            $scope.loaderProgress=true;
            var options = {
                "key": "rzp_live_c8wcuzLEGSGlJ5",
                // "key": "rzp_test_3mvVpwXZztUJYb",
                "amount": JSON.stringify($scope.finalData.appointmentData.payableAmount * 100), // 2000 paise = INR 20
                "name": "Be U Salons",
                "description": 'Appointment',
                "image": "http://res.cloudinary.com/dyqcevdpm/image/upload/v1491484496/beu-logo_srvetg.png",
                "handler": function (response) {
                    console.log(response);
                    alert("payment done");
                    ////console.log("razorpay response",response);
                    $http.get('/loggedapi/capturePayment?amount=' + $scope.finalData.appointmentData.payableAmount * 100+"&razorPaymentId="+response.razorpay_payment_id).success(function (data) {
                        console.log("bahar data",data);
                        $scope.loader = false;
                        $scope.loaderProgress=false;
                        if (data.success) {
                            alert("Your Appointment Booked Successfully")
                        }
                        
                    }).error(function (err) {
                        alert("Incorrect Link In Error");
                    })
                },
                "prefill": {
                    contact:$scope.finalData.appointmentData.client.phoneNumber
                },
                "notes": {
                    "appointmentId": $scope.finalData.appointmentData.appointmentId
                },
                "theme": {
                    "color": "#ff0000"
                },
                "modal": {
                    "ondismiss": function () {
                        $scope.loader = false;
                        $scope.loaderProgress=false;
                    }
                }
            };
            var rzp1 = new Razorpay(options);
            rzp1.open();
            e.preventDefault();
        
    }

}])

/********************************************book appointment code stop********************************************/