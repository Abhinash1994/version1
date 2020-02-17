angular.module('sbAdminApp')
.controller('addRoyaltyAmount',function($scope, $http,Excel,Upload,NgTableParams,$timeout) {


	$http.post('/role1/editRoyalityAmount').success(function(response){
        $scope.salonData=response;
       console.log("parlors", response)
    })

    $scope.saveSalon=function(avgRoyalityAmount,parlorId,mainMinimumGuarantee,holdPayment, bankName,accountNo,bankBeneficiaryName,ifscCode, signUpFees, signUpFeesReceivedOn,reverseChargeMultiple){
        var obj={avgRoyalityAmount:avgRoyalityAmount,parlorId:parlorId,edit:1,mainMinimumGuarantee:mainMinimumGuarantee,holdPayment:holdPayment,bankName : bankName,accountNo : accountNo,bankBeneficiaryName : bankBeneficiaryName,ifscCode : ifscCode, signUpFeesReceivedOn : signUpFeesReceivedOn, signUpFees :signUpFees,reverseChargeMultiple:reverseChargeMultiple}
         console.log(obj)
        $http.post('/role1/editRoyalityAmount',obj).success(function(response){
            $http.post('/role1/editRoyalityAmount').success(function(response){
                $scope.salonData=response;
            })
        })

        

    }
});