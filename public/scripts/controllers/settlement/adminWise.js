angular.module('sbAdminApp',['ngCsv'])
    .controller('adminWise', function($scope, $http, Excel, $stateParams, $window, NgTableParams, $timeout, $q) {
        $scope.salonInvoiceContent = '';
        $scope.beUInvoiceContent = '';
        $scope.password = '';
        $scope.getTotal=0
        $http.get("/role1/periods").success(function(response, status) {
            $scope.periods = response.data;
            // console.log($scope.periods);
            $scope.selectedPeriod = $scope.periods.length;
            // console.log($scope.selectedPeriod);
            $scope.periodChanged($scope.selectedPeriod);
        });

        // $scope.submitViewHide=function(){
        //     $('#viewCurrentStatus').modal('hide');
        // }
         $scope.submitViewModal=function(){
            $('#viewCurrentStatus').modal('show');
             $http.get("/role1/viewCurrentSettlementStatusToSend?period="+ $scope.selectedPeriod).success(function(response){ 
                $scope.stats=response.data.parlorsToSendSettlement;
            })
        }
       
        $scope.periodChanged = function(period) {
            // console.log(period);
            $scope.period=period;
            // console.log("$scope.selectedPeriod" + $scope.selectedPeriod);
            $http.get("/role1/settlementReportAll?period=" + period).success(function(response, status) {
                $scope.data = response.data;
                var transferData=[];
                $scope.data=$scope.data.map(function(a){
                                a.isTrue=a.isMailSent;
                                // console.log(a.isMailSent)
                                return a;
                })
                $scope.getTotal=0
                $scope.data.forEach(function(element) {
                    if(element.netPayable>0){
                        $scope.getTotal+=element.netPayable
                        transferData.push(element)
                    }
                }, this);
                 console.log("transfer data",transferData);
                  $scope.tableParams = new NgTableParams({ count: 20,sorting: { noOfAppointments: "desc" }  }, { counts: [5, 10, 20], dataset: transferData});
            });
        };

        $scope.exportToExcel = function(tableId) { 
            var exportHref = Excel.tableToExcel(tableId, 'WireWorkbenchDataExport');
            $timeout(function() {
                location.href = exportHref;
            }, 100); // trigger download
        }
        $scope.loadData=function(){
            var data=[];
               return $http.get("/role1/viewCurrentSettlementStatus?period=" + $scope.period).then(function(response) {
                $scope.response = response.data.data.parlorsToSendSettlement;
                console.log("viewCurrentSettlementStatus",$scope.response,response)
                var transferData=[];
                $scope.response.forEach(function(element) {
                    data.push({"SalonId":element.parlorId,"Salon Name":element.parlorName + "-" + element.parlorAddress ,"Payable Amount":element.netPayable})
                }, this);

                console.log("return vala data",data)
                return data;
                
            })
            
        }
        $scope.openApproveModal=function(){
            $('#approveModal').modal('show');
        }
        $scope.openApproveHide=function(){
            $('#approveModal').modal('hide');
        }

        $scope.holdSettlement=function(salonId){
            console.log("hold settlement called",salonId);
            $http.post('/role1/holeSettlement',{parlorId:salonId,period:$scope.period}).success(function(response){
                alert("Updated Successfully")
            })


        }
        $scope.settlementApproved=function(){
            $('#loginModel').modal('show');

        }
        $scope.settlementApprovedHide=function(){
            $('#loginModel').modal('hide');

        }

         $scope.settlementSend=function(){
            $('#sendModel').modal('show');
           
        }
         $scope.sendSettlementHide=function(){
            $('#sendModel').modal('hide');
           
        }

        $scope.sendMailToAll = function() {

            if (confirm("Are you sure you want to Send Mail to All ! ") == true) {
                $http.get('/api/sendFinalSettlement?period=' + $scope.selectedPeriod).success(function(res) {
                    if (res.success) {

                        $scope.periodChanged($scope.selectedPeriod)
                        alert("Successfully Mail Send To All")

                    } else {
                        alert("Something going wrong")
                    }



                })
            } else {

            }


        }

           

           $scope.submitPassword=function(){
          
                 $http.get('/role1/verifySettlement?password='+ $scope.password+"&period="+$scope.selectedPeriod).success(function(res){
                     // console.log("final",res);
                       if (res.success) {
                        alert("Valid password")
                         $scope.settlementApprovedHide();
                        $scope.openApproveHide();

                    } else {
                        alert("Invalid password")

                    }

             })
           }  


        $scope.submitSettlement=function(){
 
                 $http.post("/role1/sendSettlement",{"period":$scope.selectedPeriod,"password":  $scope.password}).success(function(res){
                     // console.log("final",res);
                       if (res.success) {
                        alert("Successfully Send Settlement")
                        $scope.sendSettlementHide()
                        $scope.openApproveHide();
                    } else {
                        alert("Not Verified Settlement")

                    }

             })
           }


        $scope.save=function(a){
             // console.log(a);
             $http.post('/role1/updatePreviousDues',a).success(function(res){
                // console.log(res);
                if(res.success){
                    alert(res.data);
                     $scope.periodChanged($scope.selectedPeriod);
                }
                       
             })

        }




        $scope.paid = function(a, b) {
            if (confirm("Are you sure !") == true) {
                $http.post('/role1/paySettlementAmount', { id: a, paid: b }).success(function(res) {
                    if (res.success) {

                        $scope.periodChanged($scope.selectedPeriod)
                        alert("Successfully paid")

                    } else {
                        alert("Something going wrong")
                    }

                })
            } else {
                // console.log("checked")
            }



        }


        //               Send Mail TO particular Record

        $scope.sendMail = function(id) {
            if (confirm("Are you sure you want to send Mail !") == true) {
                $http.get('/api/sendOneFinalSettlement?id=' + id).success(function(res) {

                    if (res.success) {

                        $scope.periodChanged($scope.selectedPeriod)
                        alert("Successfully Send Mail")

                    } else {
                        alert("Something going wrong")
                    }


                })
            } else {
                // console.log("hello")
            }


        }

        $scope.regenerate = function(a) {

            if (confirm("Are you Sure you want to rengenerate !") == true) {
                $http.get('/role1/reGenerateReport?settlementId=' + a).success(function(res) {
                    // console.log(res)

                    if (res.success) {
                        $scope.periodChanged($scope.selectedPeriod)
                        alert("Successfully Regenerated")
                    } else {
                        alert("Something going wrong")
                    }
                })
            } else {

            }




        }

        $scope.regenerateAll = function(a) {


            if (confirm("Are you sure you want to Regenrate All !") == true) {
                $http.get('/role1/reGenerateReportAll?period=' + a).success(function(res) {
                    // console.log(res)

                    if (res.success) {

                        $scope.periodChanged($scope.selectedPeriod)
                        alert("Successfully Regenerated all")

                    } else {
                        alert("Something going wrong")
                    }


                })
            } else {

            }




        }


        $scope.regenrateSettlement = function(id) {
            // console.log(id);
            // console.log($scope.selectedPeriod);
            $http.get("/role1/reGenerateReport?settlementId=" + id).success(function(response, status) {
                // console.log(response);
                if (response == 'Done') {
                    $scope.periodChanged($scope.selectedPeriod);
                    alert("Successfully regenerated");
                } else {
                    alert("Operation failed");
                }
            });
        }
        
        
        
        $scope.activatedMail=function(a,b){
            
            $http.get("/api/isMailSent?settlementId="+a+"&isTrue="+b)
                 .success(function(res)
            {
                // console.log(res)
                 $scope.periodChanged($scope.selectedPeriod);
            })
        }

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
        $scope.salonInvoice = function(parlorId, period) {
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
            $http.post("/role1/settlementInvoice", { invoiceType: 'salon', parlorId: parlorId, period: period }).success(function(response, status) {
                // console.log(response);
                $scope.salonInvoiceContent = response.message;
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

        $scope.beUInvoice = function(parlorId, period) {
            // console.log(parlorId);
            // console.log(period);
            $scope.beUInvoiceContent = '';
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

        function makeCSVData(parlorId, period,check) {
            // console.log(parlorId + " " + period);
            // console.log(check)
            var deferred = $q.defer();
            if(check==1){
            $http.post("/role1/getSettlementAppointments", { parlorId: parlorId, period: period })
                .then(function(res) {
                    $q.when(res).then(function() {
                        arrayCsv = [];
                        // console.log(res);
                        var obj = res.data.data;

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
                            obj1.salonId=parlorId;
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
                            // console.log("array csv");
                            // console.log(arrayCsv)
                        }
                        $scope.tableParams = new NgTableParams(parameters, settings);
                        var csvData = arrayCsv;
                        csvData.unshift({ "Salon Id":'salonId',"Parlor Name": 'parlorName', "Appt. Date": 'startsAt', "Appt. Id": 'appointmentId', "Customer Name": 'clientName', "Customer Mobile": 'clientPhoneNumber', "Services": 'services', "Payable Amount": 'payableAmount', "Payment Method": 'paymentMethod', "Loyalty Points": 'loyalityPoints', "Coupon Code Used": 'couponCode', "appointmentType": 'appointmentType', "clientFirstAppointment": 'clientFirstAppointment',"closedByName":'closedByName',"Membership Credits Used" : 'membershipCredits', });
                        deferred.resolve(csvData);
                    });


                }, function(res) {
                    deferred.reject();
                });
            }else{
                $http.post("/role1/getSettlementAppointmentsAll", { parlorId: parlorId, period: period })
                .then(function(res) {
                    $q.when(res).then(function() {
                        arrayCsv = [];
                        // console.log(res);
                        var obj = res.data.data;

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
                            obj1.salonId=obj[i].parlorId;
                            obj1.parlorName = obj[i].parlorName;
                            var timeConversion = obj[i].startsAt
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
                            // console.log("array csv");
                            // console.log(arrayCsv)
                        }
                        $scope.tableParams = new NgTableParams(parameters, settings);
                        var csvData = arrayCsv;
                        csvData.unshift({"Salon Id":'salonId', "Parlor Name": 'parlorName', "Appt. Date": 'startsAt', "Appt. Id": 'appointmentId', "Customer Name": 'clientName', "Customer Mobile": 'clientPhoneNumber', "Services": 'services', "Payable Amount": 'payableAmount', "Payment Method": 'paymentMethod', "Loyalty Points": 'loyalityPoints', "Coupon Code Used": 'couponCode', "appointmentType": 'appointmentType', "clientFirstAppointment": 'clientFirstAppointment',"closedByName":'closedByName',"Membership Credits Used" : 'membershipCredits' });
                        deferred.resolve(csvData);
                    });


                }, function(res) {
                    deferred.reject();
                });
            }
            return deferred.promise;

        }
        $scope.changeBalance=function(setId,period,newBalance){

            var obj1={settlementId:setId,period:period,newbalance:newBalance};
            // console.log(obj1);
            $http.post('/role1/editSettlementBalances',obj1).success(function(res){
                // console.log(res);
                if(res.success){
                    alert(res.data);
                     $scope.periodChanged($scope.selectedPeriod);
                }
                       
             })
        }




    });