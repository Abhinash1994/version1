angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','isteven-multi-select','daterangepicker','ngSanitize', 'ngCsv'])
    .controller('empPerformanceReportsCtrl', function($scope, $compile, $http, $timeout, $window, $log,NgTableParams,Excel, $timeout)
    {



        $scope.sendData={}

        $scope.employeeData=[];
        // console.log("Employee Segment " );
        getMonthName = function (v) {
            var n = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            return n[v]
        }


        $scope.check=function(){
            // console.log($scope.selectedMonth);


        }


        $scope.month=0;
        $scope.months=[{"month":"January","value":"0"},{"month":"Feburary","value":"1"},{"month":"March","value":"2"},{"month":"April","value":"3"},{"month":"May","value":"4"},{"month":"June","value":"5"},{"month":"July","value":"6"},{"month":"August","value":"7"},{"month":"September","value":"8"},{"month":"October","value":"9"},{"month":"November","value":"10"},{"month":"December","value":"11"}];

        $scope.changeMonth=function(){
            //console.log($scope.selectedParlor);
            $scope.month=[];
            for(var i=0;i<$scope.selectedMonth.length;i++){
                $scope.month.push($scope.selectedMonth[i].value);
            }
            // console.log( $scope.month);
        }




        $scope.parlorIdsToBeSent=0;
        $http.post("/role1/allParlors").success(function(response, status){
            $scope.parlors = response.data;
            // console.log($scope.parlors)
        });
        var today=new Date();

        $scope.monthSelect = [today.getMonth(),today.getMonth()-1, today.getMonth()-2];
        // console.log ($scope.monthSelect);

        $scope.applyFilter=function(parlorId){

            // console.log( $scope.month);
            // console.log("Filters changed API to be called");

            //console.log($scope.dateRangeSelected.startDate._d);
            //console.log($scope.dateRangeSelected.endDate._d);
            console.log("sending Data",{parlorId:$scope.selected,'month':$scope.sendData.selectedMonth});
            $http.post("/role1/getEmployeeReport",{parlorId:$scope.selected,'month':$scope.sendData.selectedMonth}).success(function(response, status){
                // console.log(response);
                $scope.employeeData=response;
                // console.log($scope.employeeData)

              });

            }


        $scope.exportToExcel = function (tableId) { // ex: '#my-table'
            var exportHref = Excel.tableToExcel(tableId, 'WireWorkbenchDataExport');
            $timeout(function () {
                location.href = exportHref;
            }, 100); // trigger download
        }
    })