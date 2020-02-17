angular.module('sbAdminApp')
.controller('salonDetail',function($scope, $http,Excel,Upload,NgTableParams,$timeout) {


	$http.get('/role1/salonDetailsForFinance').success(function(response){
        $scope.data=response.data;
        // console.log("salonDetail", response)
    })

   
});