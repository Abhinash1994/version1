'use strict'

angular.module('sbAdminApp', ['ngTable','daterangepicker','ui.calendar', 'ui.bootstrap','isteven-multi-select','ngSanitize', 'ngCsv'])

    .controller('CompletedAppointmentCtrl', function (Excel,$scope, $rootScope, $compile, $http, $timeout, $window, $log,NgTableParams) {

        $scope.nameSearched='';
        $scope.appointmentIdSearched='';
        $scope.memberships = memberships;
        $scope.appointments1 = appointments;
        $scope.parlorTax = $rootScope.parlorTax;
		// console.log($scope.appointments1);
        $log.debug($scope.appointments1);
        $scope.pdata = inventoryItems;
        var currentSelectedService = {};
        var currentSelectedProduct = {};
        $scope.currProduct = {};
        $scope.count = 1;
        $scope.pcount = 1;
        var parlorTax = 0;
        $scope.firstDotsFlag=false;
        $scope.secondDotsFlag=true;
        var today=new Date();
        $scope.filter = {};
        $scope.allAppointments=function(){
            $http.get("/role3/appointment?&name="+$scope.nameSearched+'&appointmentId='+$scope.appointmentIdSearched+'&startDate='+$scope.filter.date.startDate._d+'&endDate='+$scope.filter.date.endDate._d+'&allPages=1').success(function(response, status){
                // console.log("h3",response);

            });
        }
        var loadData = function () {
            // console.log("yeh function nhi chalta hai")
            var deferred = $q.defer();
            $http.get("/role3/appointment?&name="+$scope.nameSearched+'&appointmentId='+$scope.appointmentIdSearched+'&startDate='+$scope.filter.date.startDate._d+'&endDate='+$scope.filter.date.endDate._d+'&allPages=1')
                .then(function (res) {
                    $q.when(res).then(function () {
                        deferred.resolve(res);
                     });
                  }, function (res) {
                      deferred.reject();
                  });
             return deferred.promise;
        };
        $scope.loadData = function () {
            // console.log("yeh function chalta hai")
            var data=[];
            return $http.get("/role3/appointment?&name="+$scope.nameSearched+'&appointmentId='+$scope.appointmentIdSearched+'&startDate='+$scope.filter.date.startDate._d+'&endDate='+$scope.filter.date.endDate._d+'&allPages=1').then(function (res) {
                res.data.data.forEach(function(appt){
                    var paymentMethod='';
                    appt.allPaymentMethods.forEach(function(pay){
                        paymentMethod+='Paid '+pay.amount + ' by '+pay.name
                    })
                    var services='';
                    appt.services.forEach(function(ser){
                        services+=", "+ser.name
                    })
                    var products='';
                    appt.products.forEach(function(p){
                        products+=", "+p.name
                    })
                    if(appt.status==3){
                        data.push({"Customer Name":appt.client.name,"Phone Number":Number(appt.client.phoneNumber),"Customer Gender":appt.client.gender,"Loyality Points":appt.loyalityPoints,"Start Time":new Date(appt.startsAt),"End Time":new Date(appt.appointmentEndTime),"Total":appt.payableAmount,"Payment Method":paymentMethod,"Amount Payable":appt.payableAmount,"Appointment Id":appt.appointmentId,"Service Revenue":appt.serviceRevenue, "Tax":appt.tax, "Discount" : appt.discount + appt.membershipDiscount,"Product Revenue":appt.productRevenue,"Services":services,"Products":products})
                    }
                   
                })
                return data;
            });
        };


        $scope.filter.date =  {startDate: moment().startOf('month') , endDate: moment().endOf('month') };;
		//var app=[{"subtotal":23},{"subtotal":23},{"subtotal":23},{"subtotal":23},{"subtotal":23},{"subtotal":23},{"subtotal":23},{"subtotal":23},{"subtotal":13},{"subtotal":3},{"subtotal":3},{"subtotal":53},{"subtotal":63},{"subtotal":23},{"subtotal":23},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33},{"subtotal":33}];
        $scope.callApi=function(pageNumber){
            var filter = $scope.filter;
            //  console.log("hello")
            // console.log(filter)
            /*console.log('startDate',filter.date.startDate._d);
            console.log('endDate',filter.date.endDate._d);*/
            $http.get("/role3/appointment?page="+pageNumber+'&name='+$scope.nameSearched+'&appointmentId='+$scope.appointmentIdSearched+'&startDate='+$scope.filter.date.startDate._d+'&endDate='+$scope.filter.date.endDate._d).success(function(response, status){
                // console.log("h3",response);
                $rootScope.appointments=response.data.appointments;
                $scope.buttonArrayLength=response.data.totalPage;
                $scope.callPaginationInitialisation('yes');
                $scope.appointments1=$rootScope.appointments;
                app=$rootScope.appointments;
                // console.log("h1", $scope.appointments1);
                $scope.tableParams = new NgTableParams({ count: 5 }, { counts: [5, 10, 20], dataset: app});
            });
        }
          $http.get("/role3/appointment?page=1"+'&name='+'&startDate='+$scope.filter.date.startDate._d+'&endDate='+$scope.filter.date.endDate._d).success(function(response, status){
               console.log('h2',response);
              var filter = $scope.filter;
              // console.log(filter)
              // console.log('startDate',filter.date.startDate);
              // console.log('endDate',filter.date.endDate);
              $rootScope.appointments=response.data.appointments;
              $scope.buttonArrayLength=response.data.totalPage;
              $scope.callPaginationInitialisation('yes');
                $scope.appointments1=$rootScope.appointments;
          				app=$rootScope.appointments;
                        // console.log( $scope.appointments1);

 //                $scope.appointments1.sort(function(obj1, obj2) {



 //                    var aD = obj2.appointmentEndTime.split("/");
 //                    var bD = obj1.appointmentEndTime.split("/");

 //                    if (aD[0].length == 1) {
 //                        aD[0] = "0" + aD[0].toString();
 //                    }

 //                    if (bD[0].length == 1) {
 //                        bD[0] = "0" + bD[0].toString();
 //                    }

 //                    var aD = aD.reverse().join(),
 //                        bD = bD.reverse().join();
 //                    aD = aD.replace(/\,/g, "");
 //                    bD = bD.replace(/\,/g, "");
 //                    aD = parseInt(aD);
 //                    bD = parseInt(bD);
 //                    return aD < bD ? -1 : (aD > bD ? 1 : 0);


 //        // return obj2.appointmentEndTime - obj1.appointmentEndTime;
 // return new Date(obj1.appointmentEndTime).getTime() - new Date(obj2.appointmentEndTime).getTime()

 //    });
            // for(var i=0;i<$scope.appointments1.length;i++)
            // {
            //         for(var j=i+1;j<$scope.appointments1.length;j++){
            //           if($scope.appointments1[i].appointmentEndTime<$scope.appointments1[j].appointmentEndTime){
            //                     var temp=$scope.appointments1[i];
            //                     $scope.appointments1[i]=$scope.appointments1[j];
            //                     $scope.appointments1[j]=temp;

            //           }
            //         }

            // }


          				$scope.tableParams = new NgTableParams({ count: 5 }, { counts: [5, 10, 20], dataset: app});

            });



        function getEmployeeNames(empes){
            var emp = "";
            // console.log(empes);
            empes.forEach(function(e){
                emp += ( e.name + ' ' );
            });
            return emp;
        }
        function   getEmployeeNamesFromProduct(empes){
            var index=0;
            var employeeName='';
            while(index<employees.length){
                if(empes==employees[index].userId){
                    employeeName=employees[index].name;
                    break;
                }
                index++;
            }
            return  employeeName;
        }
        // console.log("empoloyees ki list");
        // console.log(employees);
       $scope.x=0;
        $scope.print = function (object, index) {
            // console.log(object);
            var tobePrinted = object;
            var dateOfInvoice=new Date();
            // console.log(tobePrinted);
            // console.log(parlorName+''+parlorAddress+''+contactNumber+''+serviceTaxNumber+''+tinNumber+'');
            // console.log(tobePrinted.parlorAppointmentId)
            $scope.urlImage='http://beusalons.com/images/Logo.png';
            var printData = "<div class='row'><div class='col-lg-6' style='height: 50px;float: right;'><img src='http://beusalons.com/images/Logo.png' width='150' alt='Beu salons' /></div></div><div class='col-md-12' ><div class='col-md-6' style='color:#d2232a;font-weight:700;text-align:right;float:right;width:180px;font-size:30px'></div>";
            printData += "<div style='text-align: left;' class='col-md-6'><b><h2 style='font-size:50px;'>" + parlorName +"</h2></b></div></div>";
            if(legalEntity)printData += "<div style='text-align: left;line-height:-2px;'>" + legalEntity + "</div>";
            printData += "<div style='text-align: left;line-height:-2px;'>" + parlorAddress +"</div>";
            printData += "<div style='text-align: left;line-height:-2px;'>Contact No." + contactNumber +"</div><br/>";
            if(gstNumber!=undefined)
            {
                printData += "<div style='text-align: left;line-height:-2px;'> GST/ UIN: " + gstNumber ;
            }else if(serviceTaxNumber!=undefined)
            {
                printData += "<div style='text-align: left;line-height:-2px;'> Service Tax Number: " + serviceTaxNumber ;
            }
            //printData += "<div style='text-align: left;line-height:-2px;'> Service Tax#" + serviceTaxNumber +  "     TIN# "+tinNumber +"</div>";
            printData += "<div style='text-align: left;line-height:-2px;'> Invoice Date: " + dateOfInvoice.getDate() + "/" + (dateOfInvoice.getMonth() + 1) + "/" + dateOfInvoice.getFullYear();
            printData += "<div style='text-align: left;line-height:-2px;'> Appointment Date: " + new Date(tobePrinted.startsAt).getDate() + "/" + (parseInt(new Date(tobePrinted.startsAt).getMonth()) + 1) + "/" + new Date(tobePrinted.startsAt).getFullYear();
            printData += "<div style='text-align: left;line-height:-2px;'> Invoice Number#" + tobePrinted.parlorAppointmentId;

            printData += "<h4><b>Client Details:</b></h4><hr>";
            printData += "<table border='1' style='width: 100%; border-collapse: collapse; text-align: center'>";
            printData += '<tr>\
                            <th>Name</th>\
                            <th>Phone No.</th>'
            if(tobePrinted.membersipCreditsLeft)printData+='<th>Membership Credits Left</th>'
                        +'</tr>';
            printData += "<tr>";
            printData += `<td>`+ tobePrinted.client.name + `</td>
                     <td>`+ tobePrinted.client.phoneNumber + `</td>`;
                     if(tobePrinted.membersipCreditsLeft)printData+='<th>'+Math.round(tobePrinted.membersipCreditsLeft )+'</th>'         
            printData += "</tr></table><br>";

            if (tobePrinted.services && tobePrinted.services.length) {
                printData += "<h4><b>Services:</b></h4>";
                printData += "<table border='1' style='width: 100%; border-collapse: collapse; text-align: center'>";
                printData += `<tr>
                            <th>Service Name</th>`
                if(tobePrinted.services[0].gstNumber!=undefined){printData +=`<th>SAC Code</th>`}
                printData +=`<th>Price</th>
                            <th>Quantity</th>
                            <th>Additions</th>
                            <th>Employee Name</th>
                        </tr>`;
                for (var i = 0; i < tobePrinted.services.length; i++) {
                    var service = tobePrinted.services[i];
                    printData += "<tr>";
                    printData += `<td>` + service.name + `</td>`
                    if(tobePrinted.services[0].gstNumber!=undefined){printData += `<td>` + service.gstNumber + `</td>`}
                    printData +=   `<td> Rs.`+ service.price + `</td>
                        <td>`+ service.quantity + `</td>
                         <td> Rs.`+ service.additions + `</td>
                         <td>`+getEmployeeNames(service.employees) +`</td>`;
                    printData += "</tr>";
                }
                printData += "</table><br>";

            }
            var ptotal=0;
            if (tobePrinted.products && tobePrinted.products.length) {
                printData += "<h4><b>Products:</b></h4>";
                printData += "<table border='1' style='width: 100%; border-collapse: collapse; text-align: center'>";
                printData += `<tr>
                            <th>Product Name</th>`
                if(tobePrinted.products[0].gstNumber!=undefined){printData +=`<th>HSN Code</th>`}
                printData +=`<th>Quantity</th>
                            <th>Price</th>
                            <th>Amount</th>
                            <th>Employee Name</th>
                        </tr>`;
                var ptotal=0;
                for (var i = 0; i < tobePrinted.products.length; i++) {
                    var product = tobePrinted.products[i];
                    printData +=  "<tr>";
                    printData += `<td>` + product.name + `</td>`
                    if(tobePrinted.products[0].gstNumber!=undefined){printData += `<td>` + product.gstNumber + `</td>`}
                    printData += `<td>`+ product.quantity + `</td>
                         <td> Rs.`+ product.price + `</td>
                         <td> Rs.`+ (product.price * product.quantity) + `</td>
                         <td>`+ getEmployeeNamesFromProduct(product.employee) + `</td>`;
                    printData += "</tr>";
                    ptotal=+product.price ;

                }
                printData += "</table><br>";
            }
            var ptax=.125*ptotal;
            tobePrinted.tax=tobePrinted.tax-ptax;
            printData += "<h4><b>Billing:</b></h4>";
            printData += "<table border='1' style='width: 100%; border-collapse: collapse;'>";
            printData += `<tr><td> Sub Total: </td><td> Rs.` + tobePrinted.subtotal + `</td></tr><tr><td> (-) Discount: </td><td> Rs.`+ tobePrinted.discount + `</td></tr><tr><td> (-) Membership Discount: </td><td> Rs.`+ tobePrinted.membershipDiscount + `</td></tr>
                        <tr><td> (-) Loyality Points Used: </td><td> Rs.`+ tobePrinted.loyalityPoints + `</td></tr>`
           /*------------------------------------------GST work starts-------------------------------*/
            if(tobePrinted.services.length>0){
                printData +=`<tr><td colspan="2"><table style='width: 100%; border-collapse: collapse; text-align: center'>
                <thead>
                <tr>
                   <th rowspan="2" style="border-left:0px solid #000;border-bottom:1px solid #000;border-top:0px solid #000;border-right:1px solid #000;">
                   Tax break-up
                 </th>
                 <th rowspan="2"  style="border-left:0px solid #000;border-bottom:1px solid #000;border-top:0px solid #000;border-right:1px solid #000;">
                   Taxable
                 </th>
                 <th colspan="2"  style="border-left:0px solid #000;border-bottom:1px solid #000;border-top:0px solid #000;border-right:1px solid #000;">
                   CGST:
                 </th>
                 <th colspan='2'  style="border-left:0px solid #000;border-bottom:1px solid #000;border-top:0px solid #000;border-right:0px solid #000;">
                   SGST
                 </th>
                </tr>
                <tr>
                  <th style="border:1px solid #000">Rate</th>
                  <th style="border:1px solid #000">Amount</th>
                  <th style="border:1px solid #000">Rate</th>
                  <th style="border-left:1px solid #000;border-bottom:1px solid #000;border-top:1px solid #000;border-right:0px solid #000;">Amount</th>
                </tr>
                </thead>
                <tbody>`



                for(var k=0;k<tobePrinted.services.length;k++){
                    var shortData=tobePrinted.services[k];
                    printData +=`<tr>
                    <td  style="border-left:0px solid #000;border-bottom:0px solid #000;border-top:0px solid #000;border-right:1px solid #000;">`+shortData.gstNumber+`:`+shortData.gstDescription+`</td>
                    <td  style="border-left:0px solid #000;border-bottom:0px solid #000;border-top:0px solid #000;border-right:1px solid #000;">`+shortData.price+`</td>
                    <td  style="border-left:0px solid #000;border-bottom:0px solid #000;border-top:0px solid #000;border-right:1px solid #000;">9%</td>
                    <td  style="border-left:0px solid #000;border-bottom:0px solid #000;border-top:0px solid #000;border-right:1px solid #000;">`+Math.round(shortData.price*0.09)+`</td>
                    <td  style="border-left:0px solid #000;border-bottom:0px solid #000;border-top:0px solid #000;border-right:1px solid #000;">9%</td>
                    <td  style="border-left:0px solid #000;border-bottom:0px solid #000;border-top:0px solid #000;border-right:0px solid #000;">`+Math.round(shortData.price*0.09)+`</td>
                  </tr>`
                }
                printData +=`</tbody></table></td></tr>`
            }else{
                printData +=`<tr><td> CGST </td><td>Rs.`+ ((tobePrinted.tax+ptax)*0.5).toFixed(1)  + `</td></tr>
                        <tr><td> SGST </td><td>Rs.`+ ((tobePrinted.tax+ptax)*.5).toFixed(1)+ `</td></tr>`
            }

            /*------------------------------------------GST work stops-------------------------------*/

            printData +=`<tr><td> (+) Total Tax: </td><td>Rs.`+ (tobePrinted.tax+ptax).toFixed(1)  + `</td></tr>
                        <tr><td> Payable Amounst: </td><td>Rs.`+ (tobePrinted.payableAmount )+ `</td></tr>
                    </table>`;
            if(tobePrinted.payableAmount){
                printData += "<h4><b>Payment Method:</b></h4>";
                printData += "<table border='1' style='width: 100%; border-collapse: collapse; text-align: center'>";
                printData += `<tr>
                                <th>Payment Option</th>
                                <th>Amount</th>
                            </tr>`;
                for (var i = 0; i < tobePrinted.allPaymentMethods.length; i++) {
                    var method = tobePrinted.allPaymentMethods[i];
                    printData += "<tr>";
                    printData += `<td>` + method.name + `</td>
                             <td> Rs.`+ method.amount + `</td>`;
                    printData += "</tr>";
                }
            }
           

            printData += "</table><br><p> Thankyou for availing services at Be U-" + parlorName +". We hope you had a pleasant experience.</p>";
            $('#publishAndPrint').modal('hide');


            var w = window.open();
            w.document.write(printData);
            w.document.close();
            if($scope.x>0){
                w.print();
                w.close();
            }else {
                var is_chrome = Boolean(window.chrome);
                if (is_chrome) {
                    w.onload = function () {
                        $scope.x++;
                        w.print();
                        w.close();
                    };
                }
                else {
                    w.print();
                    w.close();
                }
            }
            //$scope.changeStatus(index, 3);
        };
        $scope.hover=false;
        $scope.numberOfButtonsVisible=4;
        /* $scope.buttonArrayLength=10;*/
        $scope.activeButtonDummyObject={};
        $scope.disablePreviousFlag=true;
        $scope.disableNextFlag=false;

        $scope.buttonArray=[];
       $scope.callPaginationInitialisation=function(yesNoFlag){
           $scope.hover=false;
           $scope.numberOfButtonsVisible=4;
           /* $scope.buttonArrayLength=10;*/
           $scope.activeButtonDummyObject={};
           $scope.disablePreviousFlag=true;
           $scope.disableNextFlag=false;
           $scope.buttonArray=[];
           var indx1=0;
           while(indx1<$scope.buttonArrayLength){
               var obj={"value":indx1+1,"active":false,"showFlag":false};
               $scope.buttonArray.push(obj);
               indx1++;
           }
           if(($scope.buttonArrayLength>=3)&&($scope.buttonArrayLength-$scope.numberOfButtonsVisible>=2)){
               for(var i=1;i<=$scope.numberOfButtonsVisible;i++){
                   $scope.buttonArray[i].showFlag=true;
               }//we see that numberOfButtonsVisible is the value which says that the number of buttons visible should be 4 so ,i=1 is done so that as first button is forcefully made visible(below) we dont care about that and we we make the next 4 buttons visible(value of numberOfButtonsVisible)
           }
           if(yesNoFlag=='yes'){
               // $scope.buttonArray[0].active=true;                              //this is made so that thehighlight stays on the first button
               $scope.buttonArray[0].showFlag=true;                            //and it is also visible
               $scope.buttonArray[$scope.buttonArrayLength-1].showFlag=true;   //this is done so that the last button is visible(not highlighted)
               $scope.activeButtonDummyObject= $scope.buttonArray[0];
           }

       }
                //in the whole code we need the active button to decide the pagination                                                                      steps so this id done to get the current active buttons object.

        $scope.buttonValue=function(valuePassed){                       //this is the function which gets hit when the button is clicked
            if(valuePassed.active){                                     //if the button is already active then nothing happens
                return;
            }else{
                //console.log(valuePassed.value);//required value for api
                $scope.callApi(valuePassed.value);
                if(valuePassed.value==1){
                    $scope.disablePreviousFlag=true;
                }else{
                    $scope.disablePreviousFlag=false;
                }
                if(valuePassed.value==$scope.buttonArray.length){
                    $scope.disableNextFlag=true;
                }else{
                    $scope.disableNextFlag=false;
                }
                $scope.activeButtonDummyObject=valuePassed;//so here if the button clicked was not active then the one which is clicked ,its                                                  object is made the active one
                valuePassed.active=!valuePassed.active;    //toggle of active flag is done to make the clicked button active and get highlighted
                var indx2=0;
                while(indx2<$scope.buttonArray.length){     //this loop is carried to remove the highlight from all the other buttons(actually                                                  from the at button which is active by finding  the active button)
                    if($scope.buttonArray[indx2].value!=valuePassed.value){
                        $scope.buttonArray[indx2].active=false;
                    }
                    indx2++;
                }
            }

        }
        $scope.goToPrevious=function(){

            //console.log( $scope.activeButtonDummyObject);
            for(var i=0;i<$scope.buttonArray.length;i++){

                if(($scope.buttonArray[i].value==$scope.activeButtonDummyObject.value)){
                    for(var k=1;k<$scope.buttonArray.length-1;k++){
                        if(($scope.activeButtonDummyObject.value>$scope.numberOfButtonsVisible)){
                            $scope.buttonArray[k].showFlag=false;
                        }
                    }
                    for(var j=0;j<$scope.numberOfButtonsVisible;j++){
                        if(i-j>0){
                            $scope.buttonArray[i-j].showFlag=true;
                        }
                    }
                    if($scope.buttonArray[1].showFlag==false){
                        $scope.firstDotsFlag=true;
                    }else{
                        $scope.firstDotsFlag=false;

                    }
                    if($scope.buttonArray[$scope.buttonArray.length-2].showFlag==true){
                        $scope.secondDotsFlag=false;
                    }else{
                        $scope.secondDotsFlag=true;

                    }
                    break;


                }
            }
            if($scope.activeButtonDummyObject.value>1){
                var indx2=0;
                while(indx2<$scope.buttonArray.length){
                    if($scope.buttonArray[indx2].value==$scope.activeButtonDummyObject.value){
                        $scope.buttonArray[indx2-1].active=true;
                        $scope.activeButtonDummyObject= $scope.buttonArray[indx2-1];
                        // console.log($scope.activeButtonDummyObject.value); //required value for api
                        $scope.callApi($scope.activeButtonDummyObject.value);
                        if($scope.activeButtonDummyObject.value==1){
                            $scope.disablePreviousFlag=true;
                        }else{
                            $scope.disablePreviousFlag=false;
                        }
                        if($scope.activeButtonDummyObject.value==$scope.buttonArray.length){
                            $scope.disableNextFlag=true;
                        }else{
                            $scope.disableNextFlag=false;
                        }
                        $scope.buttonArray[indx2].active=false;
                        break;
                    }
                    indx2++;
                }

            }

        }
        $scope.goToNext=function(){
            if($scope.activeButtonDummyObject.value<$scope.buttonArrayLength){ //it is checked that the highlight is not on the last button as                                                                          uske baad no next

                for(var i=0;i<$scope.buttonArray.length;i++){
                    if(($scope.buttonArray[i].value==$scope.activeButtonDummyObject.value)){

                        for(var k=1;k<$scope.buttonArray.length-1;k++){
                            if(($scope.buttonArray.length+1>$scope.numberOfButtonsVisible+$scope.activeButtonDummyObject.value)){
                                $scope.buttonArray[k].showFlag=false;
                            }
                        }
                        for(var j=0;j<$scope.numberOfButtonsVisible;j++){
                            if(i+j<$scope.buttonArray.length){
                                $scope.buttonArray[i+j].showFlag=true;
                            }
                        }
                        if($scope.buttonArray[1].showFlag==false){
                            $scope.firstDotsFlag=true;
                        }else{
                            $scope.firstDotsFlag=false;

                        }
                        if($scope.buttonArray[$scope.buttonArray.length-2].showFlag==true){
                            $scope.secondDotsFlag=false;
                        }else{
                            $scope.secondDotsFlag=true;

                        }
                        break;


                    }
                }
                var indx3=0;
                while(indx3<$scope.buttonArray.length){                         //this loop makes the next button active simple
                    if($scope.buttonArray[indx3].value==$scope.activeButtonDummyObject.value){
                        $scope.buttonArray[indx3+1].active=true;
                        $scope.activeButtonDummyObject= $scope.buttonArray[indx3+1];
                        //console.log($scope.activeButtonDummyObject.value); //required value for api
                        $scope.callApi($scope.activeButtonDummyObject.value);
                        if($scope.activeButtonDummyObject.value==$scope.buttonArray.length){
                            $scope.disableNextFlag=true;
                        }else{
                            $scope.disableNextFlag=false;
                        }
                        if($scope.activeButtonDummyObject.value==1){
                            $scope.disablePreviousFlag=true;
                        }else{
                            $scope.disablePreviousFlag=false;
                        }
                        $scope.buttonArray[indx3].active=false;
                        break;
                    }
                    indx3++;
                }
            }
        }


        $scope.filterApplied=function(){

            // console.log($scope.filter.date)
            // console.log($scope.nameSearched+' '+$scope.appointmentIdSearched);
            // console.log("pageNumber"+$scope.activeButtonDummyObject.value);
            if(($scope.nameSearched=='')&&($scope.appointmentIdSearched=='')){
                $scope.callPaginationInitialisation();
                $scope.callApi(1);

            }else{
                if($scope.nameSearched==undefined ){
                    $scope.nameSearched='';
                }
                if($scope.appointmentIdSearched==undefined){
                    $scope.appointmentIdSearched='';
                }
                // console.log("hello")
                $http({
                    url: '/role3/appointment?page=1&name='+$scope.nameSearched+'&appointmentId='+$scope.appointmentIdSearched+'&startDate='+$scope.filter.date.startDate._d+'&endDate='+$scope.filter.date.endDate._d,
                    method: 'GET'
                  /*  data:{page:$scope.activeButtonDummyObject.value,name:$scope.nameSearched,appointmentId:$scope.appointmentIdSearched}*/
                }).then(function(response) {
                    // console.log(response);
                    $rootScope.appointments=response.data.data.appointments;
                    $scope.appointments1=$rootScope.appointments;
                    $scope.buttonArrayLength=response.data.data.totalPage;
                    $scope.callPaginationInitialisation('yes');
                    app=$rootScope.appointments;
                    // console.log(app);


                });
            }
        }
        $scope.removeFilterApplied=function(){
            $scope.nameSearched='';
            $scope.appointmentIdSearched='';
            $http.get("/role3/appointment?page=1").success(function(response, status){
                // console.log('h4',response);
                $rootScope.appointments=response.data.appointments;
                $scope.buttonArrayLength=response.data.totalPage;
                $scope.callPaginationInitialisation('yes');
                $scope.appointments1=$rootScope.appointments;
                app=$rootScope.appointments;
                // console.log(app);
                $scope.tableParams = new NgTableParams({ count: 5 }, { counts: [5, 10, 20], dataset: app});
            });
        }




      $scope.exportToExcel = function (tableId) {


         var exportHref = Excel.tableToExcel(tableId, 'WireWorkbenchDataExport');
          $timeout(function () {
              location.href = exportHref;
          }, 100); // trigger download


      }

    });
