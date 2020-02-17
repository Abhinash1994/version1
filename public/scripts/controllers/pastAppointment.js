angular.module("sbAdminApp",['daterangepicker']).controller("pastAppointmentCtrl",function($scope,$http,$q){
     $scope.dates={}
            $scope.dates.date = {
                startDate:new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                endDate: new Date()
            };
    $scope.getPastAppointment=function(){
        console.log($scope.dates)
       $http.post("/role1/pastAppointmentsForSettlement",$scope.dates.date).success(function(res){
       console.log(JSON.stringify(res))
           $scope.pastAppointmentData=angular.copy(res.data)
    }) 
    }
     $('body').on('apply.daterangepicker', function(ev, picker) {
         try{
             $scope.getPastAppointment(); 
         }
         catch( e){
            $scope.getPastAppointment(); 
         }
    });
    
    
    $scope.printExcelData=function(){
         var deferred = $q.defer();
         $q.when($scope.pastAppointmentData).then(function() {
        var obj=angular.copy($scope.pastAppointmentData);
             
    var     arrayCsv = [];
                        for (var i = 0; i < obj.length; i++) {
                            var obj1 = {
                                "salonId":'',
                                "parlorName": '',
                                "startsAt": '',
                                "appointmentId": '',
                                "clientName": '',
                                "clientPhoneNumber": '',
                                "services": '',
                                "payableAmount": '',
                                "paymentMethod": '',
                                "loyalityPoints": '',
                                "couponCode": '',
                                "appointmentType": '',
                                "clientFirstAppointment": '',
                                "closedByName":'',
                                "membershipCredits" :''
                            }
                             var servicesString = '';
                            var paymentString = '';
                            obj1.parlorName = obj[i].parlorName;
                            var timeConversion = obj[i].startsAt;
                            obj1.salonId=obj[i].parlorId;
                            obj1.startsAt = new Date(timeConversion).toLocaleDateString();
                            obj1.appointmentId = obj[i].appointmentId;
                            
                            obj1.clientName = obj[i].client.name;
                            obj1.clientPhoneNumber = obj[i].client.phoneNumber;
                            obj1.payableAmount = obj[i].payableAmount;
                            obj1.loyalityPoints = obj[i].loyalityPoints;
                            obj1.couponCode = obj[i].couponCode;
                            obj1.appointmentType = obj[i].appType;
                            obj1.clientFirstAppointment = obj[i].clientFirstAppointment;
                            obj1.closedByName = obj[i].closedByName;
                            obj1.membershipCredits = obj[i].membershipCreditsUsed;
                            for (var j = 0; j < obj[i].allPaymentMethods.length; j++) {
                                paymentString = paymentString + obj[i].allPaymentMethods[j].name;
                                if (j != obj[i].allPaymentMethods.length - 1) {
                                    paymentString = paymentString + ',';
                                }
                            }
                            obj1.paymentMethod = paymentString;
                            for (var j = 0; j < obj[i].services.length; j++) {
                                servicesString = servicesString + obj[i].services[j].name;
                                if (j != obj[i].services.length - 1) {
                                    servicesString = servicesString + ',';
                                }
                            }
                            obj1.services = servicesString;
                            arrayCsv.push(obj1);
                            console.log("array csv");
                            console.log(arrayCsv)
        
        
    }
          var csvData = arrayCsv;
                        csvData.unshift({"Salon Id":'salonId', "Parlor Name": 'parlorName', "Appt. Date": 'startsAt', "Appt. Id": 'appointmentId', "Customer Name": 'clientName', "Customer Mobile": 'clientPhoneNumber', "Services": 'services', "Payable Amount": 'payableAmount', "Payment Method": 'paymentMethod', "Loyalty Points": 'loyalityPoints', "Coupon Code Used": 'couponCode', "appointmentType": 'appointmentType', "clientFirstAppointment": 'clientFirstAppointment',"closedByName":'closedByName',"Membership Credits Used" : 'membershipCredits' });
                        deferred.resolve(csvData);    
             
             
         })
        
         return deferred.promise;
        
    }
    
})