'use strict';
/**
 * Created by beusalon on 2/17/2017.
 */
// angular.module('sbAdminApp')
//     .controller('test', function($scope, $http, $stateParams, $window,NgTableParams) {
//     console.log("Hello");
//         // $http.post("/role1/parlorList").success(function(response, status){
//         //     $scope.parlors = response.data;
//         //     console.log($scope.parlors);
//         // });
//
//         $scope.record= [
//             {
//                 "Name" : "Alfreds Futterkiste",
//                 "Country" : "Germany"
//             },
//             {
//                 "Name" : "Alfreds Futterkiste",
//                 "Country" : "Germany"
//             },
//             {
//                 "Name" : "Alfreds Futterkiste",
//                 "Country" : "Germany"
//             },
//             {
//                 "Name" : "Alfreds Futterkiste",
//                 "Country" : "Germany"
//             }
//         ]
//         $scope.head=[
//             {
//                 "Title":"Country name",
//                 "Address":"City"
//             }
//         ]
//         console.log($scope.record);
//         console.log($scope.head);
//         $scope.list = [];
//         $scope.text = 'hello';
//         $scope.submit = function() {
//             if ($scope.text) {
//                 $scope.list.push(this.text);
//                 $scope.text = '';
//             }
//         };
//       $scope.name=
//         $scope.list1 = [
//             {
//             "name":"India"
//         },
//             {
//                 "name":"Bihar"
//             },
//             {
//                 "name":"Patna"
//             }
//         ];
        // $scope.data = [{
        //     "name": "Christmas Eve Last Year",
        //     "country": "US",
        //     "date": "2014-12-24"
        // }, {
        //     "name": "Christmas",
        //     "country": "US",
        //     "date": "2015-12-25"
        // }, {
        //     "name": "First Day of Kwanzaa",
        //     "country": "US",
        //     "date": "2017-12-20"
        // }, {
        //     "name": "Second Day of Kwanzaa",
        //     "country": "US",
        //     "date": "2015-12-27"
        // }];
// console.log($scope.data);
//         console.log($scope.list1);
//         $scope.optionDisplay='';
//         $scope.showOptionFunction=function(){
//             $scope.data = [{
//                 "name": "Christmas Eve Last Year",
//                 "country": "India",
//                 "date": "2014-12-24"
//             }, {
//                 "name": "Christmas",
//                 "country": "Bihar",
//                 "date": "2015-12-25"
//             }, {
//                 "name": "muzaff",
//                 "country": "Bihar",
//                 "date": "2017-12-20"
//             },
//                 {
//                     "name": "First Day of Kwanzaa",
//                     "country": "Bihar",
//                     "date": "2017-12-20"
//                 },
//                 {
//                     "name": "First Day of Kwanzaa",
//                     "country": "Bihar",
//                     "date": "2017-12-20"
//                 },
//                 {
//                     "name": "First Day of Kwanzaa",
//                     "country": "Bihar",
//                     "date": "2017-12-20"
//                 },{
//                 "name": "Second Day of Kwanzaa",
//                 "country": "Patna",
//                 "date": "2015-12-27"
//             }];
//             // alert($scope.optionDisplay);
//         }
//         $http.post("/role1/parlorList").success(function(response, status){
//             $scope.parlors = response.data;
//             console.log($scope.parlors);
//         });
//         $scope.parlorId=''
//         $scope.parlorId=function(parlorId){
//             $http.post("/role1/report/empPerformanceReport",{parlorId:parlorId}).success(function(response, status){
//                 $scope.employeeData = response;
//                 console.log(response);
//                 $scope.headings=[];
//                 $scope.employeeData[0].dep.forEach(function(heading){
//                     $scope.headings.push(heading.unit +" Count");
//                     $scope.headings.push(heading.unit +" Revenue");
//                 });
//             });
//         }
//
//     });

angular.module('sbAdminApp', [])

