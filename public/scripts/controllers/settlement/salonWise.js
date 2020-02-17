angular.module('sbAdminApp')

    .controller('salonWise', function($scope, $http, $stateParams, $window, NgTableParams, $q, $timeout,Excel) {

        $scope.Math = window.Math;
        $scope.salonInvoiceContent = '';
        $scope.beUInvoiceContent = '';
        $scope.selectedParlor = '';
        $scope.loginRole = role;
        $scope.loginUserType = userType;
        $scope.today = function() {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function() {
            $scope.dt = null;
        };

            $scope.changeColor=function(a){
                  //  console.log("check   valu "+a)
                if($scope.data.length==a+1){
                   // console.log("checkiiy")
                    return "settlement" ;
                }

                else{
                    return false;
                }
            }


        $scope.toggleMin = function() {
            $scope.minDate = new Date(2017, 0, 1)
        };
        $scope.toggleMin();
        $scope.maxDate = new Date(2020, 5, 22);

        $scope.open = function($event) {
            $scope.status.opened = true;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate', 'MMM'];
        $scope.format = $scope.formats[4];

        $scope.status = {
            opened: false
        };



        // alert(role+' '+userType+' '+parlorName)
        if ((role == 2 || role == 7) && (userType == 0)) {
            $scope.selectedParlor=parlorId;
            console.log("date",$scope.dt);
            $scope.req={
                month:$scope.dt.getMonth(),
                year: $scope.dt.getFullYear()
            }
      //  console.log($scope.data)
            $http.post('/role3/settlementLedger',$scope.req)
                .success(function(res){
                //console.log('HI',res)
                $scope.ledgerData=res.data;
                console.log("ledger data",$scope.ledgerData);
                $scope.totalAmountAdjusted=0;
                $scope.totalAmountPaid=0;
            })
            $http.get("/role2/settlementReport?parlorId="+parlorId+"&date="+$scope.dt).success(function(response, status) {
                var a = {}
                for(var c in response.data[0]){
                                if(angular.isNumber(response.data[0][c])){
                                    a[c]=0;
                                }
                }

                            response.data.forEach(function(b,i) {
                     for(var d in a){
                                      a[d]+=b[d]
                         }
                                if(response.data.length==i+1){
                                    a.previousDue=null;
                                    a.activity=true;
                                    a.color="red";
                                    a.fontColor="white"
                                    a.balance=0;
                                    a.balance=b.balance;
                                                }
                                    })


                $scope.data = response.data;
                if($scope.data.length>0){
                    $scope.data.push(a)
                }
                // console.log('Hi',$scope.data);
            });
        } else {

            // console.log($scope.selectedParlor);
            $http.post("/role1/parlorList").success(function(response, status) {
                $scope.parlors = response.data;
                // console.log($scope.parlors);
                $scope.selectedParlor = $scope.parlors[0].parlorId;
                // console.log($scope.selectedParlor);
                $http.get("/role2/settlementReport?parlorId="+$scope.selectedParlor+"&date="+$scope.dt).success(function(response, status) {
                    $scope.data = response.data;
                    // console.log($scope.data);
                       var a = {}
                                for(var c in response.data[0]){
                                                if(angular.isNumber(response.data[0][c])){
                                                    a[c]=0;
                                                }
                                }
                
                response.data.forEach(function(b,i) {
                  for(var d in a){
                                a[d]+=b[d];
                  }
                  if(response.data.length==i+1){
                    a.previousDue=null;
                    a.activity=true;
                    a.color="red";
                    a.fontColor="white"
                    a.balance=0;
                    a.balance=b.balance;
                  }
                })

                if($scope.data.length>0){
                    $scope.data.push(a)
                }
              


                // console.log(a)

                });

            });
        }


        $scope.parlorChanged = function(id) {



            console.log("date",$scope.dt);
            $scope.req={
                month:$scope.dt.getMonth(),
                year: $scope.dt.getFullYear()
            }
      //  console.log($scope.data)
        $http.post('/role3/settlementLedger',$scope.req)
        .success(function(res){
            //console.log('HI',res)
            $scope.ledgerData=res.data;
            console.log("ledger data",$scope.ledgerData);
            $scope.totalAmountAdjusted=0;
            $scope.totalAmountPaid=0;
        })
            $http.get("/role2/settlementReport?parlorId="+id+"&date=" + $scope.dt).success(function(response, status) {
                var a = {}
                                for(var c in response.data[0]){
                                                if(angular.isNumber(response.data[0][c])){
                                                    a[c]=0;
                                                }
                                }
                
                response.data.forEach(function(b,i) {
                  for(var d in a){
                                a[d]+=b[d]
                  }
                  if(response.data.length==i+1){
                    a.previousDue=null;
                    a.activity=true;
                    a.color="red";
                    a.fontColor="white"
                    a.balance=0;
                    a.balance=b.balance;
                }
                })


                    // console.log(a);

                $scope.data = response.data;
                if($scope.data.length>0){
                    $scope.data.push(a)
                }
              

                // $scope.data.push(a);


                // console.log($scope.data);
            });
        };

        





        $scope.periods = [{ "date": "1-Jan to 15-jan", "value": 1 }, { "date": "16-Jan to 31-jan", "value": 2 }, { "date": "1-Feb to 15-Feb", "value": 3 }, { "date": "16-Feb to 28-Feb", "value": 4 }, { "date": "1-Mar to 15-Mar", "value": 5 }, { "date": "16-Mar to 31-Mar", "value": 6 }, { "date": "1-April to 4-April", "value": 7 }, { "date": "5-April to 7-April", "value": 8 }];

        $scope.status = function(amount) {
            // console.log(amount);
            if (amount != undefined) {
                if (amount <= 0)
                    return "Added to Pending Amount"
                else
                    return "Paid"

            } else {
                return "Settled"
            }
        }


        /* $scope.d=12785;
         $scope.a=1790;
         $scope.b=64;
         $scope.c=64;
         $scope.amount=$scope.a+$scope.b+$scope.c+$scope.d;*/
        $scope.amount = '';
        $scope.convertNumberToWords1 = function(num) {
            return convertNumberToWords(num);
        };

        // console.log($scope.amount);

        function convertNumberToWords(amount) {
            var words = new Array();
            words[0] = '';
            words[1] = 'One';
            words[2] = 'Two';
            words[3] = 'Three';
            words[4] = 'Four';
            words[5] = 'Five';
            words[6] = 'Six';
            words[7] = 'Seven';
            words[8] = 'Eight';
            words[9] = 'Nine';
            words[10] = 'Ten';
            words[11] = 'Eleven';
            words[12] = 'Twelve';
            words[13] = 'Thirteen';
            words[14] = 'Fourteen';
            words[15] = 'Fifteen';
            words[16] = 'Sixteen';
            words[17] = 'Seventeen';
            words[18] = 'Eighteen';
            words[19] = 'Nineteen';
            words[20] = 'Twenty';
            words[30] = 'Thirty';
            words[40] = 'Forty';
            words[50] = 'Fifty';
            words[60] = 'Sixty';
            words[70] = 'Seventy';
            words[80] = 'Eighty';
            words[90] = 'Ninety';

            amount = amount.toString();
            var atemp = amount.split(".");
            var number = atemp[0].split(",").join("");
            var n_length = number.length;
            var words_string = "";
            if (n_length <= 9) {
                var n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
                var received_n_array = new Array();
                for (var i = 0; i < n_length; i++) {
                    received_n_array[i] = number.substr(i, 1);
                }
                for (var i = 9 - n_length, j = 0; i < 9; i++, j++) {
                    n_array[i] = received_n_array[j];
                }
                for (var i = 0, j = 1; i < 9; i++, j++) {
                    if (i == 0 || i == 2 || i == 4 || i == 7) {
                        if (n_array[i] == 1) {
                            n_array[j] = 10 + parseInt(n_array[j]);
                            n_array[i] = 0;
                        }
                    }
                }
                var value = "";
                for (var i = 0; i < 9; i++) {
                    if (i == 0 || i == 2 || i == 4 || i == 7) {
                        value = n_array[i] * 10;
                    } else {
                        value = n_array[i];
                    }
                    if (value != 0) {
                        words_string += words[value] + " ";
                    }
                    if ((i == 1 && value != 0) || (i == 0 && value != 0 && n_array[i + 1] == 0)) {
                        words_string += "Crores ";
                    }
                    if ((i == 3 && value != 0) || (i == 2 && value != 0 && n_array[i + 1] == 0)) {
                        words_string += "Lakhs ";
                    }
                    if ((i == 5 && value != 0) || (i == 4 && value != 0 && n_array[i + 1] == 0)) {
                        words_string += "Thousand ";
                    }
                    if (i == 6 && value != 0 && (n_array[i + 1] != 0 && n_array[i + 2] != 0)) {
                        words_string += "Hundred";
                    } else if (i == 6 && value != 0) {
                        words_string += "Hundred ";
                    }
                }
                words_string = words_string.split("  ").join(" ");
            }
            return words_string;
        }
        $scope.currentDate = new Date();
        $scope.salonInvoice = function(parlorId, period,index) {
           
            /*var printData='<div class="col-md-12" id="printSectionId"><div style="margin:auto;width:90%;" ><div><img src="https://www.monsoonsalon.com/emailler/images/beu-logo.png" width="150" alt="Beu salons" /></div>'

            printData=printData+'<h3 style="text-align:center;">Invoice</h3><div class="jk">';

            printData=printData+'<table border="1" style="width:100%;border-collapse: collapse;border:1px solid gray;text-align: left;">';

            printData=printData+'<tr><b style="margin-top: 3%;margin-left: 5%;">From</b>';

            printData=printData+'<p style="margin-top: 3%;margin-left: 5%;"><span>{{data.parlorName}}1</span><br>{{data.parlorAddress}}</br>DLF City Phase II, Gurgaon 122008,Haryana</p>';

            printData=printData+'</td>';

            printData=printData+'<td style="margin-top: 3%;padding-left:2%;">Invoice No:</br>Date:</td>';

            printData=printData+' <td colspan="" style="margin-top: 3%;padding-left:2%;">BEU/2016-17/0002</br>2-Feb-17</td>';

            printData=printData+'</tr>';

            printData=printData+'<tr><td  style="margin-top: 3%;padding-left:2%;"><b style="margin-top: 3%;margin-left:0%;">To</b><p style="margin-top: 3%;margin-left:0%;"><span>M/s Gingerpan Swapcart Pvt.Ltd.</span><br>DLF City Phase II, Gurgaon 122008,Haryana</p></td>';

            printData=printData+'<td style="margin-top: 3%;padding-left:2%;">Service Tax No:<br>Pan:</td>';

            printData=printData+'<td style="margin-top: 3%;padding-left:2%;">AAGCG0658KSD001<br>AAGCG0658k</td>';

            printData=printData+'</tr>';

            printData=printData+' <tr></tr>';

            printData=printData+'<tr><td  style="margin-top: 3%;padding-left:2%;">Sr. No.</td><td style="text-align:center;padding-left:2%;">Discription</td><td style="margin-top: 3%;padding-left:2%;">Amount in INR</td></tr>';

            printData=printData+'<tr><td  style="margin-top: 3%;padding-left:2%;">1</td><td style="margin-top: 3%;padding-left:2%;">Management Fees for the period form:<br>16/01/2017 to 31-01-2017<br>(as per settelment report annexed here with)</td><td style="text-align:right;padding-right:2%;">{{d}}</td></tr>';

            printData=printData+'<tr><td></td><td style="text-align:center">Total</td><td style="text-align:right;padding-right:2%;">{{d}} </td> </tr>';

            printData=printData+'<tr><td colspan="2" style="text-align:right;padding-right:4%">Add:Service Tax @ 14%<br>SB @0.5%<br>KKb@0.5%</td><td  style="text-align:right;padding-right:2%;">{{a}}<br>{{b}}<br>{{c}}</td></tr>';

            printData=printData+'<tr><td colspan="2" style="text-align:center;">Grand Total</td><td style="text-align:right;padding-right:2%;" ng-model="myValue"> <span ng-model="myValue">{{ amount}}</span></td></tr>';

            printData=printData+'<tr><td colspan="3" style="margin-top: 3%;padding-left:2%;" id="container" ng-model="num">Rupees<span style="padding-left:5px;">{{convertNumberToWords1(amount)}}</span></td> </tr>';

            printData=printData+'<tr><td colspan="3" style="padding-bottom:2%;">';

            printData=printData+'<h3 style="text-decoration: underline;padding-left:2%;">Bank Details for payment </h3><span style="margin-top: 3%;margin-left:2%;">Name</span><span style="margin-left:145px">: GINGERPAN SWAPCART PVT LTD</span><br>';

            printData=printData+'<span style="margin-top: 3%;margin-left:2%;">Current A/c No</span><span style="margin-left: 89px;">: 50200013283420</span><br>';

            printData=printData+'<span style="margin-top: 3%;margin-left:2%;">Name of bank</span><span style="margin-left: 93px;">: HDCF Bank Ltd</span><br>';

            printData=printData+'<span style="margin-top: 3%;margin-left:2%;">Bank Branch</span><span style="margin-left: 99px;">: B-6/3,Safadarjung Encluve,New Delhi-110029</span><br>';

            printData=printData+'<span style="margin-top: 3%;margin-left:2%;">IFSC Code</span><span style="margin-left:111px">: HDFC0000503</span><br>';

            printData=printData+'<span style="margin-top: 3%;margin-left:2%;">Cheque/DD must be drawn in Favour of <b>"GINGERPAN SWAPCART PVT LTD"</b></span><br>';

            printData=printData+'</td></tr></table></div>';

            printData=printData+'<p>Note:All Disputes shall be subject to Delhi jurisdirection only</p>';

            printData=printData+'<div style="text-align:right;margin-top:20px;"><div><img src="http://res.cloudinary.com/dyqcevdpm/image/upload/v1490268827/Aalenes__DLF-page-001_qf2e6n.png"/></div></div>';

            printData=printData+'</div></div>';*/
            // console.log(parlorId);
            // console.log(period);
            $scope.salonInvoiceContent = '';
            if ((role == 2 || role == 7) && (userType == 0)) {
                $http.post("/role2/settlementInvoice", { invoiceType: 'salon', parlorId: parlorId, period: period }).success(function(response, status) {
                    // console.log(response);
                    $scope.salonInvoiceContent = response.message;
                    $scope.salonInvoiceContent.collectedByLoyalityPoints= $scope.data[index].collectedByLoyalityPoints;
                     $scope.salonInvoiceContent.refundAppDigitalCash= $scope.data[index].refundAppDigitalCash;
                    $scope.amount = (Math.ceil($scope.salonInvoiceContent.totalAmount) + Math.ceil($scope.salonInvoiceContent.serviceTax) + Math.ceil($scope.salonInvoiceContent.sbcTax) + Math.ceil($scope.salonInvoiceContent.kkcTax));
                    $scope.convertNumberToWords1($scope.amount);
                    $timeout(function() {
                        var innerContents = document.getElementById('salonInvoice').innerHTML;
                        var popupWinindow = window.open('', '_blank', 'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                        popupWinindow.document.open();
                        popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + innerContents + '</html>');
                        popupWinindow.document.close();
                    })

                });
            } else {
                $http.post("/role1/settlementInvoice", { invoiceType: 'salon', parlorId: parlorId, period: period }).success(function(response, status) {
                    // console.log(response);
                    $scope.salonInvoiceContent = response.message;
                    
                    $scope.salonInvoiceContent.collectedByLoyalityPoints= $scope.data[index].collectedByLoyalityPoints
                    $scope.amount = (Math.ceil($scope.salonInvoiceContent.totalAmount) + Math.ceil($scope.salonInvoiceContent.serviceTax) + Math.ceil($scope.salonInvoiceContent.sbcTax) + Math.ceil($scope.salonInvoiceContent.kkcTax));
                    $scope.convertNumberToWords1($scope.amount);
                    $timeout(function() {
                        var innerContents = document.getElementById('salonInvoice').innerHTML;
                        var popupWinindow = window.open('', '_blank', 'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                        popupWinindow.document.open();
                        popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + innerContents + '</html>');
                        popupWinindow.document.close();
                    })

                });
            }

        }

        $scope.beUInvoice = function(parlorId, period) {
            // console.log(parlorId);
            // console.log(period);
            $scope.beUInvoiceContent = '';
            if ((role == 2 || role == 7) && (userType == 0)) {
                $http.post("/role2/settlementInvoice", { invoiceType: 'beu', parlorId: parlorId, period: period }).success(function(response, status) {
                    // console.log(response);
                    $scope.beUInvoiceContent = response.message;
                    $scope.amount = (Math.ceil($scope.beUInvoiceContent.totalAmount) + Math.ceil($scope.beUInvoiceContent.serviceTax) + Math.ceil($scope.beUInvoiceContent.sbcTax) + Math.ceil($scope.beUInvoiceContent.kkcTax));
                    $scope.convertNumberToWords1($scope.amount);
                    $timeout(function() {
                        var innerContents = document.getElementById('beuInvoice').innerHTML;
                        var popupWinindow = window.open('', '_blank', 'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                        popupWinindow.document.open();
                        popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + innerContents + '</html>');
                        popupWinindow.document.close();
                    });
                });
            } else {
                $http.post("/role1/settlementInvoice", { invoiceType: 'beu', parlorId: parlorId, period: period }).success(function(response, status) {
                    // console.log(response);
                    $scope.beUInvoiceContent = response.message;
                    $scope.amount = (Math.ceil($scope.beUInvoiceContent.totalAmount) + Math.ceil($scope.beUInvoiceContent.serviceTax) + Math.ceil($scope.beUInvoiceContent.sbcTax) + Math.ceil($scope.beUInvoiceContent.kkcTax));
                    $scope.convertNumberToWords1($scope.amount);
                    $timeout(function() {
                        var innerContents = document.getElementById('beuInvoice').innerHTML;
                        var popupWinindow = window.open('', '_blank', 'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                        popupWinindow.document.open();
                        popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + innerContents + '</html>');
                        popupWinindow.document.close();
                    });
                });
            }

        }

        /*   var obj=[{
               "otherCharges":0,
               "subtotal":150,
               "discount":0,
               "appointmentType":3,
               "paymentMethod":1,
               "couponCode":"0",
               "comment":"",
               "bookingMethod":2,
               "allPaymentMethods":[
                   {"name":'cash',"amount":100},
                   {"name":'card',"amount":200}
               ],
               "membershipDiscount":0,
               "membersipCreditsLeft":0,
               "payableAmount":0,
               "productPrice":0,
               "appointmentId":"58e87f12af2a864a125f68c5",
               "parlorAppointmentId":12799,
               "appointmentStatus":"Upcoming",
               "creditUsed":0,
               "tax":0,
               "status":1,
               "isPaid":false,
               "startsAt":"2017-04-21T05:30:00.000Z",
               "estimatedTime":15,
               "loyalityPoints":150,
               "services":[
                   {
                       "name":"Male Hair Cut",
                       "price":150,
                       "actualPrice":350,
                       "employees":[

                       ],
                       "estimatedTime":15,
                       "additions":0,
                       "quantity":1,
                       "count":1,
                       "typeIndex":null,
                       "code":52,
                       "discount":150,
                       "tax":15,
                       "membershipDiscount":0,
                       "creditsUsed":0,
                       "dealId":null,
                       "serviceId":"58707eda0901cc46c44af2eb",
                       "type":"deal",
                       "dealPriceUsed":true,
                       "employee1":[

                       ],
                       "$$hashKey":"object:732"
                   },
                   {
                       "name":"Mooh Dhulayi",
                       "price":150,
                       "actualPrice":350,
                       "employees":[

                       ],
                       "estimatedTime":15,
                       "additions":0,
                       "quantity":1,
                       "count":1,
                       "typeIndex":null,
                       "code":52,
                       "discount":150,
                       "tax":15,
                       "membershipDiscount":0,
                       "creditsUsed":0,
                       "dealId":null,
                       "serviceId":"58707eda0901cc46c44af2eb",
                       "type":"deal",
                       "dealPriceUsed":true,
                       "employee1":[

                       ],
                       "$$hashKey":"object:732"
                   }
               ],
               "products":[

               ],
               "advanceCredits":0,
               "parlorName":"Aalenes",
               "otp":"8553",
               "client":{
                   "noOfAppointments":0,
                   "id":"58e87e5baf2a864a125f68ac",
                   "phoneNumber":"9999464168",
                   "gender":"M",
                   "customerId":14791,
                   "name":"Sai Manik "
               },
               "employees":[

               ],
               "parlorAddress":"F-46, UGF",
               "$$hashKey":"object:720"
           }]

               var arrayCsv=[];


               for(var i=0;i<obj.length;i++){
                   var obj1={
                       "parlorName":'',
                       "startsAt":'',
                       "appointmentId":'',
                       "clientName":'',
                       "clientPhoneNumber":'',
                       "services":'',
                       "payableAmount":'',
                       "paymentMethod":'',
                       "loyalityPoints":'',
                       "couponCode":''
                   }
                   var servicesString='';
                   var paymentString='';
                   obj1.parlorName=obj[i].parlorName;
                   var timeConversion=obj[i].startsAt
                   obj1.startsAt=new Date(timeConversion).toLocaleDateString();
                   obj1.appointmentId=obj[i].appointmentId;
                   obj1.clientName=obj[i].client.name;
                   obj1.clientPhoneNumber=obj[i].client.phoneNumber;
                   obj1.payableAmount=obj[i].payableAmount;
                   obj1.loyalityPoints=obj[i].loyalityPoints;
                   obj1.couponCode=obj[i].couponCode;
                   for(var j=0;j<obj[i].allPaymentMethods.length;j++){
                       paymentString=paymentString+obj[i].allPaymentMethods[j].name+' '
                   }
                   obj1.paymentMethod=paymentString;
                   for(var j=0;j<obj[i].services.length;j++){
                       servicesString=servicesString+obj[i].services[j].name+' ';
                   }
                   obj1.services=servicesString;
                   arrayCsv.push(obj1);
                   console.log("array csv");
                   console.log(arrayCsv)
               }*/
        $scope.makeCSVData = makeCSVData;
        var arrayCsv = [];
        var index = 0;
        var parameters = {
            page: 1
        };

        var settings = {
            counts: [],
            dataset: arrayCsv
        };
        //$log.debug('Params : ',$scope.tableParams)?parlorId="+parlorId+"&period="+period;

        function makeCSVData(parlorId, period) {
            // console.log(parlorId + " " + period);
            var deferred = $q.defer();
            if ((role == 2 || role == 7) && (userType == 0)) {
                $http.post("/role2/getSettlementAppointments", { parlorId: parlorId, period: period })
                    .then(function(res) {
                        $q.when(res).then(function() {
                            arrayCsv = [];
                            // console.log(res);
                            var obj = res.data.data;

                            for (var i = 0; i < obj.length; i++) {
                                var obj1 = {
                                    "parlorName": '',
                                    "startsAt": '',
                                    "appointmentId": '',
                                    "clientName": '',
                                    "clientPhoneNumber": '',
                                    "services": '',
                                    "payableAmount": '',
                                    "paymentMethod": '',
                                    "loyalityPoints": '',
                                    "couponCode": ''
                                }
                                var servicesString = '';
                                var paymentString = '';
                                obj1.parlorName = obj[i].parlorName;
                                var timeConversion = obj[i].startsAt
                                obj1.startsAt = new Date(timeConversion).toLocaleDateString();
                                obj1.appointmentId = obj[i].appointmentId;
                                obj1.clientName = obj[i].client.name;
                                obj1.clientPhoneNumber = obj[i].client.phoneNumber;
                                obj1.payableAmount = obj[i].payableAmount;
                                obj1.loyalityPoints = obj[i].loyalityPoints;
                                obj1.couponCode = obj[i].couponCode;
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
                                // console.log("array csv");
                                // console.log(arrayCsv)
                            }
                            $scope.tableParams = new NgTableParams(parameters, settings);
                            var csvData = arrayCsv;
                            csvData.unshift({ "Parlor Name": 'parlorName', "Appt. Date": 'startsAt', "Appt. Id": 'appointmentId', "Customer Name": 'clientName', "Customer Mobile": 'clientPhoneNumber', "Services": 'services', "Payable Amount": 'payableAmount', "Payment Method": 'paymentMethod', "Loyalty Points": 'loyalityPoints', "Coupon Code Used": 'couponCode' });
                            deferred.resolve(csvData);
                        });
                    }, function(res) {
                        deferred.reject();
                    });
                return deferred.promise;
            } else {
                $http.post("/role1/getSettlementAppointments", { parlorId: parlorId, period: period })
                    .then(function(res) {
                        $q.when(res).then(function() {
                            arrayCsv = [];
                            // console.log(res);
                            var obj = res.data.data;

                            for (var i = 0; i < obj.length; i++) {
                                var obj1 = {
                                    "parlorName": '',
                                    "startsAt": '',
                                    "appointmentId": '',
                                    "clientName": '',
                                    "clientPhoneNumber": '',
                                    "services": '',
                                    "payableAmount": '',
                                    "paymentMethod": '',
                                    "loyalityPoints": '',
                                    "couponCode": ''
                                }
                                var servicesString = '';
                                var paymentString = '';
                                obj1.parlorName = obj[i].parlorName;
                                var timeConversion = obj[i].startsAt
                                obj1.startsAt = new Date(timeConversion).toLocaleDateString();
                                obj1.appointmentId = obj[i].appointmentId;
                                obj1.clientName = obj[i].client.name;
                                obj1.clientPhoneNumber = obj[i].client.phoneNumber;
                                obj1.payableAmount = obj[i].payableAmount;
                                obj1.loyalityPoints = obj[i].loyalityPoints;
                                obj1.couponCode = obj[i].couponCode;
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
                                // console.log("array csv");
                                // console.log(arrayCsv)
                            }
                            $scope.tableParams = new NgTableParams(parameters, settings);
                            var csvData = arrayCsv;
                            csvData.unshift({ "Parlor Name": 'parlorName', "Appt. Date": 'startsAt', "Appt. Id": 'appointmentId', "Customer Name": 'clientName', "Customer Mobile": 'clientPhoneNumber', "Services": 'services', "Payable Amount": 'payableAmount', "Payment Method": 'paymentMethod', "Loyalty Points": 'loyalityPoints', "Coupon Code Used": 'couponCode' });
                            deferred.resolve(csvData);
                        });
                    }, function(res) {
                        deferred.reject();
                    });
                return deferred.promise;
            }


        }

        $scope.regenrateSettlement = function(id) {
            // console.log(id)
            if ((role == 2 || role == 7) && (userType == 0)) {
                $http.get("/role2/reGenerateReport?settlementId=" + id).success(function(response, status) {
                    // console.log(response);
                    if (response == 'Done') {
                        $scope.parlorChanged();
                        alert("Successfully regenerated");
                    } else {
                        alert("Operation failed");
                    }
                });
            } else {
                $http.get("/role1/reGenerateReport?settlementId=" + id).success(function(response, status) {
                    // console.log(response);
                    if (response == 'Done') {
                        $scope.parlorChanged();
                        alert("Successfully regenerated");
                    } else {
                        alert("Operation failed");
                    }
                });
            }

        }

        $scope.getSettlementAppointments = function(parlorId, period) {
            console.log(parlorId + " " + period);
            if ((role == 2 || role == 7) && (userType == 0)) {
                $http.get("/role2/getSettlementAppointments", { parlorId: parlorId, period: period }).success(function(response, status) {
                    $scope.data = response.data;
                    // console.log($scope.data);
                });
            } else {
                $http.get("/role1/getSettlementAppointments", { parlorId: parlorId, period: period }).success(function(response, status) {
                    $scope.data = response.data;
                    // console.log($scope.data);
                });
            }

        }

     $scope.exportToExcel = function (tableId) {


         var exportHref = Excel.tableToExcel(tableId, 'WireWorkbenchDataExport');
          $timeout(function () {
              location.href = exportHref;
          }, 100); // trigger download

       
      }

    });