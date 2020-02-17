angular.module('sbAdminApp')
		.controller('parlorDataCtrl',function($scope,$http){
			

				// console.log("this is calling")
			// api to get ]var for parlors
			$scope.submitData=function(){

					$http.get("/role1/getParlorVar?reportType="+$scope.selectReport).success(function(res){
						$scope.data=res;
						// console.log($scope.data)
				})

			}
				



		})