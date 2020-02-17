'use strict'

angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','ngTable'])

    .controller('authorizedAppointmentsCtrl', function ($scope, $rootScope, $compile, $http, $timeout, $window, $log,NgTableParams) {

        $scope.nameSearched='';
        $scope.appointmentIdSearched='';
        $scope.memberships = memberships;
        $scope.appointments1 = appointments;
        $scope.authorizedAppts='';
		// console.log($scope.appointments1);
        $log.debug($scope.appointments1);
        $scope.pdata = inventoryItems;
        var currentSelectedService = {};
        var currentSelectedProduct = {};
        $scope.currProduct = {};
        $scope.count = 1;
        $scope.pcount = 1;
        var parlorTax = 0;
        $scope.firstDotsFlag=false;
        $scope.secondDotsFlag=true;
		//var app=[{"subtotal":23},{"subtotal":23},{"subtotal":23},{"subtotal":23},{"subtotal":23},{"subtotal":23},{"subtotal":23},{"subtotal":23},{"subtotal":13},{"subtotal":3},{"subtotal":3},{"subtotal":53},{"subtotal":63},{"subtotal":23},{"subtotal":23},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33}];
        $scope.callApi=function(pageNumber){
            /*$http.get("/role3/appointment?page="+pageNumber+'&name='+$scope.nameSearched+'&appointmentId='+$scope.appointmentIdSearched).success(function(response, status){
                console.log(response);
                $rootScope.appointments=response.data.appointments;
                $scope.buttonArrayLength=response.data.totalPage;

                $scope.appointments1=$rootScope.appointments;
                app=$rootScope.appointments;
                console.log(app);
                $scope.tableParams = new NgTableParams({ count: 5 }, { counts: [5, 10, 20], dataset: app});
            });*/
        }
          
        /*var a=[{"otherCharges":0,"subtotal":250,"discount":0,"appointmentType":1,"paymentMethod":1,"couponCode":null,"comment":"","membershipAmount":0,"bookingMethod":1,"allPaymentMethods":[],"membershipDiscount":0,"membersipCreditsLeft":"0.00","payableAmount":295,"productPrice":0,"appointmentId":"5975a4e560925c726cfbed75","parlorId":"593aa37c4769976f38246cfb","loyalityOffer":0,"parlorAppointmentId":66600,"appointmentStatus":"Upcoming","creditUsed":"0.00","tax":45,"status":1,"isPaid":false,"startsAt":"2017-07-24T07:42:29.757Z","estimatedTime":15,"loyalityPoints":0,"services":[{"name":"Shampoo & Conditioner","price":250,"actualPrice":250,"employees":[{"employeeId":"5969b4db13093e0d28c38949","name":"Amit Kumar","distribution":100,"commission":0,"_id":"5975a4e560925c726cfbed78"}],"estimatedTime":15,"additions":0,"quantity":1,"count":1,"typeIndex":0,"brandId":null,"productId":null,"brandProductDetail":"","code":111,"actualDealPrice":250,"discount":0,"tax":18,"comboServices":[],"membershipDiscount":0,"creditsUsed":0,"dealId":null,"serviceId":"58707eda0901cc46c44af361","type":"service","dealPriceUsed":false}],"products":[],"advanceCredits":0,"parlorName":"Makers","otp":"7246","client":{"noOfAppointments":3,"creditsLeft":0,"id":"5968cabfefe53c6093046e2c","phoneNumber":"9821754309","gender":"F","customerId":69774,"name":"Indiya. "},"receptionist":"Rosy Dabas","employees":["5969b4db13093e0d28c38949"],"parlorAddress":"Ground Floor,Pinnacle Mall"}]*/
        $scope.refreshAuthorizedAppointments=function(){
            $http.post("/role3/getAuthorisedPayment").success(function(response, status){
              // console.log(response);
              $scope.authorizedAppts=response;
              // console.log("$scope.authorizedAppts",$scope.authorizedAppts)
            });
        }
        $scope.refreshAuthorizedAppointments();
        // console.log("empoloyees ki list");
        // console.log(employees);
       $scope.x=0;
        
        $scope.hover=false;
        $scope.numberOfButtonsVisible=4;
        /* $scope.buttonArrayLength=10;*/
        $scope.activeButtonDummyObject={};
        $scope.disablePreviousFlag=true;
        $scope.disableNextFlag=false;

        $scope.buttonArray=[];
       $scope.callPaginationInitialisation=function(yesNoFlag){
           $scope.hover=false;
           $scope.numberOfButtonsVisible=4;
           /* $scope.buttonArrayLength=10;*/
           $scope.activeButtonDummyObject={};
           $scope.disablePreviousFlag=true;
           $scope.disableNextFlag=false;
           $scope.buttonArray=[];
           var indx1=0;
           while(indx1<$scope.buttonArrayLength){
               var obj={"value":indx1+1,"active":false,"showFlag":false};
               $scope.buttonArray.push(obj);
               indx1++;
           }
           if(($scope.buttonArrayLength>=3)&&($scope.buttonArrayLength-$scope.numberOfButtonsVisible>=2)){
               for(var i=1;i<=$scope.numberOfButtonsVisible;i++){
                   $scope.buttonArray[i].showFlag=true;
               }//we see that numberOfButtonsVisible is the value which says that the number of buttons visible should be 4 so ,i=1 is done so that as first button is forcefully made visible(below) we dont care about that and we we make the next 4 buttons visible(value of numberOfButtonsVisible)
           }
           if(yesNoFlag=='yes'){
               $scope.buttonArray[0].active=true;                              //this is made so that thehighlight stays on the first button
               $scope.buttonArray[0].showFlag=true;                            //and it is also visible
               $scope.buttonArray[$scope.buttonArrayLength-1].showFlag=true;   //this is done so that the last button is visible(not highlighted)
               $scope.activeButtonDummyObject= $scope.buttonArray[0];
           }

       }
                //in the whole code we need the active button to decide the pagination                                                                      steps so this id done to get the current active buttons object.

        $scope.buttonValue=function(valuePassed){                       //this is the function which gets hit when the button is clicked
            if(valuePassed.active){                                     //if the button is already active then nothing happens
                return;
            }else{
                //console.log(valuePassed.value);//required value for api
                $scope.callApi(valuePassed.value);
                if(valuePassed.value==1){
                    $scope.disablePreviousFlag=true;
                }else{
                    $scope.disablePreviousFlag=false;
                }
                if(valuePassed.value==$scope.buttonArray.length){
                    $scope.disableNextFlag=true;
                }else{
                    $scope.disableNextFlag=false;
                }
                $scope.activeButtonDummyObject=valuePassed;//so here if the button clicked was not active then the one which is clicked ,its                                                  object is made the active one
                valuePassed.active=!valuePassed.active;    //toggle of active flag is done to make the clicked button active and get highlighted
                var indx2=0;
                while(indx2<$scope.buttonArray.length){     //this loop is carried to remove the highlight from all the other buttons(actually                                                  from the at button which is active by finding  the active button)
                    if($scope.buttonArray[indx2].value!=valuePassed.value){
                        $scope.buttonArray[indx2].active=false;
                    }
                    indx2++;
                }
            }

        }
        $scope.goToPrevious=function(){

            //console.log( $scope.activeButtonDummyObject);
            for(var i=0;i<$scope.buttonArray.length;i++){

                if(($scope.buttonArray[i].value==$scope.activeButtonDummyObject.value)){
                    for(var k=1;k<$scope.buttonArray.length-1;k++){
                        if(($scope.activeButtonDummyObject.value>$scope.numberOfButtonsVisible)){
                            $scope.buttonArray[k].showFlag=false;
                        }
                    }
                    for(var j=0;j<$scope.numberOfButtonsVisible;j++){
                        if(i-j>0){
                            $scope.buttonArray[i-j].showFlag=true;
                        }
                    }
                    if($scope.buttonArray[1].showFlag==false){
                        $scope.firstDotsFlag=true;
                    }else{
                        $scope.firstDotsFlag=false;

                    }
                    if($scope.buttonArray[$scope.buttonArray.length-2].showFlag==true){
                        $scope.secondDotsFlag=false;
                    }else{
                        $scope.secondDotsFlag=true;

                    }
                    break;


                }
            }
            if($scope.activeButtonDummyObject.value>1){
                var indx2=0;
                while(indx2<$scope.buttonArray.length){
                    if($scope.buttonArray[indx2].value==$scope.activeButtonDummyObject.value){
                        $scope.buttonArray[indx2-1].active=true;
                        $scope.activeButtonDummyObject= $scope.buttonArray[indx2-1];
                        //console.log($scope.activeButtonDummyObject.value); //required value for api
                        $scope.callApi($scope.activeButtonDummyObject.value);
                        if($scope.activeButtonDummyObject.value==1){
                            $scope.disablePreviousFlag=true;
                        }else{
                            $scope.disablePreviousFlag=false;
                        }
                        if($scope.activeButtonDummyObject.value==$scope.buttonArray.length){
                            $scope.disableNextFlag=true;
                        }else{
                            $scope.disableNextFlag=false;
                        }
                        $scope.buttonArray[indx2].active=false;
                        break;
                    }
                    indx2++;
                }

            }

        }
        $scope.goToNext=function(){
            if($scope.activeButtonDummyObject.value<$scope.buttonArrayLength){ //it is checked that the highlight is not on the last button as                                                                          uske baad no next

                for(var i=0;i<$scope.buttonArray.length;i++){
                    if(($scope.buttonArray[i].value==$scope.activeButtonDummyObject.value)){

                        for(var k=1;k<$scope.buttonArray.length-1;k++){
                            if(($scope.buttonArray.length+1>$scope.numberOfButtonsVisible+$scope.activeButtonDummyObject.value)){
                                $scope.buttonArray[k].showFlag=false;
                            }
                        }
                        for(var j=0;j<$scope.numberOfButtonsVisible;j++){
                            if(i+j<$scope.buttonArray.length){
                                $scope.buttonArray[i+j].showFlag=true;
                            }
                        }
                        if($scope.buttonArray[1].showFlag==false){
                            $scope.firstDotsFlag=true;
                        }else{
                            $scope.firstDotsFlag=false;

                        }
                        if($scope.buttonArray[$scope.buttonArray.length-2].showFlag==true){
                            $scope.secondDotsFlag=false;
                        }else{
                            $scope.secondDotsFlag=true;

                        }
                        break;


                    }
                }
                var indx3=0;
                while(indx3<$scope.buttonArray.length){                         //this loop makes the next button active simple
                    if($scope.buttonArray[indx3].value==$scope.activeButtonDummyObject.value){
                        $scope.buttonArray[indx3+1].active=true;
                        $scope.activeButtonDummyObject= $scope.buttonArray[indx3+1];
                        //console.log($scope.activeButtonDummyObject.value); //required value for api
                        $scope.callApi($scope.activeButtonDummyObject.value);
                        if($scope.activeButtonDummyObject.value==$scope.buttonArray.length){
                            $scope.disableNextFlag=true;
                        }else{
                            $scope.disableNextFlag=false;
                        }
                        if($scope.activeButtonDummyObject.value==1){
                            $scope.disablePreviousFlag=true;
                        }else{
                            $scope.disablePreviousFlag=false;
                        }
                        $scope.buttonArray[indx3].active=false;
                        break;
                    }
                    indx3++;
                }
            }
        }


        $scope.filterApplied=function(){
            // console.log($scope.nameSearched+' '+$scope.appointmentIdSearched);
            // console.log("pageNumber"+$scope.activeButtonDummyObject.value);
            if(($scope.nameSearched=='')&&($scope.appointmentIdSearched=='')){
                $scope.callPaginationInitialisation('yes');
                $scope.callApi(1);

            }else{
                if($scope.nameSearched==undefined ){
                    $scope.nameSearched='';
                }
                if($scope.appointmentIdSearched==undefined){
                    $scope.appointmentIdSearched='';
                }
                $http({
                    url: '/role3/appointment?page=1&name='+$scope.nameSearched+'&appointmentId='+$scope.appointmentIdSearched,
                    method: 'GET'
                  /*  data:{page:$scope.activeButtonDummyObject.value,name:$scope.nameSearched,appointmentId:$scope.appointmentIdSearched}*/
                }).then(function(response) {
                    // console.log(response);
                    $rootScope.appointments=response.data.data.appointments;
                    $scope.appointments1=$rootScope.appointments;
                    $scope.buttonArrayLength=response.data.data.totalPage;
                    $scope.callPaginationInitialisation('yes');
                    app=$rootScope.appointments;
                    // console.log(app);


                });
            }
        }
        $scope.removeFilterApplied=function(){
            $scope.nameSearched='';
            $scope.appointmentIdSearched='';
            $http.get("/role3/appointment?page=1").success(function(response, status){
                // console.log(response);
                $rootScope.appointments=response.data.appointments;
                $scope.buttonArrayLength=response.data.totalPage;
                $scope.callPaginationInitialisation('yes');
                $scope.appointments1=$rootScope.appointments;
                app=$rootScope.appointments;
                // console.log(app);
                $scope.tableParams = new NgTableParams({ count: 5 }, { counts: [5, 10, 20], dataset: app});
            });
        }
    });
