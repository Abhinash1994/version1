angular.module('sbAdminApp').controller('discountBucketCtrl',function($scope,$http){
			console.log(role)

		$http.get('/role3/discountOnPurchase').success(function(response){
				console.log(response)

		})
})
