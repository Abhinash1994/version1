app.controller('loginSalonDeals', ['$rootScope','$scope', '$http','$route','$routeParams','$location','ngProgressFactory','localStorageService','$mdDialog','Service','salonListingSearchBoxBooleanService','$log','$q',
    function($rootScope,$scope, $http,$route, $routeParams, $location,ngProgressFactory,localStorageService,$mdDialog,Service,salonListingSearchBoxBooleanService,$log,$q) {
      $scope.query={};
      $scope.disableButton=true;
      $scope.enableLogin=function() {
        $scope.phoneString=$scope.query.phoneNumber.toString();
        if($scope.phoneString.length<10){
          $scope.disableButton=true;
        }
        else {
          $scope.disableButton=false;
        }
      }
                // initialize Account Kit with CSRF protection
                AccountKit_OnInteractive = function(){
                  AccountKit.init(
                    {
                      appId:"332716867100293",
                      state:"123456789",
                      version:"v1.0",
                      fbAppEventsEnabled:true,
                      redirect:"www.beusalons.com"
                    }
                  );
                };
                AccountKit_OnInteractive();
                // login callback
                function loginCallback(response) {
                  if (response.status === "PARTIALLY_AUTHENTICATED") {
                    var code = response.code;
                    var csrf = response.state;
                    //console.log("CODE",code);
                    //console.log("CSRF",csrf);
                    $http.post("/beuApp/websiteQuery",{code:code,csrf:$scope.csrf}).success(function(response) {
                      //console.log(response);
                    });
                    // Send code to server to exchange for access token
                  }
                  else if (response.status === "NOT_AUTHENTICATED") {
                    // handle authentication failure
                  }
                  else if (response.status === "BAD_PARAMS") {
                    // handle bad parameters
                  }
                }

                // phone form submission handler
                $scope.smsLogin=function () {
                  var phoneNumber = document.getElementById("phone_number").value;
                  //console.log("pn",phoneNumber);
                  AccountKit.login(
                    'PHONE',
                    {countryCode: "+91", phoneNumber: phoneNumber}, // will use default values if not specified
                    loginCallback
                  );
                }
       $scope.changeTab = function () {
                if (!$scope.loginError) {
                   // //console.log("$scope.userLoginPhoneNumber",$scope.userLoginPhoneNumber);
                    ////console.log("$scope.userLoginPassword",$scope.userLoginPassword);
                    ////console.log("$scope.accessToken",$scope.accessToken);
                    $http({
                        url: '/api/login',
                        method: 'POST',
                        data: {
                                        phoneNumber: $scope.phoneString,
                                        password: $scope.userLoginPassword,
                                        accessToken: $scope.accessToken
                            // socialLoginType: $scope.socialLoginType,
                            // fbAccessToken : $scope.fbAccessToken
                        }
                    }).then(function (response) { //console.log(response);
                    ////console.log(response)
                        if (response.data.success == true) {
                            if(response.data.data.phoneVerification==0){
                                //alert("");
                                $scope.userExists = false;
                                $http({
                                    url: '/api/sendOtp',
                                    method: 'POST',
                                    data: {phoneNumber: response.data.data.phoneNumber, resetPassword: false}
                                }).then(function (response) {
                                    //console.log(response.data.success);
                                });

                                $mdDialog.show({
                                    controller: otpDialogController,
                                    templateUrl: '/website/views/otpVerificationDialog.html',
                                    scope: $scope,        // use parent scope in template
                                    preserveScope: true,
                                    parent: angular.element(document.body),
                                    targetEvent: event,
                                    clickOutsideToClose: true,
                                    fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                                })
                                    .then(function (answer) {
                                        $scope.status = 'You said the information was "' + answer + '".';
                                    }, function () {
                                        $scope.status = 'You cancelled the dialog.';
                                    });
                            }else if(response.data.data.phoneVerification==1) {
                                ////console.log(response)
                                $scope.userNameAfterLogIn = response.data.data.name;
                                ////console.log($scope.userNameAfterLogIn)
                                localStorageService.set('userNameAfterLogIn',$scope.userNameAfterLogIn);
                                $scope.loginLogout = "Logout";
                                if($scope.accessToken!=''){
                                    localStorageService.set('userLoginPhoneNumber', response.data.data.phoneNumber);
                                    localStorageService.set('userLoginPassword', $scope.userLoginPassword);
                                    localStorageService.set('userId',response.data.data.userId);
                                    localStorageService.set('accessToken',response.data.data.accessToken);
                                    localStorageService.set("lullFlag",true);

                                }else{
                                    localStorageService.set('userLoginPhoneNumber', response.data.data.phoneNumber);
                                    localStorageService.set('userLoginPassword', $scope.userLoginPassword);
                                    localStorageService.set('userId',response.data.data.userId);
                                    localStorageService.set('accessToken',response.data.data.accessToken);
                                    localStorageService.set("lullFlag",true);
                                }

                               // //console.log("this is the access token which is set",localStorageService.get('accessToken'))
                               // //console.log("this is the userNameAfterLogIn",localStorageService.get('userNameAfterLogIn'))
                               // //console.log("this is the userLoginPassword",localStorageService.get('userLoginPassword'))
                                ////console.log("this is the userId",localStorageService.get('userId'))
                                ////console.log("this is the userLoginPhoneNumber",localStorageService.get('userLoginPhoneNumber'))
                                //alert($scope.openMyAppointmentsFlag);
                                if(($scope.openMyAppointmentsFlag==true)||($scope.openMyLoyalityPointsFlag==true)){
                                    //alert("here",localStorageService.get("profilePageToBeOpened"));
                                    $mdDialog.hide();
                                    headerOption.setHeaderOption(localStorageService.get("profilePageToBeOpened"));

                                    $location.path('/userProfile');
                                }
                                var currentPath=$location.path();
                                if((currentPath.match("/parlor-detail/"))&&($scope.checkoutGoToFlag==true)){
                                    $location.path('/checkoutPage');
                                }
                               /* $scope.currentPath.substring('/salon-listing/')*/

                                $mdDialog.hide();
                            }

                        }
                        else if (response.data.success == false) {
                            $scope.incorrectEmailPassword = true;
                        }
                    })

                }
            };


}]);
