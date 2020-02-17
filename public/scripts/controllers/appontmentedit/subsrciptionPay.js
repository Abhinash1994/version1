angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','isteven-multi-select','daterangepicker','ngSanitize', 'ngCsv'])

    .controller('subsrciptionPay', function ($scope, $compile, $http, $timeout, $window, $log,NgTableParams,Excel, $timeout) {
       
      $scope.data={}
      

      $scope.submitSubscriber=function(){
          // console.log("req is",{'':$scope.data.subsNumber,'num':$scope.data.phoneNumber})
          var obj={"newSubscriber":$scope.data.subsNumber,"existingSubscriber":$scope.data.existNumber}
          console.log("data",obj)
          $http.post("/role1/buyOneGetOneSubscription",obj).success(function(res){
           
              alert(res.data.message);
          })

      }

      $scope.razerAppointment=function(){
          $http.get("/loggedapi/captureRazorPaymentLink?payment_id="+$scope.data.paymentAppointment).success(function(res){
              console.log("final",res)
              alert("Appointment Success");
          })

      }

      $scope.submitData=function(s){
      		
              if($scope.data.selected==2){
              	
              	    $http.post("/role1/paymentLinkSubscription",{'paymentId':$scope.data.name,'code':$scope.data.referralcode}).success(function(res){
					 console.log("req is",{code:$scope.data.referralcode})
             alert(res.data.message);
					})
              }

              else{
             
                      console.log("req is",{'ORDER_ID ':$scope.data.ORDER_ID, 'phoneNumber': $scope.data.phoneNumber,amount:$scope.data.amount,code:$scope.data.referralcode})
              	    $http.post("/role1/paymentLinkPaytmSubscription",{ORDER_ID :$scope.data.ORDER_ID, 'phoneNumber': $scope.data.phoneNumber,amount:$scope.data.amount,code:$scope.data.referralcode}).success(function(res){
					 console.log(res)
           alert(res.data.message);
					})
              }
       


      }
     

    });

