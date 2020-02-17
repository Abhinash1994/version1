'use strict'

angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap', 'ngAnimate'])

    .controller('appointmentsOTPCtrl', function ($scope, $compile, $http, $timeout, $window, $log, $rootScope) {
        $scope.tabs = [{},{},{},{},{}];
        $scope.memberships = memberships;
		$scope.services=services;

        $scope.appointments = appointments;
        $log.debug($scope.appointments);

        $scope.pdata = inventoryItems;
		// console.log($scope.memberships);

        var currentSelectedService = {};
        var currentSelectedProduct = {};
		$scope.gender=[{"name":"Female","value":"F"},{"name":"Male","value":"M"}];
        $scope.currProduct = {};
        $scope.count = 1;
        $scope.pcount = 1;
		$scope.tab = true;
		$scope.showSuperCategory=true;
		$scope.showCustOTP=false;
        $scope.appointmentType = 1;
        $scope.paymentMethod = 1;
        var parlorTax = 0, editAppointmentIndex=0;
		$scope.s={"gender":'F'};
		$scope.active=2;
		$scope.first=true;
		$scope.second=false;
		$scope.third=false;
		$scope.showGender=true;
		$scope.showCategory=false;
		$scope.showService=false;
		
		$scope.showSubService=false;"myOtp == OTP"
        $('#datetimepicker1').datetimepicker();

		$scope.newApp1=function(){
			// console.log("tab 2 function called");
			$scope.first=false;
			$scope.second=true;
			$scope.third=false;

		};
		$scope.cate=function(categ){
			$scope.selectedService=categ;
			// console.log($scope.selectedService);
			$scope.showCategory=false;
			$scope.showService=true;
			$scope.showGender=false;
			$scope.showSuperCategory=false;
		};

		$scope.serv=function(ser1){
			// console.log($scope.selectedService);
			// console.log(index);
			$scope.subServices=ser1;
			if(ser1.prices.length==1){
				$scope.showDepartmentMenu();
				$scope.addNewService(0);

			}
			else{
				$scope.showSubService=true;


			}
		};

		$scope.superF=function(superC){
			$scope.showGender=false;
			$scope.showSuperCategory=false;
			$scope.showCategory=true;
			$scope.showService=false;
			// console.log($scope.s);
			// console.log(index);
			$scope.sers=superC.categories;
			// console.log($scope.sers);
		};

        $scope.applyCoupon = function(){
            $http.post("/role3/newAppointmentCoupon", { data: $scope.newApp }).success(function (response, status) {
                var data = response.data;
                // console.log(data);
                $scope.newApp.couponMessage = data.message;
                $scope.newApp.total = data.total;
                $scope.newApp.discount = data.discount;
            });


        }

        $scope.memberships.push({ membershipId: 0, name: 'None', discount: 0 });

        $scope.serviceNames = [];
        $scope.serviceCodes = [];
        $scope.serviceObjs = [];
        services.forEach(function (cat) {
            cat.categories.forEach(function(service_cat){
            service_cat.services.forEach(function (service) {
                service.prices.forEach(function (price) {
                    if(price.employees.length>0){
                        $scope.serviceCodes.push(price.priceId);
                        var serviceObj = {};
                        serviceObj.serviceName = "" + service.name + " - " + price.priceId;
                        serviceObj.serviceCode = price.priceId;
                        serviceObj.price = price.price;
                        serviceObj.serviceId = service.serviceId;
                        serviceObj.employees = price.employees;
                        $scope.serviceNames.push(serviceObj.serviceName);
                        $scope.serviceObjs.push(serviceObj);
                    }
                });
            });
            });
        });
        $scope.products = inventoryItems.filter(function (el) {
            return el.costPrice;
        });
		// $scope.sendOTP=function(){
		// 	$scope.OTP = Math.floor(Math.random() * 90000) + 10000;
    //
		// };

        $log.debug('Service Objs: ', $scope.serviceObjs);
		
		$scope.customerDetail=function(){
			$scope.tabs[3].active = true;
			if(!$scope.newApp.user.userId){
				 $http.post("/role3/createNewCustomer", {firstName:$scope.newApp.user.name, phoneNumber:$scope.newApp.user.phoneNumber, gender:$scope.newApp.user.gender}).success(function (response, status) {
					var data = response.data;
					$scope.newApp.user.userId = data.userId;
				 });
			}
		};

        $scope.phoneNumberChanged = function () {
            // console.log("fhh");
            $scope.newApp.appointmentTime = moment(new Date()).format();
            $http.post("/role3/customer", { phoneNumber: $scope.newApp.user.phoneNumber }).success(function (response, status) {
                var data = response.data;
                if (data) {
                  $scope.newApp.user.membershipName = data.membership.name;
					$scope.newApp.user.userId = data.userId;
                    $scope.newApp.user.name = data.name;
                    $scope.newApp.user.credits = data.credits;
                    $scope.newApp.user.gender = data.gender;
                    $scope.newApp.user.membershipId = data.membership.membershipId ? data.membership.membershipId : "0";
					if($scope.newApp.user.credits){
						
					}
                } else {
                    $scope.newApp.user.membershipId = 0;
					// $scope.newApp.user.
                }
                $scope.newApp.otherCharges = 0;
            });
        };

        $scope.changeStatus = function (index, status) {

            $scope.currentViewedAppointment = isNaN(index) ? index : $scope.appointments[index];

            // console.log($scope.currentViewedAppointment.appointmentId);
            $http.put("/role3/newAppointment", { appointmentId: $scope.currentViewedAppointment.appointmentId, userId: $scope.currentViewedAppointment.client.id, status: status }).success(function (response, status) {
                // console.log(response.data);
                if (!isNaN(index)) {
                    
                }
                refreshAppointments();
                // $scope.appointments.splice(index, 1);
            });
        };
		$scope.print = function (index) {
            var tobePrinted = isNaN(index) ? index : $scope.appointments[index];
            // console.log(tobePrinted);
            var printData = "<div style='text-align: center'><br><b>" + parlorName +"</b></div><hr><br>";
            printData += "<h4><b>Appointment Details:</b></h4>";
            printData += `<table border="1" style='width: 100%; border-collapse: collapse'>
                        <tr>
                            <td><b>ID:</b> `+ tobePrinted.parlorAppointmentId + `</td>
                            <td><b>Starts At: </b>`+ tobePrinted.startsAt + `</td>
                        </tr>
                        <tr>
                            <td><b>Receptionist:</b> `+ tobePrinted.receptionist + `</td>
                            <td><b>Estimated Time: </b>`+ tobePrinted.estimatedTime + `</td>
                        </tr>
                    </table><br>`;


            printData += "<h4><b>Client Details:</b></h4>";
            printData += "<table border='1' style='width: 100%; border-collapse: collapse; text-align: center'>";
            printData += `<tr>
                            <th>Client ID</th>
                            <th>Name</th>
                            <th>Gender</th>
                            <th>Phone No.</th>
                        </tr>`;
            printData += "<tr>";
            printData += `<td>` + tobePrinted.client.customerId + `</td>
                     <td>`+ tobePrinted.client.name + `</td>
                     <td>`+ tobePrinted.client.gender + `</td>
                     <td>`+ tobePrinted.client.phoneNumber + `</td>`;
            printData += "</tr></table><br>";

            if (tobePrinted.services && tobePrinted.services.length) {
                printData += "<h4><b>Services:</b></h4>";
                printData += "<table border='1' style='width: 100%; border-collapse: collapse; text-align: center'>";
                printData += `<tr>
                            <th>Service Name</th>
                            <th>Price</th>
                            <th>Additions</th>
                            <th>Employee Name</th>
                        </tr>`;
                for (var i = 0; i < tobePrinted.services.length; i++) {
                    var service = tobePrinted.services[i];
                    printData += "<tr>";
                    printData += `<td>` + service.name + `</td>
                         <td> Rs.`+ service.price + `</td>
                         <td> Rs.`+ service.additions + `</td>
                         <td>`+ service.employeeName + `</td>`;
                    printData += "</tr>";
                }
                printData += "</table><br>";
            }

            if (tobePrinted.products && tobePrinted.products.length) {
                printData += "<h4><b>Products:</b></h4>";
                printData += "<table border='1' style='width: 100%; border-collapse: collapse; text-align: center'>";
                printData += `<tr>
                            <th>Product Name</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Amount</th>
                            <th>Employee Name</th>
                        </tr>`;
                for (var i = 0; i < tobePrinted.products.length; i++) {
                    var product = tobePrinted.products[i];
                    printData += "<tr>";
                    printData += `<td>` + product.name + `</td>
                         <td>`+ product.quantity + `</td>
                         <td> Rs.`+ product.price + `</td>
                         <td> Rs.`+ (product.price * product.quantity) + `</td>
                         <td>`+ product.employee + `</td>`;
                    printData += "</tr>";
                }
                printData += "</table><br>";
            }

            printData += "<h4><b>Billing:</b></h4>";
            printData += "<table border='1' style='width: 100%; border-collapse: collapse;'>";
            printData += `<tr><td> Sub Total: </td><td> Rs.` + tobePrinted.subtotal + `</td></tr>
                        <tr><td> (-) Discount: </td><td> Rs.`+ tobePrinted.discount + `</td></tr>
                        <tr><td> (-) Membership Discount: </td><td> Rs.`+ tobePrinted.membershipDiscount + `</td></tr>
                        <tr><td> (+) Tax: </td><td>Rs.`+ tobePrinted.tax + `</td></tr>
                        <tr><td> Payable Amount: </td><td>Rs.`+ tobePrinted.payableAmount + `</td></tr>
                    </table>`;
			$('#publishAndPrint').modal('hide');
            var w = window.open();
            w.document.write(printData);
            w.print();
            w.close();
            $scope.changeStatus(index, 3);
			$scope.cancel();
        };
        function refreshAppointments(){
            $http.get("/role3/appointment").success(function(response, status){
                appointments = response.data;
                $scope.appointments = appointments;
            });
        }

        $scope.serviceIdChanged = function () {
            $scope.serviceObjs.forEach(function (service) {
                if ($scope.currService.code == service.serviceCode) {
                    $scope.currService.name = service.serviceName;
                    $scope.currService.serviceId = service.serviceId;
                    $scope.currService.quantity = 1;
                    $scope.currService.additions = 0;
                    $scope.currService.price = service.price;
                    $scope.currService.fprice = service.price + $scope.currService.additions;
                    $scope.currService.employee = service.employees[0].userId;
                    $scope.employees = service.employees;
                    currentSelectedService = angular.copy(service);
                }
            });
        };


        $scope.productCodeChanged = function () {
            $scope.products.forEach(function (product) {
                if ($scope.currProduct.code == product.code) {
                    // console.log("product code function");
                    $scope.currProduct.code = product.code;
                    $scope.currProduct.name = product.name;
                    $scope.currProduct.quantity = 1;
                    $scope.currProduct.availquantity = product.curq;
                    $scope.currProduct.price = product.price;
                    currentSelectedProduct = angular.copy(product);
                }
            });
        };

        $scope.productNameChanged = function () {
            $scope.products.forEach(function (product) {
                if ($scope.currProduct.name == product.name) {
                    $scope.currProduct.code = product.code;
                    $scope.currProduct.name = product.name;
                    $scope.currProduct.availquantity = product.curq;
                    $scope.currProduct.quantity = 1;
                    $scope.currProduct.price = product.price;
                    currentSelectedProduct = angular.copy(product);
                }
            });
        };

        $scope.serviceAddition = function () {
            $scope.currService.fprice = $scope.currService.price + $scope.currService.additions;
            // console.log("Amount added");
        };

        $scope.addNewService = function (index) {
			$scope.currService.name = $scope.subServices.name;
			$scope.currService.serviceId = $scope.subServices.serviceId;
            $scope.currService.quantity = 1;
			$scope.currService.code = $scope.subServices.prices[index].priceId;
			$scope.currService.additions = 0;
			$scope.currService.price = $scope.subServices.prices[index].price;
			$scope.currService.employees = $scope.subServices.prices[index].employees;
			// console.log($scope.currService);
			$scope.currService.count = $scope.count;
			$scope.newApp.services.push(angular.copy($scope.currService));
			$scope.currService = {};
			calculateTotal();
			$scope.count++;
			checkPackageSuggestions();
			$scope.showDepartmentMenu();
        };
		$scope.backButton =function (){
			$scope.showCategory=true;
			$scope.showSubService=false;
			$scope.showService=false;
		}

        function checkPackageSuggestions(){
            var tempPackages = angular.copy(packages);
            $scope.packagesAvailable = [];
            tempPackages.forEach(function(p){
                var count = 0;
                $scope.newApp.services.forEach(function(s){
                    p.services.forEach(function(ser){
                        if(ser == s.serviceId) count ++;
                    })
                });
                tempPackages.count = count;
            });
            tempPackages.sort(function(a, b){ return a.count - b.count; });
            if(tempPackages.length>0)$scope.packagesAvailable.push(tempPackages[0]);
            if(tempPackages.length>1)$scope.packagesAvailable.push(tempPackages[1]);
            if(tempPackages.length>2)$scope.packagesAvailable.push(tempPackages[2]);
            // console.log($scope.packagesAvailable);
        }

        $scope.getServiceInText = function(services){
        var text = "";
        services.forEach(function(s){
            text += s.name + ", ";
        });
        return text;
    };

    $scope.addThisPackage = function(index){
        var p = $scope.packagesAvailable[index];
        // console.log(p);
        var emp = {};
        // console.log($scope.newApp.services);
        p.services.forEach(function(s){
            var idx = -1;
            $scope.newApp.services.forEach(function(service, key){
                // console.log(service.serviceId);
                // console.log(s);
                if(service.serviceId == s.serviceId){
                    idx = key;
                    emp = angular.copy(s.employee);
                }
            });
            if(idx!=-1){
                // console.log("deleting");
                $scope.newApp.services[idx].quantity -= 1;
                if($scope.newApp.services[idx].quantity == 0)$scope.newApp.services.splice(idx, 1);
            }
        });
        $scope.newApp.services.push(
            {
                serviceId : 0,
                name : p.name,
                price : p.price,
                additions : 0,
                employee : emp,
                count : 1,
                quantity : 1,
                packageId : p.packageId
            }
        );
        checkPackageSuggestions();
    };

        $scope.addNewProduct = function () {
            // console.log($scope.currProduct);
            $scope.currProduct.pcount = $scope.pcount;
            $scope.newApp.products.push(angular.copy($scope.currProduct));
            $scope.currProduct = {};
            calculateTotal();
            $scope.pcount++;
        };

        $scope.removeService = function (index) {
            // console.log("Ads");
            $scope.newApp.services.splice(index, 1);
            $scope.newApp.services.forEach(function (s, key) {
                s.count = key + 1;
            });
            calculateTotal();
            $scope.count = $scope.newApp.services.length + 1;
        };
        $scope.removeProduct = function (index) {
            // console.log("Ads");
            $scope.newApp.products.splice(index, 1);
            $scope.newApp.products.forEach(function (p, key) {
                p.pcount = key + 1;
            });
            calculateTotal();
            $scope.pcount = $scope.newApp.products.length + 1;
        };

        $scope.getEmployeeName = function (empId) {
            var empName = "";
            employees.forEach(function (emp) {
                if (emp.userId == empId) empName = emp.name;
            });
            return empName;
        };

        $scope.cancel = function () {
            $scope.newApp = {};
            $scope.currService = {};
            $scope.currProduct = {};
            $scope.newApp.user = {};
            $scope.appointmentType = "1";
            $scope.paymentMethod = "1";
            $scope.newApp.services = [];
            $scope.newApp.products = [];
            $scope.packagesAvailable = [];
            $scope.count = 1;
            $scope.newApp.otherCharges = 0;
            calculateTotal();
            
        };

        $scope.cancel();
        $scope.newApp.appointmentTime = moment(new Date()).format();
        // console.log($scope.newApp.appointmentTime);

        $scope.publish = function (check) {
            $scope.newApp.appointmentTime = $('#startdate').val();
            // console.log($scope.newApp);
			if(!$scope.newApp.otp){
            $scope.otp = Math.floor(Math.random() * 9000) + 1000;
			$scope.newApp.otp = $scope.otp;  // OTP is saved in new app variable
			};

            $http.post("/role3/newAppointment", { data: $scope.newApp, appointmentType : $scope.appointmentType, paymentMethod : $scope.paymentMethod }).success(function (response, status) {
                var data = response.data;
                // console.log(JSON.stringify($scope.newApp.services));
                if($scope.newApp.appointmentId){
					$scope.currentAppointmentIndex=response.data;
                    appointments[editAppointmentIndex] = angular.copy(response.data);
                }else{
                    appointments.push(response.data);
                    $scope.currentAppointmentIndex=response.data;
                }
                refreshAppointments();
				if(check==2){
					$scope.caOtp(response.data);
				};
                $scope.appointments = appointments;
                $scope.cancel();
            });
           
          
        };
		$scope.cancelMessage=function(index){
			// console.log($scope.appointments[index].client.phoneNumber);
			var number=[$scope.appointments[index].client.phoneNumber];
			$rootScope.$broadcast("sendSMSEvent", {message: "You appointment has been canceled!", numbers :number , type : "T"});
		};

        function calculateTotal() {
            var tax = 0, subtotal = 0, membershipDiscount = 0, discount = 0;
            $scope.memberships.forEach(function (m) {
                if ($scope.newApp.user.membershipId == m.membershipId) discount = m.discount;
            });
            $scope.newApp.services.forEach(function (s) {
                var sub = (s.price+s.additions)* s.quantity;
                var t = parlorTax / 100 * (s.price * s.quantity);
                tax += t;
                subtotal += sub;
                membershipDiscount += (discount * sub) / 100
            });
            $scope.newApp.products.forEach(function (s) {
                var sub = s.price * s.quantity;
                subtotal += sub;
            });
            // console.log(subtotal);
            subtotal += $scope.newApp.otherCharges;
            $scope.tax = tax;
            $scope.subtotal = subtotal;
            $scope.membershipDiscount = membershipDiscount;
            $scope.total = subtotal - membershipDiscount + tax;
        }

        function fillData(appointment) {
            $scope.newApp.user.phoneNumber = appointment.client.phoneNumber;
            // $scope.newApp.user.membershipId = "" | appointment.client.membership;
            $http.post("/role3/customer", { phoneNumber: appointment.client.phoneNumber }).success(function(response, status) {
                var data = response.data;
                if (data) {
                    $scope.newApp.user.name = data.name;
                    $scope.newApp.user.gender = data.gender;
                    $scope.newApp.user.membershipId = data.membership.membershipId ? data.membership.membershipId : "0";
                } else {
                    $scope.newApp.user.membershipId = 0;
                }
                $scope.newApp.otherCharges = 0;
            });
        };
		var index;

		$scope.caClick=function(index){
        editAppointmentIndex = index;
        $scope.newApp=$scope.appointments[index];
		$scope.newApp.user=$scope.appointments[index].client;
		calculateTotal();
		$scope.newApp.appointmentTime=$scope.appointments[index].startsAt;
		};

		$scope.showDepartmentMenu=function(){
			$scope.showSuperCategory=true;
			$scope.showCategory=false;
			$scope.showService=false;
			$scope.showSubService=false;
		};
		$scope.showCategoryMenu=function(){
			$scope.showSuperCategory=false;
			$scope.showCategory=true;
			$scope.showService=false;
			$scope.showSubService=false;
		};
		$scope.data={};
		$scope.updateMembership = function(memId,userId){
		$scope.data.userId = userId;
		$scope.data.membershipId = memId;

		$http.post("/role2/membershipCustomer", $scope.data).success(function(response, status){
          $scope.user = response.data;
          if(response.success){
              // console.log("mem added");
          }
      });
	  // console.log($scope.data);
    };

	$scope.active = 1;
	$scope.press=function(){
		$scope.tab = false;
		$scope.active = 2;

	};
	$scope.tabs=[{"active":true,"disable":false},{"active":false,"disable":false},{"active":false,"disable":true},{"active":false,"disable":true}];
	$scope.next1=function(){
		$scope.tabs[2].active = true;
		$scope.tabs[2].disable = false;
	};
	$scope.next2=function(){
		$scope.tabs[2].active = false;
		$scope.tabs[2].disable = false;
		$scope.tabs[3].active = true;
		$scope.tabs[3].disable = false;
	};
	$scope.resetTabs=function(){
		$scope.tabs=[{"active":false,"disable":false},{"active":true,"disable":false},{"active":false,"disable":true},{"active":false,"disable":true}];
	};
	$scope.resetTabs();
	$scope.caOtp=function(ap){
		// console.log(ap);
		ap.services.forEach(function(value, key){
                // console.log(key + ': ' + JSON.stringify(value.name));
                  $scope.serviceMsg = JSON.stringify(value.name);
            });
             $scope.msg = "Dear Customer, Total amount of services " + $scope.serviceMsg + " is Rs" +  ap.payableAmount +".The otp of this transaction is "+ ap.otp;
             // console.log($scope.msg);
             // console.log($scope.newApp);
			 $scope.OTP=ap.otp;
			 // console.log(ap.client.phoneNumber);
			 var number=[ap.client.phoneNumber];
			$rootScope.$broadcast("sendSMSEvent", {message: $scope.msg, numbers :number, type : "T", otp: $scope.OTP});
		};
    });
