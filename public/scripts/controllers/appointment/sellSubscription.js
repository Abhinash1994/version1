angular.module('sbAdminApp',[ 'isteven-multi-select'])

    .controller('sellSubscription', function ($scope, $compile, $http, $timeout, $window,$rootScope) {
    
    $scope.customers = clients;
    $scope.user={};
    $scope.employees=employees.filter(function(item) {
        return item.active;
      });
    $scope.buttonDisabled=true
    $http.get("/role3/getSubscriptionPriceInSalon").success(function(response, status){
        // console.log(response);
        $scope.subscriptionAmount=1699;
    });
    $scope.paymentOptions = [{ "value": 1, "name": "Cash", "isSelected": false }, { "value": 2, "name": "Card", "isSelected": false }];
	$scope.closeAppointment=function(appt){

        // console.log(appt);
		$http.post('/role1/changeAppointmentStatus', )
           .success(function (data, status, headers) {
               // console.log("appointment closed");
           })
    };
    $scope.employeesSelected=function(employees){
        $scope.emp=employees
        console.log("employees selected",$scope.emp,employees)
    }
    $scope.phoneNumberChanged = function() {
        $http.post("/role3/customer", { phoneNumber: $scope.user.phoneNumber }).success(function(response, status) {
            var data = response.data;
             console.log("customer api response",data);
            if (data) {
                $scope.user.userId = data.userId;
                $scope.user.emailId = data.emailId;
                $scope.user.name = data.name;
                $scope.user.gender = data.gender;
                $scope.user.clientHasApp = data.clientHasApp;
                if(data.subscriptionId){
                    $scope.user={};
                    alert("User Already Has Subscription")
                }
                //$scope.sendSubscriptionOTP();
            } else {
                $scope.user.userId = null;
                $scope.user.membershipId = null;
                $scope.user.membership = [];
                $scope.user.name = "";
                $scope.user.customerCrmFlag = true;
                $scope.user.credits = 0;
                $scope.user.clientHasApp = false;
                $scope.user.gender = "M";
            }
            $scope.otherCharges = 0;
            $scope.useAdvanceCredits = 0;
        });
        // console.log($scope.user);
    };
    $scope.customerNameChanged = function() {
        $scope.customers.forEach(function(customer) {
            if ($scope.user.name == customer.name) {
                // $scope.user.membershipName = customer.membership.name;
                $scope.user.userId = customer.userId;
                // console.log($scope);
                $scope.user.loyalityPoints = customer.loyalityPoints;
                $scope.user.phoneNumber = customer.phoneNumber;
                $scope.user.gender = customer.gender;
            }
        });
    };
    $scope.sendSubscriptionOTP=function(){
        $scope.otp = Math.floor(Math.random() * 9000) + 1000;
        var message = ' Hi ' + $scope.user.name + ', the OTP for your Subscription Purchase is '+ $scope.otp;
        var number = $scope.user.phoneNumber;
        $rootScope.$broadcast("sendSMSEvent", { message: message, numbers: number, type: "T", otp: $scope.otp });
    }
        $scope.buySubscription=function(){
             console.log("call function",$scope.emp,$scope.user.paymentOption.value);
            $http.post("/role3/subscriptionFromSalon",{phoneNumber:$scope.user.phoneNumber, amount:1699, firstName:$scope.user.name, emailId:$scope.user.emailId, gender:$scope.user.gender,paymentMethod:$scope.user.paymentOption.value,employees:$scope.emp}).success(function(response, status){
                if(response.success)    
                {
                    alert("Subscription Added to user succesfully. Please collect Rs. " + $scope.subscriptionAmount)
                }else{
                    alert(response.message)
                }
				
			});
        }
        $scope.$watch('user.name', function(value) {
            if($scope.user.paymentOption && $scope.user.name && $scope.user.phoneNumber && $scope.emp.length){
                $scope.buttonDisabled=false
            }else{
                // console.log("watch chala")
            }
          });
          $scope.$watch('user.paymentOption', function(value) {
            if($scope.user.paymentOption && $scope.user.name && $scope.user.phoneNumber && $scope.emp.length){
                $scope.buttonDisabled=false
            }else{
                // console.log("watch chala")
            }
          });
          $scope.$watch('emp', function(value) {
            if($scope.user.paymentOption && $scope.user.name && $scope.user.phoneNumber && $scope.emp.length){
                $scope.buttonDisabled=false
            }else{
                // console.log("watch chala")
            }
          });
        
	});
	