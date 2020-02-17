'use strict';

angular.module('sbAdminApp', ['ui.calendar','ui.bootstrap','ngTable','daterangepicker'])
.controller('salonReportAppCustomer', function($scope,$http) {
  $scope.totalRevenue=0;
  $scope.totalCount=0;
  $scope.startDate ="";
      $scope.dateOptions = {
             datepickerMode: "'month'",
             minMode: 'month'
         };
  var today = new Date();
  $scope.dates={}
    $scope.dates.date = {
            startDate: new Date(today.getFullYear(), today.getMonth(), 1),
            endDate: new Date()
        };
    
    $('body').on('apply.daterangepicker', function(ev, picker) {
        
        // console.log("hhdsjhjdxh")
        $scope.buttonclick()
//           if($scope.x!=null && $scope.y!=null){
//               if ($scope.x.length > 0 &&
//                   $scope.y.length>0) {
//                   $scope.sendData();
//               }
//           }

        });
    
  $scope.buttonclick=function() {
    // console.log($scope.startDate);
    var endDate=new Date(new Date($scope.startDate).getFullYear(),new Date($scope.startDate).getMonth()+1,0);
    // console.log(endDate);
    $http.post("/role1/newClientreport",{startDate :$scope.dates.date.startDate,endDate:$scope.dates.date.endDate}).success(function(res) {
      // console.log(res);
      $scope.salonData=res;

      for (var i = 0; i <$scope.salonData.length; i++) {
      $scope.totalRevenue+=$scope.salonData[i].serviceRevenue;
      $scope.totalCount+=$scope.salonData[i].count;
      $scope.totalSalonRevenue+=$scope.salonData[i].totalSalonRevenue;
      $scope.totalSalonCount+=$scope.salonData[i].totalSalonCustomers;
      }
      // console.log($scope.totalRevenue);

      });
        $scope.totalRevenue=0;
        $scope.totalCount=0;
      $scope.totalSalonRevenue=0;
       $scope.totalSalonCount=0;
      
  }

});
