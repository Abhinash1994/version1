'use strict';

angular.module('sbAdminApp', ['ui.calendar','ui.bootstrap','ngTable','daterangepicker'])
.controller('employeeIncentiveReport', function($scope,$http,$timeout,Excel) {
     $scope.dateOptions = {
            datepickerMode: "'month'",
            minMode: 'month'
        };

    $scope.today = function() {
    $scope.dt = new Date();
  };

  $scope.b=[""]
  $scope.today();
   $scope.popup1 = {
    opened: false
  };

     $scope.formats = ['MMMM,yy'];
     $scope.format = $scope.formats[0];

    $scope.open1 = function() {
    $scope.popup1.opened = true;
  };



  $scope.filter=function(){
      $scope.data=[];
      $scope.total={};
              var a=$scope.dt.getMonth();
        var b=$scope.dt.getFullYear();
    $http.post("/beuApp/employeeLuckyDrawReport",{month:a,year:b}).success(function(res){
                        // console.log(res)
                var c=[]
                        for(var a in res.data)
                    {
                       c = res.data[a];
                                break;
                      }
                      $scope.total=res.totalrow[0];
                       $scope.manipulateFunction(c)
  })


  }

  $scope.filter();



    $scope.manipulateFunction=function(a){
        $scope.data=[]
        a.forEach(function(c)
    {
                    var m={parlorName:"",frequency:{},amount:{}}
                        m.parlorName=c.parlorName;
                        for(var k in c)
                        {
                                var f=false;
                                var amount=false;
                                f=k.includes("Frequency")
                        amount=k.includes("Amount")
                        if(f){
                                        m.frequency[k]=c[k];
                            }
                            else if(amount)
                            {
                                        m.amount[k]=c[k];
                            }
                        else{
                            m[k]=c[k]
                        }
                        }
                 $scope.data.push(m)  ;

      })
        // console.log($scope.data);
    }
    $scope.exportToExcel = function (tableId) { // ex: '#my-table'
        var exportHref = Excel.tableToExcel(tableId, 'WireWorkbenchDataExport');
        $timeout(function () {
            location.href = exportHref;
        }, 100); // trigger download
    }

});
