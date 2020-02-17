'use strict';

angular.module('sbAdminApp', [])

.controller('signUpInvoice',['$scope','$http',
    function($scope,$http, $stateParams, $window,NgTableParams) {
                $scope.selectedParlor = "";

                $scope.changeParlor = function(selectedParlor){
                    $scope.selectedParlor = selectedParlor;
                }
                 $scope.year=['2017','2018','2019','2020','2021','2022','2023','2024','2025']
              $scope.month=["January","February","March","April","May","June","July","August","September","October","November","December"]
                 $scope.userType=userType;
               // console.log($scope.userType)
            $http.get("/role1/parlorList")
            .success(function(res) {
                // console.log(res)
                $scope.parlors = res.data;
                // console.log($scope.parlors);
                // $scope.selectedParlor=res.data[0].parlorId;
            })
        
               $scope.getLedger = function() {
                // console.log($scope.selectedParlor)
               var month=$scope.month.indexOf($scope.item);
               var month=Number(month)
               // console.log(month)
               var url='';
               var year=Number($scope.item1);
               // console.log(year)
               if($scope.userType=='1'){
                url="role1/getSettlementMonthlyInvoice?parlorId="+$scope.selectedParlor+"&month="+month
                // console.log(url)
                } else{
                url="role3/getSettlementMonthlyInvoice?month="+ month + "&year="+year;
                // console.log(url)
               }
            $http.get(url).success(function(response, status) {

                // console.log(response);
                $scope.settlementData=response.data;
                $scope.t=response.data.salonGST;
                // console.log($scope.t);
                var set=response.data;
                // console.log($scope.settlementData)
                $scope.d=response.data.CGST;
                $scope.a=response.data.SGST;
                $scope.tax=$scope.d+$scope.a
                $scope.c=response.data.managementFee;
                $scope.b=response.data.onlinePaymentFee;
                $scope.mo=$scope.c+$scope.b;
                $scope.e=response.data.onlinePaymentFeeExempt;
                $scope.totalAdd=response.data.amountTotal;
                // console.log($scope.totalAdd);
                // console.log($scope.d); 
                $scope.str=response.data.amountTotalString;


       

                })
        }

        // console.log($scope.totalAdd);
      
   
        $scope.printToCart = function(printSectionId) {
            var innerContents =$scope.settlementData ;
            var innerContents2=$scope.d;
            var innerContents3=$scope.totalAdd;
            var innerContents4=$scope.a;
            var innerContents5=$scope.tax;
            // console.log(innerContents5)
            var innerContents6=$scope.mo;
            var innerContents11=$scope.totalAdd;
            var innerContents12=$scope.str;
            // console.log(innerContents3)
            // console.log(innerContents.invoiceNumber)
            var popupWinindow = window.open('', '_blank', 'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
            popupWinindow.document.open();
            var printObject='<html><head><link  rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"/></head><body onload="window.print()"><div class="row" style="padding:3%!important"> <table class="table table-bordered" id="printSectionId"> <tr> <td rowspan="6" style="width:35%;text-align: left"> <div style="width: 120px;float:left"><img src="http://res.cloudinary.com/dyqcevdpm/image/upload/v1526376237/beu-logo_qfscy6.png" alt="logo" style="width: 100px"></div><div style="width:65%;float:left"> <b>Gingerpan Swapcart Private Limited</b> <br>Plote No.62 Okhla Industrial Area Phase-3 Delhi<br>GSTIN/UIN:07AAGCCG0658K1ZF<br>State Name:Delhi,Code:07<br>CIN:U5200MH2015PT266734<br>E-mail:finance@beusalons.com </div></td><td colspan="4" style="text-align: left;">Invoice No:'+innerContents.invoiceNumber+'<br>GIN/18-19/0067</td><td colspan="4" style="text-align: left;">Date:'+innerContents.date+'</td></tr><tr> <td colspan="4" style="text-align: left;">Delevery Note</td><td colspan="4" style="text-align: left;">Mode/Terms of Payment</td></tr><tr> <td colspan="4" style="text-align: left;">Suppleir"s Ref.</td><td colspan="4" style="text-align: left;">Other Reference(s)</td></tr><tr> <td colspan="4" style="text-align: left;">Buyer"s Order No </td><td colspan="4" style="text-align: left;">Dated</td></tr><tr> <td colspan="4" style="text-align: left;">Dispatched Document No</td><td colspan="4" style="text-align: left;">Dellvery Note Date</td></tr><tr> <td colspan="4" style="text-align: left;">Dispatched through</td><td colspan="4" style="text-align: left;">Destination</td></tr><tr> <td rowspan="2" style="text-align: left"> Buyer<br><b>'+innerContents.parlorName+'</b><br>'+innerContents.parlorAddress+'<br>GSTIN/UIN:'+innerContents.salonGST+'<br>State Name:'+innerContents.stateName+',Code'+innerContents.code+'<br></td></tr><tr> <td colspan="8" style="text-align: left;">Terms Of Delivery</td></tr><tr> <td >Particulars</td><td>HSN/SAC</td><td>Quantity</td><td>Rate</td><td>Per</td><td colspan="4">Amount</td></tr>'
           '<tr>'  
           if(innerContents.stateName=='New Delhi') printObject=printObject+'<td rowspan="5" style="font-weight: 700;text-align: left;"> Mangement Fees<br><br>Reimb of online payment fees<br><br>Reimb of online payment fees(Exempt)<br>';
                else printObject=printObject+'<td rowspan="4" style="font-weight: 700;text-align: left;"> Mangement Fees<br><br>Reimb of online payment fees<br><br>Reimb of online payment fees(Exempt)<br>';
                if(innerContents.stateName=='New Delhi') printObject=printObject+'<br>CGST<br><br>SGST<br>'
                else printObject=printObject+'<br>IGST<br>'
                printObject=printObject+'</td><td></td><td></td><td></td><td></td><td colspan="4" style="text-align: left;">'+innerContents.managementFee+'</td></tr><tr> <td></td><td></td><td></td><td></td><td colspan="4" style="text-align: left;">'+innerContents.onlinePaymentFee+'</td></tr><tr> <td></td><td></td><td></td><td></td><td colspan="4" style="text-align: left;">'+Math.round(innerContents.onlinePaymentFeeExempt)+'</td></tr><tr> <td></td><td></td>'
            if(innerContents.stateName=='New Delhi') printObject=printObject+'<td style="text-align: left;">'+innerContents.CGSTpercentage+'</td><td style="text-align: left;">%</td><td colspan="4" style="text-align: left;">'+innerContents.SGST+'</td></tr><tr> <td></td><td></td><td style="text-align: left;">'+innerContents.SGSTpercentage+'</td><td style="text-align: left;">%</td><td colspan="4" style="text-align: left;">'+innerContents.SGST+'</td>';
            else printObject=printObject+'<td style="text-align: left;">'+innerContents.IGSTpercentage+'</td><td style="text-align: left;">%</td><td colspan="4" style="text-align: left;">'+innerContents.IGST+'</td></tr>'
             printObject=printObject+'<tr> <td style="font-weight: 700">Total</td><td></td><td></td><td></td><td></td><td colspan="4" style="text-align: left;">'+innerContents3+'</td></tr><tr> <td colspan="9" style="text-align: left;"> Amount Chargeable(In Words)<br><b>INR '+innerContents.amountTotalString+'</b> </td></tr>'
            if(innerContents.CGST!=0) printObject=printObject+'<tr> <td rowspan="2" colspan="">HSN/SAC</td><td rowspan="2" colspan="2"> Taxable<br>Value </td><td colspan="2">Central Tax</td><td colspan="2">State Tax</td><td rowspan="2" colspan="2">Total Tax<br>Amount</td></tr><tr> <td> Rate </td><td> Amount </td><td> Rate </td><td> Amount </td></tr><tr> <td><b>Total</b></td><td colspan="2">'+innerContents6+'</td><td> 9 </td><td> '+innerContents4+' </td><td> 9 </td><td>'+innerContents4+'</td><td>'+innerContents5+'</td></tr>'
                else printObject=printObject+'<tr> <td rowspan="2" colspan="">HSN/SAC</td><td rowspan="2" colspan="2"> Taxable<br>Value </td><td colspan="4">IGST</td><td rowspan="2" colspan="2">Total<br>Amount</td></tr><tr> <td colspan="2"> Rate </td><td colspan="2"> Amount </td></tr><tr> <td><b>Total</b></td><td colspan="2">'+innerContents.taxTotalString+'</td><td colspan="2"> 18 </td><td>'+innerContents.IGST+'</td><td colspan="2">'+innerContents.IGST+'</td></tr>'
                printObject=printObject+' <tr> <td colspan="9">Tax Amount (In words):<b>INR '+innerContents.taxTotalString+'</b> </td></tr><tr> <td colspan="5" style="text-align: left"> Company Pan:<b>AAGC0658K</b></td><td colspan="4" style="text-align: left"> <b>for Gingerpan Swapcart Private Limited</b> <br><br><br>Authorised Signatory </td></tr></table>   <div>Instructions :</div><div>1. E &OE</div><div> 2. Any discrepancy in regard to this Invoice must be notified within 7 days from the date of receipt of this invoice.</div><div> 3. In case where TDS has been deducted, Income Tax Deduction Certificate as provided under The Income Tax Act, 1961,should be sent to us at the earliest.</div><div style="text-align:left;font-size:15px;">4.This is computer generated invoice no signature required.</div></div></body></html>'
            popupWinindow.document.write(printObject);
            popupWinindow.document.close();
        }


        $scope.generateRevenueReport=function() {
            var pdf = new jsPDF('1', 'pt', 'a4');
            pdf.addHTML(document.getElementById("printSectionId"), function () {
                pdf.addPage();
                pdf.save($scope.salonName + $scope.dateOfSettlement + '.pdf');
                pdf.addHTML(document.getElementById("printSectionId"), function () {
                    pdf.save($scope.salonName + $scope.dateOfSettlement + '.pdf');
                });
            });
        }
    }]);