.controller('test',['$scope','$http',
    function($scope,$http, $stateParams, $window,NgTableParams) {
        $scope.d=12785;
        $scope.a=1790;
        $scope.b=64;
        $scope.c=64;
        $scope.amount=$scope.a+$scope.b+$scope.c+$scope.d;
        $scope.convertNumberToWords1 = function(num) {
            return convertNumberToWords(num);
        };
$scope.data={};

        $scope.Add=function(){

            console.log($scope.data);

               $http.post('/api/testManj',$scope.data).then(function(res){
                console.log(res)

               })
        }

console.log($scope.amount);
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
        $http.post("/role1/parlorList").success(function(response, status){
            $scope.parlors = response.data;
            console.log($scope.parlors);
        });
        var period = $scope.selectedPeriod ? $scope.selectedPeriod : 1;
        $http.get("/role1/settlementReport?parlorId=5881d125eec0e54abc393dea&period=2").success(function(response, status){
            $scope.data = response.data;
            console.log($scope.data);
            $scope.salonName=$scope.data.parlorName;
            $scope.salonName=$scope.data.parlorAddress;
            console.log($scope.salonName);
        });
        $scope.printToCart = function(printSectionId) {
            var innerContents = document.getElementById(printSectionId).innerHTML;
            var popupWinindow = window.open('', '_blank', 'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
            popupWinindow.document.open();
            popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + innerContents + '</html>');
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


        $scope.openPDF = function(index){

            var source="../website/images/trial%20svg%20(1).svg";
            var tobePrinted = isNaN(index) ? index : $scope.appointments[index];
            var printData = "<div style='width: 50%;margin: auto' ><header><div style='float: left;width: 200px;margin-top: 2%;margin-left:4%;zoom: 1.2;'> <img src='http://res.cloudinary.com/dyqcevdpm/image/upload/v1491484496/beu-logo_srvetg.png' width='150' height='60' alt='Beu salons' /> </div> <div style='float:right;color:#777;padding-top:3%;padding-right: 1%;width:36%;'> <div><span style='padding-left:0%;font-family:'latoRegular';'>Download App</span><span style='padding-left:12%;text-transform:capitalize;font-family:'latoRegular';'>Avail Freebies</span></div> <div style='padding-top:11px;'> <span style='padding-left:24%;'><img src='http://res.cloudinary.com/dyqcevdpm/image/upload/v1491484496/ICON_3_g5skqb.png' alt='android icon' width='20' height='20'></span> <span style='padding-left: 2%;'><img src='http://res.cloudinary.com/dyqcevdpm/image/upload/v1491484496/ICON_2_abyddu.png' alt='Apple-icon icon' width='20' height='20'></span> <span style='padding-left:42%;'><img src='http://res.cloudinary.com/dyqcevdpm/image/upload/v1491484496/ICON_hjnl1h.png' alt='Apple-icon icon' width='20' height='20'></span> </div> </div> </header>";
            printData += "<div style='clear:both;'></div> <nav style='height:40px;background-color:#000;color:#ffff;'> <div > <ul style='list-style:none;'> <li style='float:left;color:#fff;width:19%;line-height:40px;border-right:1px solid #fff;text-align:center;font-family:'LetterGothicStd-Bold';'>HAIR</li> <li style='float:left;color:#fff;width:19%;line-height:40px;border-right:1px solid #fff;text-align:center;font-family:'LetterGothicStd-Bold';'>BEAUTY</li> <li style='float:left;color:#fff;width:19%;line-height:40px;border-right:1px solid #fff;text-align:center;font-family:'LetterGothicStd-Bold';'>SPA</li> <li style='float:left;color:#fff;width:19%;line-height:40px;border-right:1px solid #fff;text-align:center;font-family:'LetterGothicStd-Bold';'>MAKEUP</li> <li style='float:left;color:#fff;width:19%;line-height:40px;text-align:center;font-family:'LetterGothicStd-Bold';'>HAND & FEET</li> </ul> </div> </nav>";
            printData += "	<div style='clear:both;'></div><div style='height:300px;background-image:url(http://res.cloudinary.com/dyqcevdpm/image/upload/v1491832623/PANEL1_weyqjt.jpg);background-size: contain;'><h2 style='text-align:center;line-height:300px;color:#f5094c;font-family:'Lato-Light';'>TRENDY TREATS ON REPEAT!</h2> </div> <div style='height:200px;background:#fff;'> <p style='text-align:center;color:#000;padding-top:38px;font-size:20px;font-family:'Lato-Light';'>You availed <b style='font-family:'latoBold';'>Smoothening</b> at Be U outlet on <b style='font-family:'latoBold';'>27th march 2017</b></p> <p style='text-align:center;color:#000;font-family:'Lato-Light';'>Our experts recommend</p> <p style='text-align:center;color:#000;font-family:'Lato-Light';'>you to indulge in <b style='font-family:'latoBold';'>Hair Spa</b></p> <h1 style='text-align:center;color:#000;font-family:'latoBold';'>Book Now</h1> </div>";
            printData += "<footer> <div style='text-align:center;height:100px;padding-top:3%;font-family:'Lato-Light';color:#9f9f9f;font-size: 14px;line-height: 24px;'> <span><img src='http://res.cloudinary.com/dyqcevdpm/image/upload/v1491484496/social__ICON_2_dsofvy.png' alt='facebook' width='30' height='30'></span> <span style='padding-left:3%;'><img src='http://res.cloudinary.com/dyqcevdpm/image/upload/v1491484496/social__ICON_3_qdqnsk.png' alt='facebook' width='30' height='30'></span> <span style='padding-left:3%;'><img src='http://res.cloudinary.com/dyqcevdpm/image/upload/v1491484496/social__ICON_4_twk3mc.png' alt='facebook' width='30' height='30'></span> <p>Disclaimer: Facea coritia que dolessecto et, ut que eturem fuga. Obis inum rerume Ehenimusa verchic ipsanimi, ernam nos aut lantum rem.Exereius, voloribus sus.Nam soluptio id minctiis ipsunte mporro ipsunt. </p> </div> </footer>";

            var w = window.open();
            w.document.write(printData);
            w.document.close();
            if(windowOpenCount>0){
                w.print();
                w.close();
            }else {
                var is_chrome = Boolean(window.chrome);
                if (is_chrome) {
                    w.onload = function () {
                        windowOpenCount++;
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
        }
    }]);


