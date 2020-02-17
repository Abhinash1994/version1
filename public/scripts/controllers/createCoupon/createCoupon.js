angular.module('sbAdminApp')
.controller('createCouponCtrl',function($scope,$http,$q){
	$scope.parlorTypes=[{name:'Red',value:0},{name:'Blue',value:1},{name:'Green',value:2}];
	$scope.fromParlor=[{name:'nearby'},{name:'littleapp'}];
	$scope.coupon={offerTypes : 'nearby', parlorTypes : 0};
	$scope.createCoupon=function(){
		if($scope.coupon.offerTypes  && $scope.coupon.parlorTypes != null)
		{
				// var defer=$q.defer();
		// console.log($scope.coupon)
		$http.get('/role2/createCoupons?couponCount='+$scope.coupon.couponCount+'&offerType='+$scope.coupon.offerTypes+'&price='+$scope.coupon.price+'&dealId='+$scope.coupon.dealId+'&parlorType='+$scope.coupon.parlorTypes).success(function(res){
			console.log(res)
			var b={};
			$scope.mainData=angular.copy(res)
			$scope.mainData=$scope.mainData.map(function(response){
					delete response.startDate;
					delete response.endDate;
					return response;
			})
			
				// defer.resolve($scope.mainData);
			


		})
			// return defer.promise;
		}

		else{
			alert('Please Fill all the fields')
		}
		
	}


	$scope.uploadData=function(){

				var b={};
				var c=angular.copy($scope.mainData);
				if(c.length>0)
				{
						for(var a in c[0])
						{
							var temp=a.charAt(0).toUpperCase()+a.slice(1);
							b[a]=temp;
						}
				}
					c.unshift(b);
					return c;
	}
	
})