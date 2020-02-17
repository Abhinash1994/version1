angular.module('sbAdminApp', ['ui.bootstrap','isteven-multi-select'])
    .controller('vitalCtrl', function($scope, $http, $stateParams, $window,NgTableParams,Excel, $timeout) { 
     $scope.searchKey1 = '';
     $scope.selectedParlor=[];
    $scope.parlorIdsToBeSent=[];
//    $http.post("/role1/allParlors").success(function(response, status){
//    $scope.parlors = response.data;
//        console.log($scope.selectedSalonStatus)
//        console.log('hello',$scope.parlors);
////        $http({
////                    method: 'POST',
////                    url: "/role1/report/monthlyVitalReport",
////                    data:{
////                        startDate:$scope.dts,
////                        endDate:$scope.dte,  }   
////                    }).success(function(response, status){
////        $scope.parlorsData = response;
////        console.log('hi',response);
////        $scope.fixedHeaderMethod(); 
////    });
//    });
    
    $scope.salonStatus=[{name:'Active Salons' ,value:true},{name:'Inactive Salons'  ,value:false}]
    $scope.selectedSalonStatus=true


  
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
    
    
    $scope.applyFilter=function(){
     
         console.log({startDate:$scope.dts,endDate:$scope.dte});
        $('#tableToExport').fixedHeaderTable("destroy");
           $http({
                    method: 'POST',
                    url: "/role1/report/monthlyVitalReport",
                    data:{
                        startDate:$scope.dts,
                        endDate:$scope.dte,
                        active:$scope.selectedSalonStatus
                    }   
                    })
        .success(function(response, status){
            $scope.parlorsData = response;
            console.log(response);
               $scope.fixedHeaderMethod(); 
        });
    }
    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };
    $scope.exportToExcel = function (tableId) { // ex: '#my-table'
        var exportHref = Excel.tableToExcel(tableId, 'WireWorkbenchDataExport');
        $timeout(function () {
            location.href = exportHref;
        }, 100); // trigger download
    }
    
    $scope.search  = function(){
        $('#tableToExport').fixedHeaderTable("destroy");
            $scope.searchKey1 = $scope.searchKey;
        $scope.fixedHeaderMethod(); 
        
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
                            console.log(i+" "+(i+mid));
                        }
                }
             );
        } 
});