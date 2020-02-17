angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','isteven-multi-select','daterangepicker','ngSanitize', 'ngCsv'])
    .controller('adminRazorPayCtrl', function($scope, $http, Excel, $timeout) { 
    
     $scope.selectedParlor=[];
    $scope.parlorIdsToBeSent=[];
    $http.post("/role1/allParlors").success(function(response, status){
    $scope.parlors = response.data;
        // console.log($scope.parlors);
    });
    
  
    $scope.changeParlor=function(){
           //console.log($scope.selectedParlor);
    $scope.parlorIdsToBeSent=[];
        for(var i=0;i<$scope.selectedParlor.length;i++){
            $scope.parlorIdsToBeSent.push($scope.selectedParlor[i].parlorId);
            }
            //console.log( $scope.parlorIdsToBeSent);
            }
        var today=new Date();
        $scope.dateRangeSelected = {startDate: moment().startOf('month'), endDate: moment()};
        
        $http.post("/role1/paymentRazorPay", {"startDate":$scope.dateRangeSelected.startDate._d,"endDate":$scope.dateRangeSelected.endDate._d}).success(function(response){
            // console.log(response.data);
                $scope.datas = response.data;
            $timeout(
                function() {
                    $('#tableToExport').fixedHeaderTable({
                        fixedColumn: false});
                    console.log(document.getElementsByClassName("fht-cell"));
                    var a=document.getElementsByClassName("fht-cell");
                    var mid=(a.length)/2
                    for(var i=0;i<mid;i++){
                        a[i].clientWidth=a[i+mid].clientWidth;
                        a[i].offsetWidth=a[i+mid].clientWidth;
                        a[i].scrollWidth=a[i+mid].clientWidth;
                        a[i].style.width=a[i+mid].clientWidth+'px';
                        console.log(i+" "+(i+mid));
                    }
                }
            );
        });

      $scope.applyFilter = function(){
          
          console.log($scope.parlorIdsToBeSent);
          console.log($scope.dateRangeSelected.startDate._d);
          console.log($scope.dateRangeSelected.endDate._d);
          $('#tableToExport').fixedHeaderTable('destroy');
          $scope.datas=[];
        $http.post("/role1/paymentRazorPay", {"startDate":$scope.dateRangeSelected.startDate._d,"endDate":$scope.dateRangeSelected.endDate._d, parlorId:$scope.parlorIdsToBeSent}).success(function(response){
            console.log(response.data);
            $scope.datas = response.data;
            $timeout(
                function() {
                    $('#tableToExport').fixedHeaderTable({
                        fixedColumn: false});
                    console.log(document.getElementsByClassName("fht-cell"));
                    var a=document.getElementsByClassName("fht-cell");
                    var mid=(a.length)/2
                    for(var i=0;i<mid;i++){
                        a[i].clientWidth=a[i+mid].clientWidth;
                        a[i].offsetWidth=a[i+mid].clientWidth;
                        a[i].scrollWidth=a[i+mid].clientWidth;
                        a[i].style.width=a[i+mid].clientWidth+'px';
                        console.log(i+" "+(i+mid));
                    }
                }
            );
    });
        
      }
    
    });