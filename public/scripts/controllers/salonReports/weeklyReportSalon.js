angular.module('sbAdminApp')
    .controller('weeklyReportSalonCtrl', function($scope, $http, $stateParams, $window,NgTableParams,Excel, $timeout) {

            // console.log("inside weeklyReportSalonCtrl");
        $scope.weeksName = [{"week" :"First WeeK"},
            {"week" : "Second Week"},
            {"week" : "Third Week"},
            {"week" : "Fourth Week"},
            {"week" : "Fifth Week"}];


         

        $scope.months=[{"month":"January","value":"0"},{"month":"Feburary","value":"1"},{"month":"March","value":"2"},{"month":"April","value":"3"},{"month":"May","value":"4"},{"month":"June","value":"5"},{"month":"July","value":"6"},{"month":"August","value":"7"},{"month":"September","value":"8"},{"month":"October","value":"9"},{"month":"November","value":"10"},{"month":"December","value":"11"}];
        $scope.year=['2017','2018','2019','2020','2021','2022','2023','2024','2025'];
        $scope.item1=$scope.year[0]

        $scope.sortType='parlorName';
        $scope.sortFlag=false;
        $scope.parlorIdsToBeSent=["587088445c63a33c0af62727"];

        $scope.changeSortType=function(valuePassedForSorting){
            if($scope.sortType!=valuePassedForSorting){
                $scope.sortType=valuePassedForSorting;
                $scope.sortFlag=true;
            }else{
                $scope.sortType='-'+valuePassedForSorting;
            }
        }
        var today=new Date();
        $scope.selectedMonth=(today.getMonth()).toString();
        $http.post("/role3/report/weeklyReport",{month:today.getMonth()}).success(function(response, status){
            $scope.datas = response;
            // console.log("this is the initial response for month value 1");
            // console.log( $scope.datas);
            $scope.headings=[];
            for(var i=0;i<$scope.datas.length;i++){
                var grandTotal=0;
                for(var j=0;j<$scope.datas[i].weekData.length;j++){
                    grandTotal=grandTotal+parseInt($scope.datas[i].weekData[j].totalSale);
                }
                $scope.datas[i]['grandTotal']=grandTotal;
            }

        });
        $scope.monthChanged=function(month){
            // console.log("this is the month value which is being sent");
            // console.log(month);
            
            $http.post("/role3/report/weeklyReport",{month:month,year:$scope.year.item1}).success(function(response, status){
                // console.log("final");
                // $scope.datas = response;
               
                for(var i=0;i<$scope.datas.length;i++){
                    var grandTotal=0;
                    for(var j=0;j<$scope.datas[i].weekData.length;j++){
                        grandTotal=grandTotal+parseInt($scope.datas[i].weekData[j].totalSale);
                    }
                    $scope.datas[i]['grandTotal']=grandTotal;
                }
                $scope.datas.forEach(function(employees){
                    employees.data1=[];
                    employees.weekData.forEach(function(dep){
                        employees.data1.push(dep.serviceSale, dep.productSale, dep.totalSale);
                    });
                    $scope.weekRange  =  employees.weekData;

                });
            });
        }

        $scope.exportToExcel = function (tableId) { // ex: '#my-table'
            var exportHref = Excel.tableToExcel(tableId, 'WireWorkbenchDataExport');
            $timeout(function () {
                location.href = exportHref;
            }, 100); // trigger download
        }
    });