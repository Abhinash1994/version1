app.controller('userProfileCtrl', ['$rootScope','$scope', '$http','$route','$routeParams','$location','ngProgressFactory','localStorageService','$mdpDatePicker','$mdpTimePicker','$mdDialog','headerOption','$timeout','salonListingSearchBoxBooleanService','openSuccesfullDialogService','Service',
    function($rootScope,$scope, $http,$route, $routeParams, $location,ngProgressFactory,localStorageService,$mdpDatePicker,$mdpTimePicker,$mdDialog,headerOption,$timeout,salonListingSearchBoxBooleanService,openSuccesfullDialogService,Service) {


    salonListingSearchBoxBooleanService.setFlag(false);
      /*--------------------Variables Declaration Start--------------------*/
      $scope.myReviewContentLimit=[];

        $rootScope.headCallToProfileFlag=true;

      var user={"firstName":"","lastName":"User","phoneNumber":"","gender":"","profilePicLink":""};
      $scope.userName=localStorageService.get('userNameAfterLogIn');
      $scope.displayAccountOptions=false;
      $scope.userLastActivity="User Last Activity";
      $scope.optionToBeDisplayed="";
      $scope.user={"firstName":"","lastName":"","phoneNumber":"","gender":"","profilePicLink":""};
      $scope.user.firstName=user.firstName;
      $scope.user.lastName=user.lastName;
      $scope.user.phoneNumber=user.phoneNumber;
      $scope.user.gender=user.gender;
      $scope.user.profilePicLink=user.profilePicLink;
      $scope.userReviewedSalons='';
      $scope.loayaltyObject={"loyaltyPoints":"50","promoCode":"SHAIL0987"};



      $scope.optionsInAccount=[{"option":"My Profile","imagePathOptions":"My Profile"},{"option":"My Appointments","imagePathOptions":"My Appointments"},{"option":"My Loyalty Points","imagePathOptions":"My loyalty points"},{"option":"My Reviews","imagePathOptions":"My Reviews"}]

        $scope.mydate={"day":"","month":"","year":""};
        $scope.dateSelected={"myDate":""}
        $scope.timeSelected={"currentTime":""};
        $scope.customDatePicker=[];
        $scope.customTimePicker=[];

        $scope.dateSelected.myDate = new Date();
       // //console.log("localStorageService.get('userId')",localStorageService.get('userId'));
       // //console.log("localStorageService.get('accessToken')",localStorageService.get('accessToken'));
        $scope.userId=localStorageService.get('userId');

        $scope.accessToken=localStorageService.get('accessToken');

        $scope.addReviewObject={
            text:"",
            rating:"",
            parlorId:"",
            userId:"",
            appointmentId:""
        }

        $scope.radiodata={"Rating":""};

        /*--------------------Variables Declaration Stop--------------------*/


        /*--------------------Functions Declaration Start--------------------*/
        $scope.saveUserProfileInformation=function(){
            user={
                "firstName":$scope.user.firstName,
                "lastName":$scope.user.lastName,
                "phoneNumber":$scope.user.phoneNumber,
                "gender":$scope.user.gender,
                "profilePicLink":""
            };
           // //console.log("this is teh user profile");
           // //console.log(user);
          //  //console.log("This is the user information saved");
          //  //console.log(user);
        }

        $scope.changeLoyaltyFunction=function(){
            $scope.loayaltyObject.loyaltyPoints="100";
            $scope.loayaltyObject.promoCode="KUN8864";
        }

        $scope.displayAccountOptionsFuncn=function(){
            $scope.displayAccountOptions=!$scope.displayAccountOptions;
        }

        /*$scope.postOptionToBeDisplayed=function(){
            $scope.optionToBeDisplayed="User Profile";
        }*/
        $scope.saveUserProfile=function(){

        }
        
        //console.log(localStorageService.get('userId'));
        //console.log(localStorageService.get('accessToken'));
        $scope.optionOpenFuncn=function(value) {
            $scope.optionToBeDisplayed = value;
            localStorageService.set("profilePageToBeOpened",value);
            //alert( localStorageService.get("profilePageToBeOpened"))

            if (value == 'User Profile' || value == 'My Profile') {

                var data = {
                    userId: localStorageService.get('userId'),
                    accessToken: localStorageService.get('accessToken')
                };

                $http({
                    url: '/loggedapi/profile',
                    method: 'POST',
                    data: data
                }).then(function (response) {
                    //console.log("profile data");
                    //console.log(response);
                    $scope.user.firstName=response.data.data.firstName;
                    $scope.userName=$scope.user.firstName;
                    //$scope.user.lastName=user.lastName;
                    $scope.user.phoneNumber=response.data.data.phoneNumber;
                    $scope.user.gender=response.data.data.gender;
                    $scope.user.profilePicLink=response.data.data.profilePicLink;
                })
            }
            else if (value == "My Offers") {
                var data = {
                    userId: localStorageService.get('userId'),
                    accessToken: localStorageService.get('accessToken')
                };

                $http({
                    url: '/loggedapi/loyalityPoints',
                    method: 'POST',
                    data: data
                }).then(function (response) {
                    //console.log("loyalityPoints");
                    //console.log(response);
                })
            } else if (value == "My Appointments") {
                        //console.log("hjdhj")
                $scope.dummyObject= {}
                $scope.salonUpcomingAppointments='buffer';
                $http({
                    url: '/loggedapi/upcomingAppointments',
                    method: 'POST',
                    data: {userId: localStorageService.get('userId'), accessToken: localStorageService.get('accessToken')}
                }).then(function (response) {
                    ////console.log("upcomingPoints");
                    //console.log(response);
                    $scope.salonUpcomingAppointments=[];
                     $scope.salonUpcomingAppointments=response.data.data;
                    //console.log( $scope.salonUpcomingAppointments)

                    for(var i=0;i<$scope.salonUpcomingAppointments.length;i++){
                        $scope.customDatePicker.push($scope.salonUpcomingAppointments[i].startsAt);
                        $scope.customTimePicker.push($scope.salonUpcomingAppointments[i].startsAt);
                    }
//                  //  //console.log(" $scope.customDatePicker", $scope.customDatePicker);
                   // //console.log("$scope.customTimePicker",$scope.customTimePicker);
                })



                $http({
                    url: '/loggedapi/pastAppointments',
                    method: 'POST',
                    data: {
                        userId: localStorageService.get('userId'),
                        accessToken: localStorageService.get('accessToken'),
                        page: 1
                    }
                }).then(function (response) {
                   // //console.log("previousPoints");
                    ////console.log(response);
                    $scope.salonPreviousAppointments=response.data;
                })

            } else if (value == "My Loyalty Points") {

                $http({
                    url: '/loggedapi/loyalityPoints',
                    method: 'POST',
                    data: {userId: localStorageService.get('userId'), accessToken: localStorageService.get('accessToken')}
                }).then(function (response) {
                    ////console.log("loyalityPoints");
                    ////console.log(response);
                    $scope.loayaltyObject=response.data.data;
                })
            }
            else if (value == "My Reviews") {

                $http({
                    url: '/loggedapi/userReviewedSalons',
                    method: 'POST',
                    data: {userId: localStorageService.get('userId'), accessToken: localStorageService.get('accessToken')}
                }).then(function (response) {
                    ////console.log("userReviewedSalons");
                   // //console.log(response.data.data);
                    $scope.userReviewedSalons=response.data.data;
                    for(var i=0;i<$scope.userReviewedSalons.length;i++){
                        $scope.userReviewedSalons[i].contentLength=200;
                        $scope.userReviewedSalons[i].showReadMoreFlag=true;
                    }

                })

                //console.log()
            }
        }

        $rootScope.headCallToProfile=function(value){

            $scope.optionOpenFuncn(value);
        }

        $scope.showDatePickerUpcomingAppointments = function(index,ev) {
            $mdpDatePicker($scope.dateSelected.myDate, {
                targetEvent: ev,
                minDate:new Date()
            }).then(function(selectedDate) {

                //$scope.salonUpcomingAppointments[index].startsAt= selectedDate.toLocaleDateString();
                $scope.oldTime=$scope.salonUpcomingAppointments[index].startsAt.split('T');
                $scope.customDatePicker[index]=selectedDate.toJSON();
                $scope.dateSplitArray=$scope.customDatePicker[index].split('T');
               // $scope.dateSelected.myDate = selectedDate.toLocaleDateString();
                $scope.salonUpcomingAppointments[index].startsAt=$scope.dateSplitArray[0]+'T'+$scope.oldTime[1];
               // //console.log("Final time thru date picker",$scope.salonUpcomingAppointments[index].startsAt);
                $timeout($scope.showTimePickerUpcomingAppointments(index,ev), 20000);
            });


        };


        $scope.showTimePickerUpcomingAppointments = function(index,ev) {
            $mdpTimePicker($scope.timeSelected.currentTime, {
                targetEvent: ev
            }).then(function(selectedDate) {
                //$scope.salonUpcomingAppointments[index].startsAt= selectedDate.getTime();
                $scope.oldDate=$scope.salonUpcomingAppointments[index].startsAt.split('T');
                $scope.customTimePicker[index]=selectedDate.toJSON();
                $scope.timeSplitArray=$scope.customTimePicker[index].split('T');
               // //console.log($scope.timeSplitArray[0]+"fffffff"+$scope.timeSplitArray[1])
               // //console.log(selectedDate);
               // $scope.finalDate=$scope.dateSplitArray[0]+'T'+$scope.timeSplitArray[1]

                $scope.salonUpcomingAppointments[index].startsAt= $scope.oldDate[0]+'T'+$scope.timeSplitArray[1];
               // //console.log("Final time thru time picker",$scope.salonUpcomingAppointments[index].startsAt);

            });;
        }


        $scope.addReview=function(ev,parlorDetails){
            ////console.log("parlorDetails.parlorId",parlorDetails.parlorId);

            $scope.addReviewErrorFlag=false;
            $scope.addReviewObject={
                text:"",
                rating:"",
                parlorId:"",
                userId:"",
            };
            $scope.addReviewObject.parlorId=parlorDetails.parlorId;
           // //console.log("These re the required parlor details");
            ////console.log(parlorDetails.appointmentId);
            $scope.addReviewObject.appointmentId=parlorDetails.appointmentId;
            //$scope.addReviewObject.appointmentId=parlorDetails.appointmentId;


            $scope.radiodata={"Rating":""};

            $mdDialog.show({
                controller: addReviewDialog,
                templateUrl: '/website/views/addReviewDialog.html',
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


            function addReviewDialog($scope, $mdDialog) {
                $scope.hide = function() {

                    $mdDialog.hide();


                };

                $scope.cancel = function() {
                    $mdDialog.cancel();
                };
                $scope.automaticReviewFill=function(reviewGiven){
                    if(reviewGiven==1){
                        $scope.addReviewObject.text="Blah";
                    }else if(reviewGiven==2){
                        $scope.addReviewObject.text="Average";
                    }else if(reviewGiven==3){
                        $scope.addReviewObject.text="Good";
                    }else if(reviewGiven==4){
                        $scope.addReviewObject.text="Decent";
                    }else if(reviewGiven==5){
                        $scope.addReviewObject.text="Awesome";
                    }
                }
                $scope.reviewSubmitted=function(){

                    ////console.log("This is the required appointment Id");
                   // //console.log($scope.addReviewObject.appointmentId);
                   // //console.log("This is user id",localStorageService.get('userId'));
                    ////console.log("This is the review added");
                   // //console.log( $scope.addReviewObject.text);
                   // //console.log("This is the radio button data");
                    $scope.addReviewObject.rating=$scope.radiodata.Rating;
                    ////console.log($scope.addReviewObject.rating);
                    ////console.log("This is the parlor id added");
                    //$scope.addReviewObject.userId="57adf19f60e0a040289efdb6";
                    ////console.log("this is the parlor id");
                   // //console.log($scope.addReviewObject.parlorId);
                    $scope.addReviewObject.userId=localStorageService.get('userId');
                   // //console.log("This is the final object");
                   // //console.log($scope.addReviewObject);

                    $http({
                        url: '/loggedapi/addReview',
                        method: 'POST',
                        data: {
                            text:$scope.addReviewObject.text,
                            rating:$scope.addReviewObject.rating,
                            parlorId:$scope.addReviewObject.parlorId,
                            userId:localStorageService.get('userId'),
                            appointmentId:$scope.addReviewObject.appointmentId,
                            accessToken:localStorageService.get("accessToken")
                        }
                    }).then(function (response) {
                        ////console.log("Review Add");
                       // //console.log(response);
                        if(response.data.message=="Invalid data"){
                            $scope.addReviewErrorFlag=true;

                        }else{
                            $mdDialog.hide();
                        }
                    })
                }

            }

        }





        $scope.readMoreReviewContent=function(index){
            //alert(index)
           // alert( $scope.userReviewedSalons[i].showReadMoreFlag)
           // //console.log($scope.myReviewContentLimit);
            //  //console.log( $scope.userReviewedSalons[index]);
            $scope.userReviewedSalons[index].contentLength=20000;
            $scope.userReviewedSalons[index].showReadMoreFlag=false;
           // //console.log("localStorageService.get('accessToken')",localStorageService.get('accessToken'));
            ////console.log(" localStorageService.get('userId')",localStorageService.get('userId'));


        }

        /*--------------------Functions Declaration Stop--------------------*/


        /*--------------------Reload Functions Declaration Start--------------------*/
        //alert(localStorageService.get("profilePageToBeOpened"));
        if(localStorageService.get("profilePageToBeOpened")!=undefined){
            $scope.optionToBeDisplayed=localStorageService.get("profilePageToBeOpened");
            $scope.optionOpenFuncn($scope.optionToBeDisplayed);
        }
        else{
            $scope.optionToBeDisplayed='My Profile'
        }

        /*--------------------Reload Functions  Declaration Stop--------------------*/


        $scope.openPastAppointmentsDialog=function(ev,pastParlorDetails){
            $scope.displayPastParlorDetails="";
            ////console.log(pastParlorDetails);
            $scope.displayPastParlorDetails=pastParlorDetails;
            $mdDialog.show({
                controller: viewPastAppointmentsDialog,
                templateUrl: '/website/views/previousAppointmentsDialog.html',
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


            function viewPastAppointmentsDialog($scope, $mdDialog) {
                $scope.hide = function() {
                    $mdDialog.hide();

                };

                $scope.cancel = function() {
                    $mdDialog.cancel();
                };

                //alert("in here startsAt");


            }

        }

        $scope.appointmentBookedSuccesfulDialog = function() {
            //alert("here")
            $mdDialog.show({
                controller: appointmentBookedSuccesfulController,
                templateUrl: '/website/views/appointmentBookedSuccessful.html',

                scope: $scope,        // use parent scope in template
                preserveScope: true,
                parent: angular.element(document.body),
                targetEvent:"",
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

        if(openSuccesfullDialogService.getFlag()==true){


            localStorageService.set('cart',0);
            localStorageService.set('requiredParlorId',undefined);
            localStorageService.set("cartParlorId",undefined);
            localStorageService.set("cartQuantity",undefined);
            localStorageService.set("userQuery",undefined);

            localStorageService.set('cartObjectStored',undefined);


            localStorageService.set('appointmentId',undefined);
            localStorageService.set('cartIds',0);
            /*localStorageService.set("lullFlag",false);*/
            localStorageService.set('appt',undefined);
            localStorageService.set('offerPageSearchedLocation',undefined);
            $scope.appointmentBookedSuccesfulDialog();
            Service.setNumber(0)
            openSuccesfullDialogService.setFlag(false);
        }

    }]);