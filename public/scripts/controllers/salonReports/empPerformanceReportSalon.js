
angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','isteven-multi-select','daterangepicker','ngSanitize', 'ngCsv'])
    .controller('empPerformanceReportSalonCtrl', function($scope, $compile, $http, $timeout, $window, $log,NgTableParams,Excel, $timeout) {
        // console.log("inside emp performance");
        getMonthName = function (v) {
            var n = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            return n[v]
        }
        $scope.month=[];
        $scope.months=[{"month":"January","value":"0"},{"month":"Feburary","value":"1"},{"month":"March","value":"2"},{"month":"April","value":"3"},{"month":"May","value":"4"},{"month":"June","value":"5"},{"month":"July","value":"6"},{"month":"August","value":"7"},{"month":"September","value":"8"},{"month":"October","value":"9"},{"month":"November","value":"10"},{"month":"December","value":"11"}];
        $scope.year=['2017','2018','2019','2020','2021','2022','2023','2024','2025'];
        $scope.item1=$scope.year[0]

         $scope.changeMonth=function(){
           //console.log($scope.selectedParlor);
        $scope.month=[];
        for(var i=0;i<$scope.selectedMonth.length;i++){
            $scope.month.push($scope.selectedMonth[i].value);
            }
            // console.log( $scope.month);
            }

        $scope.parlorIdsToBeSent=["587088445c63a33c0af62727"];

         var today=new Date();
//        $scope.dateRangeSelected={
//            startDate:{'_d':new Date(today.getFullYear(),today.getMonth()-2,1)},
//            endDate:{'_d':new Date()}
//        }
    
        // console.log("this is the initial date object");
            //$scope.monthSelect=today.getMonth();
            $scope.monthSelect = [today.getMonth(),today.getMonth()-1, today.getMonth()-2];
            //'month': $scope.monthSelect
        $http.post("/role3/report/empPerformanceReport",{'month': $scope.monthSelect}).success(function(response, status){
            $scope.employeeData = response;
            // console.log("This is the initial response");
            // console.log(response);
            $scope.headings=[];
            $scope.employeeData[0].month.forEach(function(mon){
                var mName=getMonthName(mon.month);
                $scope.headings.push("Total Revenue for " + mName );
                $scope.headings.push("Revenue in terms of 'x' - "+mName );
            });
            $scope.employeeData.forEach(function(employee){
                employee.data=[];
                employee.month.forEach(function(mon){

                    employees.data.push((mon.totalRevenue/employee.empSalary).toFixed(2));
                    if((mon.totalRevenue/employee.empSalary)>=5){
                        employees.data.push("Yes");

                    }
                });

            });

        })
        $scope.applyFilter=function(parlorId){
          // console.log( $scope.item1);
            // console.log("Final dates which are sent in the api");
            //console.log($scope.dateRangeSelected.startDate._d);
            //console.log($scope.dateRangeSelected.endDate._d);
            $http.post("/role3/report/empPerformanceReport",{'month':$scope.month,'year':$scope.year.item1}).success(function(response, status){
                $scope.employeeData = response;
                // console.log("this is the final response");
               console.log("hey",$scope.employeeData);
                $scope.headings=[];
                $scope.employeeData[0].month.forEach(function(mon){
                    var mName=getMonthName(mon.month);
                    $scope.headings.push("Total Revenue for " + mName );
                    $scope.headings.push("Revenue in terms of 'x' - "+mName );
                });
                $scope.employeeData.forEach(function(employee){
                    employee.data=[];
                    employee.month.forEach(function(mon){

                        employees.data.push((mon.totalRevenue/employee.empSalary).toFixed(2));
                        if((mon.totalRevenue/employee.empSalary)>=5){
                            employees.data.push("Yes");

                        }
                    });

                });

            })
        };

        $scope.exportToExcel = function (tableId) { // ex: '#my-table'
            var a={'exportHref':''};
            a.exportHref = Excel.tableToExcel(tableId, 'WireWorkbenchDataExport');
            $timeout(function () {
                location.href = a.exportHref;
            }, 100); // trigger download
        }

    })