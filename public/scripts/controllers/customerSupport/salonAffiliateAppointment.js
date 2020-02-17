angular.module('sbAdminApp')
    .controller('salonAffiliateAppointCtrl', function($scope, $http, $stateParams, $window,NgTableParams) { 
    
    // console.log("Salon Affiliate");

    $http.post("/role1/affiliateSalonAppointments").success(function(res){

        // console.log(res)
        $scope.salonAffilateData=res.data;
        // console.log("salon Affilaite",$scope.salonAffilateData)
    })

});