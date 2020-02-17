
angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','isteven-multi-select','daterangepicker','ngSanitize', 'ngCsv'])
    .controller('empPerformanceCtrl', function($scope, $compile, $http, $timeout, $window, $log,NgTableParams,Excel, $timeout) {
    
    // console.log("Employee Segment " );
        getMonthName = function (v) {
            var n = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            return n[v]
        }

        
       
        $scope.month=[];
        $scope.months=[{"month":"January","value":"0"},{"month":"Feburary","value":"1"},{"month":"March","value":"2"},{"month":"April","value":"3"},{"month":"May","value":"4"},{"month":"June","value":"5"},{"month":"July","value":"6"},{"month":"August","value":"7"},{"month":"September","value":"8"},{"month":"October","value":"9"},{"month":"November","value":"10"},{"month":"December","value":"11"}];
        
         $scope.changeMonth=function(){
           //console.log($scope.selectedParlor);
        $scope.month=[];
        for(var i=0;i<$scope.selectedMonth.length;i++){
            $scope.month.push($scope.selectedMonth[i].value);
            }
            // console.log( $scope.month);
            }
        
        
        
        
        $scope.parlorIdsToBeSent=[];
        $http.post("/role1/allParlors").success(function(response, status){
            $scope.parlors = response.data;
        });
    var today=new Date();
//        $scope.dateRangeSelected={
//            startDate:{'_d':new Date(today.getFullYear(),today.getMonth()-2,1)},
//            endDate:{'_d':new Date()}
//        }
//        
         //$scope.monthSelect=today.getMonth();
            $scope.monthSelect = [today.getMonth(),today.getMonth()-1, today.getMonth()-2];
        // console.log ($scope.monthSelect);
  $http.post("/role1/report/empPerformanceReport",{'month': $scope.monthSelect}).success(function(response, status){
            $scope.employeeData = response;
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
        $scope.changeParlor=function(){
            $scope.parlorIdsToBeSent=[];
            for(var i=0;i<$scope.selectedParlor.length;i++){
                $scope.parlorIdsToBeSent.push($scope.selectedParlor[i].parlorId);
            }
        }
  $scope.applyFilter=function(parlorId){
      // console.log("Filters changed API to be called");
      // console.log($scope.parlorIdsToBeSent);
      //console.log($scope.dateRangeSelected.startDate._d);
      //console.log($scope.dateRangeSelected.endDate._d);
      // console.log($scope.month);
      $http.post("/role1/report/empPerformanceReport",{parlorIds:$scope.parlorIdsToBeSent,'month':$scope.month}).success(function(response, status){
         // console.log(response);
          $scope.employeeData = response;
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
  };
  
  $scope.exportToExcel = function (tableId) { // ex: '#my-table'
      var exportHref = Excel.tableToExcel(tableId, 'WireWorkbenchDataExport');
      $timeout(function () {
          location.href = exportHref;
      }, 100); // trigger download
  }
})