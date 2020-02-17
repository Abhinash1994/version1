'use strict';

angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','isteven-multi-select','ui.bootstrap','daterangepicker'])
.controller('CreateFlashCooponCtrl', function($scope,$http,$timeout,Excel) {

$scope.coupon={

}
 $scope.parlorsSelected=[];
   var today=new Date();
        $scope.dateRangeSelected = {startDate: moment().startOf('month'), endDate: moment()};

    $http.post('/role1/allParlors').success(function(response){
            console.log(response);
            $scope.parlorList=response.data;
            console.log($scope.parlorList)
        });

$scope.SubmitCouponCode=function(){

console.log($scope.coupon)
$http.post("role1/createFlashCoupon",$scope.coupon).then(function(response){
console.log(response);

})


}

  console.log("this is create flash coopon ")

});
 // {'startDate':$scope.dateRangeSelected.startDate._d,
 //                   'endDate':$scope.dateRangeSelected.endDate._d
 //                 }