angular.module('sbAdminApp',['nvd3']).controller('thousandCashBackSpendCtrl',function($scope,$http){

	$scope.data=[]
		$http.post('/role1/report/thousandCashbackSpend').success(function(res){
				$scope.data=res;
				// console.log(res);
		})

});