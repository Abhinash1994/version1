angular.module('sbAdminApp')
    .controller('cashBackDetails',['$scope','$http','Upload','NgTableParams','$timeout',function($scope, $http,Upload,NgTableParams,$timeout) {
        $scope.cashback='';
        $http.post("/role1/cashBackDetails",{'phoneNumber':9811900813}).then(function(response) {
            $scope.cashback=response.data.data
            // console.log('search', $scope.cashback)

        })

    }]);
