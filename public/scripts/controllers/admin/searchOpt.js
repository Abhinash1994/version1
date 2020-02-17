/**
 * Created by beusalon on 7/3/2017.
 */
angular.module('sbAdminApp')
    .controller('searchOpt',['$scope','$http','Upload','NgTableParams','$timeout',function($scope, $http,Upload,NgTableParams,$timeout) {

        $scope.SearchOtp="";
        $http.post("/role1/searchOtp",{'phoneNumber':9811900813}).then(function(response){
            $scope.SearchOtp=response.data
            // console.log('search',response)
           if(status==1){



           }
        });
    }]);

