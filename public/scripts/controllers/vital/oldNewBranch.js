angular.module('sbAdminApp', ['ui.bootstrap', 'isteven-multi-select'])
    .controller('oldNewBranchCtrl', function($scope, $http, $stateParams, $window,NgTableParams,Excel, $timeout) { 
    
    $scope.selectedParlor=[];
    $scope.parlorIdsToBeSent=[];
    $http.post("/role1/allParlors").success(function(response, status){
    $scope.parlors = response.data;
        console.log($scope.parlors);
    });


    $scope.changeParlor=function(){
    $scope.parlorIdsToBeSent=[];
        for(var i=0;i<$scope.selectedParlor.length;i++){
            $scope.parlorIdsToBeSent.push($scope.selectedParlor[i].parlorId);
            }
            }
    
    $scope.popup1 = {
        opened: false
    };

    $scope.popup2 = {
        opened: false
    };

    $scope.open1 = function() {
        $scope.popup1.opened = true;
    };

    $scope.open2 = function() {
        $scope.popup2.opened = true;
    };
    var today = new Date();
    $scope.dts = new Date(today.getFullYear(),today.getMonth(),1);
    console.log($scope.dts);
    $scope.dte = new Date();
    
    $http({
           method: 'POST',
            url: '/role1/report/oldNewBranchSeg',
            data:{
                        startDate:$scope.dts,
                        endDate:$scope.dte
                    }   
                    })
        .success(function(response, status){
        $scope.datas = response;
        console.log(response);
         $scope.datas.forEach(function(rep){
             $scope.oldTotalNoOfService = 0;
             $scope.newTotalNoOfService = 0;
             $scope.newTotalRevenue =0;
             $scope.oldTotalRevenue =0;
             rep.reports.forEach(function(cust, index){
                $scope.newTotalNoOfService += cust.customers[0].serviceNo;
                $scope.newTotalRevenue +=cust.customers[0].revenue;
                 $scope.oldTotalNoOfService += cust.customers[1].serviceNo;
                 $scope.oldTotalRevenue += cust.customers[1].revenue;
             })
             rep['newTotalNoOfService'] =  $scope.newTotalNoOfService;
             rep['newTotalRevenue'] =  $scope.newTotalRevenue;
             rep['oldTotalNoOfService'] =  $scope.oldTotalNoOfService;
             rep['oldTotalRevenue'] =  $scope.oldTotalRevenue;
             
         })
         $scope.fixedHeaderMethod();
    });
    
     $scope.applyFilter=function(){
        console.log("Date Changed");
        console.log($scope.dts);
        console.log($scope.dte);
        console.log($scope.parlorIdsToBeSent);
          $('#tableToExport').fixedHeaderTable("destroy");
        console.log({startDate:$scope.dts,endDate:$scope.dte});
           $http({
                    method: 'POST',
                    url: '/role1/report/oldNewBranchSeg',
                    data:{
                        'parlorIds': $scope.parlorIdsToBeSent,
                        startDate:$scope.dts,
                        endDate:$scope.dte
                    }   
                    }).success(function(response, status){
             $scope.datas = response;
            console.log(response);
            
             $scope.datas.forEach(function(rep){
             $scope.oldTotalNoOfService = 0;
             $scope.newTotalNoOfService = 0;
             $scope.newTotalRevenue =0;
             $scope.oldTotalRevenue =0;
             rep.reports.forEach(function(cust, index){
                $scope.newTotalNoOfService += cust.customers[0].serviceNo;
                $scope.newTotalRevenue +=cust.customers[0].revenue;
                 $scope.oldTotalNoOfService += cust.customers[1].serviceNo;
                 $scope.oldTotalRevenue += cust.customers[1].revenue;
             })
             rep['newTotalNoOfService'] =  $scope.newTotalNoOfService;
             rep['newTotalRevenue'] =  $scope.newTotalRevenue;
             rep['oldTotalNoOfService'] =  $scope.oldTotalNoOfService;
             rep['oldTotalRevenue'] =  $scope.oldTotalRevenue;
             
         })
            $scope.fixedHeaderMethod();
            
        });
    }
     
    $scope.exportToExcel = function (tableId) { // ex: '#my-table'
        var exportHref = Excel.tableToExcel(tableId, 'WireWorkbenchDataExport');
        $timeout(function () {
            location.href = exportHref;
        }, 100); // trigger download
    }

          $scope.fixedHeaderMethod = function(){
               $timeout(
                function() {
                    $('#tableToExport').fixedHeaderTable({
                        fixedColumn: false});
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


});