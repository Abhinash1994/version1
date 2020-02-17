angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','isteven-multi-select','daterangepicker','ngSanitize', 'ngCsv'])
    .controller('empSegmentReportSalonCtrl', function($scope, $compile, $http, $timeout, $window, $log,NgTableParams,Excel, $timeout) {

   // console.log("inside empSegment report");

        $scope.months = [{"name": "January", "value": "01"}, {"name": "Feburary", "value": "02"}, {
            "name": "March",
            "value": "03"
        }, {"name": "April", "value": "04"}, {"name": "May", "value": "05"}, {
            "name": "June",
            "value": "06"
        }, {"name": "July", "value": "07"}, {"name": "August", "value": "08"}, {
            "name": "September",
            "value": "09"
        }, {"name": "October", "value": "10"}, {"name": "November", "value": "11"}, {
            "name": "December",
            "value": "12"
        }];
        $scope.selectedParlor=[];
        $scope.parlorIdsToBeSent=["587088445c63a33c0af62727"];
        var today=new Date();
        var x=new Date();
        var previous=x.setMonth(x.getMonth()-1);
        var jsonPrevious=new Date(previous)
        $scope.dateRangeSelected={
            startDate:{'_d':new Date(today.getFullYear(),today.getMonth(),1)},
            endDate:{'_d':new Date().toJSON()}
        }
        // console.log("this is the initial date object");
        // console.log($scope.dateRangeSelected);
        $http.post("/role3/report/empSegmentReport",{'startDate':$scope.dateRangeSelected.startDate._d,'endDate':$scope.dateRangeSelected.endDate._d}).success(function(response, status){
            $scope.employeeData = response;
            // console.log("this is the initial response");
            // console.log(response);
            $scope.headings=[];
            $scope.headings1=[];
            $scope.employeeData[0].dep.forEach(function(heading){
                $scope.headings.push("Count");
                $scope.headings.push("Revenue");
                $scope.headings1.push(heading.unit);
                
            });
            $scope.employeeData.forEach(function(employees){
                employees.data=[];
                employees.dep.forEach(function(dep){
                    employees.data.push(dep.serviceNo);
                    employees.data.push(dep.totalRevenue);
                });

            });
             $scope.fixedHeaderMethod();
           
        });
        $scope.applyFilter=function(parlorId){
            // console.log("Final dates which are sent in the api");
            //console.log($scope.parlorIdsToBeSent);
            // console.log($scope.dateRangeSelected.startDate._d);
            // console.log($scope.dateRangeSelected.endDate._d);
            $http.post("/role3/report/empSegmentReport",{'startDate':$scope.dateRangeSelected.startDate._d,'endDate':$scope.dateRangeSelected.endDate}).success(function(response, status){
                $scope.employeeData = response;
                // console.log("this is the final response");
                // console.log(response);
                $scope.headings=[];
                $scope.employeeData[0].dep.forEach(function(heading){
                    $scope.headings.push(heading.unit +" Count");
                    $scope.headings.push(heading.unit +" Revenue");
                });
                $scope.employeeData.forEach(function(employees){
                    employees.data=[];
                    employees.dep.forEach(function(dep){
                        employees.data.push(dep.serviceNo);
                        employees.data.push(dep.totalRevenue);
                    });

                });
                        $('#selector').fixedHeaderTable('destroy');
                   $scope.fixedHeaderMethod();
                $scope.parlorIdsToBeSent=[];
            });
        };
        $scope.search = function(){
             $('#selector').fixedHeaderTable('destroy');
                   $scope.fixedHeaderMethod();
        }
        $scope.fixedHeaderMethod = function(){
               $timeout(
                function() {
                    $('#selector').fixedHeaderTable({
                        fixedColumn: true});
                    var myTable = document.getElementById('firstRowFirstCell');
                    console.log(document.getElementById('firstRowSecondCell').offsetHeight)
                    document.getElementById('firstRowFirstCell').style.height=document.getElementById('firstRowSecondCell').offsetHeight+'px';
                    console.log(document.getElementsByClassName("fht-cell"));
                    var a=document.getElementsByClassName("fht-cell");
                    var mid=(a.length-1)/2
                    for(var i=1;i<=mid;i++){
                        a[i].clientWidth=a[i+mid].clientWidth;
                        a[i].offsetWidth=a[i+mid].clientWidth;
                        a[i].scrollWidth=a[i+mid].clientWidth;
                        a[i].style.width=a[i+mid].clientWidth+'px';
                            console.log(i+" "+(i+mid));
                        }
                }
             );
            
        }
        $scope.exportToExcel = function (tableId) { // ex: '#my-table'
            var exportHref = Excel.tableToExcel(tableId, 'WireWorkbenchDataExport');
            $timeout(function () {
                location.href = exportHref;
            }, 100); // trigger download
        }
    })
