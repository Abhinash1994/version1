'use strict';

angular.module('sbAdminApp', ['ui.calendar','ui.bootstrap','ngTable','daterangepicker'])
.controller('UserMembership', function($scope,$http,$timeout,$state){
  
        $scope.phoneNumber='';
        $scope.name='';
		$scope.gender='';
		$scope.user={};
		$scope.submitphoneNumber=function(){
	    $http.get("/role1/getUserDetail?phoneNumber="+$scope.phoneNumber).success(function(res){
	      $scope.user=res.data;
	       console.log($scope.user)
	    	})
		}
		$scope.updateUser=function(){
			$http.post("/role1/updateUserDetail", { "phoneNumber":$scope.phoneNumber, "firstName":$scope.user.firstName, "gender":$scope.user.gender }).success(function(response, status) {
				console.log('user updated')

			});
		}
		$scope.updateMembership=function(creditsLeft,id){
			console.log('update membership done',$scope.user.phoneNumber,creditsLeft,id)
			$http.post("/role1/updateMembership", { "phoneNumber":$scope.phoneNumber, "creditsLeft":creditsLeft, "id":id }).success(function(response, status) {
				console.log('update membership done');
				alert("Membership Updated");
				$http.get("/role1/getUserDetail?phoneNumber="+$scope.phoneNumber).success(function(res){
					$scope.user=res.data;
					 console.log($scope.user)
				})
				  

			});
		}
		$scope.deleteMembership=function(membershipSaleId,id){
			$http.post("/role1/deleteMembership", { "phoneNumber":$scope.phoneNumber, "membershipSaleId":membershipSaleId,  "id":id }).success(function(response, status) {
				console.log('user updated')
				console.log('update membership done',$scope.user.phoneNumber,membershipSaleId,id)
					alert("Membership Deleted");
					$http.get("/role1/getUserDetail?phoneNumber="+$scope.phoneNumber).success(function(res){
						$scope.user=res.data;
						 console.log($scope.user)
					})

			});
		}


});
