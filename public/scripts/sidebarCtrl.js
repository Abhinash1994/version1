'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
    .controller('SidebarCtrl', function($scope,$position, $http, $timeout, $state,$stateParams,$rootScope) {

      $scope.role = role;
      $scope.userId=userId;
      $scope.showReports=window.location.hostname=="beusalons.com"?false:true;

        console.log("parlorname",$scope.parlorName)
      // console.log(role)
      if($scope.location=="")
      if(role == 7){
        $http.post("/role3/employees").success(function(response, status){
            employees = response.data;
        });

        $http.post("/role2/allParlors").success(function(response, status){
            allParlors = response.data;
        });

        
      }
    $http.get("/role3/chapters").success(function(response, status){
        $scope.chapters=response.data;
        // console.log(response.data);

    });
    $scope.chapter=function(chapterId){
        // console.log(chapterId);
        $state.go('dashboard.viewTutorial',{chapterId:chapterId});
    }

        $http.get("/role1/customerCareTeamMembers").success(function(response, status){
            customerCareTeamMembers = response;
             console.log("customerCareTeamMembers data",customerCareTeamMembers)
        });



      // if(role!=1 && role != 7 && userType !="1"){
      if(role!=1 && userType !="1"){
        // console.log("sdasadsda sdasdasad sdasaddsa");
        $http.post("/role3/services").success(function(response, status){
            services = response.data;
            // console.log("service data",services)
        });





        $http.get("/role3/getDealSlabs").success(function(response, status){

            // console.log(response);

            slabs=response.data;
            $rootScope.parlorId=response.data[0]._id;

            // console.log( $rootScope.parlorId)
        });//slabs variable for combo/newCombo discount

        // $http.get("/role3/newPackagesApi").success(function(response, status){
        //     console.log(response);
        //     packagesComboNewCombo=response.data;
        // }).error(function(data){
        //             console.log(data);
        // });

        $http.post("/role3/employees").success(function(response, status){
            employees = response.data;
        });

        $http.get("/role2/membership").success(function(response, status){
            memberships = response.data;
        });

         $http.get("/role2/deals").success(function(response, status){
            deals = response.data;
        });

        $http.get("/role2/inventory").success(function(response, status){

            inventoryItems = response.data;


        });

        $http.get("/role3/appointment").success(function(response, status){
            appointments = response.data;
        });

        $http.get("/role2/package").success(function(response, status){
            packages = response.data;
        });
        
        
        $http.get("/role2/parlorServiceByCategoryIds"+"/?parlorId="+parlorId).success(function(response, status){
            newServices = response.data;
            // console.log("new services",newServices)
        });

        $http.get("/role2/logo").success(function(response, status){
            // console.log('logo',response)
            logo = response.data.logo;
            parlorName = response.data.name;
            parlorType = response.data.parlorType;
            legalEntity = response.data.legalEntity;
            parlorAddress = response.data.parlorAddress;
            parlorRegisteredAddress = response.data.parlorRegisteredAddress;
            serviceTaxNumber = response.data.serviceTaxNumber;
            gstNumber = response.data.gstNumber;
            contactNumber = response.data.contactNumber;
            tinNumber = response.data.tinNumber;
            editPriceAtBooking = response.data.editPriceAtBooking;
            openingTime=response.data.openingTime;
            closingTime=response.data.closingTime;
            branchCode = response.data.branchCode;
            editCRM = response.data.editDiscountFromCrmPermission;
           // googleURL=response.data.googleRateLink;
            $rootScope.parlorTax=response.data.parlorTax;
            realParlorTax=response.data.parlorTax;
             $scope.parlorName = parlorName;
            document.getElementById("profile-image").style.backgroundImage = "url('"+ logo +"')";
           // console.log("editCRM",response.data.editDiscountFromCrmPermission,$rootScope.parlorTax)
        });

        $http.get("/role2/facebookpages").success(function(response, status){
            pages = response.data;
            if(pages.constructor === Array && pages.length>0){
                pages = response.data[0].data;
                $state.go('dashboard.facebookpage');
            }
        });


        $http.post("/role3/customers?page=1").success(function(response, status){
            clients = response.data;
        });





/*        var socket = io.connect('/');
     socket.on("messages",function(data){
        console.log("message is ",data);
        //alert(data)
    })

     socket.on("connectionCreated",function(data){
        console.log("SDAdsa");
        console.log(data);
        $http.get("/role3/registerSocket?socketId=" + data.id).success(function(response, status){
            console.log("message is ", response);
        });
        //alert(data)
    })

    socket.on("payment",function(data){
        console.log("payment received is ",data);
        //alert(data)
    })

    socket.on("newOrder",function(data){
        console.log("new order from server ",data);
        //alert(data)
    })*/

       /* // $scope.appointments.forEach(function(appt){
        //     $scope.p.push(angular.copy($scope.paymentOptions));
        //     for(var i=0;i<appt.allPaymentMethods.length;i++){
        //         $scope.p[index].forEach(function(options){
        //             if(options.value==appt.allPaymentMethods[i].value)
        //                 options.isSelected=true;
        //             console.log("true hua at" +i);
        //         });
        //     }
        //
        //     index++;
        // });*/
      }



      $scope.$on("sendSMSEvent", function (event, args) {
        var element = args.element;
        $http.post("/role3/sendSms", args).success(function(response, status){
            // console.log(response.data);
            // console.log(response);
        });
    });



        // $rootScope.$broadcast("sendSMSEvent", {message: "ssdsadd", numbers : [], type : "P" ,otp: "OTP"});  add $rootScope in controller


  })
