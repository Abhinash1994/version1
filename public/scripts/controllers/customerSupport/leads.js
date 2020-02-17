angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap', 'ui.bootstrap.datetimepicker','isteven-multi-select','daterangepicker','ngSanitize', 'ngCsv'])

    .controller('leads', function ($scope, $compile, $http, $timeout, $window, $log,NgTableParams,Excel, $timeout) {
        $scope.picker={isOpen : false,date:new Date()};
        $scope.response={}
        $scope.newClient={}
        $scope.userName=userName;
        $scope.subscriptionAmount=[];
        $scope.customerCareUserType=customerCareUserType;
        console.log("user type",$scope.customerCareUserType)
        var date = new Date();
        var time = new Date(date.getTime());
        time.setMonth(date.getMonth() + 1);
        time.setDate(0);
        $scope.daysRemaining =time.getDate() > date.getDate() ? time.getDate() - date.getDate() : 1;
        console.log("days left",$scope.daysRemaining)
            $scope.openCalendar = function(e) {
                $scope.picker={isOpen : true};
                console.log("date time value",$scope.picker.date)
            };
             $scope.userId=userId;
             if(customerCareUserType=="3"){
                $scope.statusvalue=[{name:"Not Interested",status:10},{name:"Follow Up",status:5},{name:"Number Not Reachable/Ringing",status:5},{name:"No Salon Nearby",status:10},{name:"Invalid Number",status:10},{name:"Whats App Dropped",status:10},{name:"Appointment Booked",status:3}]
             }else if(customerCareUserType=="2")
             {
                $scope.statusvalue=[{name:"Not Interested",status:10},{name:"Follow Up",status:5},{name:"Number Not Reachable/Ringing",status:5},{name:"No Salon Nearby",status:10},{name:"Invalid Number",status:10},{name:"Whats App Dropped",status:10},{name:"Subscription Sold",status:6}]
             }
               $http.post("/role1/customerCareLeadsDashboard",{"userId":$scope.userId }).success(function(response, status){
                      $scope.stats=response;
                      $scope.stats.pendingLeads.forEach(function(element) {
                          element.phoneNumber=element.phoneNumber.slice(-10); 
                      }, this);
                      console.log("data",$scope.stats)
                
             });
            

             $scope.submitQuery=function(){

                 $scope.params={status:$scope.selectedStatus.status,statusString:$scope.selectedStatus.name,appointmentId:$scope.response.appointmentId,followUpTime:$scope.picker.date,comment:$scope.response.comment,queryId:$scope.modalQuery._id,phoneNumber:$scope.modalQuery.phoneNumber,amount:$scope.response.amount}
                 console.log("prams",$scope.params)
                 $http.post("/role1/updateFacebookQuery",$scope.params).success(function(response, status){
                    console.log( "data",response);
                    $('#updateQuery').modal('hide');
                    $scope.response={};
                    $scope.appointmentId='';
                    $scope.refreshQuery()
                });
             }
             $scope.searchUser=function(phoneNumber){

                $http.post("/role1/facebookQueryByPhoneNumber",{phoneNumber:phoneNumber, userId : $scope.userId}).success(function(response, status){
                    console.log("phoneNumber response",response[0]);
                    $scope.stats.followUpLeads.unshift(response[0])
                    $scope.searchNumber=''
                });
             }


            $scope.refreshAppointment=function(){
                var userType=customerCareUserType;
                console.log("type",userType)
                if(userType==3){
                         $http.get("/role1/updateCustomerCareFacebookQueryAppointment").success(function(response, status){
                        alert("Successfully Refresh") 
                        
                     });  
                }
                else{
                        $http.get("/role1/updateCustomerCareFacebookQuerySubscription").success(function(response, status){
                            
                            alert("Successfully Refresh .") 
                     });  
                }
             
            }

             $scope.refreshQuery=function(){
                $http.post("/role1/customerCareLeadsDashboard",{"userId":$scope.userId }).success(function(response, status){
                    $scope.stats=response;
                    $scope.stats.pendingLeads.forEach(function(element) {
                        element.phoneNumber=element.phoneNumber.slice(-10); 
                    }, this);

                    console.log("data",$scope.stats)
              
             });
            }

             $scope.openModal=function(query){
                 $scope.modalQuery=query
                 console.log("query",$scope.modalQuery)
                $('#updateQuery').modal('show');
                $scope.subscriptionAmount=[];
             }
             $scope.addCustomer=function(){
                $('#addCust').modal('show');
             }
             $scope.addCustomerFunction=function(){
                console.log("new client",$scope.newClient)
                $http.post("/role1/createNewLeadFacebookQuery",{name:$scope.newClient.name,phoneNumber:$scope.newClient.phoneNumber,"userId":$scope.userId  }).success(function(response, status){
                    $('#addCust').modal('hide');
                    $scope.newClient={}
                    alert(response)
                    $scope.refreshQuery()
             });
               
             }
             $scope.sendReminderMessage=function(phoneNumber,queryId,apptId){
                var message=''
                if($scope.customerCareUserType=="2"){
                         message="Still havent purchased your Be U Salon Subscription. Need more clarity? Do connect back with "+$scope.stats.name+" "+"("+$scope.stats.phoneNumber +")" + " to get your special discount on our Salon Subscription (get FREE services worth Rs 500/month, for 12 months @1699) before the offer expires. Know more about our Salon Subscription plan http://beusalons.com/subscription"
                        $http.post("/role1/sendSmsToUser",{message:message ,phoneNumber:phoneNumber,queryId:queryId,customerCareId:$scope.userId}).success(function(response, status){
                             alert("SMS Sent Successfully")
                        });   
                        console.log("message",message)
                }else if($scope.customerCareUserType=="3"){
                    $http.get("/api/appointmentDetailParlorNameById?appointmentId="+apptId).success(function(appt, status) {
                        console.log("appt",appt)
                        message="We noticed that you couldnt make it for your appointment at Be U "+ appt.data.parlorName+ ", booked through "+$scope.stats.name+" "+"("+$scope.stats.phoneNumber +")" +".  Do connect back to reschedule and get your special price."
                        $http.post("/role1/sendSmsToUser",{message:message ,phoneNumber:phoneNumber,queryId:queryId,customerCareId:$scope.userId}).success(function(response, status){
                        alert("SMS Sent Successfully")
                     });
                    });    
                    console.log("message",message)
                } 
            }
             $scope.sendGreetingMessage=function(phoneNumber,queryId){
                 var message=''
                 console.log("user type",$scope.customerCareUserType)
                if($scope.customerCareUserType=="2"){
                    message="Thanks for taking out time and talking to "+$scope.stats.name+" from Be U Salons. Do connect back with "+$scope.stats.name+" "+"("+$scope.stats.phoneNumber +")" + ", to get your special discount on our Salon Subscription (get FREE services worth Rs 500/month, for 12 months @1699). Know more about our Salon Subscription plan http://beusalons.com/subscription"
                $http.post("/role1/sendSmsToUser",{phoneNumber:phoneNumber,message:message ,queryId:queryId,customerCareId:$scope.userId}).success(function(response, status){
                    
                alert("SMS Sent Successfully")
            
                });
            }else if($scope.customerCareUserType=="3"){
                    message="Hi,This side " +$scope.stats.name+" from Be U Salons. You have filled up a form on Facebook regarding deals on Keratin/Smoothening/Highlights/Global Color. Please reach me at "+$scope.stats.phoneNumber+ " to  help you book an appointment."
                $http.post("/role1/sendSmsToUser",{phoneNumber:phoneNumber,message:message ,queryId:queryId,customerCareId:$scope.userId}).success(function(response, status){
                    
                alert("SMS Sent Successfully")
            
                });

            }
     
    
        }
        $scope.todaysAppointmentMessage=function(name,phoneNumber,queryId){
            var message=''
           if($scope.customerCareUserType=="3"){
               message=name+", this is to remind you of your appointment at Be U Salons today. If you want to reschedule this appointment, you can call us on " +$scope.stats.phoneNumber
           $http.post("/role1/sendSmsToUser",{phoneNumber:phoneNumber,message:message ,queryId:queryId,customerCareId:$scope.userId}).success(function(response, status){
               
           alert("SMS Sent Successfully")
       
           });
       }


   }
        $scope.populateAmount=function(phoneNumber){
            console.log("req",phoneNumber)
            $http.get("/role1/checkAppointmentAmount?phoneNumber="+phoneNumber).success(function(res, status) {
                console.log("res",res);
                if(res>3000){
                    $scope.subscriptionAmount=[1699,1499,1199,699];
                }else{
                    $scope.subscriptionAmount=[1699,1499,1199];
                }
                //$scope.subscriptionAmount=[1699,1499,1199,699];
            })
        }

    });

