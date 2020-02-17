/**
 * Created by Manisha on 7/5/2017.
 */
angular.module("sbAdminApp").controller("searchOtp",
    function($scope,$http){

            $scope.otpData=null;

                $scope.searchOtp=function(){
                    $http.post("role3/searchOtp",  {phoneNumber:$scope.phoneNumber}).success(function(response){
                        $scope.otpData={};
                        $scope.otpData=response.data;
                        // console.log($scope.otpData);
                    })

                }

})
