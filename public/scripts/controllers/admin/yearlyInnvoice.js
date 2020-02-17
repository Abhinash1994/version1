angular.module('sbAdminApp',[ 'ngCsv'])
.controller('yearlyInnvoice',function($scope, $http,NgTableParams) {
  

			 	 $scope.selectedParlor ={};
         $scope.selectedParlor.selectedParlor=parlorId;
			 	 $scope.userType=userType;
			 	 $scope.myDate ={};
			 	 $scope.data={};
         $scope.startDate={};
         $scope.endDate={};
			   $scope.type={};
  				// $scope.selectedtype = [{id:1,name:"SignUp"},{id:2,name:"yearly Model"}];


  				  $http.post("/role1/parlorList").success(function(response, status) {
                         $scope.parlors = response.data;
                         // console.log("parlorId",$scope.parlors)
                         
                })	

				  $scope.changedValue = function() {
				   // console.log( $scope.type.name)
				  }
 				
 				
 				 $scope.generate=function(selectedParlor){
 				 	var obj={"parlorId":$scope.selectedParlor.selectedParlor,"type":$scope.type.type,"amount":$scope.data.amount,"date":new Date($scope.myDate.myDate),"startDate":new Date($scope.startDate.startDate),"endDate":new Date($scope.endDate.endDate)}
 				 	console.log("data",obj)
 				 	  $http.post("/role1/generateSignUpSettlementInvoice",obj).success(function(res){
                           
                            alert("successfully generate")	
                           	
                          })
 				 	  
 				  }
 				  
 				
                $scope.submit=function(selectedParlor){

                    $http.post("/role2/getSignUpSettlementInvoice",{"parlorId":$scope.selectedParlor.selectedParlor}).success(function(res){  
                           	$scope.stats=res;
                           	console.log("table",$scope.stats)
                         })
                }

                 $scope.delete=function(_id){

                 	console.log(_id);
                    $http.post("/role1/deleteSignUpSettlementInvoice",{invoiceId:_id}).success(function(res){  
                           	alert("successfully delete");
                         })
                }

                function createdAt(x) {
        					x= new Date(x);
        				    var y = x.getFullYear().toString();
        				    var m = (x.getMonth() + 1).toString();
        				    var d = x.getDate().toString();
        				    (d.length == 1) && (d = '0' + d);
        				    (m.length == 1) && (m = '0' + m);
        				    var yyyymmdd = y + " / " + m + " / " + d;
        				    return yyyymmdd;
				      }

				 function dateType(month,year) {
          if((month === 3 && year == 2019) || (month === 4 && year == 2019) || (month === 5 && year == 2019) || (month === 6 && year == 2019) || (month === 7 && year == 2019) ||(month === 8 && year == 2019) || (month === 9 && year == 2019) || (month === 10 && year == 2019) || (month === 11 && year == 2019) || (month === 12 && year == 2019))
          {
            return "Invoice No: SYF/19-20/00"
          }
           else if((month === 0 && year == 2019) || (month === 1 && year == 2019) || (month === 2 && year == 2019) || (year == 2018))
            {
                  return "Invoice No: SYF/18-19/00"
            }

        }

				 function invoiceType(type) {
					if(type==1)
					{
						return "SignUp"
					}
					else{
						return "Advance For Yearly Model Royality"
					}
				    
				}

        
           $scope.printToCart = function(data) {
            var innerContents =data;
           	var date=data.date;
            var invoiceNum = dateType(data.month,data.year)
           	var startDate=createdAt(data.startDate);
           	var endDate=createdAt(data.endDate);
           	var type=invoiceType(data.type);

            var popupWinindow = window.open('', '_blank', 'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
            popupWinindow.document.open();
            var printObject='<html><head><link  rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"/></head><body onload="window.print()"><div class="row" style="padding:3%!important;margin-top:-45px"> <table class="table table-bordered" > <h2 style="text-align: center;font-weight:700"> Invoice Summary</h2><tr><td colspan="4" style="width:35%;text-align: left"><div style="width: 120px;float:left"><img src="http://res.cloudinary.com/dyqcevdpm/image/upload/v1526376237/beu-logo_qfscy6.png" alt="logo" style="width: 100px"></div></td><td colspan="3" style="text-align: left;">'+invoiceNum+''+innerContents.invoiceNumber+'<br></td> <td colspan="4" style="text-align: left;">Date : '+date+'</td><tr><td colspan="4" style="width:35%;text-align: left"> <h4> Issued To : </h4> <b>'+innerContents.parlorName+'</b> <br>'+innerContents.parlorAddress+'<br>GSTIN/UIN: '+innerContents.salonGST+'<br></td><td colspan="5" style="text-align: right;"><h4> From : </h4><b>Gingerpan Swapcart Private Limited</b> <br> Plote No.62 Okhla Industrial Area Phase-3 Delhi<br>GSTIN/UIN: 07AAGCG0658K1ZF<br> State Name: Delhi, Code: 07<br>CIN: U5200MH2015PT266734<br>E-mail: finance@beusalons.com</td></tr></tr><tr></tr>'
            if(innerContents.type!=1 ) printObject=printObject+'<tr><td colspan="9" style="text-align: center;border-right-style:none;">This Invoice summary is for the billing period  <b>'+startDate+' - '+endDate+'</b></td></tr>'


             printObject=printObject+'<tr> <td colspan="4" style="font-weight:700">Particulars</td><td style="font-weight:700">HSN/SAC</td><td style="font-weight:700">Quantity</td><td style="font-weight:700">Rate</td><td style="font-weight:700">Percentage</td><td style="font-weight:700">Amount</td></tr><tr><td colspan="4">'+type+'</td></td><td></td><td></td><td></td><td></td><td colspan="5" style="text-align: left;">'+innerContents.managementFee+'</td>'
            if(innerContents.CGST!=0 ) printObject=printObject+'<tr><td colspan="4">CGST</td><td></td><td></td><td>'+innerContents.CGSTpercentage+'</td><td> %</td><td colspan="5" style="text-align: left;">'+innerContents.CGST+'</td> </tr>'

             printObject=printObject+''
            if(innerContents.SGST!=0 ) printObject=printObject+'<tr><td  colspan="4">SGST</td><td></td> <td></td><td>'+innerContents.SGSTpercentage+'</td> <td> %</td><td colspan="5" style="text-align: left;">'+innerContents.SGST+'</td></tr>'
             printObject=printObject+''
            if(innerContents.IGST!=0 ) printObject=printObject+'<tr><td  colspan="4">IGST</td><td></td> <td></td><td>'+innerContents.IGSTpercentage+' </td> <td>%</td><td colspan="5" style="text-align: left;">'+innerContents.IGST+'</td></tr>'

             printObject=printObject+'<tr><td colspan="4" style="font-weight: 700">Total</td><td></td><td></td><td></td><td></td><td colspan="5" style="text-align: left;font-weight:700">'+innerContents.amountTotal+'</td> </tr><tr><td colspan="9" style="text-align: left;">Amount Chargeable(In Words)<br> <b>INR '+innerContents.amountTotalString+'</b></td></tr> <tr><td rowspan="2">HSN/SAC</td><td rowspan="2"> Taxable<br>Value</td><td colspan="2">Central Tax </td> <td colspan="2">State Tax </td><td colspan="2">IGST</td><td colspan="2">Total Tax<br>Amount</td></tr> <tr><td>Rate</td><td>Amount</td><td>Rate</td><td>Amount</td><td>Rate</td><td>Amount</td><td colspan="4"></td></tr><tr><td style="font-weight:700">Total</td><td style="font-weight:700">'+innerContents.managementFee+'</td><td>'+innerContents.CGSTpercentage+'</td><td>'+innerContents.CGST+'</td><td>'+innerContents.SGSTpercentage+'</td><td>'+innerContents.SGST+'</td><td style="font-weight:700">'+innerContents.IGSTpercentage+'</td><td style="font-weight:700">'+innerContents.IGST+'</td><td  style="font-weight:700">'+innerContents.taxTotal+'</td></tr><tr><td colspan="12">Tax Amount(In words) : <b>'+innerContents.taxTotalString+'</b> </td></tr><tr><td colspan="3" style="text-align: left">Company Pan: <b>AAGCG0658K</b></td><td colspan="6" style="text-align: left"><b>for Gingerpan Swapcart Private Limited</b><br><br><br>Authorised Signatory</td></tr></tr></tr></tr></table><div>Instructions :</div><div>1. E &OE</div><div> 2. Any discrepancy in regard to this Invoice must be notified within 7 days from the date of receipt of this invoice.</div><div> 3. In case where TDS has been deducted, Income Tax Deduction Certificate as provided under The Income Tax Act, 1961,should be sent to us at the earliest.</div><div style="text-align:left;font-size:15px;">4.This is computer generated invoice no signature required.</div></div></body></html>'

             printObject=printObject+'<tr> <td colspan="4" style="font-weight:700">Particulars</td><td style="font-weight:700">HSN/SAC</td><td style="font-weight:700">Quantity</td><td style="font-weight:700">Rate</td><td style="font-weight:700">Percentage</td><td style="font-weight:700">Amount</td></tr><tr><td colspan="4">'+type+'</td></td><td></td><td></td><td></td><td></td><td colspan="5" style="text-align: left;">'+innerContents.managementFee+'</td><tr><td colspan="4">CGST</td><td></td><td></td><td>'+innerContents.CGSTpercentage+'</td><td> %</td><td colspan="5" style="text-align: left;">'+innerContents.CGST+'</td> </tr><tr><td  colspan="4">SGST</td><td></td> <td></td><td>'+innerContents.SGSTpercentage+'</td> <td> %</td><td colspan="5" style="text-align: left;">'+innerContents.SGST+'</td></tr><tr><td  colspan="4">IGST</td><td></td> <td></td><td>'+innerContents.IGSTpercentage+' </td> <td>%</td><td colspan="5" style="text-align: left;">'+innerContents.IGST+'</td></tr><tr><td colspan="4" style="font-weight: 700">Total</td><td></td><td></td><td></td><td></td><td colspan="5" style="text-align: left;font-weight:700">'+innerContents.amountTotal+'</td> </tr><tr><td colspan="9" style="text-align: left;">Amount Chargeable(In Words)<br> <b>INR '+innerContents.amountTotalString+'</b></td></tr> <tr><td rowspan="2">HSN/SAC</td><td rowspan="2"> Taxable<br>Value</td><td colspan="2">Central Tax </td> <td colspan="2">State Tax </td><td colspan="2">IGST</td><td colspan="2">Total Tax<br>Amount</td></tr> <tr><td>Rate</td><td>Amount</td><td>Rate</td><td>Amount</td><td>Rate</td><td>Amount</td><td colspan="4"></td></tr><tr><td style="font-weight:700">Total</td><td style="font-weight:700">'+innerContents.managementFee+'</td><td></td><td></td><td></td><td></td><td style="font-weight:700">'+innerContents.IGSTpercentage+'</td><td style="font-weight:700">'+innerContents.IGST+'</td><td  style="font-weight:700">'+innerContents.taxTotal+'</td></tr><tr><td colspan="12">Tax Amount(In words) : <b>'+innerContents.taxTotalString+'</b> </td></tr><tr><td colspan="3" style="text-align: left">Company Pan: <b>AAGCG0658K</b></td><td colspan="6" style="text-align: left"><b>for Gingerpan Swapcart Private Limited</b><br><br><br>Authorised Signatory</td></tr></tr></tr></tr></table><div>Instructions :</div><div>1. E &OE</div><div> 2. Any discrepancy in regard to this Invoice must be notified within 7 days from the date of receipt of this invoice.</div><div> 3. In case where TDS has been deducted, Income Tax Deduction Certificate as provided under The Income Tax Act, 1961,should be sent to us at the earliest.</div><div style="text-align:left;font-size:15px;">4.This is computer generated invoice no signature required.</div></div></body></html>'

            popupWinindow.document.write(printObject);
            popupWinindow.document.close();
        }


});

