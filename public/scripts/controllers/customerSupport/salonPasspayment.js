angular.module('sbAdminApp')
    .controller('salonPasspaymentCtrl', function($scope, $http, $stateParams, $window,NgTableParams) { 
    
    // console.log("Salon Pass Payment");

    $http.post("/role1/salonPassPayments").success(function(res){

        // console.log(res)
        $scope.salonPassData=res.data;
        // console.log($scope.salonPassData)
    })

});