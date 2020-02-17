'use strict'

angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap'])

    .controller('AppointmentsCtrl', function ($scope, $compile, $http, $timeout, $window, $log) {

        $scope.memberships = memberships;
        $scope.appointments = appointments;
        $log.debug($scope.appointments);
        $scope.pdata = inventoryItems;
        var currentSelectedService = {};
        var currentSelectedProduct = {};
        $scope.currProduct = {};
        $scope.count = 1;
        $scope.pcount = 1;
        $scope.appointmentType = 1;
        $scope.paymentMethod = 1;
        var parlorTax = 0, editAppointmentIndex=0;
        $scope.parlorEmployees = employees;



        $('#datetimepicker1').datetimepicker();

        $scope.memberships.push({ membershipId: 0, name: 'None', discount: 0 });

        $scope.serviceNames = [];
        $scope.serviceCodes = [];
        $scope.serviceObjs = [];
        services.forEach(function (service_cat) {
            service_cat.services.forEach(function (service) {
                service.prices.forEach(function (price) {
                    if(price.employees.length>0){
                        $scope.serviceCodes.push(price.priceId);
                        var serviceObj = {};
                        serviceObj.serviceName = "" + service.name + (price.name ? " - " + price.name : "");
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
        $scope.products = inventoryItems.filter(function (el) {
            return el.costPrice;
        });

        $log.debug('Service Objs: ', $scope.serviceObjs);

        $scope.phoneNumberChanged = function () {
            $scope.newApp.appointmentTime = moment(new Date()).format();
            $http.post("/role3/customer", { phoneNumber: $scope.newApp.user.phoneNumber }).success(function (response, status) {
                var data = response.data;
                if (data) {
                    $scope.newApp.user.name = data.name;
                    $scope.newApp.user.gender = data.gender;
                    $scope.newApp.user.membershipId = data.membership.membershipId ? data.membership.membershipId : "0";
                    $scope.newApp.services = [];
                    $scope.newApp.products = [];
                } else {
                    $scope.newApp.user.membershipId = 0;
                }
                $scope.newApp.otherCharges = 0;
            });
        };

        $scope.openAppointmentModal = function (index) {
            $scope.currentViewedAppointment = $scope.appointments[index];
            $scope.currentViewedAppointment.index = index;
            $('#appointmentDetail').modal('show');
        };

        $scope.changeStatus = function (index, status) {
            $scope.currentViewedAppointment = $scope.appointments[index];
            console.log($scope.currentViewedAppointment.appointmentId);
            $http.put("/role3/newAppointment", { appointmentId: $scope.currentViewedAppointment.appointmentId, userId: $scope.currentViewedAppointment.client.id, status: status }).success(function (response, status) {
                console.log(response.data);
                refreshAppointments();
                // $scope.appointments.splice(index, 1);
            });
        };

        function refreshAppointments(){
            $http.get("/role3/appointment").success(function(response, status){
                appointments = response.data;
                $scope.appointments = appointments;
            });
        }

        $scope.print = function (index) {
			
            var tobePrinted = $scope.appointments[index];
            console.log(tobePrinted);
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

            var w = window.open();
            w.document.write(printData);
            w.print();
            w.close();
            $scope.changeStatus(index, 3);
			$scope.cancel();
        };

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

        $scope.serviceNameChanged = function () {
            $scope.serviceObjs.forEach(function (service) {
                if ($scope.currService.name == service.serviceName) {
                    $scope.currService.code = service.serviceCode
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
            console.log($scope.currProduct.code);
            console.log($scope.products);
            $scope.products.forEach(function (product) {
                if ($scope.currProduct.code == product.itemId) {
                    console.log("product code function");
                    $scope.currProduct.code = product.itemId;
                    $scope.currProduct.name = product.name;
                    $scope.currProduct.quantity = 1;
                    $scope.currProduct.capacity = product.capacity;
                    $scope.currProduct.price = product.sellingPrice;
                    $scope.currProduct.costprice = product.costPrice;
                    currentSelectedProduct = angular.copy(product);
                }
            });
        };

        $scope.productNameChanged = function () {
            $scope.products.forEach(function (product) {
                if ($scope.currProduct.name == product.name) {
                    $scope.currProduct.code = product.itemId;
                    $scope.currProduct.name = product.name;
                    $scope.currProduct.quantity = 1;
                    $scope.currProduct.capacity = product.capacity;
                    $scope.currProduct.price = product.sellingPrice;
                    $scope.currProduct.costprice = product.costPrice;
                    currentSelectedProduct = angular.copy(product);
                }
            });
        };

        $scope.serviceAddition = function () {
            $scope.currService.fprice = $scope.currService.price + $scope.currService.additions;
            console.log("Amount added");
        };

        $scope.addNewService = function () {
            console.log($scope.currService);
            $scope.currService.count = $scope.count;
            $scope.newApp.services.push(angular.copy($scope.currService));
            $scope.currService = {};
            calculateTotal();
            $scope.count++;
            checkPackageSuggestions();
        };

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
            console.log($scope.packagesAvailable);
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
        console.log(p);
        var emp = {};
        console.log($scope.newApp.services);
        p.services.forEach(function(s){
            var idx = -1;
            $scope.newApp.services.forEach(function(service, key){
                console.log(service.serviceId);
                console.log(s);
                if(service.serviceId == s.serviceId){
                    idx = key;
                    emp = angular.copy(s.employee);
                }
            });
            if(idx!=-1){
                console.log("deleting");
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
            console.log($scope.currProduct);
            $scope.currProduct.pcount = $scope.pcount;
            $scope.newApp.products.push(angular.copy($scope.currProduct));
            $scope.currProduct = {};
            calculateTotal();
            $scope.pcount++;
        };

        $scope.removeService = function (index) {
            console.log("Ads");
            $scope.newApp.services.splice(index, 1);
            $scope.newApp.services.forEach(function (s, key) {
                s.count = key + 1;
            });
            calculateTotal();
            $scope.count = $scope.newApp.services.length + 1;
        };
        $scope.removeProduct = function (index) {
            console.log("Ads");
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
        console.log($scope.newApp.appointmentTime);

        $scope.publish = function () {
            $scope.newApp.appointmentTime = $('#startdate').val();
            console.log($scope.newApp);

            $http.post("/role3/newAppointment", { data: $scope.newApp, appointmentType : $scope.appointmentType, paymentMethod : $scope.paymentMethod }).success(function (response, status) {
                var data = response.data;
                console.log($scope.newApp);
                /*if($scope.newApp.appointmentId){
                    appointments[editAppointmentIndex] = angular.copy(response.data);
                }else{
                    appointments.push(response.data);
                }*/
                refreshAppointments();
                // $scope.appointments = appointments;
                $scope.cancel();
            });
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
            console.log(subtotal);
            subtotal += $scope.newApp.otherCharges;
            $scope.tax = tax;
            $scope.subtotal = subtotal;
            $scope.membershipDiscount = membershipDiscount;
            $scope.total = subtotal - membershipDiscount + tax;
        }

        function fillData(appointment) {
            $scope.newApp.user.phoneNumber = appointment.client.phoneNumber;
            // $scope.newApp.user.membershipId = "" | appointment.client.membership;
            $http.post("/role3/customer", { phoneNumber: appointment.client.phoneNumber }).success(function (response, status) {
                var data = response.data;
                if (data) {
                    $scope.newApp.user.name = data.name;
                    $scope.newApp.user.gender = data.gender;
                    $scope.newApp.user.membershipId = data.membership.membershipId ? data.membership.membershipId : "0";
                    $scope.newApp.services = [];
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

		
	});

