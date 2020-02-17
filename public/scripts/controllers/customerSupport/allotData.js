angular.module('sbAdminApp')
    .controller('allotData', function($scope, $http, $stateParams, $window,NgTableParams) { 
    
    // console.log("Customer Support" );
    $http({
        method: 'GET',
        url: '/admin/appointmentFromApp'
    }).then(function successCallback(response) {
        $scope.appointments=response.data.data;
        $scope.appointments.forEach(function(app){
            var ser="";
            app.services.forEach(function(service){
                ser+=(service.name + " ,");
            });
            app.sName=ser;
        })
        // console.log(response);
        // console.log($scope.appointments);
    }, function errorCallback(response) {
        // console.log("Error");
    });
});