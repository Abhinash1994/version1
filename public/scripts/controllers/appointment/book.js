
'use strict'

angular.module('sbAdminApp', ['ui.bootstrap', 'ngAnimate', 'isteven-multi-select', 'ngSanitize'])
    .controller('bookCtrl', function($scope, $compile, $http, $timeout, $window, $log, $rootScope, deleteAppointmentIdService) {
    
    $scope.showDetails=function(m){
        //console.log(m) 
        $scope.temporary=angular.copy(m)
        $('#showDetailsModal').modal('show');
    }
        $scope.editCRM=editCRM;
        //$scope.chargeMainMenu=chargeMainMenu;
        $scope.personalCouponApplied=false
        $scope.Math = window.Math;
        $scope.personalCouponCode=null
        $scope.tabs = [{}, {}, {}, {}, {}];
        $scope.memberships = memberships;
        $scope.services = services;
        $scope.paymentLeftAfterMembership=false;
        $scope.membershipApplied=false;
        $scope.membershipDiscount=0;
        $scope.editAppointmentId=null;
        $scope.newServices={}
        $scope.newServices.categories=angular.copy(newServices);
       // console.log("new services",$scope.newServices)
        $scope.customers = clients;
       // console.log(deals);
        $scope.parlorTax = $rootScope.parlorTax;
        // console.log("rootscope",$rootScope)
        // console.log("parlor tax",$rootScope.parlorTax)
        $scope.deals = angular.copy(deals);
        $scope.allDSIds = [];
        $scope.allDIds = [];
        $scope.allDPSIds = [];
        $scope.selectedUibTab = 'services';
        $scope.scheckoutPaymentOption = [];
        $scope.checkoutPaymentOptions = [{ "value": 1, "name": "Cash", "isSelected": false }, { "value": 2, "name": "Card", "isSelected": false },  { "value": 11, "name": "Affliates", "isSelected": false }, { "value": 4, "name": "Advance Online", "isSelected": false }];
        $scope.paymentOptions = [{ "value": 1, "name": "Cash", "isSelected": false }, { "value": 2, "name": "Card", "isSelected": false },  { "value": 11, "name": "Affliates", "isSelected": false }, { "value": 4, "name": "Advance Online", "isSelected": false }];
        $scope.MemPaymentOptions = [{ "value": 1, "name": "Cash", "isSelected": false }, { "value": 2, "name": "Card", "isSelected": false }, { "value": 8, "name": "MX Debit Card", "isSelected": false }, { "value": 9, "name": "MX Credit Card", "isSelected": false }, { "value": 11, "name": "Affliates", "isSelected": false }, { "value": 4, "name": "Advance Online", "isSelected": false }];
        $scope.minDateDatepicker = new Date();
        var minTimeTimepicker = new Date();
        minTimeTimepicker.setHours(minTimeTimepicker.getHours());
        minTimeTimepicker.setMinutes(minTimeTimepicker.getMinutes());
        $scope.minTimeTimepicker = minTimeTimepicker;
        /*var maxTimeTimepicker=new Date();
        maxTimeTimepicker.setHours( 22 );
        maxTimeTimepicker.setMinutes( 0 );
        $scope.maxTimeTimepicker = maxTimeTimepicker;*/

        //console.log($scope.deals);
//    to refresh Appointments
// new initializations
        $scope.allServices=[];
        $scope.cart=[];
        $scope.searchText='';
        $scope.billingEmployees=[];
        $scope.paymentButtonText="Select Payment Method"
        $scope.showCustomerDetailsError=true;
        $scope.cartTotal=0;
        $scope.user={hasOldCredits:false,useOldCredits:false};
        $scope.selectedPaymentMethod=[];
        $scope.showEmployeeError=true;
        $scope.showPaymentError=true;
        $scope.numberOfServices=0;
        $scope.newServices.categories.forEach(function(element) {
            $scope.allServices=$scope.allServices.concat(element.services);
        }, this);
        memberships.forEach(function(element) {
            element.categoryId="2";
            element.gender="MF";
            element.dealPrice=element.price/1.18;
            element.serviceId=element.membershipId;
        }, this);
        $scope.salonProductItems=[];
        inventoryItems.forEach(function(element) {
            if(element.quantity && element.quantity>=1){
                var temp=angular.copy(element)
                temp.categoryId="3"
                temp.gender="MF";
                temp.dealPrice=temp.sellingPrice;
                temp.price=temp.sellingPrice;
                temp.serviceId=temp.Id;
                temp.quantity=0;
                $scope.salonProductItems.push(temp)
            }
            
        }, this);
        // console.log("has credits", $scope.user.hasOldCredits)
        $scope.newServices.categories.push({services:$scope.allServices,name:"All Categories",categoryId:"1"})
        $scope.selectedCategory={services:$scope.allServices,name:"All Categories",categoryId:"1"}
        $scope.newServices.categories.push({services:memberships,name:"Family Wallets",categoryId:"2"});
        $scope.newServices.categories.push({services:$scope.salonProductItems,name:"All Products",categoryId:"3"})
        $scope.refreshIt=function()
        {
           refreshAppointments() ;
        }
//    Refresh Services
        $scope.refreshServices=function()
        {
            $http.get("/role2/parlorServiceByCategoryIds"+"/?parlorId="+parlorId).success(function(response, status){
                newServices = response.data;
                $scope.newServices={}
                $scope.newServices.categories=angular.copy(newServices);
                // console.log("new services",newServices);
                $scope.newServices.categories.forEach(function(element) {
                    $scope.allServices=$scope.allServices.concat(element.services);
                }, this);
                memberships.forEach(function(element) {
                    element.categoryId="2";
                    element.gender="MF";
                    element.dealPrice=element.price/1.18;
                    element.serviceId=element.membershipId;
                }, this);
                $scope.salonProductItems=[];
                inventoryItems.forEach(function(element) {
                    if(element.quantity && element.quantity>=1){
                        var temp=angular.copy(element)
                        temp.categoryId="3"
                        temp.gender="MF";
                        temp.dealPrice=temp.sellingPrice;
                        temp.price=temp.sellingPrice;
                        temp.serviceId=temp.Id;
                        temp.quantity=0;
                        $scope.salonProductItems.push(temp)
                    }
                    
                }, this);
                // console.log("has credits", $scope.user.hasOldCredits)
                $scope.newServices.categories.push({services:$scope.allServices,name:"All Categories",categoryId:"1"})
                $scope.selectedCategory={services:$scope.allServices,name:"All Categories",categoryId:"1"}
                $scope.newServices.categories.push({services:memberships,name:"Family Wallets",categoryId:"2"});
                $scope.newServices.categories.push({services:$scope.salonProductItems,name:"All Products",categoryId:"3"})
            });            
        }



        $scope.check = function() {
            // console.log(hello);
        }
        for (var i = 0; i < $scope.deals.length; i++) {
            $scope.allDIds.push($scope.deals[i].dealId);
            $scope.deals[i].services.forEach(function(element) {
                $scope.allDSIds.push(element);
                $scope.allDPSIds.push(i);
            });
        };

        $scope.loyalty = 0;
        $scope.newApp = { aptDate: new Date(),erpDiscount:0 };
        // console.log('$scope.deals', $scope.deals);
        $scope.popup1 = {
            open1: false
        };
        $scope.mytime = new Date();
        $scope.dt = new Date();
        $scope.open1 = function() {
            $scope.popup1.open1 = true;
            // console.log("button pressed");
        };
        $scope.dateWithoutAppChangedFn = function(changedDate) {
            var crDate = new Date();
            var newDate = new Date(changedDate);

            if (crDate.toDateString() == newDate.toDateString()) { //-------------------------same day

                minTimeTimepicker = new Date();
                minTimeTimepicker.setHours(minTimeTimepicker.getHours());
                minTimeTimepicker.setMinutes(minTimeTimepicker.getMinutes());
                $scope.dateTimeObjAppWidtEmp.aptTime = minTimeTimepicker;
                $scope.minTimeTimepicker = minTimeTimepicker;
            } else { //----------------------------------------------------------------------different days

                //$scope.minTimeTimepicker=''
                minTimeTimepicker = new Date(changedDate);
                minTimeTimepicker.setHours(parseInt(openingTime));
                minTimeTimepicker.setMinutes(0);
                $scope.dateTimeObjAppWidtEmp.aptTime = minTimeTimepicker;
                $scope.minTimeTimepicker = minTimeTimepicker;
            }

        }
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        $scope.combos = [];
        $scope.chick = [];
        $scope.frequencies = [];
        $scope.cartIds = [];
        $scope.newApp = { aptDate: new Date() };
        $scope.chick[0] = true;
        //console.log($scope.allDPSIds);
        $scope.appointments = appointments;
        // console.log('$scope.appointments', $scope.appointments);
        // $rootScope.$broadcast("sendSMSEvent", {message: "Hie", numbers :8826345311, type : "P", otp: 123});
        $scope.pdata = inventoryItems;
        // console.log('inventoryItems', inventoryItems);
        $scope.employeeCheck = true;
        var currentSelectedService = {};
        var currentSelectedProduct = {};
        $scope.gender = [{ "name": "Female", "value": "F" }, { "name": "Male", "value": "M" }];
        $scope.currProduct = {};
        $scope.count = 1;
        $scope.thicknessIndex = 0;
        $scope.pcount = 1;
        $scope.tab = true;
        $scope.showSuperCategory = true;
        $scope.showCustOTP = false;
        $scope.appointmentType = 1;
        $scope.paymentMethod = 1;
        var parlorTax = 0,
            editAppointmentIndex = 0;
        $scope.s = { "gender": 'F',selectedBrand:"",selectedAddition:0 };
        $scope.active = 2;
        $scope.first = true;
        $scope.second = false;
        $scope.third = false;
        $scope.showGender = true;
        $scope.showCategory = false;
        $scope.showService = false;
        $http.post("/billing/employee", { parlorId:parlorId }).success(function(response, status) {
            $scope.billingEmployees = response.data;
            $scope.productEmployees=employees.filter(function(item){return item.active==true})
            // console.log("employees",$scope.productEmployees)
            $scope.productEmployees.forEach(function(item){item.employeeId=item.userId})
            $scope.billingEmployees.push({categoryId:'3',employees:$scope.productEmployees})
            // console.log("billing employees",$scope.billingEmployees);
            
        });
        
        /*$scope.productEmployees = employees;*/
        $scope.showSubService = false;
        $scope.showBrandsFlag = false;
        $scope.showProductsFlag = false;
        $scope.comboNewComboTabFlag = false;

        function weekDayWeekendCheck(dateOfAppointment, weekDayWeekendVariable) {
            (weekDayWeekendVariable == null || weekDayWeekendVariable == undefined) ? weekDayWeekendVariable = 1: console.log('weekDayWeekendVariable defined');
            var weekDayWeekend; //will contain weekday or weekend or weekdayweekend string depending upon the availability of deal or service  on that day
            var currentDateOfAppointment = new Date(dateOfAppointment); //to get to know if appointment which is trying to be booked is on a weekday or weekend
            var appointmentDateWeekdayWeekend;
            if (weekDayWeekendVariable == 1) {
                weekDayWeekend = 'weekdayweekend';
            } else if (weekDayWeekendVariable == 2) {
                weekDayWeekend = 'weekday';
            } else if (weekDayWeekendVariable == 3) {
                weekDayWeekend = 'weekend';
            }

            if (currentDateOfAppointment.getDay() == 6 || currentDateOfAppointment.getDay() == 0) {
                appointmentDateWeekdayWeekend = 'weekend';
            } else {
                appointmentDateWeekdayWeekend = 'weekday';
            }

            var n = weekDayWeekend.includes(appointmentDateWeekdayWeekend);
            // console.log('deal ka din' + '   ' + weekDayWeekend);
            // console.log('appointment ka din ' + '   ' + appointmentDateWeekdayWeekend);
            // console.log(n);
            return n;
        }

        function filterPresentEmployees(arrayOfEmployeesToBeFiltered) {
            var requiredEmployeeArray = [];
            //console.log(arrayOfEmployeesToBeFiltered);
            for (var k = 0; k < arrayOfEmployeesToBeFiltered.length; k++) {
                if (!arrayOfEmployeesToBeFiltered[k].employeeId) {
                    arrayOfEmployeesToBeFiltered[k].employeeId = arrayOfEmployeesToBeFiltered[k].userId;
                }
            }
            for (var k = 0; k < arrayOfEmployeesToBeFiltered.length; k++) {
                if (employeesPresent.filter(function(ar) { return ar.userId == arrayOfEmployeesToBeFiltered[k].employeeId; })[0]) {
                    requiredEmployeeArray.push(arrayOfEmployeesToBeFiltered[k]);
                }
            }
            //console.log(requiredEmployeeArray)
            return requiredEmployeeArray;
        } // filter present employees from given employee array

        $scope.newApp1 = function() {
            // console.log("tab 2 function called");
            $scope.first = false;
            $scope.second = true;
            $scope.third = false;

        };
        $scope.cate = function(categ) {
            //console.log(categ);
            $scope.selectedService = categ;
            //console.log($scope.selectedService);
            $scope.showCategory = false;
            $scope.showService = true;
            $scope.showGender = false;
            $scope.showSuperCategory = false;
            $scope.sorder = 3;
        };

        $scope.productBrandPriceIndex = '';
        $scope.productBrandPriceAddition = false;
        $scope.comboNewComboSubServices = '';

        $scope.serv = function(ser1) {
            // console.log('$scope.serv function telling about subservice selected', ser1);
            /*=================================================packages category works starts=================================*/
            $scope.comboBrand = false;
            $scope.comboProduct = '';
            $scope.newComboBrand = '';
            $scope.newComboProduct = '';
            $scope.selectedNewComboService = 1;
            $scope.checkedRadioCombo = false;
            $scope.comboCart = {
                'dealId': '',
                'type': '',
                'name': '',
                'parlorDealId': '',
                'quantity': 1,
                'slabId': '',
                'services': [],
                'price': '',
                'weekDay': ''
            }
            if (ser1.dealType && (ser1.dealType == 'combo' || ser1.dealType == 'newCombo')) { //this is a check if the ser object comes is a combo or newcombo object
                $scope.comboNewComboSubServices = angular.copy(ser1); //done for dropdown purpose
                $scope.comboCart.dealId = ser1.dealId;
                $scope.comboCart.type = ser1.dealType;
                $scope.comboCart.name = ser1.name;
                $scope.comboCart.parlorDealId = ser1.dealId;
                $scope.comboCart.price = 0;
                $scope.comboCart.weekDay = ser1.weekDay;
                if (ser1.slabId) {
                    $scope.comboCart.slabId = ser1.slabId;
                }
                /*==================================common work for combo/newCombo=======------STOPS-----====================================*/
                if (ser1.dealType == 'combo') {
                    ser1.selectors.forEach(function(selector) {
                        var servicesObject = { 'serviceCode': '', 'price': selector.services[0].price, 'name': '' };
                        $scope.comboCart.price = $scope.comboCart.price + selector.services[0].price;
                        servicesObject.name = selector.services[0].name;
                        servicesObject.serviceCode = selector.services[0].serviceCode;
                        servicesObject.comboEmployees = angular.copy(filterPresentEmployees(selector.services[0].employees)); //filterPresentEmployees returns present employees
                        //servicesObject.comboEmployees=selector.services[0].employees;
                        $scope.comboCart.services.push(servicesObject);
                    })
                    // console.log($scope.comboCart);
                } else {
                    ser1.selectors.forEach(function(selector) {
                        //console.log('------------------------new combo ka price calculate hua------------------------------');
                        if (selector.services.length > 0) {
                            $scope.comboCart.price = $scope.comboCart.price + selector.services[0].price;
                        }
                    })
                }
                /*==================================common work for combo/newCombo=======------STARTS------====================================*/


                var selectorCount = 0;
                $scope.comboNewComboSubServices.selectors.find(function(element) {
                        element.services.find(function(subElement) {
                            if (subElement.brands.length > 0) {
                                var count = 0;
                                subElement.showNewComboBrandFlag = false; // this is done for the new combo dropdown so that if a service is selected its respective brand is shown
                                subElement.brands.find(function(brandElement) {
                                    brandElement.checked = false; //makes brand radiobuton unchecked every time combo/newCombo is openend
                                    brandElement.showProductFlag = false; //this is done to show hide the respective products of the brands
                                    if (brandElement.products.length > 0) {
                                        brandElement.products.find(function(productElement) {
                                            productElement.brandId = brandElement.brandId; //this is done to get the brand id inside products array to get to know uski brand ki id kya hai for radio form
                                            productElement.brandIndex = count;
                                            productElement.checked = false; //makes the radiobutton of products in the brands list unchecked when new combo/newCombo selected
                                        })
                                        count++; //this is done to get the brand index inside products array to get to know uski brand ka index kya hai for radio form
                                    }
                                })
                                if (subElement.brands.length == 1) { // done for the selecetion if their exists only single brand
                                    //console.log('direct going to PRESELECETION');
                                    //console.log(subElement.brands[0]);
                                    //console.log(selectorCount);
                                    if ($scope.comboNewComboSubServices.dealType == 'combo') {
                                        $scope.comboBrandSelected(subElement.brands[0], selectorCount, subElement.brands);
                                    }
                                }
                            }
                        })
                        selectorCount++;
                    }) //brandId added to filter for table
                $scope.comboNewComboTabFlag = true;
                /*=================================================packages category works stops=================================*/
            } else {
                /*=================================================non package category works starts=================================*/
                $scope.subServices = ser1;
                if ($scope.subServices.prices.length > 0) {
                    $scope.subServices.prices.find(function(priceElement) {
                        if (priceElement.additions.length > 0) {
                            priceElement.additions.find(function(additionsElement) {
                                if (additionsElement.types.length > 0) {
                                    additionsElement.types.find(function(typesElement) {
                                        typesElement.checkboxFlag = false;
                                    })
                                }
                            })
                        }
                        if (priceElement.brand.brands.length > 0) {
                            priceElement.brand.brands.find(function(brandElement) {
                                brandElement.radioCheck = false;
                                if (brandElement.products.length > 0) {
                                    brandElement.products.find(function(productsElement) {
                                        productsElement.radioCheck = false;
                                    })
                                }
                            })
                        }
                    })
                } // this is done to make the products and brands radios unchecked when service is opened again
                $scope.productBrandPriceIndex = '';
                if (ser1.prices.length == 1 && !ser1.prices[0].additions.length) {
                    if (!ser1.prices[0].brand.brands.length) {
                        $scope.showDepartmentMenu();
                        $scope.addNewService(0, null, null, null, null);
                        //$scope.addNewService(0,null,null,null,null);
                    } else {
                        $scope.productBrandPriceIndex = 0;
                        if (ser1.prices[0].brand.brands.length == 1) { //done to add directly if single brand or multibrand but single product
                          //  console.log('brand length was just ' + ser1.prices[0].brand.brands.length)
                            $scope.brandSelected(ser1.prices[0].brand.brands[0]);
                        } else {
                            $scope.productBrandPriceAddition = false;
                            $scope.showSubService = true;
                            $scope.showBrandsFlag = true;
                        }
                    }
                } else {

                    $scope.showSubService = true;
                    $scope.productBrandPriceAddition = true;
                    $scope.showSubService = true;
                    $scope.showBrandsFlag = true;
                    $scope.showThickness = true;
                    $scope.checkChanged(0);
                    $scope.thick = "Normal";
                }
            }
        };

        $scope.superF = function(superC) {
            $scope.showGender = false;
            $scope.showSuperCategory = false;
            $scope.showCategory = true;
            $scope.showService = false;
            $scope.sersN = superC.name;
            $scope.sers = superC.categories;
            $scope.sorder = 2;
        };

        $scope.applyCoupon = function() {
            $scope.newApp.couponCode = $scope.newApp.couponCode01;
            if ($scope.newApp.couponCode.indexOf("AT") > -1) {
                var x = $scope.newApp.couponCode.indexOf("AT");
                var temp = $scope.newApp.couponCode.substring(x, $scope.newApp.couponCode.length)
                var str = $scope.newApp.couponCode.substring(0, x)
                $scope.newApp.couponCode = str;
            }
            // console.log($scope.newApp.couponCode)
            $http.post("/role3/newAppointmentCoupon", { data: $scope.newApp }).success(function(response, status) {

                var data = response.data;
                if (data.discount == 0) {
                    alert("Invalid Coupon");
                    $scope.newApp.couponCode = '';
                    // console.log(data);
                } else {
                    // console.log(data);
                    $scope.newApp.couponMessage = data.message;
                    $scope.newApp.paymentMethod = 11;
                    // $scope.newApp.couponCode=$scope.newApp.couponCode+temp;
                    $scope.newApp.total = data.total;
                    alert("Coupon Applied Successfully");
                    $scope.newApp.discount = data.discount;
                    $scope.ssubtotal = 0;
                    $scope.stax = 0;
                    $scope.total = 0;
                }

            });
        }

        /*=================================================non package category works stops=================================*/
        $scope.serviceNames = [];
        $scope.serviceCodes = [];
        $scope.serviceObjs = [];
        $scope.checkChanged = function(index) {
            $scope.brandProductObjectToBePassed == '';
            $scope.priceIndex = index;
            $scope.productBrandPriceIndex = index;
            if ($scope.subServices.prices[index].brand.brands.length == 1) {
              //  console.log('$scope.subServices.prices[index].brand.brands.length  ' + $scope.subServices.prices[index].brand.brands.length);
                if ($scope.subServices.prices[index].brand.brands[0].products.length == 1 || $scope.subServices.prices[index].brand.brands[0].products.length == 0) {
                  //  console.log('we can hide the brands');
                    $scope.brandSelected($scope.subServices.prices[index].brand.brands[0]);
                    $scope.showBrandsFlag = false;
                }
            } else if ($scope.subServices.prices[index].brand.brands.length > 1) {
              //  console.log('$scope.subServices.prices[index].brand.brands.length  ' + $scope.subServices.prices[index].brand.brands.length);
            } //if price and additions exists and if single brand and product exists then add brand directly

        }
        services.forEach(function(cat) {
            cat.categories.forEach(function(service_cat) {
                service_cat.services.forEach(function(service) {
                    if (service.prices) {
                        service.prices.forEach(function(price) {
                            if (price.additions.length > 0) {
                                if (price.additions[0].name == "Length") {
                                    price.additions[0].types.forEach(function(type, length) {
                                        if (!type.name.includes('Normal') && !type.name.includes('Thick')) {
                                            if (length > 4) {
                                                type.name = "Normal - " + type.name;
                                            } else {
                                                type.name = "Thick - " + type.name;

                                            }
                                        }
                                    })
                                }
                            }
                            if (price.employees.length > 0) {
                                $scope.serviceCodes.push(price.priceId);
                                var serviceObj = {};
                                serviceObj.serviceName = "" + service.name + " - " + price.priceId;
                                serviceObj.serviceCode = price.priceId;
                                serviceObj.price = price.price;
                                serviceObj.realServiceCode = service.serviceCode;
                                serviceObj.serviceId = service.serviceId;
                                serviceObj.permEmployees = price.employees;
                                serviceObj.employees = price.employees;
                                $scope.serviceNames.push(serviceObj.serviceName);
                                if (service.serviceCode == 459) {
                                   // console.log('pushed', serviceObj)
                                }
                                $scope.serviceObjs.push(serviceObj);
                            }
                        });
                    }
                });
            });
        });
       // console.log('$scope.serviceObjs', $scope.serviceObjs)

        var checkPackagePresenceFlag = false; // this flag checks if packages are already injected  or not
        services.forEach(function(element) {
                element.categories.forEach(function(subElement) {
                    if (subElement.name == 'Packages') {
                        checkPackagePresenceFlag = true;
                    }
                })
            }) // loop for checking packages
        if (!checkPackagePresenceFlag) {
            services.forEach(function(element) {

               if(Array.isArray(packagesComboNewCombo)){

                    packagesComboNewCombo.forEach(function(subElement) {
                    if (element.name == subElement.name) {
                        var packageCategory = { 'name': 'Packages', 'services': [] };
                        subElement.package.forEach(function(packageElement) {
                            if (packageElement.dealType == 'combo' || packageElement.dealType == 'newCombo') {
                                // packageElement.gender='MF';
                                packageCategory.services.push(packageElement);
                            }
                        })

                        element.categories.push(packageCategory);
                    }
                })

               }

            })
        } // loop for injecting packages
        // console.log(services);
        $scope.products = inventoryItems.filter(function(el) {
            return (el.quantity > 0 && el.active==true) ;
        });
        // $scope.sendOTP=function(){
        //  $scope.OTP = Math.floor(Math.random() * 90000) + 10000;
        //
        // };
        //console.log( $scope.serviceObjs);
        $log.debug('Service Objs: ', $scope.serviceObjs);

        $scope.customerDetail = function() {
            $scope.loyalty = 0;
            $scope.advance = 0;
            calculateTotal();
            $scope.tabs[3].active = true;
            if (!$scope.newApp.user.userId) {
                $http.post("/role3/createNewCustomerCrm", { firstName: $scope.newApp.user.name, phoneNumber: $scope.newApp.user.phoneNumber, gender: $scope.newApp.user.gender }).success(function(response, status) {
                    var data = response.data;
                    // console.log(data);
                    // console.log("data");
                     $scope.showCustomerDetailsError=false
                    $scope.newApp.user.userId = data.userId;
                    // console.log("new user id ",$scope.newApp.user.userId)
                });
            }
        };
        $scope.userNotRegisteredFlag = 1;
        $scope.phoneNumberChanged = function() {
            $scope.userNotRegisteredFlag = 1;
            $scope.disableNextButton = true;
            var x=($scope.newApp.services.reduce(function (a,b) { return a + b.price; }, 0));

            $http.post("/role3/customer", { phoneNumber: $scope.user.phoneNumber,subtotal:Math.ceil(x*1.18),noOfService:$scope.services.length }).success(function(response, status) {
                var data = response.data;
                
                // console.log(response.data);
                $scope.userNotRegisteredFlag = response.data;
                $scope.applyMembershipCredits(0);
                if (data) {
                    $scope.showCustomerDetailsError=false
                    $scope.user.userId = data.userId;
                    $scope.user.membership = data.membership;
                    $scope.user.emailId = data.emailId;
                    $scope.user.name = data.name;
                    $scope.user.membership = data.membership;
                    $scope.user.gender = data.gender;
                    $scope.user.advanceCredits = data.advanceCredits;
                    if($scope.user.advanceCredits){
                        $scope.user.hasOldCredits=true;
                        $scope.user.useOldCredits=false
                    }
                    $scope.user.loyalityPoints = data.loyalityPoints;
                    $scope.user.freeServices = data.freeServices;
                    $scope.user.checked = data.checked;
                    $scope.user.customerCrmFlag = data.zeroCompletedAppointments;
                    if ($scope.user.freeServices.length) {
                        freeSer($scope.user.freeServices)
                    };
                } else {
                    $http.post("/role3/createNewCustomerCrm", { firstName: $scope.user.name, phoneNumber: $scope.user.phoneNumber, gender: $scope.newApp.user.gender }).success(function(response, status) {
                        var data = response.data;
                        // console.log(data);
                       // console.log("data");
                         $scope.showCustomerDetailsError=false
                        $scope.newApp.user.userId = data.userId;
                        // console.log("new user id ",$scope.newApp.user.userId)
                    });
                    $scope.user.userId = null;
                    $scope.user.customerCrmFlag = true;
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
                    var x=($scope.services.reduce(function (a,b) { return a + b.price; }, 0));
                    $scope.user.loyalityPoints = customer.loyalityPoints;
                    $scope.user.phoneNumber = customer.phoneNumber;
                    $http.post("/role3/customer", { phoneNumber: $scope.user.phoneNumber,subtotal:Math.ceil(x*1.18),noOfService:$scope.services.length }).success(function(response, status) {
                        var data = response.data;
                        $scope.showCustomerDetailsError=false
                        $scope.user.loyalityPoints = data.loyalityPoints;
                        // console.log($scope.user.loyalityPoints);
                        $scope.user.advanceCredits = data.advanceCredits;
                        if($scope.user.advanceCredits){
                            $scope.hasOldCredits=true;
                            $scope.user.useOldCredits=false;
                        }
                        $scope.user.freeServices = data.freeServices;
                        $scope.user.membership = data.membership;
                        if ($scope.user.freeServices.length) {
                            freeSer($scope.user.freeServices)
                        };
                    });

                    $scope.user.gender = customer.gender;
                }
            });
            $scope.useAdvanceCredits = 0;
        };

        $scope.membershipChanged = function() {

            $scope.newApp.user.membership.forEach(function(m) {
                if (m.membershipId == $scope.newApp.user.membershipId) {
                    $scope.newApp.user.credits = m.creditsLeft;
                }
            });
        };

        $scope.empoyleeRevenue = function() {
            // console.log($scope.availEmployees);
            var tot = 0;
            if ($scope.availEmployeesServiceObject.type == "combo" || $scope.availEmployeesServiceObject.type == "newCombo") {
                for (var j = 0; j < $scope.availEmployeesServiceObject.services.length; j++) {
                    tot = 0;
                    $scope.availEmployeesServiceObject.services[j].employees.find(function(employeesElement) {
                        tot = tot + parseInt(employeesElement.dist);
                    })
                    // console.log(tot)
                    if (tot != 100) {
                        break;
                    }
                } // till here it is checked that the pop up opened is for combo or newcombo only
            } else {
                for (var i = 0; i < $scope.availEmployees.length; i++) {
                    tot = tot + $scope.availEmployees[i].dist;
                }
            }

            if (tot == 100) {
                $('#revenueDistribution').modal('hide');
                $scope.newApp.services[$scope.eIndex].eCheck = true;
                // console.log("true ho gaya");
                //$scope.newApp.services[requiredIndexForComboNewCombo]=angular.copy($scope.availEmployeesServiceObject);
            } else {
                alert("Percentage total not equal to 100");
                $scope.newApp.services[$scope.eIndex].eCheck = false;
            }
            //$scope.newApp.services[$scope.eIndex].employee2=$scope.availEmployees;
            // console.log($scope.newApp.services);

        }
        $scope.cancelAppt = function(id, userId, status) {
            $http.put("/role3/newAppointment", { appointmentId: id, userId: userId, status: status }).success(function(response, status) {
                // console.log(response.data);
                if (!isNaN(index)) {

                }
                if (response.data.items) {
                    updateProducts(response.data.items);
                }
                $('#rescheduleCancel2').modal('hide');
                refreshAppointments();

                // $scope.appointments.splice(index, 1);
            });
        }


        $scope.changeStatus = function(index, status) {
            // console.log($scope.appointments);
            // console.log($scope.appointments[index]);
            $scope.currentViewedAppointment = isNaN(index) ? index : $scope.appointments[index];

            // console.log($scope.currentViewedAppointment.appointmentId);
            $http.put("/role3/newAppointment", { appointmentId: $scope.currentViewedAppointment.appointmentId, userId: $scope.currentViewedAppointment.client.id, status: status }).success(function(response, status) {
                // console.log(response.data);
                if (!isNaN(index)) {

                }
                if (response.data.items) {
                    updateProducts(response.data.items);
                }
                refreshAppointments();

                // $scope.appointments.splice(index, 1);
            });
        };

        function updateProducts(items) {
            inventoryItems.forEach(function(i) {
                items.forEach(function(item) {
                    if (item.itemId == i.itemId) {
                        i.quantity = item.quantity;
                    }
                });
            });
        };

        $scope.print = function(index) {

            $scope.openPDF(index);
            $scope.changeStatus(index, 3);
            $scope.cancel();
        };
        var windowOpenCount = 0;
        $scope.openPDF = function(index) {

            var source = "../website/images/trial%20svg%20(1).svg";
            var tobePrinted = isNaN(index) ? index : $scope.appointments[index];
            // console.log(tobePrinted);
            var dateOfInvoice = new Date(tobePrinted.startsAt);
            var printData = "<div class='row'><div class='col-lg-6' style='height: 50px;float: right;'><img src='http://beusalons.com/images/Logo.png' width='150' alt='Be U salons' /></div></div><div class='col-md-12' ><div class='col-md-6' style='color:#d2232a;font-weight:700;text-align:right;float:right;width:180px;font-size:30px'></div>";
            printData += "<div style='text-align: left;' class='col-md-6'><b><h2 style='font-size:50px;'>" + parlorName + "</h2></b></div></div>";
            printData += "<div style='text-align: left;line-height:-2px;'>" + parlorAddress + "</div>";
            printData += "<div style='text-align: left;line-height:-2px;'>Contact No." + contactNumber + "</div><br/>";
            if (gstNumber != undefined) {
                // console.log("gst  is not defined")
                printData += "<div style='text-align: left;line-height:-2px;'> GSTIN Number: " + gstNumber;
            } else if (serviceTaxNumber != undefined) {
                printData += "<div style='text-align: left;line-height:-2px;'> Service Tax Number: " + serviceTaxNumber;
            }
            /*            if(tinNumber!=undefined){
                             printData += "     GST/ UIN  :"+tinNumber +"</div>";
                        }
                       */
            printData += "<div style='text-align: left;line-height:-2px;'> Invoice Date: " + dateOfInvoice.getDate() + "/" + (dateOfInvoice.getMonth() + 1) + "/" + dateOfInvoice.getFullYear();
            printData += "<div style='text-align: left;line-height:-2px;'> Invoice Number:" + tobePrinted.parlorAppointmentId;
            printData += "<h4><b>Client Details:</b></h4>";
            printData += "<table  style='width:90%; border-collapse: collapse; text-align: center; border-top-style: dotted;border-bottom-style: dotted;'>";
            printData += '<tr>\
                            <th>Name</th>\
                            <th>Phone No.</th>\
                             <th>Membership Credits Left</th>\
                        </tr>';
            printData += "<tr>";
            printData += `<td>` + tobePrinted.client.name + `</td>
                        <td>` + tobePrinted.client.phoneNumber + `</td>
                     <td>` + tobePrinted.client.creditsLeft + `</td>`;
            printData += "</tr></table><br>";

            if (tobePrinted.services && tobePrinted.services.length) {
                printData += "<h4><b>Services:</b></h4>";
                printData += "<table  style='width: 90%; border-collapse: collapse; text-align: center;border-top-style: dotted;border-bottom-style: dotted;'>";
                printData += `<tr>
                            <th>Service Name</th>`
                if (tobePrinted.services[0].gstNumber != undefined) { printData += `<th>SAC Code</th>` }
                printData += `<th>Price</th>
                            <th>Quantity</th>
                            <th>Additions</th>
                            <th>Employee Name</th>
                        </tr>`;
                for (var i = 0; i < tobePrinted.services.length; i++) {
                    var service = tobePrinted.services[i];
                    printData += "<tr>";
                    printData += `<td>` + service.name + `` + getBrandProductsName(service.brandProductDetail) + `` + `</td>`
                    if (tobePrinted.services[0].gstNumber != undefined) { printData += `<td>` + service.gstNumber + `</td>` }
                    printData += `<td> Rs.` + service.price + `</td>
                        <td>` + service.quantity + `</td>
                         <td> Rs.` + service.additions + `</td>
                         <td>` + getEmployeeNames(service.employees) + `</td>`;
                    printData += "</tr>";
                }
                printData += "</table><br>";

            }
            var ptotal = 0;
            if (tobePrinted.products && tobePrinted.products.length) {
                printData += "<h4><b>Products:</b></h4>";
                printData += "<table  style='width:90%; border-collapse: collapse; text-align: center;border-top-style: dotted;border-bottom-style: dotted;'>";
                printData += `<tr>
                            <th>Product Name</th>`
                if (tobePrinted.products[0].gstNumber != undefined) { printData += `<th>HSN Code</th>` }
                printData += `<th>Quantity</th>
                            <th>Price</th>
                            <th>Amount</th>
                            <th>Employee Name</th>
                        </tr>`;
                var ptotal = 0;
                for (var i = 0; i < tobePrinted.products.length; i++) {
                    var product = tobePrinted.products[i];
                    printData += "<tr>";
                    printData += `<td>` + product.name + `</td>`
                    if (tobePrinted.products[0].gstNumber != undefined) { printData += `<td>` + product.gstNumber + `</td>` }
                    printData += `<td>` + product.quantity + `</td>
                         <td> Rs.` + product.price + `</td>
                         <td> Rs.` + (product.price * product.quantity) + `</td>
                         <td>` + product.employee + `</td>`;
                    printData += "</tr>";
                    ptotal = +product.price;

                }
                printData += "</table><br>";
            }
            var ptax = .28 * ptotal;
            tobePrinted.tax = tobePrinted.tax - ptax;
            printData += "<h4><b>Billing:</b></h4>";
            printData += "<table  style='width:90%; border-collapse: collapse;border-top-style: dotted;'>";
            // if(tobePrinted.subscriptionAmount==1699){
            //     printData += "<tr><td> Beu Gold Subscription: </td><td> Rs." + tobePrinted.subscriptionAmount + "</td></tr>"
            //    }else{
            //           printData += "<tr><td ng-if='tobePrinted.subscriptionAmount==1699'>Beu Silver Subscription: </td><td> Rs." + tobePrinted.subscriptionAmount + "</td></tr>"

            //    }



            printData += "<tr><td> Sub Total: </td><td> Rs." + tobePrinted.subtotal + "</td></tr>"

            if (tobePrinted.discount > 0) {
                printData += "<tr><td> (-) Discount: </td><td> Rs." + tobePrinted.discount + "</td></tr>";
            }
            if (tobePrinted.membershipDiscount > 0) {
                printData += "<tr><td> (-)  Membership Discount: </td><td> Rs." + tobePrinted.membershipDiscount + "</td></tr>";
            }
            if (tobePrinted.creditUsed > 0) {
                printData += "<tr><td> (-) Membership Credits Used: </td><td> Rs." + tobePrinted.creditUsed + "</td></tr>";
            }
            if (tobePrinted.loyalityPoints > 0) {
                printData += "<tr><td> (-) Loyality Points Used: </td><td> Rs." + tobePrinted.loyalityPoints + "</td></tr>";
            }
            /*------------------------------------------GST work starts-------------------------------*/
          
            if (tobePrinted.services.length) {
                if (tobePrinted.services[0].gstNumber != undefined) {
                    printData += `<tr><td colspan="2"><table style='width: 100%; border-collapse: collapse; text-align: center'>
                <thead>
                <tr>
                   <th rowspan="2" style="border-top-style:dotted;">
                   Tax break-up
                 </th>
                 <th rowspan="2"  style="border-top-style:dotted;">
                   Taxable
                 </th>
                 <th colspan="2"  style="border-top-style: dotted;">
                   CGST:
                 </th>
                 <th colspan='2' style="border-top-style: dotted;">
                   SGST
                 </th>
                </tr>
                <tr>
                  <th style="border-bottom-style: dotted;">Rate</th>
                  <th style="border-bottom-style: dotted;">Amount</th>
                  <th style="border-bottom-style: dotted;">Rate</th>
                  <th style="border-bottom-style: dotted;">Amount</th>
                </tr>
                </thead>
                <tbody>`



                    for (var k = 0; k < tobePrinted.services.length; k++) {
                        var shortData = tobePrinted.services[k];
                        printData += `<tr>
                    <td  style="border-bottom-style: dotted;">` + shortData.gstNumber + `:` + shortData.gstDescription + `</td>
                    <td  style="border-bottom-style: dotted;">` + shortData.price + `</td>
                    <td  style="border-bottom-style: dotted;">9%</td>
                    <td  style="border-bottom-style: dotted;">` + Math.round(shortData.price * 0.09) + `</td>
                    <td  style="border-bottom-style: dotted;">9%</td>
                    <td  style="border-bottom-style: dotted;">` + Math.round(shortData.price * 0.09) + `</td>
                  </tr>`
                    }

                    printData += `</tbody></table></td></tr>`
                } else {
                    printData += `<tr><td style="border-bottom-style: dotted;"> CGST </td><td>Rs.` + ((tobePrinted.tax + ptax) * 0.5).toFixed(1) + `</td></tr>
                        <tr><td style="border-bottom-style: dotted;"> SGST </td><td>Rs.` + ((tobePrinted.tax + ptax) * .5).toFixed(1) + `</td></tr>`
                }
            }
            /*------------------------------------------GST work stops-------------------------------*/
            printData +="<tr><td> (+) CGST: </td><td>Rs "+ ((tobePrinted.tax + ptax) * 0.5).toFixed(1) + "</td></tr>";
            printData +="<tr><td> (+) SGST:</td><td>Rs "+ ((tobePrinted.tax + ptax) * .5).toFixed(1) + "</td></tr>";
            // printData +="<tr><td> (+) Krishi Kalyan Cess: </td><td>Rs."+ ((tobePrinted.tax)*(1/30)).toFixed(1) + "</td></tr>";
            printData += "<tr><td> (+) Total Tax: </td><td>Rs." + (tobePrinted.tax + ptax) + "</td></tr>";
            printData += "<tr style='border-top-style: dotted;'><td> Payable Amount: </td><td>Rs." + (tobePrinted.payableAmount) + "</td></tr></table>";
            /*printData +=




                       `




                    `;*/
            printData += "<h4><b>Payment Method:</b></h4>";
            printData += "<table  style='width:90%; border-collapse: collapse; text-align: center;border-top-style: dotted;border-bottom-style: dotted;'>";
            printData += `<tr>
                            <th>Payment Option</th>
                            <th>Amount</th>
                        </tr>`;
            for (var i = 0; i < tobePrinted.allPaymentMethods.length; i++) {
                var method = tobePrinted.allPaymentMethods[i];
                printData += "<tr>";
                printData += `<td>` + method.name + `</td>
                         <td> Rs.` + method.amount + `</td>`;
                printData += "</tr>";
            }
            printData += "</table><br><p> Thankyou for availing services at Be U - " + parlorName + ". We hope you had a pleasant experience.</p>";
            $('#publishAndPrint').modal('hide');
            
            var message = ' Hi ' + tobePrinted.client.name + ', Thank you for availing services of Rs.' + tobePrinted.payableAmount + ' with Be U - ' + parlorName + ' . Glad to serve you';
            var number = tobePrinted.client.phoneNumber;
            $rootScope.$broadcast("sendSMSEvent", { message: message, numbers: number, type: "T", otp: '' });

            var w = window.open();
            w.document.write(printData);
            w.document.close();
            var is_chrome = Boolean(window.chrome);
            if (is_chrome) {
                w.onload = function() {
                    windowOpenCount++;
                    w.print();
                    w.close();
                };
            } else {
                w.print();
                w.close();
            }
            
            //$scope.changeStatus(index, 3);
        }

        function getEmployeeNames(empes) {
            var emp = "";
            // console.log(empes);
            empes.forEach(function(e) {
                emp += (e.name + ' ');
            });
            return emp;
        }

        function getBrandProductsName(brandProductNames) {
            var names = '';
            if (brandProductNames != '') {
                names = '(' + brandProductNames + ')';
            }
            return names;
        }
        $scope.p = [];
        var employeesPresent;

        function refreshAppointments() {
            $scope.p = [];
            $scope.products = inventoryItems.filter(function(el) {
                return el.costPrice;
            });
            $scope.copyOfAppointments = '';
            $http.get("/role3/appointment").success(function(response, status) {
                appointments = angular.copy(response.data);
                $scope.appointments = angular.copy(appointments);
              //  console.log("hi", $scope.appointments);
                var copyOfAppointments = angular.copy(appointments);
                for (var i = 0; i < $scope.appointments.length; i++) {
                    var p = angular.copy($scope.paymentOptions);
                    for (var j = 0; j < p.length; j++) {
                        for (var k = 0; k < $scope.appointments[i].allPaymentMethods.length; k++) {
                            if (p[j].value == $scope.appointments[i].allPaymentMethods[k].value) {
                                p[j].isSelected = true;
                                p[j].amount = $scope.appointments[i].allPaymentMethods[k].amount;

                            }
                        }
                    }
                    $scope.p.push(p);
                }
               // console.log('current appointments payment options of each appointment', $scope.p);

            });
            $http.get("/role3/appointmentFromApp").success(function(response, status) {
               // console.log('appointmentFromApp', response.data);
                if (response.data) {
                    $scope.appWithoutEmp = response.data;

                    for (var i = 0; i < $scope.appWithoutEmp.length; i++) {
                        for (var j = 0; j < $scope.appWithoutEmp[i].services.length; j++) {
                            $scope.appWithoutEmp[i].services[j].employee1 = [];
                        }
                    }

                    //console.log($scope.newApp.aptDate)
                }

                $http.post("/role3/presentEmployees", { 'appointmentDate': $scope.newApp.aptDate }).success(function(response, status) {
                   // console.log('presentEmployees inside refreshAppointments', response)
                    employeesPresent = response.data;
                    if ($scope.appWithoutEmp.length > 0) {
                        for (var i = 0; i < $scope.appWithoutEmp.length; i++) {
                            //console.log((new Date($scope.appWithoutEmp[i].startsAt)).getHours());
                            var dtAppWithEmp = new Date();
                            var x = (new Date($scope.appWithoutEmp[i].startsAt)).toLocaleDateString();
                            if (((new Date($scope.appWithoutEmp[i].startsAt)).getHours() <= 24) && (x == dtAppWithEmp.toLocaleDateString())) {
                                //$scope.allotEmployees(i);
                                break;
                            }
                        }
                    }
                });


            });
        }
        refreshAppointments();
        $scope.serviceIdChanged = function() {
            $scope.serviceObjs.forEach(function(service) {
                if ($scope.currService.code == service.serviceCode) {
                    $scope.currService.name = service.serviceName;
                    $scope.currService.serviceId = service.serviceId;
                    $scope.currService.quantity = 1;
                    $scope.currService.serviceDiscount = 0;
                    $scope.currService.additions = 0;
                    $scope.currService.price = service.price;
                    $scope.currService.fprice = service.price + $scope.currService.additions;
                    $scope.currService.employee = service.employees[0].userId;
                    $scope.employees = service.employees;
                    currentSelectedService = angular.copy(service);
                }
            });
        };


        $scope.productCodeChanged = function() {
            // console.log($scope.currProduct.code);
            // console.log($scope.products);
            $scope.products.forEach(function(product) {
                if ($scope.currProduct.code == product.itemId) {
                    // console.log("product code function");
                    $scope.currProduct.code = product.itemId;
                    $scope.currProduct.name = product.name;
                    $scope.currProduct.quantity = 1;
                    $scope.currProduct.availquantity = product.quantity;
                    $scope.currProduct.commission = product.commission;
                    $scope.currProduct.price = product.sellingPrice;
                    currentSelectedProduct = angular.copy(product);
                }
            });
        };

        $scope.productNameChanged = function() {
            $scope.products.forEach(function(product) {
                if ($scope.currProduct.name == product.name) {
                    $scope.currProduct.code = product.itemId;
                    $scope.currProduct.name = product.name;
                    $scope.currProduct.quantity = 1;
                    $scope.currProduct.availquantity = product.quantity;
                    $scope.currProduct.commission = product.commission;
                    $scope.currProduct.price = product.sellingPrice;
                    currentSelectedProduct = angular.copy(product);
                }
            });
        };

        $scope.serviceAddition = function() {
            $scope.currService.fprice = $scope.currService.price + $scope.currService.additions;
            // console.log("Amount added");
        };

        /*$scope.addNewService = function (index,tindex,lindex,lev){
            if(lev=="Thick"){
                lindex=lindex+5;
            }
            var da=$scope.newApp.aptDate;
            console.log(lindex);
            console.log(lev);
            var da1=da.getDay();
            var week=1;
            if(da1==0|| da1==6){
                week=3;
            }
            else{
                week=2;
            }

            $scope.cartIds.push($scope.subServices.serviceCode);
            console.log($scope.subServices);
            $scope.currService.price = $scope.subServices.prices[index].price;
            $scope.currService.serviceId = $scope.subServices.serviceId;
            $scope.currService.type="service";
            if(lindex!=null){
                $scope.currService.name = $scope.subServices.name+'-'+ $scope.subServices.prices[index].additions[0].name+'-'+$scope.subServices.prices[index].additions[0].types[lindex].name;
                $scope.currService.additions = $scope.subServices.prices[index].additions[0].types[lindex].additions;
                $scope.currService.typeIndex = lindex;
            }
            else{
                $scope.currService.name = $scope.subServices.name;
                $scope.currService.additions =0;
            }
            var ins=[];
            for(var j=0;j<$scope.allDSIds.length;j++){
                if($scope.allDSIds[j].serviceCode==$scope.subServices.serviceCode){
                    ins.push($scope.allDPSIds[j]);
                }
            };
            for(var i=0;i<ins.length;i++){
                var dealName=$scope.deals[ins[i]].dealType.name;
                if((dealName=="chooseOne" || dealName=="dealPrice") && ($scope.deals[ins[i]].weekDay==1 || $scope.deals[ins[i]].weekDay==week)){

                    if($scope.currService.price+$scope.currService.additions>$scope.deals[ins[i]].dealType.price){
                        $scope.currService.price =$scope.deals[ins[i]].dealType.price ;
                        $scope.currService.additions =0;
                        $scope.currService.serviceId = $scope.deals[ins[i]].dealId;
                        $scope.currService.parlorDealId = $scope.deals[ins[i]].dealIdParlor;
                    }
                    $scope.currService.type=dealName;
                    console.log($scope.currService.serviceId);
                    console.log($scope.currService.serviceId);
                    console.log($scope.deals[ins[i]]);
                }
                else if(dealName=="chooseOnePer" && ($scope.deals[ins[i]].weekDay==1 || $scope.deals[ins[i]].weekDay==week)){
                    $scope.currService.price =($scope.subServices.prices[index].price*$scope.deals[ins[i]].dealType.price)/100;
                    $scope.currService.additions =($scope.currService.additions*$scope.deals[ins[i]].dealType.price)/100
                    $scope.currService.type=dealName;
                    $scope.currService.serviceId = $scope.deals[ins[i]].dealId;
                    $scope.currService.parlorDealId = $scope.deals[ins[i]].dealIdParlor;
                }
                else if((dealName=="combo") && ($scope.deals[ins[i]].weekDay==1 || $scope.deals[ins[i]].weekDay==week)){
                    var curComboIds=[];
                    $scope.deals[ins[i]].services.forEach(function(element){
                        curComboIds.push(element.serviceCode);

                    });
                    var con=1;
                    for(var k=0;k<curComboIds.length;k++){
                        var x=$scope.cartIds.indexOf(curComboIds[k]);
                        if(x<0){
                            con=0;
                        }
                    }
                    if(con){
                        $scope.combos.push($scope.deals[ins[i]]);
                        $scope.currService.type=dealName;
                    }
                }
                else if((dealName=="frequency") && ($scope.deals[ins[i]].weekDay==1 || $scope.deals[ins[i]].weekDay==week)){
                    $scope.frequencies.push($scope.deals[ins[i]]);
                }
             };
            $scope.currService.serviceCode=$scope.subServices.serviceCode;
            $scope.currService.quantity = 1;
            $scope.currService.code = $scope.subServices.prices[index].priceId;
            $scope.currService.employees = $scope.subServices.prices[index].employees;
           /!* $http.post("/role3/presentEmployees",{'appointmentDate':new Date()}).success(function (response, status) {
                console.log(response)
               $scope.currService.employees=response.data;
            });*!/

            console.log($scope.currService);
            console.log($scope.subServices);
            $scope.currService.count = $scope.count;
            $scope.currService.tax =  $scope.subServices.prices[index].tax;
            console.log($scope.currService);
            $scope.newApp.services.push(angular.copy($scope.currService));
            $scope.currService = {};

            $scope.count++;

            $scope.showDepartmentMenu();
        };*/
        function chooseOneDealPriceService(dealIndex) {
            if ($scope.currService.price + $scope.currService.additions > $scope.deals[dealIndex].dealType.price) {
                $scope.currService.price = $scope.deals[dealIndex].dealType.price;
                $scope.currService.additions = 0;
                $scope.currService.serviceId = $scope.deals[dealIndex].dealId;
                $scope.currService.parlorDealId = $scope.deals[dealIndex].dealIdParlor;
            }

        }

        function chooseOnePer(dealIndex, requiredRatioPassed, elementRatio, subServiceIndex) {
            $scope.currService.price = (($scope.subServices.prices[subServiceIndex].price * requiredRatioPassed) * ($scope.deals[dealIndex].dealType.price * elementRatio)) / 100;
            $scope.currService.additions = ($scope.currService.additions * $scope.deals[dealIndex].dealType.price * elementRatio) / 100
            $scope.currService.serviceId = $scope.deals[dealIndex].dealId;
            $scope.currService.parlorDealId = $scope.deals[dealIndex].dealIdParlor;
        }
        $scope.indexForEmployeesPresent = '';
        $scope.addNewService = function(index, tindex, lindex, lev, brandProductObjectPassed) {
            // console.log(brandProductObjectPassed);
            var comboBrandObject = angular.copy(brandProductObjectPassed);
            if (comboBrandObject == null) {
                comboBrandObject = { 'type': '' };
            } // this is done because when the object was passed null then error occured type of null so exclusive object with empty type is created
            if (comboBrandObject.type && (comboBrandObject.type == 'combo') || (comboBrandObject.type == 'newCombo')) {
                // console.log('welcome combo')
                // console.log(brandProductObjectPassed);

                $scope.currService.price = $scope.finalComboNewComboPrice;
                $scope.currService.serviceId = brandProductObjectPassed.dealId;
                $scope.currService.type = brandProductObjectPassed.type;
                $scope.currService.name = brandProductObjectPassed.name;
                $scope.currService.typeIndex = 0;
                $scope.currService.parlorDealId = brandProductObjectPassed.parlorDealId;
                $scope.currService.quantity = brandProductObjectPassed.quantity;
                $scope.currService.services = brandProductObjectPassed.services;
                $scope.currService.additions = 0;
                $scope.currService.serviceDiscount = 0;
                $scope.currService.tax = 18;

                /*========================Employees work combo new combo=============starts============================*/
                $scope.currService.employees = [];
                brandProductObjectPassed.services.find(function(serviceElement) {
                    if (comboBrandObject.type == 'combo') {
                        $.each(serviceElement.comboEmployees, function(index, value) {
                            if ($scope.currService.employees.indexOf(value.employeeId) === -1) {
                                $scope.currService.employees.push(value);
                            }
                        }); //best way to push unique elements in an array out of many arrays
                    } else {
                        $.each(serviceElement.comboEmployees, function(index, value) {
                            if ($scope.currService.employees.indexOf(value.employeeId) === -1) {
                                $scope.currService.employees.push(value);
                            }
                        }); //best way to push unique elements in an array out of many arrays
                    }

                })
                // console.log($scope.currService.employees)
                    /*========================Employees work combo new combo============stops============================*/

                $scope.currService.count = $scope.count;
                // console.log($scope.currService);
                $scope.newApp.services.push(angular.copy($scope.currService));
                $scope.currService = {};
                $scope.count++;
                $scope.showDepartmentMenu();
            } else {
                var requiredRatio = null;
                var productOrBrand = null;
                if (brandProductObjectPassed && brandProductObjectPassed.brandId) {
                    requiredRatio = brandProductObjectPassed.ratio;
                    $scope.currService.brandId = brandProductObjectPassed.brandId;
                    productOrBrand = 'brand';
                    // console.log('brand added whose ratio is - ' + requiredRatio);
                } else if (brandProductObjectPassed && brandProductObjectPassed.productId) {
                  //  console.log($scope.brandObjectRequiredId);
                    $scope.currService.brandId = $scope.brandObjectRequiredId.brandId;
                    requiredRatio = brandProductObjectPassed.ratio;
                    $scope.currService.productId = brandProductObjectPassed.productId;
                    productOrBrand = 'product';
                   // console.log('product added whose ratio is - ' + requiredRatio);
                } // detects if brand or product comes and adds the required id and gives us the ratio (requiredRatio)
                //console.log( $scope.subServices.prices);
                //console.log("this is the date selected for the employees");
                //console.log($scope.newApp.aptDate);
                $scope.indexForEmployeesPresent = index;


                if (lev == "Thick") {
                    lindex = lindex + 5;
                }
                var da = $scope.newApp.aptDate;
                // console.log(lindex);
                // console.log(lev);
                var da1 = da.getDay();
                var week = 1;
                if (da1 == 0 || da1 == 6) {
                    week = 3;
                } else {
                    week = 2;
                }

                $scope.cartIds.push($scope.subServices.serviceCode);
                //console.log($scope.subServices);

                if (requiredRatio == null) {
                    $scope.currService.price = $scope.subServices.prices[index].price;
                } else {
                    $scope.currService.price = $scope.subServices.prices[index].price * requiredRatio;
                } // if no deal and noproduct exists on the service then price is not multiplied with required ratio else if product or brand exists then its raio is multiplied

                $scope.currService.serviceId = $scope.subServices.serviceId;
                $scope.currService.type = "service";
                if (lindex != null) {
                    $scope.currService.name = $scope.subServices.name + '-' + $scope.subServices.prices[index].additions[0].name + '-' + $scope.subServices.prices[index].additions[0].types[lindex].name;
                    if (requiredRatio == null) {
                        $scope.currService.additions = $scope.subServices.prices[index].additions[0].types[lindex].additions;
                    } else {
                        $scope.currService.additions = $scope.subServices.prices[index].additions[0].types[lindex].additions * requiredRatio;
                    }

                    $scope.currService.typeIndex = lindex;
                } else {
                    $scope.currService.name = $scope.subServices.name;
                    $scope.currService.additions = 0;
                }
                var ins = [];
                for (var j = 0; j < $scope.allDSIds.length; j++) {
                    if ($scope.allDSIds[j].serviceCode == $scope.subServices.serviceCode) {
                        ins.push($scope.allDPSIds[j]);
                    }
                };
                for (var i = 0; i < ins.length; i++) {
                    var dealName = $scope.deals[ins[i]].dealType.name;
                    // console.log('This is the required deal object---------------------------- ' + '  ' + ins[i])
                    // console.log($scope.deals[ins[i]]);
                    if ((dealName == "chooseOne" || dealName == "dealPrice") && ($scope.deals[ins[i]].weekDay == 1 || $scope.deals[ins[i]].weekDay == week)) {
                        if ($scope.deals[ins[i]].brands.length > 0 && productOrBrand != null) {
                            if (productOrBrand == 'brand') {
                                $scope.deals[ins[i]].brands.find(function(element) {
                                        if ($scope.currService.brandId == element.brandId) {
                                            $scope.deals[ins[i]].dealType.price = $scope.deals[ins[i]].dealType.price * element.ratio;
                                            // console.log('brand matched' + '---  ' + element.ratio);
                                            // console.log($scope.currService.brandId);
                                            // console.log(element.brandId);
                                            chooseOneDealPriceService(ins[i]);
                                            $scope.currService.type = dealName;
                                        }
                                    }) // this loop works if  brand  is added and also deal exists
                                    // ins[i] if the same brand exists in the deal also then dealprice is changed and deal is applied
                            } else if (productOrBrand == 'product') {
                                $scope.deals[ins[i]].brands.find(function(element) {
                                    if (element.products.length > 0) {
                                        element.products.find(function(subElement) {
                                            if (subElement.productId == $scope.currService.productId) {
                                               // console.log($scope.deals[ins[i]].dealType.price);

                                                $scope.deals[ins[i]].dealType.price = $scope.deals[ins[i]].dealType.price * subElement.ratio;
                                                // console.log('product matched' + '---  ' + subElement.ratio + '---  ' + $scope.deals[ins[i]].dealType.price);
                                                // console.log(subElement.productId);
                                                // console.log($scope.currService.productId);
                                                chooseOneDealPriceService(ins[i]);
                                                $scope.currService.type = dealName;
                                            }
                                        })
                                    }
                                })
                            } // this loop works if  product  is added and also deal exists
                            //if the same product exists in the deal also then dealprice is changed and deal is applied
                        } else if (productOrBrand == null) {
                            chooseOneDealPriceService(ins[i]);
                            $scope.currService.type = dealName;
                        } // this loop works if no product or brand is added but deal exists

                        //console.log($scope.currService.serviceId);
                        //console.log($scope.currService.serviceId);
                        //console.log($scope.deals[ins[i]]);
                    } else if (dealName == "chooseOnePer" && ($scope.deals[ins[i]].weekDay == 1 || $scope.deals[ins[i]].weekDay == week)) {
                        if ($scope.deals[ins[i]].brands.length > 0 && productOrBrand != null) {
                            if (productOrBrand == 'brand') {
                                $scope.deals[ins[i]].brands.find(function(element) {
                                        if ($scope.currService.brandId == element.brandId) {
                                            // console.log('brand matched');
                                            // console.log($scope.currService.brandId);
                                            // console.log(element.brandId);
                                            chooseOnePer(ins[i], requiredRatio, element.ratio, index);
                                            $scope.currService.type = dealName;
                                        }
                                    }) // this loop works if  brand  is added and also deal exists
                                    // ins[i] if the same brand exists in the deal also then dealprice is changed and deal is applied
                            } else if (productOrBrand == 'product') {
                                $scope.deals[ins[i]].brands.find(function(element) {
                                    if (element.products.length > 0) {
                                        element.products.find(function(subElement) {
                                            if (subElement.productId == $scope.currService.productId) {
                                                $scope.deals[ins[i]].dealType.price = $scope.deals[ins[i]].dealType.price * requiredRatio;
                                                // console.log('product matched');
                                                // console.log(subElement.productId);
                                                // console.log($scope.currService.productId);
                                                chooseOnePer(ins[i], requiredRatio, subElement.ratio, index);
                                                $scope.currService.type = dealName;
                                            }
                                        })
                                    }
                                })
                            } // this loop works if  product  is added and also deal exists
                            //if the same product exists in the deal also then dealprice is changed and deal is applied
                        } else if (productOrBrand == null) {
                            chooseOnePer(ins[i], 1, 1, index);
                            $scope.currService.type = dealName;
                        }
                    } else if ((dealName == "frequency") && ($scope.deals[ins[i]].weekDay == 1 || $scope.deals[ins[i]].weekDay == week)) {
                        $scope.frequencies.push($scope.deals[ins[i]]);
                    }
                };


                $scope.currService.employees = [];
                // console.log($scope.subServices.prices[index].employees);
                $scope.currService.pEmployees = $scope.subServices.prices[index].employees;
                for (var k = 0; k < $scope.subServices.prices[index].employees.length; k++) {
                    if (employeesPresent.filter(function(ar) { return ar.userId == $scope.subServices.prices[index].employees[k].userId; })[0]) {
                        $scope.currService.employees.push($scope.subServices.prices[index].employees[k]);
                    }
                }
                $scope.currService.serviceCode = $scope.subServices.serviceCode;
                $scope.currService.quantity = 1;
                $scope.currService.code = $scope.subServices.prices[index].priceId;
                /*$scope.currService.employees = $scope.subServices.prices[index].employees;*/


                //console.log($scope.currService);
                //console.log($scope.subServices);
                $scope.currService.count = $scope.count;
                $scope.currService.tax = $scope.subServices.prices[index].tax;
                // console.log($scope.currService);
                $scope.currService.serviceDiscount=0;
                $scope.newApp.services.push(angular.copy($scope.currService));
                $scope.currService = {};
                $scope.count++;
                $scope.showDepartmentMenu();
            }


            $scope.comboBrand = ''; // to refresh combo new combo radio buttons so that they dont appear checked
            $scope.comboProduct = '';
            $scope.newComboBrand = '';
            $scope.newComboProduct = '';
            $scope.selectedNewComboService = '';
            $scope.deals = angular.copy(deals);
            $scope.brandProductObjectToBePassed = null;

        };
        $scope.callAddNewService = function(check, index, tindex, lindex, lev, brandProductObjectPassed) {
            // console.log($scope.showBrandsFlag + ' $scope.priceIndex ' + $scope.priceIndex);
            // console.log(brandProductObjectPassed)
            if ($scope.subServices.prices[$scope.priceIndex].brand.brands.length > 0 && brandProductObjectPassed == null) {
                alert('Please select the brands and products first');
                check.checkboxFlag = false;
            } else {
                $scope.addNewService(index, tindex, lindex, lev, brandProductObjectPassed)
            }
        }
        $scope.comboSelected = function(combo, index1) {
            // console.log(combo);
            combo.services.forEach(function(element) {
                var index = $scope.cartIds.indexOf(element.serviceCode);
                if (index > -1) {
                    //console.log($scope.newApp.services[index]);
                    $scope.newApp.services.splice(index, 1);
                    $scope.cartIds.splice(index, 1);
                }
            });
            $scope.currService.employees = $scope.subServices.prices[0].employees;
            // console.log($scope.subServices.prices[0].employees);
            $scope.currService.name = combo.name;
            $scope.cartIds.push(10001);
            $scope.combos.splice(index, 1);
            $scope.currService.additions = 0;
            $scope.currService.price = combo.dealType.price;
            $scope.currService.serviceId = combo.dealId;
            $scope.currService.parlorDealId = combo.dealIdParlor;
            $scope.currService.quantity = 1;
            $scope.currService.code = 10000;
            $scope.currService.tax = combo.tax;
            $scope.currService.type = "combo";
            $scope.currService.count = $scope.count;
            $scope.currService.serviceDiscount=0;
            $scope.newApp.services.push(angular.copy($scope.currService));

            // console.log($scope.newApp.services);
            $scope.currService = {};
            $scope.count++;
            checkPackageSuggestions();
            $scope.showDepartmentMenu();

        };
        $scope.frequencySelected = function(frequency, index1) {
            frequency.services.forEach(function(element) {
                var index = $scope.cartIds.indexOf(element.serviceCode);
                // console.log(index);
                if (index > -1) {
                    $scope.newApp.services[index].price = $scope.newApp.services[index].price * frequency.dealType.frequencyRequired;
                    $scope.newApp.services[index].additions = $scope.newApp.services[index].additions * frequency.dealType.frequencyRequired;
                    $scope.frequencies.splice(index1, 1);
                    $scope.newApp.services[index].type = "frequency";
                    $scope.newApp.services[index].serviceId = frequency.dealId;
                }
            });

        };

        $scope.backButton = function() {
            $scope.showCategory = true;
            $scope.showSubService = false;
            $scope.showBrandsFlag = false;
            $scope.showProductsFlag = false;
            $scope.showService = false;
            $scope.comboNewComboTabFlag = false;
        }

        // function checkPackageSuggestions(){
        // var tempPackages = angular.copy(packages);
        // $scope.packagesAvailable = [];
        // tempPackages.forEach(function(p){
        // var count = 0;
        // $scope.newApp.services.forEach(function(s){
        // p.services.forEach(function(ser){
        // if(ser == s.serviceId) count ++;
        // })
        // });
        // tempPackages.count = count;
        // });
        // tempPackages.sort(function(a, b){ return a.count - b.count; });
        // if(tempPackages.length>0)$scope.packagesAvailable.push(tempPackages[0]);
        // if(tempPackages.length>1)$scope.packagesAvailable.push(tempPackages[1]);
        // if(tempPackages.length>2)$scope.packagesAvailable.push(tempPackages[2]);
        // }

        $scope.getServiceInText = function(services) {
            var text = "";
            services.forEach(function(s) {
                text += s.name + ", ";
            });
            return text;
        };

        $scope.addThisPackage = function(index) {
            var p = $scope.packagesAvailable[index];
            // console.log(p);
            var emp = {};
            // console.log($scope.newApp.services);
            p.services.forEach(function(s) {
                var idx = -1;
                $scope.newApp.services.forEach(function(service, key) {
                    // console.log(service.serviceId);
                    // console.log(s);
                    if (service.serviceId == s.serviceId) {
                        idx = key;
                        emp = angular.copy(s.employee);
                    }
                });
                if (idx != -1) {
                    // console.log("deleting");
                    $scope.newApp.services[idx].quantity -= 1;
                    if ($scope.newApp.services[idx].quantity == 0) $scope.newApp.services.splice(idx, 1);
                }
            });
            $scope.newApp.services.push({
                serviceId: 0,
                name: p.name,
                price: p.price,
                additions: 0,
                serviceDiscount:0,
                employee: emp,
                count: 1,
                quantity: 1,
                packageId: p.packageId
            });
            checkPackageSuggestions();
        };

        $scope.addNewProduct = function() {
            // console.log($scope.currProduct);
            $scope.currProduct.pcount = $scope.pcount;
            $scope.newApp.products.push(angular.copy($scope.currProduct));
            $scope.currProduct = {};
            $scope.pcount++;
        };

       
        $scope.removeProduct = function(index) {
            $scope.newApp.products.splice(index, 1);
            $scope.newApp.products.forEach(function(p, key) {
                p.pcount = key + 1;
            });
            $scope.pcount = $scope.newApp.products.length + 1;
        };

        $scope.getEmployeeName = function(empId) {
            var empName = "";
            employees.forEach(function(emp) {
                if (emp.userId == empId) empName = emp.name;
            });
            return empName;
        };

        $scope.cancel = function() {
            $scope.newApp = {};
            $scope.currService = {};
            $scope.currProduct = {};
            $scope.newApp.user = {};
            $scope.newApp.useMembershipCredits = 0;
            $scope.appointmentType = "1";
            $scope.paymentMethod = 2;
            $scope.newApp.services = [];
            $scope.newApp.products = [];
            $scope.packagesAvailable = [];
            $scope.count = 1;
            $scope.newApp.aptDate = new Date();
            $scope.newApp.aptTime = null;
            $scope.newApp.otherCharges = 0;
            $scope.newApp.useLoyalityPoints = false;
            $scope.cartIds = [];
            $scope.combos = [];
            $scope.disableLB = false;
            $scope.advanceLB = false;
            $scope.frequencies = [];
        };

        $scope.cancel();
        $scope.loyaltyPoints = function() {
            $scope.disableLB = true;
            $scope.newApp.useLoyalityPoints = true;

            if ($scope.ssubtotal <= $scope.newApp.user.loyalityPoints) {
                $scope.loyalty = $scope.ssubtotal;
            } else {
                $scope.loyalty = $scope.newApp.user.loyalityPoints;
            }
            $scope.ssubtotal -= ($scope.loyalty);
            $scope.stax = $scope.ssubtotal * (.18);
            var am = ($scope.loyalty) * 1.18;
            // console.log(am);
            $scope.total -= Math.round(am);
        }

        $scope.updateDateTime = function() {
            var d = $scope.newApp.aptDate;
            var t = $scope.newApp.aptTime ? $scope.newApp.aptTime : new Date();

            $scope.newApp.appointmentTime = new Date(d.getFullYear(), d.getMonth(), d.getDate(), t.getHours(), t.getMinutes(), 0);
            // console.log($scope.newApp.appointmentTime);
            $http.post("/role3/presentEmployees", { 'appointmentDate': $scope.newApp.aptDate }).success(function(response, status) {
                /*console.log(response)
                var employeesPresent;
                employeesPresent=response.data;
                $scope.currService.employees=[];
                console.log($scope.subServices.prices[$scope.indexForEmployeesPresent].employees);
                for(var k=0;k<$scope.subServices.prices[$scope.indexForEmployeesPresent].employees.length;k++){
                    if(employeesPresent.filter(function (ar) {return ar.userId == $scope.subServices.prices[$scope.indexForEmployeesPresent].employees[k].userId;})[0]){
                        $scope.currService.employees.push($scope.subServices.prices[$scope.indexForEmployeesPresent].employees[k]);
                    }
                }*/
                $scope.productEmployees = response.data;
                // console.log($scope.newApp.services);
                var presentEmployeesChange = response.data;
                $scope.currService.employees = [];
                if ($scope.newApp.services.length > 0) {
                    for (var i = 0; i < $scope.newApp.services.length; i++) {

                        $scope.newApp.services[i].employee1 = [];
                        for (var j = 0; j < $scope.newApp.services[i].employees.length; j++) {
                            $scope.newApp.services[i].employees[j].isSelected = false;
                        }

                    }
                    for (var k = 0; k < $scope.newApp.services.length; k++) {
                        for (var i = 0; i < $scope.newApp.services[k].pEmployees.length; i++) {
                            if (presentEmployeesChange.filter(function(ar) { return ar.userId == $scope.newApp.services[k].pEmployees[i].userId; })[0]) {
                                $scope.currService.employees.push($scope.newApp.services[k].pEmployees[i]);
                            }
                        }

                    }
                    // console.log($scope.newApp.services);
                    // console.log($scope.serviceObjs);
                }


            });
        }
        $scope.availEmployeesServiceObject = '';
        var requiredIndexForComboNewCombo = '';
        $scope.revenueDistribution = function(index) {
            $scope.availEmployeesServiceObject = $scope.newApp.services[index];
            requiredIndexForComboNewCombo = index;
           // console.log($scope.availEmployeesServiceObject)
            $scope.availEmployees = $scope.newApp.services[index].employee1;
           // console.log($scope.availEmployees);
            var findFlagToEditEmployees = false;
            if ($scope.availEmployeesServiceObject.type == 'combo' || $scope.availEmployeesServiceObject.type == 'newCombo') {
                for (var i = 0; i < $scope.availEmployeesServiceObject.services.length; i++) {
                    $scope.availEmployeesServiceObject.services[i]['employee1'] = angular.copy($scope.availEmployees);
                    $scope.newApp.services[index].services.find(function(serviceElement) {
                        var copyOfSelectedEmployees = angular.copy(serviceElement);
                       // console.log(copyOfSelectedEmployees)
                        serviceElement.employee1 = angular.copy($scope.newApp.services[index].employee1);
                       // console.log(serviceElement.employee1)
                        for (var i = 0; i < serviceElement.employee1.length; i++) {
                            if (copyOfSelectedEmployees.employees) {
                                copyOfSelectedEmployees.employees.find(function(employeeElement) {
                                    if (employeeElement.employeeId == serviceElement.employee1[i].employeeId) {
                                       // console.log('scsdcsdc')
                                        serviceElement.employee1[i].isSelected = true;
                                        serviceElement.employee1[i].dist = employeeElement.distribution;
                                    }
                                })
                            } else {
                                findFlagToEditEmployees = true;
                                $scope.availEmployeesServiceObject.services[i]['employee1'] = angular.copy($scope.availEmployees);
                                break;
                            }
                        }
                        if (!findFlagToEditEmployees) {
                            serviceElement.employee1.find(function(e1) {
                                serviceElement.employees.find(function(e) {
                                    if (e.employeeId == e1.employeeId) {
                                       // console.log('in here')
                                        e.dist = e1.distribution;
                                    }
                                })
                            })
                        }
                        // console.log(serviceElement.employee1);
                        // console.log(serviceElement.employees)
                    })


                }
            }


            $scope.eIndex = index;
        };
        $scope.onCloseServicesComboNewCombo = function(emp) {
            // console.log(emp)
        }
        $scope.publish = function(check) {
            // $scope.newApp.appointmentTime = ;
            // console.log($scope.appointmentType)
            // console.log({ data: $scope.newApp, appointmentType: $scope.appointmentType, paymentMethod: $scope.paymentMethod });
            // console.log($scope.newApp);

            if (!$scope.newApp.otp) {
                if (!$scope.newApp.user.customerCrmFlag) {
                    $scope.otp = $scope.newApp.user.phoneNumber.substring(0, 4);
                } else {
                    $scope.otp = Math.floor(Math.random() * 9000) + 1000;
                }

                $scope.newApp.otp = $scope.otp; // OTP is saved in new app variable
            };
            // console.log($scope.apptLevelDiscount);
            // console.log($scope.newApp);
            $scope.newApp.services.forEach(function(ser){
                ser.serviceDiscount=ser.serviceDiscount+(1-ser.serviceDiscount/100)*$scope.newApp.erpDiscount
            })
            // console.log($scope.newApp);

            $http.post("/role3/newAppointment", { data: $scope.newApp, appointmentType: $scope.appointmentType, paymentMethod: $scope.paymentMethod }).success(function(response, status) {
                var data = response.data;
                var appId=data.appointmentId;
                // console.log(data);
                alert("Appointment has been successfully booked");
                if ($scope.newApp.appointmentId) {
                    appointments[editAppointmentIndex] = angular.copy(response.data);
                } else {
                    appointments.push(response.data);
                }
                if(appId==undefined)
                {
                    appId=$scope.newApp.appointmentId;
                }
                // console.log("apptid new",appId);


                $http.post("/role3/sendShortUrlSms", {phoneNumber: $scope.newApp.user.phoneNumber,subtotal: data.subtotal,noOfService: $scope.newApp.services.length,appointmentId:appId }).success(function(response, status) {

                    // console.log(response);
                });
                if (check == 2) {
                    $scope.caOtp(response.data);
                };
                $scope.appointments = appointments;
                $scope.cancel();
                refreshAppointments();
            });


        };
        $scope.cancelMessage = function(index) {
            // console.log($scope.appointments[index].client.phoneNumber);
            // var number=[$scope.appointments[index].client.phoneNumber];
            // $rootScope.$broadcast("sendSMSEvent", {message: "Your appointment has been cancelled!", numbers :number , type : "T"});
        };

        function calculateTotal() {
            var stax = 0,
                ptax = 0,
                ssubtotal = 0,
                membershipDiscount = 0,
                discount = 0,
                apptLevelDiscount=0,
                serviceLevelDiscount=0,
                psubtotal = 0;
            // console.log($scope.newApp.services);
            $scope.newApp.useLoyaltyPoints = 0;
            $scope.newApp.advanceCredits = 0;
            $scope.newApp.services.forEach(function(s) {
                var sub = (s.price + s.additions) * s.quantity;
                var t =(($scope.parlorTax) / 100 )* sub;
                stax += t;
                ssubtotal += sub;
                serviceLevelDiscount += (s.serviceDiscount * sub) / 100
                membershipDiscount += (discount * sub) / 100
            });
            serviceLevelDiscount=Math.round(serviceLevelDiscount);
            $scope.newApp.products.forEach(function(s) {
                var sub = s.price * s.quantity;
                psubtotal += sub;
                var t = 28 / 100 * sub;
                ptax += t;
            });
            $scope.ssubtotal = ssubtotal - $scope.loyalty;
            $scope.psubtotal = psubtotal;
            $scope.serviceLevelDiscount = serviceLevelDiscount;
            apptLevelDiscount=Math.round((($scope.newApp.erpDiscount/100))*(ssubtotal-serviceLevelDiscount));
            $scope.subtotal = $scope.psubtotal + $scope.ssubtotal;
            $scope.stax = stax-(serviceLevelDiscount+apptLevelDiscount)*.18;
            $scope.ptax = ptax;
            $scope.apptLevelDiscount=apptLevelDiscount;
            $scope.membershipDiscount = membershipDiscount;
            $scope.total = Math.ceil($scope.subtotal - membershipDiscount + $scope.stax  + $scope.ptax-serviceLevelDiscount-apptLevelDiscount);

            if ($scope.advance) {
                $scope.newApp.useAdvanceCredits = true;
                if ($scope.total <= $scope.advance) {
                    $scope.newApp.advanceCredits = $scope.total;
                    $scope.total = 0;
                } else {
                    $scope.total = $scope.total - $scope.advance;
                    $scope.newApp.advanceCredits = $scope.advance;
                }
            }


        }

        function fillData(appointment) {
            $scope.newApp.user.phoneNumber = appointment.client.phoneNumber;
            // console.log(appointment);

            // $scope.newApp.user.membershipId = "" | appointment.client.membership;
            $http.post("/role3/customer", { phoneNumber: appointment.client.phoneNumber }).success(function(response, status) {
                var data = response.data;
                if (data) {
                    // console.log(data)
                    $scope.newApp.user.name = data.name;
                    $scope.newApp.user.gender = data.gender;
                    $scope.newApp.user.loyalityPoints = data.loyalityPoints;
                    $scope.newApp.user.membershipId = data.membership.membershipId ? data.membership.membershipId : "0";
                } else {
                    $scope.newApp.user.membershipId = 0;
                }
                $scope.newApp.otherCharges = 0;
            });
        };
        var index;
        $scope.caClick1 = function(index) {
            // console.log(appointments[index]);
        }

        function serviceEmployeesEdit(s) {
            if (s.dealPriceUsed) {

                s.serviceId = s.dealId;
                s.type = s.type;


            }
            s.employee1 = s.employees;
            // console.log("check for dist");
            // console.log(s.employee1)
            $scope.serviceObjs.forEach(function(service) {
                if (s.code == service.realServiceCode) {
                    s.employees = service.employees;

                }

            });

            for (var i = 0; i < s.employees.length; i++) {
                for (var j = 0; j < s.employee1.length; j++) {
                    if (s.employee1[j].employeeId == s.employees[i].userId) {
                        s.employees[i].isSelected = true;
                        s.employees[i].dist = s.employee1[j].distribution;
                    }
                }
            }
        }

        function comboNewComboEmployeesEdit(s) {
            if (s.dealPriceUsed) {
                s.serviceId = s.dealId;
                s.type = s.type;
            }
            // console.log('employee work for comboNew combo');
            // console.log(s);
            s.employee1 = angular.copy(s.employees); //outer multiselect ke selected employees
            s.employees = [];
            $scope.serviceObjs.forEach(function(service) {
                s.services.find(function(innerElement) {
                    if (innerElement.serviceCode == service.realServiceCode) {
                        innerElement.comboEmployees = filterPresentEmployees(angular.copy(service.employees));
                    }
                })
            });
            // console.log(s.employees);

            s.services.find(function(serviceElement) {
                serviceElement.comboEmployees.find(function(comboEmployeesElement) {
                    var matchFlag = false;
                    if (s.employees.length == 0) {
                        s.employees.push(comboEmployeesElement);
                        matchFlag = true;
                    }
                    for (var i = 0; i < s.employees.length; i++) {
                        if (s.employees[i].employeeId == comboEmployeesElement.employeeId) {
                            matchFlag = true;
                            break;
                        }
                    }
                    if (!matchFlag) {
                        s.employees.push(comboEmployeesElement);
                    }
                })
            })

            for (var i = 0; i < s.employee1.length; i++) {
                s.employees.find(function(employeeElement) {
                    if (employeeElement.employeeId == s.employee1[i].employeeId) {
                        employeeElement.isSelected = true;
                    }
                })
            }


            /*for(var i=0;i<s.employees.length;i++){
                for(var j=0;j<s.employee1.length;j++){
                    if(s.employee1[j].employeeId==s.employees[i].userId){
                        s.employees[i].isSelected=true;
                        s.employees[i].dist=s.employee1[j].distribution;
                    }
                }
            }*/
        }
      

        $scope.showDepartmentMenu = function() {
            $scope.showSuperCategory = true;
            $scope.showCategory = false;
            $scope.showService = false;
            $scope.showSubService = false;
            $scope.showBrandsFlag = false
            $scope.showProductsFlag = false;
            $scope.comboNewComboTabFlag = false;
            $scope.sorder = 1;
        };
        $scope.showCategoryMenu = function() {
            $scope.showSuperCategory = false;
            $scope.showCategory = true;
            $scope.showService = false;
            $scope.showSubService = false;
            $scope.showBrandsFlag = false;
            $scope.showProductsFlag = false;
            $scope.comboNewComboTabFlag = false;
            $scope.sorder = 2;
        };
        $scope.showServiceMenu = function() {
            $scope.showSuperCategory = false;
            $scope.showCategory = false;
            $scope.showService = true;
            $scope.showSubService = false;
            $scope.showBrandsFlag = false;
            $scope.showProductsFlag = false;
            $scope.comboNewComboTabFlag = false;
            $scope.sorder = 3;
        };
        $scope.data = {};
        $scope.updateMembership = function(memId, userId) {
            $('#printMembership').modal('show');

        };

       

        $scope.active = 1;
        $scope.press = function() {
            $scope.tab = false;
            $scope.active = 2;

        };
        $scope.tabs = [{ "active": true, "disable": false }, { "active": false, "disable": false }, { "active": false, "disable": true }, { "active": false, "disable": true }];
        $scope.next1 = function() {
            // console.log($scope.newApp.services)
            var employeeCheckFlag = false;
            for (var i = 0; i < $scope.newApp.services.length; i++) {
                if (($scope.newApp.services[i].employee1 == '') || ($scope.newApp.services[i].employee1.length == 0)) {
                    employeeCheckFlag = true;
                }
            }
            if (employeeCheckFlag) {
                alert("Please enter the employees");
            } else {
                var t = true;
                // console.log($scope.newApp.services);
                $scope.newApp.services.forEach(function(s) {
                    if (!s.eCheck) {
                        t = false;
                    }
                });
                if (t) {
                    $scope.tabs[2].active = true;
                    $scope.tabs[2].disable = false;
                }
            }
            $window.scrollTo(0, 0);
            
        };
        $scope.next2 = function() {
            $scope.tabs[2].active = false;
            $scope.tabs[2].disable = false;
            $scope.tabs[3].active = true;
            $scope.tabs[3].disable = false;
        };
        $scope.next3 = function() {
            var employeeCheckFlag = false;
            for (var i = 0; i < $scope.newApp.services.length; i++) {
                if (($scope.newApp.services[i].employee1 == '') || ($scope.newApp.services[i].employee1.length == 0)) {
                    employeeCheckFlag = true;
                }
            }
            if (employeeCheckFlag) {
                alert("Please enter the employee for the selected services");
            } else {
                $scope.tabs[2].active = true;
                $scope.tabs[2].disable = false;
            }

        };

        $scope.resetTabs = function() {
            $scope.tabs = [{ "active": false, "disable": false }, { "active": true, "disable": false }, { "active": false, "disable": true }, { "active": false, "disable": true }];
        };

      
        $scope.resetTabs();
        $scope.caOtp = function(ap) {
            // console.log(ap);
            var serviceNameList = [];
            for (var i = 0; i < ap.services.length; i++) {
                serviceNameList.push(ap.services[i].name);
            }

           // console.log([serviceNameList.slice(0, -1).join(', '), serviceNameList.slice(-1)[0]].join(serviceNameList.length < 2 ? '' : ' and '));
            var serviceString = [serviceNameList.slice(0, -1).join(', '), serviceNameList.slice(-1)[0]].join(serviceNameList.length < 2 ? '' : ' and ')
           // console.log(serviceNameList);
            $scope.storedAppId = ap.appointmentId;
            var len = ap.services.length - 1;
            $scope.serviceMsg = "";
            ap.services.forEach(function(value, key) {
                // console.log(key + ': ' + JSON.stringify(value.name));
                $scope.serviceMsg = $scope.serviceMsg + " " + JSON.stringify(value.name);
                if (key != len) {
                    $scope.serviceMsg = $scope.serviceMsg + " ,";
                }
            });
            if ((ap.creditUsed != 0) || (ap.loyalityPoints != 0) || (ap.advanceCredits != 0)) {
                var totalBillSummaryAmount = parseInt(ap.payableAmount + ap.membershipDiscount);
                var membership = ap.creditUsed;
                var loyaltyap = ap.loyalityPoints;
                var advance = ap.advanceCredits;
                var addedMessage = 'Thankyou for using your ';
                var arrayForMLA = []; //MLA-membership,loyality and advance
                if (ap.creditUsed != 0) {
                    arrayForMLA.push('Membership points (used-' + ap.creditUsed + ', left-' + ap.client.creditsLeft + ')');
                    totalBillSummaryAmount = totalBillSummaryAmount + parseInt(ap.creditUsed);
                }
                if (ap.loyalityPoints != 0) {
                    arrayForMLA.push('Loyalty points (' + ap.loyalityPoints + ') ');
                    totalBillSummaryAmount = totalBillSummaryAmount + parseInt(ap.loyalityPoints);
                }
                if (ap.advanceCredits != 0) {
                    arrayForMLA.push('Advance (' + ap.advanceCredits + ') ');
                    totalBillSummaryAmount = totalBillSummaryAmount + parseInt(ap.advanceCredits);
                }
                for (var i = 0; i < arrayForMLA.length; i++) {
                    if ((i == arrayForMLA.length - 1) && (arrayForMLA.length > 1)) {
                        addedMessage = addedMessage + ' and ' + arrayForMLA[i];
                    } else {
                        addedMessage = addedMessage + arrayForMLA[i];
                        if ((i != arrayForMLA.length - 2) && (arrayForMLA.length > 1)) {
                        }                            addedMessage = addedMessage + ',';

                    }
                }


                if (ap.membershipDiscount > 0) {
                    $scope.msg = "Hi " + ap.client.name + " Your bill summary for " + serviceString +". Payable amount is Rs." + ap.payableAmount + ". " + addedMessage + ". Download our APP to avail a trendy haircut Absolutely FREE here: http://onelink.to/bf45qf";
                } else {
                    $scope.msg = "Hi " + ap.client.name + " Your bill summary for " + serviceString +". Payable amount is Rs." + ap.payableAmount + ". " + addedMessage + ". Download our APP to avail a trendy haircut Absolutely FREE here: http://onelink.to/bf45qf";
                }

            } else {
                $scope.msg = "Hi " + ap.client.name + ", Your bill summary for " + serviceString + " is Rs " + ap.payableAmount + ". Hate Waiting For OTP SMS And Long Payment Queues? Why Not, Download And Pay Through Be U Salons App For Easy Transactions. Link http://onelink.to/bf45qf";
            }
            // console.log("these are services");
            // console.log(ap.services);
            // console.log($scope.msg);
            $scope.OTP = ap.otp;
           // console.log(ap.client.phoneNumber);
            var number = [ap.client.phoneNumber];
            $http.post("/role3/sendSmsOtp", { message: ap.otp + " is the OTP of your transaction for the amount of Rs " + ap.payableAmount, numbers: number, type: "T", otp: $scope.OTP, appointmentId: ap.appointmentId }).success(function(response, status) {
               // console.log(response);
                ap.resend = 1;
                if (!response.success) {
                    alert("SMS limit reached")
                }
                $scope.countDown = 60;
                var time = $timeout(function() {
                    var timer = setInterval(function() {
                        if ($scope.countDown > 0) {
                            $scope.countDown--;
                        } else {
                            clearInterval(timer)
                        }
                        $scope.$apply();
                    }, 1000);
                }, 1000);
            });
            $rootScope.$broadcast("sendSMSEvent", { message: $scope.msg, numbers: number, type: "T", otp: $scope.OTP });
        };
        $scope.resendOtp = function(ap, type) {
            // console.log("retry api callled")
            $http.post("/role3/sendSmsOtp", { message: ap.otp + " is the OTP of your transaction for the amount of Rs " + ap.payableAmount, numbers: ap.client.phoneNumber, type: "T", otp: ap.otp, appointmentId: ap.appointmentId, retry: type }).success(function(response, status) {
                // console.log(response.data);
                if (type == "text")
                    ap.resendText == 1
                else
                    ap.resendVoice == 1

                if (!response.success) {
                    alert("SMS limit reached")
                }
            });
        }
        $scope.addAdvance = function() {

            /*$scope.advanceLB=true;
             $scope.msg = "Dear Customer, Advance of Rs " + $scope.newApp.addAdvanceCredits +  " has been received by Be U Salons.";
             console.log($scope.msg);
             $rootScope.$broadcast("sendSMSEvent", {message: $scope.msg, numbers :$scope.newApp.user.phoneNumber, type : "T"});*/

        };
        $scope.addAdvance = function() {

            /*$scope.advanceLB=true;
             $scope.msg = "Dear Customer, Advance of Rs " + $scope.newApp.addAdvanceCredits +  " has been received by Be U Salons.";
             console.log($scope.msg);
             $rootScope.$broadcast("sendSMSEvent", {message: $scope.msg, numbers :$scope.newApp.user.phoneNumber, type : "T"});*/

        };
        $scope.useAdvance = function() {
            $scope.advance = $scope.newApp.user.advanceCredits;
            calculateTotal();
        };

        $scope.paymentDropdown = function(index) {
           // console.log($scope.p[index], "  it is dropdown")

            if ($scope.appointments[index].couponCode == null) {
               // console.log('Coupon Code is null')
                $scope.p[index].forEach(function(a) {
                  //  console.log('entered')
                    if (a.value == 11 && a.isSelected == true) {
                        a.isSelected = false
                        alert(' No coupon code cannot select' + a.name);

                    }
                })

                // console.log($scope.p[index]);



            }

           // console.log("appointment for testing", $scope.appointments[index])
            if ($scope.appointments[index].allPaymentMethods.length > 1) {
                $scope.payModalVar = index;
                $('#paymentDistribution').modal('show');

            } else if ($scope.appointments[index].allPaymentMethods.length == 1) {
                $scope.appointments[index].allPaymentMethods[0].amount = $scope.appointments[index].payableAmount;
                $http.post("/role3/changePaymentMethod", { paymentMethod: $scope.appointments[index].allPaymentMethods, appointmentId: $scope.appointments[index].appointmentId }).success(function(response, status) {
                   // console.log(response.data);
                });
               // console.log($scope.appointments[index]);
            }

        }

        $scope.paymentModal = function(pay, index) {
            var tot = 0;
            for (var i = 0; i < pay.allPaymentMethods.length; i++) {
                tot = tot + pay.allPaymentMethods[i].amount;
            }

            if (tot == (pay.payableAmount+pay.subscriptionAmount)) {
               // console.log($scope.appointments[index]);
                $('#paymentDistribution').modal('hide');
                $http.post("/role3/changePaymentMethod", { paymentMethod: $scope.appointments[index].allPaymentMethods, appointmentId: $scope.appointments[index].appointmentId }).success(function(response, status) {
                   // console.log(response.data);
                });
            } else {
                alert("Amount not equal to payable amount");

            }
        }

        $scope.statusChanged = function(apptId) {
            $http.get("/role2/changeAppointmentStatus?appointmentId=" + apptId).success(function(response, status) {
               // console.log(response.data);
                refreshAppointments()
               // console.log($scope.appointments);
            });
        };
        // $scope.checkPayment=function(index){
        // var method =$scope.appointments[index];
        // console.log("chala");
        // method.allPaymentMethods.forEach(function(option){
        // method.pm.forEach(function(element){
        // if(element.value==option.value)
        // element.isSelected=true;
        // });
        // });
        // };
        var freeSer = function(ser) {
           // console.log(ser);
            ser.forEach(function(s) {
                $scope.services.forEach(function(dep) {
                    dep.categories.forEach(function(cat) {
                        cat.services.forEach(function(ser) {
                            ser.prices.forEach(function(pr) {
                                if (pr.priceId == s.code && s.serviceId == ser.serviceId) {
                                    s.name = ser.name;

                                    for (var i = 0; i < $scope.newApp.services.length; i++) {
                                        if ($scope.newApp.services[i].code == s.code) {
                                            s.allow = true;
                                            s.index = i;
                                        }
                                    };
                                }
                            });
                        });
                    });
                });
            });
        }
        $scope.availFreeService = function(index, index1) {
           // console.log("Free service button");
            $scope.newApp.services[index].frequencyUsed = true;
            $scope.newApp.services[index].price = 0;
            $scope.newApp.services[index].additions = 0;
            $scope.newApp.services[index].type = "deal";
            $scope.newApp.services[index].serviceId = $scope.newApp.user.freeServices[index1].serviceId;
            alert("Free service added");

        }
        $scope.printMembership = function(pm, mem, userId) {
            var total = 0;
           // console.log(userId);
            pm.forEach(function(p) {
                total += p.amount;
            });
            if (total == Math.ceil(mem.price * 1.18)) {
                $('#printMembership').modal('hide');
                $scope.data.userId = userId;
                $scope.data.paymentMethod = pm;
                $scope.mem = {};
                $scope.u = {};
               // console.log(pm);
                $scope.data.membershipId = mem.membershipId;
               // console.log("membership data",$scope.data)
                $http.post("/role2/membershipCustomer", $scope.data).success(function(response, status) {
                    $scope.user = response.data;
                   // console.log(response.data);
                    $scope.newApp.user.credits = response.data.credits;
                    $scope.mem = response.data.printObj.memberships;
                    $scope.u = response.data.printObj.client;
                    if (response.success) {
                        $scope.msg = "Dear Customer, You have purchased " + $scope.mem.name + " Membership for Rs ." + $scope.mem.price * 1.18;
                       // console.log($scope.msg);
                        $rootScope.$broadcast("sendSMSEvent", { message: $scope.msg, numbers: $scope.u.phoneNumber, type: "T" });
                        $scope.phoneNumberChanged();
                        // console.log("mem added");
                        // console.log($scope.mem);
                        var printData = "<div style='text-align: center'><br><b>Membership Invoice</b></div><hr><br>";
                        printData += `<table border="1" style='width: 100%; border-collapse: collapse'>
    <tr>
    <b>Membership Name:</b> ` + $scope.mem.name + `

    </tr>
    <tr>
    <td><b>Membership Price:</b> ` + $scope.mem.price + `</td>
    <td><b>Valid For(Months): </b>` + $scope.mem.validFor + `</td>
    </tr>
    </table><br>`;
                        printData += "<h4><b>Client Details:</b></h4>";
                        printData += "<table border='1' style='width: 100%; border-collapse: collapse; text-align: center'>";
                        printData += `<tr>
    <th>Name</th>
    <th>Phone No.</th>
    </tr>`;
                        printData += "<tr>";
                        printData += `<td>` + $scope.u.name + `</td>
    <td>` + $scope.u.phoneNumber + `</td>`;
                        printData += "</tr></table><br>";
                        printData += "<h4><b>Billing Details:</b></h4>";
                        printData += "<table border='1' style='width: 100%; border-collapse: collapse;'>";
                        printData += `<tr><td> Membership Price: </td><td> Rs.` + $scope.mem.price + `</td></tr>
    <tr><td> (+) Service Tax: </td><td>Rs.` + $scope.mem.price * .18 + `</td></tr>
    <tr><td> Payable Amount: </td><td>Rs.` + $scope.mem.price * 1.18 + `</td></tr>
    </table>`;

                        var w = window.open();
                        w.document.write(printData);
                        w.print();
                        w.close();
                    }
                });


            } else {
                alert("Total amount should be equal to Membership price");
            }
        };

        $scope.checkoutPaymentOption1 = function(pr) {

            // console.log($scope.storedAppId);
            // console.log(pr);
            if ($scope.total != 0) {
                $http.post("/role3/changePaymentMethod", { paymentMethod: pr, appointmentId: $scope.storedAppId }).success(function(response, status) {
                    // console.log("Payment Method changed");
                    // console.log(response);

                });
            }
            for (var i = 0; i < $scope.appointments.length; i++) {
                if ($scope.appointments[i].appointmentId == $scope.storedAppId)
                    $scope.currentAppointmentIndex = i;
            }
            // console.log($scope.currentAppointmentIndex);
            $scope.appointments[$scope.currentAppointmentIndex].allPaymentMethods = pr;
            $scope.print($scope.currentAppointmentIndex);
            /* refreshAppointments(function(){
                 alert("here")
                 $scope.appointments[$scope.currentAppointmentIndex].allPaymentMethods=pr;
                 $scope.print($scope.currentAppointmentIndex);
             });*/


        };
        $scope.checkPrint = function(options) {
            var tot = 0;
            options.forEach(function(option) {
                tot += option.amount;
            });
            if (tot != $scope.total)
                return true;
            else
                return false;
        }
        $scope.checkApptStatus = function(app, otp) {
            // if ( app.payableAmount == 0 && otp == app.otp) {
            //     return false
            // } else if (app.appBooking!=2 && app.allPaymentMethods.length && otp == app.otp) {

            //     return false
            // } else if (app.appBooking==2 && (app.allPaymentMethods.length || app.paymentMethod==5)) {
            //     return false;
            // } else {
            //     return true
            // }
        }
        $scope.checkApptStatus1 = function(app, otp) {
            if (app.payableAmount == 0) {
                return false
            } else if (app.allPaymentMethods.length) {
                return false
            } else {
                return true
            }
        }







        $scope.duplicateEmployeesToBeSelected = [];
        var requiredindex = '';
        var appWithoutEmpCopy = ''
        $scope.allotEmployees = function(index,c) {
            // console.log(index)
            // console.log($scope.appWithoutEmp);
            if(c)
            {       
                    var obj=angular.copy(index);
                    index=0;
                    appWithoutEmpCopy=[];
                    appWithoutEmpCopy[index]=angular.copy(obj);
            }
            else{
                         appWithoutEmpCopy = angular.copy($scope.appWithoutEmp);
                          //  console.log(appWithoutEmpCopy[index].startsAt)

            }
       
            $http.post("/role3/presentEmployees", { 'appointmentDate': appWithoutEmpCopy[index].startsAt }).success(function(response, status) {
               // console.log(response)

                for (var i = 0; i < appWithoutEmpCopy[index].services.length; i++) {
                    $scope.duplicateEmployeesToBeSelected[i] = angular.copy(response.data);
                    for (var j = 0; j < appWithoutEmpCopy[index].services[i].employees.length; j++) {
                        for (var k = 0; k < $scope.duplicateEmployeesToBeSelected[i].length; k++) {
                            if ($scope.duplicateEmployeesToBeSelected[i][k].userId == appWithoutEmpCopy[index].services[i].employees[j].employeeId) {
                                $scope.duplicateEmployeesToBeSelected[i][k].isSelected = true;
                            }
                        }
                    }
                }

                requiredindex = index;
                $scope.modalObjAppWithoutEmp = '';


                $scope.modalObjAppWithoutEmp = appWithoutEmpCopy[index].services;
                /*=====================work for comboNew combo flag=====================starts====================*/
                $scope.modalObjAppWithoutEmp.find(function(serviceElement) {
                        if (serviceElement.comboServices.length > 0) {
                           // console.log('here2');
                            serviceElement.showComboNewComoServicesFlag = false;
                            serviceElement.services = angular.copy(serviceElement.comboServices);
                        }
                    })
                    /*=====================-work for comboNew combo flag-------------Stops--------------================================*/
                if ($scope.selectedUibTab == 'currentAppointments') {
                    $('#allotEmp2').modal({
                        backdrop: 'static',
                        keyboard: false
                    })
                    $('#allotEmp2').modal('show');
                } else if ($scope.selectedUibTab == 'services') {
                    $('#allotEmp3').modal({
                        backdrop: 'static',
                        keyboard: false
                    })
                    $('#allotEmp3').modal('show');
                }

            });


        }

        $scope.displayComboAllotEmployees = function(allotEmpComboObj) {
            // console.log(allotEmpComboObj);
            allotEmpComboObj.showComboNewComoServicesFlag = true;
            allotEmpComboObj.services.forEach(function(serviceElement) {
                serviceElement.employee1 = angular.copy(allotEmpComboObj.employees);
            })
        }
        $http.get("/role3/appointmentFromApp").success(function(response, status) {
            // console.log('appointmentFromApp', response.data);
            $scope.appWithoutEmp = response.data;
            for (var i = 0; i < $scope.appWithoutEmp.length; i++) {
                for (var j = 0; j < $scope.appWithoutEmp[i].services.length; j++) {
                    $scope.appWithoutEmp[i].services[j].employee1 = [];
                }
            }


        });

        $scope.employeeDistributionModalList = [];

        $scope.advancePaySelect = function(x) {
            // console.log(x);
        }
        $scope.submitAdvancePaymentDistribution = function(x, y, z) {
            $scope.newApp.advancePaymentMethods = x;
            var totalAmount = 0;
            for (var i = 0; i < x.length; i++) {
                totalAmount = totalAmount + x[i].amount;
            }

            if (Math.ceil(totalAmount) != Math.ceil($scope.newApp.addAdvanceCredits)) {
                alert("The amount does not matches the advance amount you entered");
            } else {
                $scope.newApp.addAdvanceCredits = Math.ceil(totalAmount);
                $scope.advanceLB = true;
                $scope.msg = "Dear Customer, Advance of Rs " + $scope.newApp.addAdvanceCredits + " has been received by Be U Salons.";
                // console.log($scope.msg);
                $rootScope.$broadcast("sendSMSEvent", { message: $scope.msg, numbers: $scope.newApp.user.phoneNumber, type: "T" });
                $('#addAdvanceModelPopUp').modal('hide');
            }


        }
        $scope.distributionOfWork = function(employeeObject, indexPassed, distributionToBeAssigned, finalEmloyee) {
            employeeObject.dist = parseInt(distributionToBeAssigned);
            finalEmloyee = $scope.modalObjAppWithoutEmp.employees;



        }
        $scope.paymentNotification = function(id) {
            // console.log(id);
            $http.post("/role3/sendPayNotification", { appointmentId: id }).success(function(response, status) {
                alert("Notification Sent.");
            });
        }

        $scope.updateEmployeeDistributionForApp = function() {



            // console.log($scope.selectedUibTab);

            appWithoutEmpCopy[requiredindex].services = $scope.modalObjAppWithoutEmp;
           // console.log(appWithoutEmpCopy[requiredindex]);
            /*var t=$scope.appWithoutEmp;*/
            $scope.appWithoutEmp = appWithoutEmpCopy;

           // console.log($scope.appWithoutEmp[requiredindex].appointmentType);

            for (var i = 0; i < $scope.appWithoutEmp[requiredindex].services.length; i++) {
                var total100 = 0;
                $scope.distributionSumCheckFlag = true;
                if ($scope.appWithoutEmp[requiredindex].services[i].type == 'combo' || $scope.appWithoutEmp[requiredindex].services[i].type == 'newCombo') {
                    var innerServiceElement = $scope.appWithoutEmp[requiredindex].services[i].services;
                    for (var j = 0; j < innerServiceElement.length; j++) {
                        var comboSerTotal = 0;
                        if (innerServiceElement[j].employees) {
                            innerServiceElement[j].employees.find(function(empElement) {
                              //  console.log('hmm' + empElement)
                                comboSerTotal = comboSerTotal + parseInt(empElement.dist);
                            })
                        }
                       // console.log('comboNewCombo total' + ' ' + comboSerTotal);
                        total100 = comboSerTotal
                        if (total100 != 100) {
                            break;
                        }
                    }
                } else {
                    for (var j = 0; j < $scope.appWithoutEmp[requiredindex].services[i].employees.length; j++) {
                        if ($scope.appWithoutEmp[requiredindex].services[i].employees[j].dist != undefined) {
                            total100 = total100 + parseInt($scope.appWithoutEmp[requiredindex].services[i].employees[j].dist);
                        }
                    }
                }
               // console.log('normal' + ' ' + total100);
                if (total100 != 100) {

                   // console.log('hello', total100);
                    $scope.distributionSumCheckFlag = false;

                    break;
                }
            }

            if ($scope.distributionSumCheckFlag) {
                /*for(var i=0;i<$scope.appWithoutEmp.length;i++){
                 for(var j=0;j<$scope.appWithoutEmp[i].services.length;j++){
                 $scope.appWithoutEmp[i].services[j].employee1=$scope.appWithoutEmp[requiredindex].employees;
                 }
                 }*/
                /*$scope.appWithoutEmp[requiredindex].employee1=$scope.appWithoutEmp[requiredindex].employees;*/
               // console.log($scope.appWithoutEmp[requiredindex]);
                $scope.appWithoutEmp[requiredindex].user = $scope.appWithoutEmp[requiredindex].client;
                for (var i = 0; i < $scope.appWithoutEmp[requiredindex].services.length; i++) {
                    $scope.appWithoutEmp[requiredindex].services[i].employee1 = $scope.appWithoutEmp[requiredindex].services[i].employees;
                }
                // console.log($scope.appWithoutEmp);
                $http.post("/role3/addEmployee", { services: $scope.appWithoutEmp[requiredindex].services, appointmentId: $scope.appWithoutEmp[requiredindex].appointmentId }).success(function(response, status) {
                    deleteAppointmentIdService.setappointmentId($scope.appWithoutEmp[requiredindex].parlorAppointmentId);
                    $rootScope.$broadcast('removeNotificationAppointment');
                    // console.log(response)
                    refreshAppointments();
                });
                if ($scope.selectedUibTab == 'services') {
                    $('#allotEmp3').modal('hide');
                } else if ($scope.selectedUibTab == 'currentAppointments') {
                    $('#allotEmp2').modal('hide');
                }


            } else {
                // console.log("less");
            }

        }
        $scope.$on('broadcastRefreshAppointents', function() {
            refreshAppointments();
        });
        //console.log($scope.selectedUibTab);
        $scope.uibTabSelected = function(tabName) {
            /*alert("here"); */
            // console.log(tabName);
            $scope.selectedUibTab = tabName;
           // console.log($scope.selectedUibTab);

        }
        $scope.rescheduleCancelDataObject = '';
        $scope.rescheduleCancelAppointmentForApp = function() {
            $scope.rescheduleCancelDataObject = '';
            // console.log($scope.appWithoutEmp[requiredindex]);
            // console.log($scope.modalObjAppWithoutEmp);
            $scope.rescheduleCancelDataObject = $scope.appWithoutEmp[requiredindex];
            if ($scope.selectedUibTab == 'services') {
                $('#allotEmp3').modal('hide');
                $('#rescheduleCancel3').modal({
                    backdrop: 'static',
                    keyboard: false
                })
                $('#rescheduleCancel3').modal('show');

            } else if ($scope.selectedUibTab == 'currentAppointments') {
                $('#allotEmp2').modal('hide');
                $('#rescheduleCancel2').modal({
                    backdrop: 'static',
                    keyboard: false
                })
                $('#rescheduleCancel2').modal('show');
            }

        }

        $scope.cancelAppBookedAppointment = function() {
            // console.log($scope.appWithoutEmp[requiredindex])
            $http.put("/role3/newAppointment", { appointmentId: $scope.appWithoutEmp[requiredindex].appointmentId, userId: $scope.appWithoutEmp[requiredindex].client.id, status: 2 }).success(function(response, status) {
                // console.log(response.data);
                if ($scope.selectedUibTab == 'services') {

                    $('#rescheduleCancel3').modal('hide');
                } else if ($scope.selectedUibTab == 'currentAppointments') {

                    $('#rescheduleCancel2').modal('hide');
                }
                refreshAppointments();

                // $scope.appointments.splice(index, 1);
            });
        }
        $scope.dateTimeObjAppWidtEmp = { "aptDate": '', "aptTime": '' };

        $scope.rescheduleAppBookedAppointment = function() {
            var d = $scope.dateTimeObjAppWidtEmp.aptDate;
            var t = $scope.dateTimeObjAppWidtEmp.aptTime ? $scope.dateTimeObjAppWidtEmp.aptTime : new Date();
          //  console.log('appintment ID', $scope.appWithoutEmp[requiredindex].appointmentId);
            // console.log('time', new Date(d.getFullYear(), d.getMonth(), d.getDate(), t.getHours(), t.getMinutes(), 0));
            $http.post("/role3/changeAppointmentTime", { appointmentId: $scope.appWithoutEmp[requiredindex].appointmentId, startAts: new Date(d.getFullYear(), d.getMonth(), d.getDate(), t.getHours(), t.getMinutes(), 0) }).success(function(response, status) {

                // console.log('hello')

                // console.log(response);
                if ($scope.selectedUibTab == 'services') {

                    $('#rescheduleCancel3').modal('hide');
                } else if ($scope.selectedUibTab == 'currentAppointments') {

                    $('#rescheduleCancel2').modal('hide');
                }
                refreshAppointments();

                // $scope.appointments.splice(index, 1);
            });
        }

        $scope.productsArray = '';
        $scope.brandProductObjectToBePassed = null;
        $scope.brandObjectRequiredId = null;
        $scope.brandSelected = function(brandPassed) {
            // console.log(brandPassed);
            $scope.brandObjectRequiredId = angular.copy(brandPassed);
            if ($scope.subServices.prices[$scope.productBrandPriceIndex].additions.length == 0) {
                $scope.productBrandPriceAddition = false;
            } else {
                $scope.productBrandPriceAddition = true; //flag to check if length or anything like that exists as a result if true then directly product is not added instead options for the additions are given
            }
           // console.log('$scope.productBrandPriceAddition-----------' + '  ' + $scope.productBrandPriceAddition);
            $scope.brandProductObjectToBePassed = brandPassed;
            if (brandPassed.products.length > 0) {
                if (brandPassed.products.length == 1) {
                   // console.log('this brand has product length 1');
                    $scope.productSelected(brandPassed.products[0]);
                } else {
                    $scope.showSubService = true;
                    $scope.showBrandsFlag = true;
                    $scope.showProductsFlag = true;
                    $scope.productsArray = brandPassed.products;
                }
            } else {
                if ($scope.productBrandPriceAddition) {
                    // console.log('additions exists');
                } else {

                    //$scope.currService.brandId=brandPassed.brandId;
                    //pass ratio to  addNewService($scope.productBrandPriceIndex,null,null,null,brandPassed)
                    $scope.addNewService($scope.productBrandPriceIndex, null, null, null, $scope.brandProductObjectToBePassed)
                    // console.log($scope.currService)
                    // console.log('additions doesnt exists')
                    // console.log('call add service');
                }

            }
        }

        $scope.productSelected = function(productPassed) {

            $scope.brandProductObjectToBePassed = productPassed;
            // console.log(productPassed)
            if ($scope.productBrandPriceAddition) {
                // console.log('additions exists');
            } else {
                //$scope.currService.productId=productPassed.productId;
                //pass ratio to  addNewService($scope.productBrandPriceIndex,null,null,null,productPassed)
                $scope.addNewService($scope.productBrandPriceIndex, null, null, null, $scope.brandProductObjectToBePassed)
                // console.log($scope.currService)
                // console.log('additions doesnt exists')
                // console.log('call add service');
            }
        }

        $scope.comboBrandObjectPassed = '';
        $scope.comboBrandIndex = '';
        $scope.selectorIndex = '';
        $scope.comboBrandSelected = function(comboBrand, selectorIndex, allBrands) {
            if (!comboBrand.checked) { // this is done to avoid multiple clicks on brand
                for (var i = 0; i < allBrands.length; i++) {
                    if (comboBrand.brandId != allBrands[i].brandId) {
                        allBrands[i].checked = false;
                    }
                }
                // console.log(comboBrand);
                $scope.selectorIndex = selectorIndex;
                comboBrand.checked = true; //to make radio selected
               // console.log($scope.comboNewComboSubServices.selectors[selectorIndex]);
                $scope.comboBrandObjectPassed = comboBrand;


                if ($scope.comboCart.services[selectorIndex].productId) {
                    var prop = "productId";
                    delete $scope.comboCart.services[selectorIndex][prop];
                }
                $scope.comboCart.services[selectorIndex].brandId = angular.copy(comboBrand.brandId); // here the process of storing brand id and its respective price starts
                $scope.comboCart.services[selectorIndex].price = angular.copy(comboBrand.price); // helps in calculating the final price in the comboCart
                $scope.comboCart.price = 0;
                for (var i = 0; i < $scope.comboCart.services.length; i++) {
                    $scope.comboCart.price = $scope.comboCart.price + $scope.comboCart.services[i].price
                }
               // console.log($scope.comboCart);
                $scope.comboNewComboSubServices.selectors[selectorIndex].services[0].brands.find(function(element) {
                        if (element.brandId == comboBrand.brandId) {
                            element.showProductFlag = true;

                            if (element.products.length == 1) { // done for the selecetion if their exists only single product
                                element.products[0].checked = true; // this makes the radiobutton of the only product checked
                              //  console.log('This is the first product so it got selected ' + element.products[0].productName);
                                $scope.comboProductSelected(element.products[0], selectorIndex);
                            }
                        } else {
                            element.showProductFlag = false;
                        }

                    }) // this is the process of hiding and showing the respective products
            }

        }

        $scope.comboProductSelected = function(comboProduct, superParentIndex) {
           // console.log(comboProduct);

            $scope.comboCart.services[superParentIndex].productId = angular.copy(comboProduct.productId); // here the process of storing brand id and its respective price starts
            $scope.comboCart.services[superParentIndex].price = angular.copy(comboProduct.price); // helps in calculating the final price in the comboCart
            $scope.comboCart.price = 0;
            for (var i = 0; i < $scope.comboCart.services.length; i++) {
                $scope.comboCart.price = $scope.comboCart.price + $scope.comboCart.services[i].price
            }
            // console.log($scope.comboCart);

        }

        $scope.newComboServiceSelected = function(newComboServiceObject, parentIndexOfService) {
           // console.log('newComboServiceObject inside $scope.newComboServiceSelected', newComboServiceObject);
            //console.log(parentIndexOfService);
            var obj = { 'price': newComboServiceObject.price, 'key': parentIndexOfService, 'serviceCode': newComboServiceObject.serviceCode, 'name': newComboServiceObject.name, 'serviceBrandObject': newComboServiceObject.brands, 'comboEmployees': angular.copy(filterPresentEmployees(newComboServiceObject.employees)) };
            if ($scope.comboCart.services.length == 0) {
                $scope.comboCart.services.push(obj);
            } else {
                var matchFlag = false; //to see if the cart consists of the service selected in the dropdown
                $scope.comboCart.services.find(function(el) {
                    if (el.key == parentIndexOfService) {
                        // console.log(el.serviceCode);
                        el.serviceCode = newComboServiceObject.serviceCode;
                        console.log(angular.copy(filterPresentEmployees(newComboServiceObject.employees)))
                        el.comboEmployees = angular.copy(filterPresentEmployees(newComboServiceObject.employees));
                        el.serviceBrandObject = newComboServiceObject.brands
                        matchFlag = true;
                    }
                });
                // console.log(matchFlag)
                if (!matchFlag) {
                    $scope.comboCart.services.push(obj);
                }

            }
           // console.log('$scope.comboCart inside $scope.newComboServiceSelected func', $scope.comboCart);
            newComboServiceObject.showNewComboBrandFlag = !newComboServiceObject.showNewComboBrandFlag;
            if (newComboServiceObject.brands.length == 1) {
                //console.log('going to select one brand for newCombo');
                //newComboServiceObject.brands[0].checked=true;
                $scope.newComboBrandSelected(newComboServiceObject.brands[0], parentIndexOfService, 0, null);
            }
        }

        $scope.newComboBrandSelected = function(newComboBrandObject, parentKeyIndexOfCart, brandIndex, allBrands) {
                // console.log('newComboBrandSelected func', allBrands);
               // console.log('newComboBrandObject in newComboBrandSelected func', newComboBrandObject);
                // console.log('parentKeyIndexOfCart newComboBrandSelected func' + parentKeyIndexOfCart);
                if (!newComboBrandObject.checked) {
                    newComboBrandObject.checked = true;
                    if (allBrands != null) {
                        for (var i = 0; i < allBrands.length; i++) {
                            if (newComboBrandObject.brandId != allBrands[i].brandId) {
                                allBrands[i].checked = false;
                            }
                        }
                    }
                    //console.log(newComboBrandObject);
                    //console.log($scope.comboCart.services[parentKeyIndexOfCart].serviceBrandObject[brandIndex]);
                    $scope.comboCart.services.find(function(serviceElement) {
                            if (parentKeyIndexOfCart == serviceElement.key) {
                                serviceElement.brandId = newComboBrandObject.brandId;
                                serviceElement.price = newComboBrandObject.price;
                                if (serviceElement.productId) {
                                    var prop = "productId";
                                    delete serviceElement[prop];
                                }
                                serviceElement.serviceBrandObject.find(function(brandObject) {
                                    if (brandObject.brandId == newComboBrandObject.brandId) {
                                        /*brandObject.showProductFlag=!brandObject.showProductFlag;*/
                                        brandObject.showProductFlag = true;
                                    } else {
                                        brandObject.showProductFlag = false;
                                    }
                                })
                            }
                        }) //found the required brandArray by using parentKeyIndexOfCart to find ki cart main jo services hain unmain se kisko belong karta hai yey brand
                        //parentKeyIndexOfCart and key attribute is compared in the services from cart and if it matches then thsi says okay iss service ko ye brandArray belong karti hai

                    $scope.comboCart.price = 0;
                    for (var i = 0; i < $scope.comboCart.services.length; i++) {
                        if ($scope.comboCart.services[i].price) {
                            $scope.comboCart.price = $scope.comboCart.price + $scope.comboCart.services[i].price
                        }
                    }
                   // console.log('$scope.comboCart inside newComboBrandSelected func', $scope.comboCart);
                    if (newComboBrandObject.products.length == 1) {
                       // console.log('here')
                        newComboBrandObject.products[0].checked = true;
                        $scope.newComboProductSelected(newComboBrandObject.products[0], parentKeyIndexOfCart);
                    }
                }
            } //then out of all brands required brand is found by getting the brand id from radio button and uska flag vice versa karke doosron ko false karke unke products chup diye jaate hain
            //the key element to be focused here is  $scope.comboCart

        $scope.newComboProductSelected = function(newComboProductObject, parentKeyIndexOfCart) {
           // console.log('newComboProductObject inside newComboProductSelected func', newComboProductObject);
            $scope.comboCart.services.find(function(serviceElement) {
                if (parentKeyIndexOfCart == serviceElement.key) {
                    serviceElement.productId = newComboProductObject.productId;
                    serviceElement.price = newComboProductObject.price;
                }
            })
            $scope.comboCart.price = 0;
            for (var i = 0; i < $scope.comboCart.services.length; i++) {
                if ($scope.comboCart.services[i].price) {
                    $scope.comboCart.price = $scope.comboCart.price + $scope.comboCart.services[i].price
                }
            }
          //  console.log('$scope.comboCart inside newComboProductSelected func', $scope.comboCart);
        }

        $scope.checkWeekDayWeekendComboNewCombo = function(index, tindex, lindex, lev, comboBrandProductObjectPassed) {
            // console.log($scope.newApp.aptDate);
           // console.log(weekDayWeekendCheck($scope.newApp.aptDate, comboBrandProductObjectPassed.weekDay));
            if (weekDayWeekendCheck($scope.newApp.aptDate, comboBrandProductObjectPassed.weekDay)) { //function checks this deal is available on the date of appointment or not
                $scope.addNewService(index, tindex, lindex, lev, comboBrandProductObjectPassed);
            } else {
                alert('This deal is not available on the date you are trying to book')
            }
            //$scope.addNewService(index,tindex,lindex,lev,ComboBrandProductObjectPassed);
        }
        $scope.finalComboNewComboPrice = 0;
        $scope.modifyServicesPopUp = function(appt) {
            $('#modifyServices').modal('show');
            $scope.editApptServicesAppt = appt;


        };
        $scope.modifyServices = function(appt) {
            $('#modifyServices').modal('hide');
            // console.log($scope.editApptServicesAppt.services);
            // console.log($scope.editApptServicesAppt.appointmentId);
            $http.post("/role3/changeQuantityInAppointment", { "services": $scope.editApptServicesAppt.superSetServices, "appointmentId": $scope.editApptServicesAppt.appointmentId }).success(function(response, status) {
                // console.log('presentEmployees THE BEGINING CALL', response.data);
                refreshAppointments();
                alert("Appointment Revised");
            });


        };
        $scope.$watch('comboCart.price', function() {

            //console.log('original price----------  '+$scope.comboCart.price+' slabId '+$scope.comboCart.slabId);
            if ($scope.comboCart != null) {
                $scope.finalComboNewComboPrice = angular.copy($scope.comboCart.price);
                //console.log($scope.comboCart);

                slabs.find(function(slabElement) {
                    if (slabElement._id == $scope.comboCart.slabId) {
                        slabElement.ranges.find(function(rangeElement) {
                            if ((rangeElement.range1 < $scope.comboCart.price) && ($scope.comboCart.price <= rangeElement.range2)) {
                                $scope.finalComboNewComboPrice = Math.ceil(angular.copy($scope.comboCart.price * ((100 - rangeElement.discount) / 100)));
                               // console.log('discount ---------- ' + rangeElement.discount);
                            }
                        })
                    }
                })
            }


        }, true);
        $scope.sendSubOTP=function(user,apptId){
            $('#availSubscription').modal('show');
            $http.post("/role3/sendOtpForSubscription", { 'userId':user.id,"appointmentId":apptId }).success(function(response, status) {
               // console.log('send otp api called',{ 'userId':user.id,"appointmentId":apptId } );
                $scope.subscriptionApptId=apptId;
                $scope.subscriptionUserId=user.id;
            });


        }
        $scope.applySubOTP=function(otp){
           // console.log("submit otp called",{ appointmentId:$scope.subscriptionApptId,otp:otp,userId:$scope.subscriptionUserId});
            $http.post("/role3/verifyOtpForSubscription", { appointmentId:$scope.subscriptionApptId,otp:otp,userId:$scope.subscriptionUserId}).success(function(response, status) {
                // console.log('send otp api called', response.data);
                if(response.success){
                    refreshAppointments();
                    alert("Subscription Used Successfully");
                    $('#availSubscription').modal('hide');
                }
                else {
                    alert(response.message);
                    $('#availSubscription').modal('hide');
                }
            });
        }
        $scope.ceilFunction=function(number){
            var result=number*((100+$scope.parlorTax)/100)
            return Math.ceil(result)
        }
        $scope.$watch("newApp.erpDiscount",function(newValue,oldValue){
            // console.log("watch chala",newValue);
            if(newValue== undefined){
                $scope.newApp.erpDiscount=0
            }
            calculateTotal();
           });
            $scope.addService=function(service,factor){
               // console.log("service check",service , $scope.user.useOldCredits)
                if(service.categoryId=="3"){
                    var obj={
                        categoryId:service.categoryId,
                        price:parseInt(service.price),
                        estimatedTime:0,
                        code:service.itemId,
                        serviceCode:service.itemId,
                        actualServiceId:service.Id,
                        serviceId:service.Id,
                        uniqueCartId:service.Id,
                        quantity:1,
                        name:service.name,
                        additions:0,
                        brandId:"",
                    }
                    // console.log("service function",service);
                    $scope.addServiceToCart(obj,service.price,factor)                    
                }
                else if(service.categoryId=="2"){
                    var obj={
                        categoryId:service.categoryId,
                        price:parseInt(service.price),
                        estimatedTime:service.validFor,
                        code:service.itemId,
                        serviceCode:service.membershipId,
                        actualServiceId:service.membershipId,
                        serviceId:service.membershipId,
                        uniqueCartId:service.membershipId,
                        quantity:1,
                        name:service.name,
                        additions:0,
                        brandId:"",
                    }
                    $scope.addServiceToCart(obj,service.price,factor)                    
                }else if((service.prices[0].brand.brands.length>1) || (service.dealId==null && service.prices[0].additions.length) || (service.prices[0].additions.length && $scope.user.useOldCredits)){
                    if(service.prices[0].brand.brands.length>1)
                    service.prices[0].brand.brands[0].checked=true
                    if(service.dealId==null && service.prices[0].additions.length)
                    service.prices[0].additions[0].types[0].checked=true
                    $scope.s.selectedAddition=0;
                    $scope.s.selectedBrand='';
                    $scope.modalService=service;
                    $scope.modalServiceFactor=factor;
                    $('#selectBrandOrAddition').modal('show');

                }else{
                    var price=0;
                   // console.log("in else in add")
                    if(service.prices[0].brand.brands.length==1){
                        price=parseInt(service.prices[0].brand.brands[0].price* (1 + $scope.parlorTax/100));
                        service.uniqueCartId=(service.serviceId+service.prices[0].brand.brands[0].brandId)
                    }
                    else{
                        price=service.dealPrice?parseInt(service.dealPrice* (1 + $scope.parlorTax/100)):parseInt(service.prices[0].price* (1 + $scope.parlorTax/100))
                        service.uniqueCartId=service.serviceId;
                        if($scope.user.useOldCredits)price=service.prices[0].price* (1 + $scope.parlorTax/100)
                    }
                    $scope.addServiceToCart(service,price,factor)

                }
            }
            $scope.addServiceToCart=function(service,price,factor){
               // console.log("add service to cart function",service,price)
                
                var serviceObj={
                    categoryId:service.categoryId,
                    price:$scope.user.useOldCredits?(parseInt(((service.prices[0].price?service.prices[0].price:service.price)+(service.additions?service.additions:0))*(1 + $scope.parlorTax/100))):parseInt(price),
                    estimatedTime:service.estimatedTime,
                    serviceCode:service.serviceCode,
                    actualServiceId:service.serviceId,
                    dealId:service.dealId,
                    serviceId:((service.dealId==null || $scope.user.useOldCredits)?service.serviceId:service.dealId),
                    uniqueCartId:service.uniqueCartId,
                    quantity:1,
                    priceWithoutDeal:service.prices[0].price,
                    priceWithDeal:parseInt(price),
                    name:service.name,
                    type:"service",
                    code:service.serviceCode,
                    additions:service.additions?service.additions:0,
                    brandId:service.brandId?service.brandId:null,
                    dealType:service.dealType?service.dealType:null
                }

                $scope.addQuantityToService(service.categoryId,serviceObj.actualServiceId,factor)
                var present=false;
                var index=0;
                $scope.cartTotal=$scope.cartTotal +(serviceObj.price*factor);
                $scope.newPayableAmount=$scope.cartTotal
                $scope.cart.forEach(function(element,i) {
                    if(element.uniqueCartId==serviceObj.uniqueCartId){
                        present=true;
                        index=i
                    }
                }, this);
                if(!present){
                    // console.log("inserting object",serviceObj);
                    
                    if(factor ==1){
                        $scope.billingEmployees.forEach(function(element) {
                            if(element.categoryId==service.categoryId){
                                serviceObj.employees=angular.copy(element.employees);
                                
                            }
                        }, this);
                        serviceObj.selectedEmployees=[];
                        // console.log("inserting object",serviceObj);
                        $scope.cart.push(serviceObj);
                        $scope.numberOfServices++;

                    }
                }else{
                    if($scope.cart[index].quantity==1 && factor==-1){
                        $scope.cart.splice(index,1)
                        $scope.numberOfServices--;
                    }else{
                        $scope.cart[index].quantity=$scope.cart[index].quantity+(1*factor);
                        $scope.numberOfServices=$scope.numberOfServices+(1*factor);
                    }
                    
                }

            }
            $scope.addServiceCart=function(service,index){
                // console.log("cart",service,index);
                $scope.cart[index].quantity++;
                $scope.numberOfServices++;
                $scope.cartTotal+=service.price;
                $scope.addQuantityToService(service.categoryId,service.actualServiceId,1)
            }
            $scope.removeServiceCart=function(service,index){
                // console.log("cart",service,index);
                $scope.numberOfServices--;
                $scope.cartTotal-=service.price;
                $scope.addQuantityToService(service.categoryId,service.actualServiceId,-1)
                if(service.quantity==1){
                    $scope.cart.splice(index,1)
                }else{
                    $scope.cart[index].quantity--;
                }
                
            }
            $scope.addModalService=function(service){
                if($scope.s.selectedBrand!='')
                $scope.s.selectedBrand=JSON.parse($scope.s.selectedBrand)
                // console.log("modeal service callled",service)
                // console.log("modeal service callled",$scope.s.selectedBrand)
                // console.log("modeal service callled",$scope.s.selectedAddition);
                $('#selectBrandOrAddition').modal('hide');
                var price=0;
                if($scope.s.selectedBrand!=''){
                    price=parseInt($scope.s.selectedBrand.price* (1 + $scope.parlorTax/100))
                    service.uniqueCartId=service.serviceId+$scope.s.selectedBrand.brandId;
                    service.brandId=$scope.s.selectedBrand.brandId;
                    // console.log("add service to cart modal ",service)
                    $scope.addServiceToCart(service,price,$scope.modalServiceFactor)
                }else{
                    // console.log("in else")
                    price= parseInt((service.prices[0].price+parseInt($scope.s.selectedAddition))* (1 + $scope.parlorTax/100))
                    service.uniqueCartId=service.serviceId+$scope.s.selectedAddition;
                    service.additions=parseInt($scope.s.selectedAddition);
                    $scope.addServiceToCart(service,price,$scope.modalServiceFactor) 
                }
            }
            $scope.calculatePrice=function(service){

            }
            $scope.sendDisplayPriceForMember=function(service){
                if(service.categoryId==3){
                    return service.price
                }
                else if(service.menuPrice==null && service.categoryId!="2")
                return parseInt(service.price* (1 + $scope.parlorTax/100))
                 else if(service.prices && service.prices[0].brand.brands.length==0)
                    return parseInt(service.prices[0].price* (1 + $scope.parlorTax/100))
                else if(service.prices && service.prices[0].brand.brands.length==1)
                    return parseInt(service.prices[0].price * (1 + $scope.parlorTax/100))
                else if(service.prices && service.prices[0].brand.brands.length>1){
                        var lowest=service.prices[0].brand.brands[0].ratio;
                        service.prices[0].brand.brands.forEach(function(element) {
                            if(element.ratio<lowest)
                                lowest=element.ratio
                        }, this);
                        return parseInt(service.prices[0].price*lowest* (1 + $scope.parlorTax/100))
                    }
                else if(service.dealId==null && service.categoryId!="2")
                return parseInt(service.prices[0].price* (1 + $scope.parlorTax/100))
                
                else if(service.dealId!=null)
                return parseInt(service.prices[0].price* (1 + $scope.parlorTax/100))
             

            }
            $scope.sendDisplayPrice=function(service){

                if(service.categoryId==3){
                    return service.price
                }
                 else if(service.prices && service.prices[0].brand.brands.length==0)
                    return service.dealPrice?parseInt(service.dealPrice* (1 + $scope.parlorTax/100)):parseInt(service.prices[0].price* (1 + $scope.parlorTax/100))
                else if(service.prices && service.prices[0].brand.brands.length==1)
                    return parseInt(service.prices[0].brand.brands[0].price* (1 + $scope.parlorTax/100))
                else if(service.prices && service.prices[0].brand.brands.length>1){
                        var lowest=service.prices[0].brand.brands[0].price;
                        service.prices[0].brand.brands.forEach(function(element) {
                            if(element.price<lowest)
                                lowest=element.price
                        }, this);
                        return parseInt(lowest* (1 + $scope.parlorTax/100))
                    }
                    else if(service.dealId==null && service.categoryId!="2")
                    return parseInt(service.prices[0].price* (1 + $scope.parlorTax/100))
                    else if(service.dealId!=null)
                    return parseInt(service.dealPrice* (1 + $scope.parlorTax/100))
                    else if(service.dealId==null && service.categoryId=="2")
                    return parseInt(service.dealPrice)
                    
            }
            $scope.addQuantityToService=function(categoryId,serviceId,factor){
               // console.log("add service to cart",categoryId,serviceId,factor)
                $scope.newServices.categories.forEach(function(element) {
                    if(element.categoryId==categoryId || categoryId=="1"){
                        element.services.forEach(function(ser){
                            if(ser.serviceId==serviceId){
                                ser.quantity=ser.quantity?ser.quantity+(1*factor):1
                            }
                        })
                    }
                }, this);
            }
            $scope.addPlusSign=function(service){
                if(service.prices[0].additions[0].types.length>0)
                return "+"
                else if(service.prices[0].brand.brands.length>1)
                return "+"
                else 
                return " "
            }
            $scope.bookAppointment=function(){
                // console.log("inside function");
                if($scope.cartTotal)$scope.paymentMethod=$scope.selectedPaymentMethod[0].value
                
                $scope.newAppointmentObject={
                    aptDate: new Date(),
                    erpDiscount:0,
                    otp:"8826",
                    services:$scope.cart,              
                    user:$scope.user,
                    appointmentId:$scope.editAppointmentId,
                    useMembershipCredits:$scope.user.useOldCredits,
                    personalCouponCode:$scope.personalCouponCode
                };
               // console.log("new appt object", $scope.newAppointmentObject,$scope.selectedPaymentMethod);
                $http.post("/role3/newAppointment", { data: $scope.newAppointmentObject, appointmentType: $scope.appointmentType, paymentMethod: $scope.paymentMethod,allPaymentMethods:$scope.selectedPaymentMethod }).success(function(response, status) {
                    var data = response.data;
                    var appId=data.appointmentId;
                    // console.log(data);
                    alert("Appointment has been successfully booked");
                    if ($scope.newApp.appointmentId) {
                        appointments[editAppointmentIndex] = angular.copy(response.data);
                    } else {
                        appointments.push(response.data);
                    }
                    if(appId==undefined)
                    {
                        appId=$scope.newApp.appointmentId;
                    }
                    // console.log("apptid new",appId);
                    $scope.clearVariables();
                    $scope.tabs[0].active = true;
                    // $http.post("/role3/sendShortUrlSms", {phoneNumber: $scope.newApp.user.phoneNumber,subtotal: data.subtotal,noOfService: $scope.newApp.services.length,appointmentId:appId }).success(function(response, status) {
    
                    //     console.log(response);
                    // });
                    // if (check == 2) {
                    //     $scope.caOtp(response.data);
                    // };
                    $scope.appointments = appointments;
                    $scope.cancel();
                    refreshAppointments();
                });
            }
            $scope.completeAppointment=function(){
                // console.log("inside function")
            }
            $scope.selectPayment=function(){
                // console.log("inside function");
                $('#paymentMethod').modal('show');
            }
            
            $scope.checkPaymentMethod=function(method){
                // console.log("payment method change closed",method);
                $scope.selectedPaymentMethod=method
               // console.log("payment method change closed", $scope.selectedPaymentMethod);
                $scope.selectedPaymentMethod[0].amount=$scope.cartTotal
            }
            $scope.submitPaymentMethod=function(paymentMethods){
               // console.log("payment array",paymentMethods);
                var total=0;
                $scope.paymentButtonText="Payment Method is "
                paymentMethods.forEach(function(element) {
                     $scope.paymentButtonText+=element.name + ", "
                    total+=element.amount
                }, this);
                if(total==$scope.cartTotal){
                    $('#paymentMethod').modal('hide');
                }else{
                    alert("Total should be equal to Rs." + $scope.cartTotal)
                }
                
            }
            $scope.openNearBuyModal=function(){
               // console.log("nearbuy coupon clicked");
                $('#nearBuyModal').modal('show');
            }
            $scope.submitNearBuyCoupon=function(code){
               console.log("nearbuy coupon clicked");
               if(code.indexOf("SAL") > -1){
                console.log("inside personal coupon code",code);
                $http.get("/role3/getPersonalCouponDetail?couponCode="+code).success(function(response, status) {
                    var data = response.data;
                    console.log("data",data)
                    if (data) {
                        var percentageOff=data.percentOff;
                        console.log("cart total before",$scope.cartTotal,$scope.newPayableAmount,percentageOff)
                        alert("Coupon Applied Successfully");
                        $('#nearBuyModal').modal('hide');
                        if($scope.cartTotal*(data.percentOff/100)>=data.maxOff){
                            percentageOff=(data.maxOff*100)/$scope.cartTotal;
                        }
                        $scope.personalCouponApplied=true;
                        $scope.personalCouponCode=code;
                        // $scope.newApp.couponCode=$scope.newApp.couponCode+temp;
                        $scope.newPayableAmount=Math.ceil($scope.cartTotal*(1-(percentageOff/100))) ;
                        $scope.cartTotal =Math.ceil($scope.cartTotal*(1-(percentageOff/100))) ;
                        console.log("cart total",$scope.cartTotal,$scope.newPayableAmount,percentageOff)
                        $scope.cart.forEach(function(element) {
                            element.serviceDiscount=percentageOff;
                        }, this);
                        console.log("cart changed",$scope.cart)
                        //$scope.newApp.personalCouponCode=$scope.newApp.couponCode;
                    }
                });
            }
            }
            $scope.isteveClick = function(employees,index) {
               // console.log("employee selected",employees);
                if(employees.length==0){
                    $scope.cart[index].employee1=[];
                    $scope.showEmployeeError=true;
                }
                if(employees.length>1){
                    $('#revenueDistribution').modal('show');
                    $scope.multipleEmployees=employees;
                    $scope.multipleRevenueIndex=index;
                }else{
                    $scope.cart[index].employee1=[{
                        dist:100,userId:employees[0].employeeId}]
                }
            };
            $scope.submitMultipleEmployeeRevenue=function(){
               // console.log("multiple",$scope.multipleEmployees);
                var total=0;
                $scope.multipleEmployees.forEach(function(element) {
                    total+=element.dist
                }, this);
                if(total==100){
                    $('#revenueDistribution').modal('hide');
                   // console.log("index",$scope.multipleRevenueIndex)
                    $scope.cart[$scope.multipleRevenueIndex].employee1=$scope.multipleEmployees;
                    console.log("cart",$scope.cart,$scope.multipleRevenueIndex)
                }else{
                    alert("Total distribution percentage should be 100")
                }
                //$('#nearBuyModal').modal('show');
            }
            $scope.caClick = function(index) {
                 $scope.clearVariables();
                // console.log("appts are",appointments);
                $scope.numberOfServices=$scope.cart=0;
                $scope.showPaymentError=false;
                $scope.showEmployeeError=false;
                $scope.showCustomerDetailsError=false;
                $scope.appointments1  = angular.copy(appointments);
                $scope.editAppointment=angular.copy(appointments[index]);
                $scope.tabs[1].active = true;
                $scope.editAppointmentId=$scope.editAppointment.appointmentId;
                // console.log("edited appt is ",$scope.appointments1[index]);
                $scope.user = $scope.editAppointment.client;
                $scope.cart=angular.copy($scope.editAppointment.services);
                $scope.newApp.products = $scope.editAppointment.products;
                $scope.selectedPaymentMethod = $scope.editAppointment.allPaymentMethods;
                if( $scope.editAppointment.allPaymentMethods.length){
                    $scope.paymentButtonText="Payment Method is "
                   $scope.editAppointment.allPaymentMethods.forEach(function(paym){
                        $scope.paymentButtonText+=paym.name + " ";
                        $scope.paymentOptions.forEach(function(option){
                            if(option.value==paym.value)
                                option.isSelected=true;
                                option.amount=paym.amount
                        })
                }) 
               }else{
                     $scope.paymentButtonText="Select Payment Method"
               }
                
                // console.log("eall employees are ",$scope.billingEmployees);
                for (var i = 0; i <  $scope.editAppointment.services.length; i++) {
                    $scope.billingEmployees.forEach(function(category){
                        if(category.categoryId==$scope.editAppointment.services[i].categoryId){
                            $scope.cart[i].employees=angular.copy(category.employees);
                            $scope.cart[i].selectedEmployees=angular.copy(category.employees);
                        }
                    })
                    $scope.cart[i].price=$scope.editAppointment.services[i].price*(1 + $scope.parlorTax/100)
                     $scope.cart[i].uniqueCartId=$scope.editAppointment.services[i].serviceId
                     $scope.cart[i].actualServiceId=$scope.editAppointment.services[i].serviceId
                     $scope.cart[i].serviceId=$scope.editAppointment.services[i].dealId?$scope.editAppointment.services[i].dealId:$scope.editAppointment.services[i].serviceId
                    if($scope.editAppointment.services[i].brandId){
                     $scope.cart[i].uniqueCartId+=$scope.editAppointment.services[i].brandId   
                    }
                    // console.log("function called of adding service")
                    $scope.addQuantityToService($scope.editAppointment.services[i].categoryId,$scope.editAppointment.services[i].serviceId,1)
                    $scope.cartTotal+=($scope.editAppointment.services[i].price*$scope.editAppointment.services[i].quantity*(1 + $scope.parlorTax/100)
                        )
                    $scope.numberOfServices+=$scope.editAppointment.services[i].quantity;
                        
                        $scope.cart[i].employees.forEach(function(emp){
                            $scope.editAppointment.services[i].employees.forEach(function(actualEmp){
                                if(actualEmp.employeeId==emp.employeeId){
                                    emp.isSelected=true;
                                    emp.dist=actualEmp.distribution
                                }
                            })  

                    })
                }
                if($scope.editAppointment.couponCode){
                    $scope.newApp.couponCode=$scope.editAppointment.couponCode;
                    $scope.newApp.couponCode01=$scope.editAppointment.couponCode;
                    $scope.applyCoupon();
                }
                // console.log($scope.cart);
                // console.log("payment method",$scope.selectedPaymentMethod)
            };
            $scope.clearVariables=function(){
                $scope.paymentButtonText="";
                $scope.cart=[];
                $scope.editAppointmentId=null;
                $scope.user={};
                $scope.cartTotal=0;
                $scope.numberOfServices=0;
                $scope.selectedPaymentMethod=[];
                $scope.newServices.categories.forEach(function(element) {
                        element.services.forEach(function(ser){
                                ser.quantity=0;
                        })
                    
                }, this);
            }
            $scope.$watch("cart",function(newValue,oldValue){
                 console.log("cart changed in watch",$scope.cart)
                $scope.showEmployeeError=false;
                $scope.cartTotal=0;
                $scope.numberOfServices=0;
                 $scope.cart.forEach(function(item){
                    $scope.cartTotal+=item.price;
                    $scope.numberOfServices+=item.quantity;
                    if(item.employee1.length==0){
                        $scope.showEmployeeError=true
                    }
                })
                if($scope.personalCouponApplied){
                    $scope.cartTotal =Math.ceil($scope.cartTotal*(1-($scope.cart[0].serviceDiscount/100))) ;
                }
                 // console.log("employee error",$scope.showEmployeeError)
             },true);

            $scope.$watch("selectedPaymentMethod",function(newValue,oldValue){
                if($scope.selectedPaymentMethod.length>0 && $scope.cartTotal>0 )
                $scope.showPaymentError=false
           });
           $scope.$watch("user.useOldCredits",function(newValue,oldValue){
            if($scope.user.useOldCredits){
                $scope.user.membershipId=$scope.user.membership[0].membershipId;
                $scope.user.credits=$scope.user.membership[0].creditsLeft
            }else{
            }           
       });
           $scope.useOldCreditsFunction=function(){
              // console.log("use credits",$scope.user.useOldCredits);
               $scope.applyOldCredits();
           }
            $scope.applyOldCredits=function(){
                if($scope.user.useOldCredits){
                    // console.log("cart",$scope.cart);
                    $scope.cart.forEach(function(item){
                        item.serviceId=item.actualServiceId;
                        item.price=item.priceWithoutDeal;
                    })
                }else{
                   // console.log("dont use old credits");
                   $scope.cart.forEach(function(item){
                    item.serviceId=item.dealId?item.dealId:item.actualServiceId;
                    item.price=item.priceWithDeal;
                })
                }
                
            }
            $scope.applyMembershipCredits = function(value) {
                $scope.newApp.useMembershipCredits = value;
                // console.log("membership value",value)
                $scope.memObj={
                    aptDate: new Date(),
                    erpDiscount:0,
                    otp:"8826",
                    services:$scope.cart,              
                    user:$scope.user,
                    appointmentId:$scope.editAppointmentId,
                    useMembershipCredits:1
                };
                // console.log("obj", $scope.memObj)
                if (value) {
                    $http.post("/role3/newAppointmentMembership", { data: $scope.memObj }).success(function(response, status) {
                        var data = response.data;
                        // console.log("membership response of api",data);
                        $scope.newApp.membershipCreditsLeft = data.creditsLeft;
                        $scope.newApp.membershipCreditsUsed = Math.ceil(data.creditsUsed*(1 + $scope.parlorTax/100));
                        $scope.creditsUsed = data.creditsUsed;
                        $scope.newPayableAmount=data.payableAmount;
                        $scope.cartTotal=parseInt(data.payableAmount);
                        $scope.membershipApplied=true;
                        if(data.payableAmount){
                            $scope.paymentLeftAfterMembership=true
                            
                        }else{
                            $scope.showPaymentError=false
                        }
                        alert("Membership Applied Successfully")
                    });
                } else {
                    $scope.newApp.membershipCreditsLeft = $scope.newApp.user.credits;
                    $scope.newApp.membershipCreditsUsed = 0;
                }
            };
            $scope.mergeMembership=function(){
                
            }
    });
