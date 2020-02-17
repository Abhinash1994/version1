angular.module("sbAdminApp")
.controller("incentiveEditForumCtrl",function($scope,$http){

		$scope.parlors=[]

	console.log("hello")
			// $http.post("/role1/editIncentive").success(function(res){
			// 			console.log(res)
			// })
			$scope.check=function(){
				$http.post("/role1/editIncentive").success(function(res){
							console.log(res)
							$scope.parlors=res.data
			})

			}
			

			$scope.check();

			$scope.edit=function(a){

				$scope.temp={};
				$scope.temp=angular.copy($scope.parlors[a])
							$("#myModal").modal("show");
			}



			$scope.sendIt=function(){

						console.log($scope.temp)
							$http.post("/role1/editIncentive",{parlorId:$scope.temp.parlorId,categories:$scope.temp.categories})
							.success(function(res){
								console.log(res)
											$scope.check()
											$("#myModal").modal("hide");
							})
				}



})