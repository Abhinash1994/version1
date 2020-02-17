angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','isteven-multi-select','daterangepicker','ngSanitize', 'ngCsv'])
    .controller('adminCoupanCodeCtrl', function($scope, $http,$timeout) {
    // console.log("coupan code"); 
    
    $scope.search = '';
    $scope.msg="";
    //$scope.show=false;
    $scope.showTable=false;
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
          $scope.changeSortType=function(valuePassedForSorting){
            if($scope.sortType!=valuePassedForSorting){
                $scope.sortType=valuePassedForSorting;
                $scope.sortFlag=true;
            }else{
                $scope.sortType='-'+valuePassedForSorting;
            }
        }
    var today=new Date();
    $scope.dateRangeSelected = {startDate: moment().startOf('month'), endDate: moment()};
        // console.log( $scope.dateRangeSelected);
     $http.post("/role1/couponCodeListing",{"startDate":$scope.dateRangeSelected.startDate._d,"endDate":$scope.dateRangeSelected.endDate._d}).success(function(response){
        
        $scope.datas = response.data;
        // console.log($scope.datas);
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
    $scope.couponStatus=function(status,active){
        // console.log("status",status)
        if(status==1)
            return "A booked appt exsits"
        else if(status==2 && !active)
            return "Appt has been cancelled. Click on button to activate coupon"
        else if(status==2 && active)
            return "Appt has been cancelled and coupon is activated. Please book appt again"
        else if(status==3)
            return "Coupon has been redeemed as appt has been closed"
        else
           return "Please contact support" 
    }
    $scope.activateCoupon=function(code){
        // console.log("Coupon Code",code);
        $http.post("/role1/activateCoupon", {couponCode:code}).success(function(response){
            // console.log('Hi',response);
            alert("Coupon Activated");
            $('#srchCode').modal('hide');
            $scope.msg = response.message;  
                    
       
   });
    }
    
     $scope.searchCoupan  = function(){
            
          $scope.showTable=false;
          $scope.srchDatas = " ";
          $scope.msg =" ";
        // console.log( $scope.search);
        $http.post("/role1/couponCodeListing", {couponCode:$scope.search}).success(function(response){
            console.log('Hi',response);
            $scope.showTable=true;
            $scope.srchDatas = response.data; 
            $scope.msg = response.message;
    });
    } 
     $scope.applyFilter = function(){
         // console.log( $scope.dateRangeSelected.startDate._d);
         // console.log( $scope.dateRangeSelected.endDate._d);
         // console.log( $scope.parlorIdsToBeSent);
         $scope.datas=[];
         $('#tableToExport').fixedHeaderTable('destroy');
          $http.post("/role1/couponCodeListing",{"startDate":$scope.dateRangeSelected.startDate._d,"endDate":$scope.dateRangeSelected.endDate._d, parlorId:$scope.parlorIdsToBeSent}).success(function(response){
            $scope.datas = response.data;
               // console.log("hello",$scope.datas);
              $timeout(
                  function() {

                      $('#tableToExport').fixedHeaderTable({
                          fixedColumn: false});
                      // console.log(document.getElementsByClassName("fht-cell"));
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
    
})