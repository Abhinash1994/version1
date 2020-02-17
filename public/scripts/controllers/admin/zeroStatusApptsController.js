angular.module('sbAdminApp', ['ui.bootstrap', 'isteven-multi-select'])
    .controller('zeroStatusApptsCtrl', function($scope, $http, $stateParams, $window,NgTableParams,Excel, $timeout) { 
    
    $scope.selectedParlor=[];
    $scope.parlorIdsToBeSent=[];
    $http.post("/role1/parlorList").success(function(response, status){
    $scope.parlors = response.data;
        // console.log($scope.parlors);
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
    // console.log($scope.dts);
    $scope.dte = new Date();

        $scope.sortType='';
        $scope.sortFlag=false;

        $scope.changeSortType=function(valuePassedForSorting){
            if($scope.sortType!=valuePassedForSorting){
                $scope.sortType=valuePassedForSorting;
                $scope.sortFlag=true;
            }else{
                $scope.sortType='-'+valuePassedForSorting;
            }
        }

        
        $http({method: 'POST',url: '/role1/appointmentStatusZero',data:{startDate:$scope.dts,endDate:$scope.dte}}).success(function(response, status){
            // console.log(response);
            $scope.parlorsData = response.data;
            //$scope.fixedHeaderMethod();
            /*$scope.parlorsData = response;
            console.log(response);
            $scope.parlorsData.forEach(function(report){
                var total = 0;
                report['totalProductSale'] = report.totalProductSale;
                
            })
            $scope.fixedHeaderMethod();*/
        });
    $scope.applyFilter=function(){
        // console.log("Date Changed");
        // console.log($scope.parlorIdsToBeSent);
         $('#tableToExport').fixedHeaderTable("destroy");
        // console.log({startDate:$scope.dts,endDate:$scope.dte});
           $http({
                    method: 'POST',
                    url: '/role1/appointmentStatusZero',
                    data:{
                        'parlorIds': $scope.parlorIdsToBeSent,
                        startDate:$scope.dts,
                        endDate:$scope.dte
                    }   
                    }).success(function(response, status){
            $scope.parlorsData = response.data;
            // console.log(response);
        });
    }
    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };
    
    $scope.depTotal=function(deps){
        var total=0;
        deps.forEach(function(dep){
            total+=dep.totalRevenue;
        })
        return total;
    };
    $scope.exportToExcel = function (tableId) { // ex: '#my-table'
        var exportHref = Excel.tableToExcel(tableId, 'WireWorkbenchDataExport');
        $timeout(function () {
            location.href = exportHref;
        }, 100); // trigger download
    }
   
    
     $scope.fixedHeaderMethod = function(){
               $timeout(
                function() {
                    $('#tableToExport').fixedHeaderTable({fixedColumn: true});
                    var a=document.getElementsByClassName("fht-cell");
                    var mid=(a.length-1)/2
                    for(var i=1;i<=mid;i++){
                        a[i].clientWidth=a[i+mid].clientWidth;
                        a[i].offsetWidth=a[i+mid].clientWidth;
                        a[i].scrollWidth=a[i+mid].clientWidth;
                        a[i].style.width=a[i+mid].clientWidth+'px';
                            // console.log(i+" "+(i+mid));
                        }
                }
             );
        } 
 
    

});


