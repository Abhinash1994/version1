angular.module('sbAdminApp',[ 'ngCsv'])
.controller('transferSubscription',function($scope, $http,NgTableParams) {
  
          $scope.oldnumber='';
          $scope.newnumber='';

			 	$scope.transfer=function(){
          var obj={"oldPhoneNumber":$scope.oldnumber,"newPhoneNumber":$scope.newnumber}
          console.log("data",obj)
           $http.post("/role1/transferSubscriptionOfUser",obj).success(function(res){
                           
                         alert("Successfully Transfer") 
                      })
            
          }

});

