app.controller('headerCtrl', ['$rootScope','$scope', '$http','$route','$routeParams','$location','ngProgressFactory','localStorageService','$mdDialog','$auth','$window','Service','headerOption','salonListingSearchBoxBooleanService','$q','$log','openSuccesfullDialogService','mySharedService','$filter','$timeout','$mdSidenav',
    function($rootScope,$scope, $http,$route, $routeParams, $location,ngProgressFactory,localStorageService,$mdDialog,$auth,$window,Service,headerOption,salonListingSearchBoxBooleanService,$q,$log,openSuccesfullDialogService,mySharedService,$filter,$timeout,$mdSidenav) {
        $scope.currentPath=$location.path();
        //alert($scope.currentPath)
        /*if($scope.currentPath=="/salon-listing/"){

            alert("habad dabad")
        }*/
        $scope.toggleLeft = buildToggler('left');
        $scope.toggleRight = buildToggler('right');

        function buildToggler(componentId) {
            return function() {
                $mdSidenav(componentId).toggle();
            };
        }
        $scope.hideHeaderFlag=false;
        if(($scope.currentPath=='/appfaq')||($scope.currentPath=='/appTermsConditions')){
            $scope.hideHeaderFlag=true;
        }
        $scope.cartQuantityTracker=Service;
        $scope.checkoutGoToFlag=false;
        $scope.$on('handleBroadcastForLoginPopUp', function() {
            $scope.goToProfileOrLogin();
            $scope.checkoutGoToFlag=true;
        });

        if($scope.currentPath.match('/salon-listing')){
            // alert("habad dabad")
        }
        $scope.cartValue=0;

        if(localStorageService.get("cartQuantity")!=undefined){
            /*$scope.Service*/
            //$scope.cartValue = Service.setNumber(localStorageService.get("cartQuantity"));

            Service.setNumber(localStorageService.get("cartQuantity"))
            /*$scope.cartValue= Service.getNumber();*/
            $scope.cartValue=Service


        }else{
            $scope.cartValue=Service;

        }

        //$scope.showCartNotifications=
        $scope.currentPath=$location.path();
        // alert($scope.currentPath);
        $scope.cartLength=0;
        if(localStorageService.get('cart')==undefined){
            $scope.cartLength=localStorageService.set('cart',0);
        }
        else
        {
            $scope.cartLength=localStorageService.get('cart').length;
        }
        $scope.userLoginPhoneNumber="";
        ////console.log(localStorageService.get('userLoginPhoneNumber'));
        $scope.userLoginPassword="";
        $scope.userNameAfterLogIn="Sign In";
        $scope.loginLogout="New?";
        $scope.incorrectEmailPassword=false;
        $scope.showLoginDropdown=false;
        $scope.newUser=false;
        $scope.userSearchedServ="";
        $scope.userGender='F';
        $scope.userGenderGoogle='F';
        $scope.socialLoginType='';
        $scope.phoneNumberFbGoogleLogin='';

        $scope.changeTabFbGoogle = function() {
            // //console.log($scope.userLoginPhoneNumber);
            ////console.log($scope.userLoginPassword);

            $http({
                url: '/api/login',
                method: 'POST',
                data:{phoneNumber:"",password:"",accessToken:localStorageService.get('accessToken')}
            }).then(function(response) {
                ////console.log(response);
                if(response.data.success==true){
                    $scope.userNameAfterLogIn=response.data.data.name;
                    $scope.loginLogout="Logout";
                    localStorageService.set('userLoginPhoneNumber',$scope.userLoginPhoneNumber);
                    localStorageService.set('userLoginPassword',$scope.userLoginPassword);
                    localStorageService.set('userId',response.data.data.userId);
                    localStorageService.set('accessToken',response.data.data.accessToken);
                    $scope.accessToken=localStorageService.get('accessToken');
                    localStorageService.set("lullFlag",true);
                    // //console.log("this is the access token which is set",localStorageService.get('accessToken'))
                    $mdDialog.hide();

                }
                else  if(response.data.success==false){
                    $scope.incorrectEmailPassword=true;
                }
            });

            $scope.changeTab();
        };



        if((localStorageService.get('userLoginPhoneNumber')!=undefined)&&(localStorageService.get('accessToken')!=undefined)){
            $scope.userLoginPhoneNumber=localStorageService.get('userLoginPhoneNumber');
            //$scope.userLoginPassword=localStorageService.get('userLoginPassword');

            $scope.changeTab = function() {
                //  //console.log($scope.userLoginPhoneNumber);
                // //console.log($scope.userLoginPassword);

                $http({
                    url: '/api/login',
                    method: 'POST',
                    data:{phoneNumber:"",password:"",accessToken:localStorageService.get('accessToken')}
                }).then(function(response) {
                    ////console.log(response);
                    if(response.data.success==true){
                        $scope.userNameAfterLogIn=response.data.data.name;
                        $scope.loginLogout="Logout";
                        localStorageService.set('userLoginPhoneNumber',$scope.userLoginPhoneNumber);
                        localStorageService.set('userLoginPassword',$scope.userLoginPassword);
                        localStorageService.set('userId',response.data.data.userId);
                        localStorageService.set('accessToken',response.data.data.accessToken);
                        $scope.accessToken=localStorageService.get('accessToken');
                        localStorageService.set("lullFlag",true);
                        //console.log("this is the access token which is set",localStorageService.get('accessToken'))
                        $mdDialog.hide();

                    }
                    else  if(response.data.success==false){
                        $scope.incorrectEmailPassword=true;
                    }
                });


            };

            $scope.changeTab();
        }

        /*$scope.goToUserProfile=function(){
         $location.path('/userProfile');
         }*/
        ////console.log("inside user profile controller");


        this.settings = {
            printLayout: true,
            showRuler: true,
            showSpellingSuggestions: true,
            presentationMode: 'edit'
        };

        this.sampleAction = function(name, ev) {
            $mdDialog.show($mdDialog.alert()
                .title(name)
                .textContent('You triggered the "' + name + '" action')
                .ok('Great')
                .targetEvent(ev)
            );


        };


        $scope.showalert = function(ev) {
            if($scope.loginLogout=="New?"){

                $scope.incorrectEmailPassword=false;
                $mdDialog.show({
                    controller: DialogController,
                    templateUrl: '/website/views/dialog2.html',
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
            }

            else if($scope.loginLogout=="Logout"){
                $scope.userNameAfterLogIn="Sign In";
                $scope.loginLogout="New?";
                $location.path('/');
                $scope.currentPath=$location.path();
                if($scope.currentPath=="/"){

                    $window.location.reload();
                }

                localStorageService.set('userLoginPhoneNumber',undefined);
                localStorageService.set('userLoginPassword',undefined);
                localStorageService.set('cart',0);
                localStorageService.set('requiredParlorId',undefined);
                localStorageService.set("cartParlorId",undefined);
                localStorageService.set("cartQuantity",undefined);
                localStorageService.set("userQuery",undefined);
                localStorageService.set('userNameAfterLogIn',undefined);
                localStorageService.set('cartObjectStored',undefined);
                localStorageService.set('userId',undefined);
                localStorageService.set('accessToken',undefined);
                localStorageService.set('profilePageToBeOpened',undefined);
                localStorageService.set('appointmentId',undefined);
                localStorageService.set('cartIds',0);
                localStorageService.set("lullFlag",false);
                localStorageService.set('appt',undefined);
                localStorageService.set('offerPageSearchedLocation',undefined);
                localStorageService.set('currentDateStored',undefined);
            }
        };



        function DialogController($scope, $mdDialog,$auth,$rootScope) {
            $scope.userLoginPhoneNumber = "";
            $scope.userLoginPassword = "";
            $scope.userSignUpFirstName = "";
            $scope.userSignUpEmail = "";
            $scope.userSignUpPassword = "";
            $scope.userSignUpPhoneNumber = "";
            $scope.signUpError = false;
            $scope.loginError = false;
            $scope.userExists = false;
            $scope.accessToken = "";
            $scope.forgetPasswordPhoneNumber="";
            $scope.forgetPasswordFlag=false;
            $scope.newPassword="";
            $scope.invalidOtpPhoneNumberFlag=false;
            $scope.fbAccessToken="";
            $scope.socialLoginType=1;

            $scope.hide = function () {
                $mdDialog.hide();
            };

            $scope.cancel = function () {
                $mdDialog.cancel();
            };
            $scope.selectedTab = null;


            $scope.filterValue = function ($event) {
                if (isNaN(String.fromCharCode($event.keyCode))) {
                    $event.preventDefault();
                }
            };

            $scope.signUp = function () {
                $scope.selectedTab = ($scope.selectedTab + 1) % 2;
            };

            if($scope.newUser==true){
                $scope.signUp();
                $scope.newUser=false;
            }


            $scope.validationLoginForm = function () {


                if ((!$scope.loginForm.userLoginPhoneNumber.$dirty) || (!$scope.loginForm.userLoginPassword.$dirty) || (!$scope.loginForm.userLoginPhoneNumber.$valid) || (!$scope.loginForm.userLoginPassword.$valid)) {
                    $scope.loginError = true;
                }
                else {
                    $scope.loginError = false;
                }
                // //console.log("$scope.loginError", $scope.loginError);

            };



            $scope.validationSignUpForm = function () {
                if ((!$scope.signUpForm.userSignUpFirstName.$valid) || (!$scope.signUpForm.userSignUpEmail.$valid) || (!$scope.signUpForm.userSignUpEmail.$dirty) || (!$scope.signUpForm.userSignUpPhoneNumber.$dirty) || (!$scope.signUpForm.userSignUpPhoneNumber.$valid) || (!$scope.signUpForm.userSignUpPassword.$valid)) {
                    $scope.signUpError = true;
                }
                else {
                    $scope.signUpError = false;
                }
                ////console.log("$scope.signUpError", $scope.signUpError);
            };



            $scope.authenticateSignUp = function () {
                $rootScope.$on('event:social-sign-in-success', function (event, userDetails) {
                    ////console.log(userDetails);
                    //$scope.userNameAfterLogIn=userDetails.name;
                    $scope.userSignUpFirstNameArray = userDetails.name.split(' ');
                    ////console.log($scope.userSignUpFirstNameArray);
                    $scope.userSignUpFirstName = $scope.userSignUpFirstNameArray[0];
                    $scope.userSignUpEmail = userDetails.email;
                    ////console.log("userDetails.email", userDetails.email);
                });
            };


            $scope.changeTab = function () {
                if (!$scope.loginError) {
                    // //console.log("$scope.userLoginPhoneNumber",$scope.userLoginPhoneNumber);
                    ////console.log("$scope.userLoginPassword",$scope.userLoginPassword);
                    ////console.log("$scope.accessToken",$scope.accessToken);
                    $http({
                        url: '/api/login',
                        method: 'POST',
                        data: {
                            phoneNumber: $scope.userLoginPhoneNumber,
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

            $scope.authenticateFacebookSignUp=function(provider){
                $auth.authenticate(provider).then(function (response) {
                    // //console.log("wwwwwwwwwwww")
                    // //console.log(response);
                    $scope.fbAccessToken = response.access_token;
                    ////console.log($scope.fbAccessToken)
                    $scope.loginError = false;
                    // alert($scope.fbAccessToken);
                    $scope.facebookGraphApiUrl='https://graph.facebook.com/me?access_token='+$scope.fbAccessToken;

                    $http.get($scope.facebookGraphApiUrl).then(function(response) {
                        //console.log("this is the facebookGraphApiContent data");
                        $scope.facebookGraphApiContent=response;
                        $scope.userSignUpFirstName=response.data.name;
                        // //console.log($scope.facebookGraphApiContent);
                        /* $scope.facebookProfilePicture="http://graph.facebook.com/"+response.data.id+"/picture?type=large&redirect=false";
                         $http.get($scope.facebookProfilePicture,{cache:false}).then(function(response) {
                             //console.log("this is the facebookProfilePictureContent data");
                             $scope.facebookProfilePictureContent=response;
                             //$scope.userSignUpFirstName=response.data.name;
                             //console.log($scope.facebookProfilePictureContent);
                         });*/
                    });

                    /* $http({
                         url: 'http://www.beusalon.com/api/login',
                         method: 'POST',
                         data: {
                             fbAccessToken: $scope.fbAccessToken,
                             socialLoginType: 1
                         }
                     }).then(function mySuccess(response) {
                         alert("success");
                         //console.log(response);
                         ////console.log(response.data.data.accessToken);
                         //console.log(response);
                         $scope.facebookLoginAccessTokenReceived=response;
                         $scope.accessToken= $scope.fbAccessToken;
                         $scope.loginError=false;
                         $scope.changeTab();
                     }, function myError(response) {
                         //console.log("error")
                         alert("error");
                     });*/
                })
            }

            $scope.authenticateFacebookLogin=function(provider){
                if(provider=='facebook'){
                    $scope.socialLoginType=1;
                }else if(provider=='google'){
                    $scope.socialLoginType=2;
                }


                $auth.authenticate(provider).then(function (response) {


                    $scope.fbAccessToken = response.access_token;
                    ////console.log($scope.fbAccessToken)
                    $scope.loginError = false;
                    $http({
                        url: '/api/socialLogin',
                        method: 'POST',
                        data: {
                            accessToken: $scope.fbAccessToken,
                            socialLoginType: $scope.socialLoginType
                        }
                    }).then(function mySuccess(response) {
                        //console.log(response);
                        if(response.data.data.phoneVerification==0){
                            if(response.data.data.userId==null){
                                $mdDialog.show({
                                    controller: fbGoogleOtpController,
                                    templateUrl: '/website/views/fbGoogleOtpDialog.html',
                                    scope: $scope,        // use parent scope in template
                                    preserveScope: true,
                                    parent: angular.element(document.body),
                                    targetEvent: '',
                                    clickOutsideToClose: true,
                                    fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                                })
                                function fbGoogleOtpController($scope, $mdDialog) {
                                    //console.log("inside fb")
                                    $scope.hide = function () {
                                        $mdDialog.hide();
                                    };
                                    $scope.cancel = function () {
                                        $mdDialog.cancel();
                                    };

                                    $scope.registerUserFbGoogleLogin=function(ev){
                                        //console.log($scope.phoneNumberFbGoogleLogin);
                                        //console.log($scope.socialLoginType);
                                        //console.log($scope.fbAccessToken);
                                        //console.log($scope.userGenderGoogle);
                                        $http({
                                            url: '/api/user',
                                            method: 'POST',
                                            data: {
                                                phoneNumber:$scope.phoneNumberFbGoogleLogin,
                                                socialLoginType: $scope.socialLoginType,
                                                accessToken:$scope.fbAccessToken,
                                                gender:$scope.userGenderGoogle
                                            }
                                        }).then(function mySuccess(response) {
                                            // //console.log(response);
                                            $mdDialog.hide();
                                            $scope.userSignUpPhoneNumber=$scope.phoneNumberFbGoogleLogin;
                                            $http({
                                                url: '/api/sendOtp',
                                                method: 'POST',
                                                data: {phoneNumber: $scope.userSignUpPhoneNumber, resetPassword: false}
                                            }).then(function (response) {
                                                //console.log(response.data.success);
                                            });

                                            $mdDialog.show({
                                                controller: otpDialogController,
                                                templateUrl: '/website/views/otpVerificationDialog.html',
                                                scope: $scope,        // use parent scope in template
                                                preserveScope: true,
                                                parent: angular.element(document.body),
                                                targetEvent: ev,
                                                clickOutsideToClose: true,
                                                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                                            })
                                                .then(function (answer) {
                                                    $scope.status = 'You said the information was "' + answer + '".';
                                                }, function () {
                                                    $scope.status = 'You cancelled the dialog.';
                                                });

                                        })
                                    }
                                }
                            }else{
                                $scope.userSignUpPhoneNumber=response.data.data.phoneNumber;
                                $http({
                                    url: '/api/sendOtp',
                                    method: 'POST',
                                    data: {phoneNumber: $scope.userSignUpPhoneNumber, resetPassword: false}
                                }).then(function (response) {
                                    ////console.log(response.data.success);
                                });

                                $mdDialog.show({
                                    controller: otpDialogController,
                                    templateUrl: '/website/views/otpVerificationDialog.html',
                                    scope: $scope,        // use parent scope in template
                                    preserveScope: true,
                                    parent: angular.element(document.body),
                                    targetEvent: '',
                                    clickOutsideToClose: true,
                                    fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                                })
                                    .then(function (answer) {
                                        $scope.status = 'You said the information was "' + answer + '".';
                                    }, function () {
                                        $scope.status = 'You cancelled the dialog.';
                                    });
                            }
                            ////console.log(response);
                        }else{
                            localStorageService.set('accessToken',response.data.data.accessToken);
                            $scope.changeTabFbGoogle();
                        }
                    }, function myError(response) {
                        // //console.log("error")
                        alert("error");
                    });
                })
            }

            $scope.authenticate = function (provider) {
                // alert(provider)
                $auth.authenticate(provider).then(function (response) {
                    // //console.log("wwwwwwwwwwww")
                    ////console.log(response);
                    $scope.fbAccessToken = response.access_token;
                    // //console.log($scope.fbAccessToken)
                    $scope.loginError = false;
                    alert($scope.fbAccessToken);
                    $http({
                        url: '/api/login',
                        method: 'POST',
                        data: {
                            fbAccessToken: $scope.fbAccessToken,
                            socialLoginType: 1
                        }
                    }).then(function mySuccess(response) {
                        alert("success");
                        ////console.log(response);
                        ////console.log(response.data.data.accessToken);
                        ////console.log(response);
                        $scope.facebookLoginAccessTokenReceived=response;
                        $scope.accessToken= $scope.fbAccessToken;
                        $scope.loginError=false;
                        $scope.changeTab();

                        /* $http({
                             url: '/api/login',
                             method: 'POST',
                             data: {
                                 phoneNumber: "",
                                 password: "",
                                 accessToken: $scope.facebookLoginAccessTokenReceived.data.data.accessToken,
                                 socialLoginType:""
                                 // socialLoginType: $scope.socialLoginType,
                                 // fbAccessToken : $scope.fbAccessToken
                             }
                         }).then(function (response) {
                           //  //console.log("this is nikita's data");
                            // //console.log(response);
                         })
                         alert("success");*/
                    }, function myError(response) {
                        ////console.log("error")
                        alert("error");
                    });
                })

            };

            $scope.showOtpAlert = function (ev) {
                //$scope.userSignUpPhoneNumber.toString();
                ////console.log("$scope.userSignUpPhoneNumber",$scope.userSignUpPhoneNumber);
                ////console.log(typeof($scope.userSignUpPhoneNumber))
                ////console.log("$scope.userSignUpEmail", $scope.userSignUpEmail);
                ////console.log("$scope.userSignUpPassword",$scope.userSignUpPassword);
                ////console.log("$scope.userSignUpFirstName",$scope.userSignUpFirstName);
                // //console.log("$scope.signUpError--------", $scope.signUpError);

                if (!$scope.signUpError) {
                    //console.log("here"+$scope.fbAccessToken)
                    if($scope.forgetPasswordFlag==false){
                        //console.log("signup request");
                    }
                    $http({
                        url: '/api/user',
                        method: 'POST',
                        data: {
                            name: $scope.userSignUpFirstName,
                            phoneNumber: $scope.userSignUpPhoneNumber,
                            password: $scope.userSignUpPassword,
                            profilePic: "",
                            emailId:  $scope.userSignUpEmail,
                            fbAccessToken: $scope.fbAccessToken,
                            gender:$scope.userGender,
                            gmAccessToken: $scope.gmAccessToken
                        }
                    }).then(function (response) {
                        ////console.log(response);
                        ////console.log(response.data);

                        if (!response.data.success) {
                            $scope.userExists = true;
                            // //console.log(response.data);
                        }
                        else {
                            $scope.userExists = false;
                            $http({
                                url: '/api/sendOtp',
                                method: 'POST',
                                data: {phoneNumber: $scope.userSignUpPhoneNumber, resetPassword: false}
                            }).then(function (response) {
                                ////console.log(response.data.success);
                            });

                            $mdDialog.show({
                                controller: otpDialogController,
                                templateUrl: '/website/views/otpVerificationDialog.html',
                                scope: $scope,        // use parent scope in template
                                preserveScope: true,
                                parent: angular.element(document.body),
                                targetEvent: ev,
                                clickOutsideToClose: true,
                                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                            })
                                .then(function (answer) {
                                    $scope.status = 'You said the information was "' + answer + '".';
                                }, function () {
                                    $scope.status = 'You cancelled the dialog.';
                                });
                        }
                    })
                }


            };

            function otpDialogController($scope, $mdDialog) {
                $scope.otpEntered = "";

                $scope.hide = function () {
                    $mdDialog.hide();
                };

                $scope.cancel = function () {
                    $mdDialog.cancel();
                };

                $scope.verifyOtp = function () {

                    ////console.log("$scope.otpEntered", $scope.otpEntered);
                    ////console.log("$scope.userSignUpPhoneNumber", $scope.userSignUpPhoneNumber);
                    ////console.log("$scope.forgetPasswordPhoneNumber",$scope.forgetPasswordPhoneNumber);
                    // //console.log("$scope.newPassword",$scope.newPassword);

                    if($scope.forgetPasswordFlag){
                        $scope.userSignUpPhoneNumber=$scope.forgetPasswordPhoneNumber;
                        $scope.userSignUpPassword=$scope.newPassword;
                    }
                    var fbGoogledata;

                    if($scope.socialLoginType==1 || $scope.socialLoginType==2){
                        fbGoogledata={phoneNumber: $scope.userSignUpPhoneNumber, otp: $scope.otpEntered, socialLoginType:$scope.socialLoginType ,accessToken:$scope.fbAccessToken}
                        // //console.log(fbGoogledata)
                    }else{
                        fbGoogledata={phoneNumber: $scope.userSignUpPhoneNumber, otp: $scope.otpEntered, newPassword: $scope.newPassword}
                        ////console.log(fbGoogledata)
                    }
                    $http({
                        url: '/api/verifyOtp',
                        method: 'POST',
                        data: fbGoogledata
                    }).then(function (response) {
                        //console.log(response)
                        if (response.data.success == true) {
                            $scope.userNameAfterLogIn = response.data.data.name;
                            localStorageService.set('userLoginPhoneNumber',$scope.userSignUpPhoneNumber);
                            localStorageService.set('userLoginPassword',$scope.userSignUpPassword );
                            localStorageService.set('accessToken',response.data.data.accessToken);
                            localStorageService.set('userId',response.data.data.userId);
                            localStorageService.set("lullFlag",true);
                            $scope.loginLogout = "Logout";
                            $mdDialog.hide();
                        }
                        else if (response.data.success == false) {
                            $scope.invalidOtpPhoneNumberFlag=true;
                        }
                    });

                }

            }



            $scope.openForgotPasswordDialog=function(ev){

                $scope.forgetPasswordPhoneNumber=$scope.userLoginPhoneNumber;
                $mdDialog.show({
                    controller: forgotPasswordDialogController,
                    templateUrl: '/website/views/forgotPasswordDialog.html',
                    scope: $scope,        // use parent scope in template
                    preserveScope: true,
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                })
                    .then(function (answer) {
                        $scope.status = 'You said the information was "' + answer + '".';
                    }, function () {
                        $scope.status = 'You cancelled the dialog.';
                    });

                $scope.invalidPhoneNumberFlagForgotPassword=false;


            }

            function forgotPasswordDialogController($scope, $mdDialog) {
                $scope.hide = function () {
                    $mdDialog.hide();
                };

                $scope.cancel = function () {
                    $mdDialog.cancel();
                };

                $scope.validationForgetPasswordForm=function(){


                };

                $scope.forgetPasswordFunction=function(ev)  {

                    //console.log("enterd number",$scope.forgetPasswordPhoneNumber);
                    $scope.forgetPasswordFlag=true;
                    $scope.forgetPasswordBuffer=true;
                    $http({
                        url: '/api/sendOtp',
                        method: 'POST',
                        data: {phoneNumber: $scope.forgetPasswordPhoneNumber, resetPassword: true}
                    }).then(function (response) {
                        $scope.forgetPasswordBuffer=false;
                        //console.log(response.data.success);
                        if(response.data.success){
                            $mdDialog.show({
                                controller: otpDialogController,
                                templateUrl: '/website/views/otpVerificationDialog.html',
                                scope: $scope,        // use parent scope in template
                                preserveScope: true,
                                parent: angular.element(document.body),
                                targetEvent: ev,
                                clickOutsideToClose: true,
                                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                            })
                                .then(function (answer) {
                                    $scope.status = 'You said the information was "' + answer + '".';
                                }, function () {
                                    $scope.status = 'You cancelled the dialog.';
                                });
                        }
                        else{
                            $scope.forgetPasswordBuffer=false;
                            $scope.invalidPhoneNumberFlagForgotPassword=true;
                        }
                    });
                }
            }
// //Facebook Account Kit
//             $scope.AccountKit_OnInteractive = function(){
//
//                 AccountKit.init(
//                     {
//                         appId:"332716867100293",
//                         state:"{{csrfToken}}",
//                         version:"v1.0",
//                         debug:true
//                     }
//                 );
//             };
//             $scope.AccountKit_OnInteractive();
//
//             $scope.loginWithSMS = function() {
//
//                 function loginCallback(response) {
//                     //console.log(response);
//                     if (response.status === "PARTIALLY_AUTHENTICATED") {
//                         // document.getElementById("code").value = response.code;
//                         // document.getElementById("csrf_nonce").value = response.state;
//                         // document.getElementById("my_form").submit();
//                         var data={};
//                         data.code=response.code;
//                         data.csrf_nonce=response.state;
//                         $http.post("/api/sendcode",data).success(function (response, status) {
//                             $scope.data = response.data;
//                             //console.log("nikita");
//                             //console.log(response);
//                         })
//                     }
//                     else if (response.status === "NOT_AUTHENTICATED") {
//                         // handle authentication failure
//                     }
//                     else if (response.status === "BAD_PARAMS") {
//                         // handle bad parameters
//                     }
//                 }
//                 AccountKit.login("PHONE", {countryCode: "+91", phoneNumber:"8826345311"}, loginCallback);
//             };
//             // login callback
//             $scope.loginCallback=function (response) {
//                 //console.log(response);
//                 if (response.status === "PARTIALLY_AUTHENTICATED") {
//                     // document.getElementById("code").value = response.code;
//                     // document.getElementById("csrf_nonce").value = response.state;
//                     // document.getElementById("my_form").submit();
//                     var data={};
//                     data.code=response.code;
//                     data.csrf_nonce=response.state;
//                     $http.post("/api/sendcode",data).success(function (response, status) {
//                         $scope.data = response.data;
//                        //console.log($scope.data);
//                     });
//
//
//                 }
//                 else if (response.status === "NOT_AUTHENTICATED") {
//                     // handle authentication failure
//                 }
//                 else if (response.status === "BAD_PARAMS") {
//                     // handle bad parameters
//                 }
//             };
//
//             // phone form submission handler
//             // email form submission handler
//             $scope.email_btn_onclick=function () {
//                 var email_address = document.getElementById("email").value;
//
//                 AccountKit.login('EMAIL', {emailAddress: email_address}, $scope.loginCallback());
//             };
//             $scope.phone_btn_onclick= function () {
//                 var country_code = document.getElementById("country_code").value;
//                 var ph_num = document.getElementById("phone_num").value;
//                 AccountKit.login('PHONE',
//                     {countryCode: "+91", phoneNumber:"8826345311"}, // will use default values if this is not specified
//                     $scope.loginCallback());
//             }

        }


        $scope.newUserFlagSet=function(){
            $scope.newUser=true;
        };

        $scope.goToProfileOrLogin = function (value) {

            localStorageService.set("profilePageToBeOpened",value);
            //alert(localStorageService.get("profilePageToBeOpened"))

            //alert($scope.loginLogout )
            if ($scope.loginLogout == "New?") {
                if(localStorageService.get("profilePageToBeOpened")=='My Appointments'){
                    $scope.openMyAppointmentsFlag=true;
                    //alert($scope.openMyAppointmentsFlag)

                }
                else if(localStorageService.get("profilePageToBeOpened")=='My Loyalty Points'){

                    $scope.openMyLoyalityPointsFlag=true;
                }
                $scope.displayOptionFlag=true;
                $scope.showalert();

                //alert("Inside Login");
            }
            else if ($scope.loginLogout == "Logout") {

                //alert(localStorageService.get("profilePageToBeOpened"));
                if( $rootScope.headCallToProfileFlag==true){

                    $rootScope.headCallToProfile(value);

                }

                $location.path('/userProfile');
                //alert("Inside Logout");
            }


        }

        $scope.menuShow=function(){
            $scope.showLoginDropdown=true;
            ////console.log("menuShow",$scope.showLoginDropdown)
        }

        $scope.menuShowClick=function(){
            $scope.showLoginDropdown=!$scope.showLoginDropdown;
        }

        $scope.menuHide=function(){
            $scope.showLoginDropdown=!$scope.showLoginDropdown;
            $scope.checkoutGoToFlag=false;
            ////console.log("menuHide",$scope.showLoginDropdown)
        }

        $scope.goToFreeBees=function(){
            $location.path('/freeBees');
        }

        /* if(($scope.currentPath.match("/parlor-detail"))&&(localStorageService.get('userLoginPhoneNumber')==undefined)&&(localStorageService.get('accessToken')==undefined)&&( localStorageService.get("lullFlag")==true)){
             $scope.goToProfileOrLogin();
             //$scope.userNameAfterLogIn="kjdncsjnc"
         }*/
        $scope.welcomeMail=function () {
            var welcomeMailContent='<body><table style="height: 700px; background-color: #f9dfbc;" border="0px" width="700" cellspacing="2px" cellpadding="0px"><tbody>';

            welcomeMailContent+='<tr><td style="text-align: center; border-bottom: 4px solid rgba(255, 255, 242, 1); /* border-width: 1px;" colspan="4"><br /><a href="http://beusalons.com/" target="blank"><img style="width: 212px; margin-bottom: 11px;" src="http://beusalons.com/images/email/beusalon.svg" alt="" /></a></td></tr>';

            welcomeMailContent+='<tr><td colspan="4"><br /><a href="http://beusalons.com/" target="blank"> <img style="width: 650px; margin-left: 21px;" src="http://beusalons.com/images/email/header.jpg" alt="" /></a><br /><br /></td></tr>';

            welcomeMailContent+='<td style="text-align: center;" colspan="4"><h2 style="color:#58595b;font-size:25px; font-family:latoLight;">Welcome to Be U Salons!</h2><br /><span style="color:#58595b;font-size:17px; margin-left: 10px;text-align: center;float: left;margin-right: 15px;">We are so happy you are here. Be U is a premium affordable salon chain that intents to bring standalone salons under one roof. It steers you towards a confident personality. It lets you,<br> to be, who you are.<br /><br /> We hope you will like navigating our website and get the best of services at the best of prices. Checkout our website to get the best deals and offers. Happy navigating.</span> <br /> <br /> <br /> <button style="background-color: #e1756e; border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 35px 2px; cursor: pointer;"><a href="http://beusalons.com/" target="blank">GET STARTED</a></button></td></tr>';

            welcomeMailContent+='<tr><td colspan="4"><br /><a href="https://play.google.com/store" target="blank"><img style="width: 650px; margin-left: 21px;" src="http://beusalons.com/images/email/footer.jpg" alt="" /></a><br /><br /></td></tr>';

            welcomeMailContent+='<tr><td><span><a href="https://www.facebook.com/beusalons" target="blank"><img src="http://beusalons.com/images/email/facebook.png" alt="" style="width: 25px;margin-left: 20px;"></a></span>&nbsp<span><a href="https://twitter.com/beusalons" target="blank"><img src="http://beusalons.com/images/email/twitter.png" alt="" style=" width: 25px;"></a></span>&nbsp<span><a href="https://www.instagram.com/beusalons/" target="blank"><img src="http://beusalons.com/images/email/instagram.png" alt="" style=" width: 25px;"></a></span>&nbsp<span><a href="https://plus.google.com/u/1/100683126750126363146" target="blank"><img src="http://beusalons.com/images/email/googleplus.png" alt="" style=" width: 25px; "></a></span>&nbsp<span style="float: right;margin-right: 29px;font-size: 14px;margin-top: 5px;"><a href="http://beusalons.com/" target="blank">Customer Support</a>  |  <a href="http://beusalons.com/" target="blank">FAQ</a>  |  <a href="http://beusalons.com/" target="blank">Gift Cards</a>  |  <a href="http://beusalons.com/" target="blank">Contact Us</a></span></td></tr>';

            welcomeMailContent+='</tbody></table></body>';

        }

        $scope.welcomeMessage=function(){
            //console.log('Dear '+client.name+',Welcome to Be U Salon. We thank you for signing up with us. Visit beusalons.com for exciting offers and discounts.')
        }

        $scope.returnToHome=function(){

            /*$scope.welcomeMail();*/
            localStorageService.set("cartQuantity",undefined);
            localStorageService.set("accordionDealsRefreshObeject",undefined)
            localStorageService.set("dealFilterForSalonsRefreshObeject",undefined)
            localStorageService.set("accordionDealsRefreshObeject",undefined);
            // localStorageService.set('userLoginPhoneNumber',undefined);
            //  localStorageService.set('userLoginPassword',undefined);
            localStorageService.set('cart',0);
            localStorageService.set('requiredParlorId',undefined);
            localStorageService.set("cartParlorId",undefined);
            localStorageService.set("cartQuantity",undefined);
            localStorageService.set("userQuery",undefined);
            // localStorageService.set('userNameAfterLogIn',undefined);
            localStorageService.set('cartObjectStored',undefined);
            // localStorageService.set('userId',undefined);
            // localStorageService.set('accessToken',undefined);
            // localStorageService.set('profilePageToBeOpened',undefined);
            //  localStorageService.set('appointmentId',undefined);
            localStorageService.set('cartIds',0);
            /*localStorageService.set("lullFlag",false);*/
            localStorageService.set('appt',undefined);
            localStorageService.set('currentDateStored',undefined);
            localStorageService.set('previousdayWeekendWeekday',undefined);
            //localStorageService.set('offerPageSearchedLocation',undefined);
            Service.setNumber(0);
            $location.path('/');
        }

        $scope.goToCartParlor=function(){
            //console.log("cartclicked");
            if(localStorageService.get('cartQuantity')!=undefined  && localStorageService.get('cartQuantity')!='0'){
                var a =   (localStorage.getItem("app.cartParlorLink")).replace('"', '').replace('"', '');
                $location.path('/parlor-detail/'+a);
            }
            else{
                alert("Nothing is in the cart")
            }
        }
        $scope.showWalletOptions='';
        $scope.appointmentBookedSuccesfulDialog = function(ev) {
            //alert("here")
            $mdDialog.show({
                controller: appointmentBookedSuccesfulController,
                templateUrl: '/website/views/appointmentBookedSuccessful.html',

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
        function appointmentBookedSuccesfulController($scope, $mdDialog) {
            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.close=function(){
                $scope.hide();
            }
        };
        // //console.log($scope.cart);
        /*-------------------------$filter('date')(appt.startsAt, 'h:mm a');--- $filter('date')(appt.startsAt, 'dd/MM/yyyy')-----Checkout Work---------------------Start------------------------------*/

        $scope.mailBody='';
        $scope.AppointmentMessageToBeSent=function(appt){

        }

        $scope.cartBufferFlag=false;

        $scope.paymentModeSelected=function(data){
            $scope.showWalletOptions=data;
            ////console.log(data);
        };
        $scope.paymentsOptions=[{"name":"Cash Payment","value":"1"},{"name":"Online Payment","value":"5"}];
        $scope.payForOrder=function(payOption,ev){
            ga('send', {
                hitType: 'event',
                eventCategory: 'Payment Button',
                eventAction: 'click',
                eventLabel: 'payed'
            });
            // //console.log($scope.appObj);
            ////console.log($scope.userNameAfterLogIn);

            /*$scope.AppointmentMessageToBeSent($scope.appObj);
            $scope.AppointmentMailToBeSent($scope.appObj);*/

            // //console.log(payOption);
            if(payOption==1)
            {
                $scope.cartBufferFlag=true;

                $http({
                    url: '/loggedapi/bookAndCapturePayment',
                    method: 'POST',
                    data: {
                        userId : localStorageService.get("userId"),
                        accessToken : localStorageService.get('accessToken'),
                        appointmentId : localStorageService.get("appointmentId"),
                        amount: $scope.appObj.payableAmount,
                        paymentMethod : 1, // 1 - cash, 2 - card, 3 - advance cash, 4 - advance online, 5 - razor pay, 6 - paytm
                    }
                }).then(function (response) {
                    $scope.cartBufferFlag=false;
                    $location.path('/userProfile');
                    openSuccesfullDialogService.setFlag(true);

                    /!*$scope.appointmentBookedSuccesfulDialog(ev);*!/
                    $scope.goToProfileOrLogin('My Appointments')

                    // //console.log(response);
                });

            }
            else if(payOption == 6){

                $scope.initPaytmPayment();
            }
            else if(payOption == 5){
                $scope.razorpay();
            }
        };

        $scope.initPaytmPayment = function(){
            ////console.log("addsa");
            $http.post('/loggedapi/initPaytmPayment', {appointmentId : localStorageService.get("appointmentId"), userId : localStorageService.get("userId"), accessToken : localStorageService.get('accessToken')}).success(function(re){
                var paytmVar = re.data;
                //console.log(paytmVar);
                var formData = "";
                for(var i=0; i<Object.keys(paytmVar).length; i++){
                    formData += '<input type="hidden" name="' + Object.keys(paytmVar)[i] +'" value="' + paytmVar[Object.keys(paytmVar)[i]] + '">';
                }
                document.getElementById('paytm-form').innerHTML += formData;
                document.getElementById('paytm-form').submit();
            });
        };

        $scope.razorpay = function(){
            //Razor Pay
            ////console.log(localStorageService.get("userId"));
            ////console.log(localStorageService.get("accessToken"));
            ////console.log(localStorageService.get("appointmentId"));
            $http.post('/loggedapi/appointmentDetail', {appointmentId : localStorageService.get("appointmentId"), userId : localStorageService.get("userId"), accessToken : localStorageService.get('accessToken')}).success(function(re){

                var appointment = re.data;
                //console.log(appointment);
                var appointmentPayableAmount = parseInt(appointment.payableAmount) * 100; // in paise
                var appointmentId = appointment.appointmentId;
                var options = {
                    "key": "rzp_live_c8wcuzLEGSGlJ5",
                    "amount": appointmentPayableAmount, // 2000 paise = INR 20
                    "name": "BeU Salons",
                    "description": "Appointment",
                    "image": "/website/images/Be U logo.png",
                    "handler": function (response1){
                        $scope.cartBufferFlag=true;
                        $timeout(function () {
                            $scope.cartBufferFlag=false;
                        }, 60000);
                        //console.log(response1.razorpay_payment_id);
                        $http({
                            url: '/loggedapi/bookAndCapturePayment',
                            method: 'POST',
                            data: {
                                userId : localStorageService.get("userId"),
                                accessToken : localStorageService.get('accessToken'),
                                razorpay_payment_id: response1.razorpay_payment_id,
                                amount: appointmentPayableAmount,
                                paymentMethod : 5, // 1 - cash, 2 - card, 3 - advance cash, 4 - advance online, 5 - razor pay, 6 - paytm
                            }
                        }).then(function (response) {
                            $scope.cartBufferFlag=false;
                            $location.path('/userProfile');
                            openSuccesfullDialogService.setFlag(true);

                            /*$scope.appointmentBookedSuccesfulDialog(ev);*/
                            $scope.goToProfileOrLogin('My Appointments')


                            ////console.log(response);
                        }).error(function(error){
                            alert("here")
                        });
                    },
                    "prefill": {
                        "name": $scope.userNameAfterLogIn,
                        "email": $scope.user.email,
                        "contact":$scope.userLoginPhoneNumber
                    },
                    "notes": {
                        "address": "Hello World",
                        "appointmentId": appointmentId
                    },
                    "theme": {
                        "color": "#d2232a"
                    }
                };
                var rzp1 = new Razorpay(options);
                rzp1.open();
            });

        };
        $scope.cartAddButton=function(index){
            // Service.setNumber(10);
            $scope.cartBufferFlag=true;
            ////console.log(index);
            localStorageService.get('cartParlorId')
            //  alert(Service.getNumber());
            $scope.cart[index].quantity++;
            $scope.appt.appointmentId=localStorageService.get('appointmentId');
            // //console.log($scope.appt);

            $scope.appt.services[index].quantity++;
            localStorageService.set("appt",$scope.appt);
            var cartIndex=0;
            var cartQuantityChanging=0;
            while(cartIndex<$scope.appt.services.length){
                cartQuantityChanging=cartQuantityChanging+$scope.appt.services[cartIndex].quantity;
                cartIndex++;
            }
            Service.setNumber(cartQuantityChanging)
            $http.put('/loggedapi/appointment',$scope.appt).success(function(re){
                $scope.appObj=re.data;
                $scope.cartBufferFlag=false;
                ////console.log($scope.appObj);
                $scope.cart=re.data.services;
                /*   localStorageService.set("cart",$scope.cart);*/


            });


            //$scope.allCategories[c1].services[s1].quantity++;

        };
        $scope.cartRemoveButton=function(index){
            if($scope.cart[index].quantity>0){
                $scope.cartBufferFlag=true;
                $scope.cart[index].quantity--;
                $scope.appt.appointmentId=localStorageService.get('appointmentId');
                ////console.log($scope.appt);
                $scope.appt.services[index].quantity--;
                localStorageService.set("appt",$scope.appt);
                var cartIndex=0;
                var cartQuantityChanging=0;
                while(cartIndex<$scope.appt.services.length){
                    cartQuantityChanging=cartQuantityChanging+$scope.appt.services[cartIndex].quantity;
                    cartIndex++;
                }
                Service.setNumber(cartQuantityChanging)
                $scope.appt.appointmentId=localStorageService.get('appointmentId');
                // //console.log($scope.appt);

                $http.put('/loggedapi/appointment',$scope.appt).success(function(re){
                    //console.log(re);
                    $scope.appObj=re.data;
                    $scope.cartBufferFlag=false;
                    ////console.log($scope.appObj);
                    $scope.cart=re.data.services;
                    /* localStorageService.set("cart",$scope.cart)*/
                });
            }
            // alert(Service.getNumber());

        };


        $scope.applyLoyalityPoints=function(){
            $scope.cartBufferFlag=true;
            $scope.appt.appointmentId=localStorageService.get('appointmentId');
            $scope.appt.useLoyalityPoints=$scope.cashLoyality;
            ////console.log($scope.appt);
            $http.put('/loggedapi/appointment',$scope.appt).success(function(re){
                $scope.appObj=re.data;
                $scope.cartBufferFlag=false;
                ////console.log(re);
                $scope.cart=re.data.services;
                /* localStorageService.set("cart",$scope.cart)*/
            });
        }

        /*-----------------------------Booking appointment starts here--------------------------------------*/
        if(localStorageService.get("appt")!=undefined){
            $scope.appt=localStorageService.get("appt");
            $scope.appt.accessToken=localStorageService.get("accessToken");
            $scope.appt.userId=localStorageService.get("userId");
            ////console.log("localStorageService.get('appt')",$scope.appt);
            var cartIndex=0;
            var cartQuantityChanging=0;
            while(cartIndex<$scope.appt.services.length){
                cartQuantityChanging=cartQuantityChanging+$scope.appt.services[cartIndex].quantity;
                cartIndex++;
            }
            Service.setNumber(cartQuantityChanging)
            $scope.appt.appointmentId=null;
            $http.post('/loggedapi/appointment',$scope.appt).success(function(data, err){
                //console.log(data);
                //console.log(err);
                //alert("success");
                localStorageService.set('appointmentId',data.data.appointmentId);
                activeAppointmentId = data.data.appointmentId;
                ////console.log(data);
                // //console.log(localStorageService.get('accessToken'))
                ////console.log(localStorageService.get("userId"))
                // //console.log( data.data.appointmentId)
                $http.post('/loggedapi/appointmentDetail', {appointmentId :  data.data.appointmentId, userId : localStorageService.get("userId"), accessToken : localStorageService.get('accessToken')}).success(function(re){
                    ////console.log("re re re re re re re re ere re er er ere erer ");
                    // //console.log(re);
                    $scope.appObj=re.data;
                    /*$scope.cart=localStorageService.get('cart');*/
                    ////console.log($scope.appObj);
                    var data = {
                        userId: localStorageService.get('userId'),
                        accessToken: localStorageService.get('accessToken')
                    };
                    $scope.cart=re.data.services;
                    $http({
                        url: '/loggedapi/profile',
                        method: 'POST',
                        data: data
                    }).then(function (response) {
                        ////console.log("profile data");
                        // //console.log(response);
                        $scope.user=response.data.data;
                    })
                });

                //  alert("appointment registered");

                if($scope.userId==null){
                    $timeout(function() {
                        var el = document.getElementById('sign');
                        angular.element(el).triggerHandler('click');
                    }, 0);
                }
            }).error(function (data) {

            });
        }
        $scope.editAppointment=false;
        var count=0;


        /*-----------------------------Booking appointment stops here--------------------------------------*/
        //header show after scroll
        // $(window).scroll(function() {
        //
        //     if ($(this).scrollTop()>0 )
        //     {
        //         $('.header-fixed').fadeOut();
        //     }
        //     else
        //     {
        //         $('.header-fixed').fadeIn();
        //     }
        // });
        // $(window).scroll(function (event) {
        //     var scroll = $(window).scrollTop();
        //     var oldState = $scope.showUpArrow;
        //     //console.log(scroll);
        //     if(scroll>0 || scroll==undefined){
        //         $scope.showUpArrow = true;
        //     }else{
        //         $scope.showUpArrow  = false;
        //     }
        //     if($scope.showUpArrow !== oldState) {
        //         $scope.$apply();
        //     }
        //
        // });
        //
        // var senseSpeed =0;
        // var previousScroll = 0;
        // $(window).scroll(function(event){
        //     var scroller = $(this).scrollTop();
        //     if (scroller-senseSpeed > previousScroll){
        //         $(".header-fixed").filter(':not(:animated)').slideUp();
        //
        //     } else if (scroller+senseSpeed < previousScroll) {
        //         $(".header-fixed").filter(':not(:animated)').slideDown();
        //
        //     }
        //     previousScroll = scroller;
        //
        // });
        /* window.addEventListener('scroll', function(e) {
             document.getElementById('header-fixed').classList[e.pageY > 10 ? 'add' : 'remove']('fade-in');
             alert("ok");
         });*/
        /*  $scope.lastScrollTop = 0;
          $scope.direction = "4";
          $scope.vanishHeader=false;
          angular.element($window).bind("scroll", function() {
              $scope.st = window.pageYOffset;
              if ($scope.st > $scope.lastScrollTop) {
                  $scope.direction = "down";
                  $scope.vanishHeader=true;
                  //console.log($scope.vanishHeader);
                  $scope.$apply();
              } else {
                  $scope.direction = "up";
                  $scope.vanishHeader=false;
                  //console.log($scope.vanishHeader);
                  $scope.$apply();
              }

              $scope.lastScrollTop = $scope.st;
              $scope.$apply();
              //console.log($scope.direction);
          });*/
        $scope.goToAboutUs=function(){
            window.scrollTo(0,0);
            $location.path( '/aboutUs' );
        };

        $scope.goToOffers=function(){
            window.scrollTo(0,0);
            $location.path( '/offerPage/deals' );
        };
        $scope.goToDeals=function(){
            window.scrollTo(0,0);
            $location.path( '/salon-deals' );
        };
        $scope.goToSubscription=function(){

            window.scrollTo(0,0);
            $location.path('/subscription');
        };


          // $scope.goTonewsalondeal=function(){
          //     window.scrollTo(0,0);
          //     $location.path( '/new-salon-deal' );
          // };
        // $scope.goToBlog=function(){
        //     window.scrollTo(0,0);
        //     $location.path( '' );
        // };
        $scope.goToContactUs=function(){
            window.scrollTo(0,0);
            $location.path('/contactUs' );
        };
          $scope.goToWebsiteQuery=function(){
            window.scrollTo(0,0);
            $location.path('/website-Query' );
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

    }]);

