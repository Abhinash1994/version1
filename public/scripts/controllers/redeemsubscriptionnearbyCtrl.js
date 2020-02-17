angular.module('sbAdminApp',['ngCsv','daterangepicker'])
        .controller('redeemsubscriptionnearbyCtrl',function($scope,$http,Excel,$timeout){
	
	console.log("Hi")
	
	$scope.form={}
	
	$scope.Submit=function(){
		
		console.log($scope.form)
		$http.post('/role2/redeemNearBySubscription',$scope.form).success(function(res){
		console.log(res);
			if(res.success){
				$scope.form = {};
				alert(res.data)
			}else{
				// $scope.message=res.data
				alert(res.message)
			}
			
	});
        
	}

})