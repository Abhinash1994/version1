angular.module('sbAdminApp')
.controller('Finance',function($scope, $http,Excel,Upload,NgTableParams,$timeout) {


	$http.post('/role1/editRoyalityAmount').success(function(response){
        $scope.salonData=response;
        // console.log("parlors", response)
    })

    $scope.saveSalon=function(avgRoyalityAmount,parlorId,mainMinimumGuarantee,threeXModel){
        var obj={avgRoyalityAmount:avgRoyalityAmount,parlorId:parlorId,edit:1,mainMinimumGuarantee:mainMinimumGuarantee,threeXModel:threeXModel}
        // console.log(obj)
        $http.post('/role1/editRoyalityAmount',obj).success(function(response){
            $scope.salonData=response;
           // console.log("parlors", $scope.salonData)
        })

        $http.post('/role1/editRoyalityAmount').success(function(response){
            $scope.salonData=response;
           // console.log("parlors", response)
        })

    }
});