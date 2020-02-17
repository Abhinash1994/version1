'use strict'

angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','isteven-multi-select','daterangepicker','ngSanitize', 'ngCsv'])
    .controller('onlinePaymentReportCtrl', function ($scope, $compile, $http, $timeout, $window, $log,NgTableParams,Excel,$rootScope) {
        // console.log('inside online payment controller ');

        $scope.dateRangeSelected = {startDate: moment().startOf('month'), endDate: moment()};
        $scope.parlors='';
        $scope.selectedParlor=[];
        $scope.parlorsToBeShown=[];
        $scope.onlinePaymentParlors='';
        $http.post("/role1/allParlors").success(function(response, status){
            // console.log("parlors list obtained");
            // console.log(response.data);
            $scope.parlors=response.data;
            //$scope.parlors = response.data;
        });
        
        function getDates(startDate, stopDate) {
            var dateArray = [];
            var currentDate = moment(startDate);
            var stopDate = moment(stopDate);
            while (currentDate <= stopDate) {
                dateArray.push( moment(currentDate).format('MM/DD/YYYY') )
                currentDate = moment(currentDate).add(1, 'days');
            }
            return dateArray;
        }

        // console.log($scope.dateRangeSelected)

        $scope.applyFilter=function(){
            // console.log($scope.dateRangeSelected.startDate._d);
            // console.log($scope.dateRangeSelected.endDate._d);
            $http.post("/role1/onlinePayment",{'startDate':$scope.dateRangeSelected.startDate._d,'endDate':$scope.dateRangeSelected.endDate._d}).success(function(response, status){
                //console.log('online payment');
                //console.log(response.message);
                $scope.onlinePaymentParlors=response.message;
                // console.log(angular.copy(response.message));
                //console.log(getDates($scope.dateRangeSelected.startDate._d,$scope.dateRangeSelected.endDate._d));
                $scope.maxDateArray=getDates($scope.dateRangeSelected.startDate._d,$scope.dateRangeSelected.endDate._d);
                /*$scope.onlinePaymentParlors.find(function(element){
                    if($scope.maxDateArray.length<element.values.length){
                        $scope.maxDateArray=element.values;
                    }
                })*/
                // console.log($scope.maxDateArray);
                $scope.onlinePaymentParlors.find(function(element){
                    if($scope.maxDateArray.length>element.values.length){
                        for(var i=0;i<$scope.maxDateArray.length;i++){
                            var flag=false;
                            if($scope.maxDateArray.length>element.values.length){
                                for(var j=0;j<element.values.length;j++){
                                 if(element.values[j].date!=$scope.maxDateArray[i]){
                                     flag=true;
                                     var obj={
                                         'date':$scope.maxDateArray[i],
                                         'cashAmount':0,
                                         'razorAmount':0,
                                         'razorCount':0,
                                         'cashCount':0
                                     }
                                    }
                                }   
                            }
                            if(flag){
                                    element.values.push(obj);
                                }
                        }
                    }
                })
                $scope.onlinePaymentParlors.find(function(element){
                    var totalCash=0;
                    var totalRazor=0;
                    var totalCashCount=0;
                    var totalRazorCount=0;
                    element.values.find(function(valElement){
                        totalCash=valElement.cashAmount+totalCash;
                        totalRazor=valElement.razorAmount+totalRazor;
                        totalCashCount=valElement.cashCount+totalCashCount;
                        totalRazorCount=valElement.razorCount+totalRazorCount;
                    })
                    element.totalCashAmount=totalCash;
                    element.totalRazorAmount=totalRazor;
                    element.totalCashCount=totalCashCount;
                    element.totalRazorCount=totalRazorCount;
                })
                
                $scope.onlinePaymentParlors.find(function(element){
                    element.values.sort(function(a,b){  return new Date(a.date).getTime() - new Date(b.date).getTime()  });
                });
                // console.log($scope.onlinePaymentParlors)
                //console.log(angular.copy($scope.onlinePaymentParlors));
                if($scope.selectedParlor.length>0){
                    $scope.changeParlor($scope.selectedParlor);
                }else{
                    $scope.parlorsToBeShown=$scope.onlinePaymentParlors;
                    dateTotalGrandTotal($scope.parlorsToBeShown);
                }
            });
        }
        $scope.applyFilter();

        $scope.changeParlor=function(parlorsSelected){
            if(parlorsSelected.length>0){
                    $scope.parlorsToBeShown=[];
                    $scope.selectedParlor=parlorsSelected;
                    for(var i=0;i<parlorsSelected.length;i++){
                        $scope.onlinePaymentParlors.find(function(element){
                            if(element._id.parlorId==parlorsSelected[i].parlorId){
                                 $scope.parlorsToBeShown.push(element);   
                            }
                        })
                    }
                    dateTotalGrandTotal($scope.parlorsToBeShown);
                    // console.log($scope.grandTotal)
                    // console.log($scope.datesTotalArray);
                    //console.log(parlorsSelected);
                    //console.log($scope.parlorsToBeShown);
                    }else{
                        $scope.parlorsToBeShown=$scope.onlinePaymentParlors;
                        dateTotalGrandTotal($scope.parlorsToBeShown);
                    }

        }
        function dateTotalGrandTotal(parlorsToBeShown){
            $scope.datesTotalArray=[];
                    $scope.grandTotalRazor=0;
                    $scope.grandTotalCash=0;
                    $scope.grandTotalRazorCount=0;
                    $scope.grandTotalCashCount=0;
                    for(var j=0;j<$scope.maxDateArray.length;j++){
                        var total={
                            'razorAmount':0,
                            'cashAmount':0,
                            'razorCount':0,
                            'cashCount':0
                        };
                        //total of total amounts of all salons
                        for(var i=0;i<parlorsToBeShown.length;i++){
                            total.razorAmount=total.razorAmount+parlorsToBeShown[i].values[j].razorAmount;
                            total.cashAmount=total.cashAmount+parlorsToBeShown[i].values[j].cashAmount;
                            total.razorCount=total.razorCount+parlorsToBeShown[i].values[j].razorCount;
                            total.cashCount=total.cashCount+parlorsToBeShown[i].values[j].cashCount;
                            if(j==0){
                                $scope.grandTotalRazor=$scope.grandTotalRazor+parlorsToBeShown[i].totalRazorAmount;
                                $scope.grandTotalCash=$scope.grandTotalCash+parlorsToBeShown[i].totalCashAmount;
                                $scope.grandTotalRazorCount=$scope.grandTotalRazorCount+parlorsToBeShown[i].totalRazorCount;;
                                $scope.grandTotalCashCount=$scope.grandTotalCashCount+parlorsToBeShown[i].totalCashCount;;
                            }
                        }
                        $scope.datesTotalArray.push(total);
                    }
        }
        $scope.exportToExcel = function (tableId) { // ex: '#my-table'
            var exportHref = Excel.tableToExcel(tableId, 'WireWorkbenchDataExport');
            $timeout(function () {
                location.href = exportHref;
            }, 100); // trigger download
        }
    });