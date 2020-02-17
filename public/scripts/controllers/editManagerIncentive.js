angular.module("sbAdminApp")
.controller("editManagerIncentiveCtrl",function($scope,$http,$window)
{

		console.log($window.innerWidth)
$scope.getData=function(){
$http.post("/role1/editSalonIncentive").success(function(res){
	console.log(res)
$scope.incentive=res.data;
})	
}

$scope.getData();


$scope.editIt=function(a){
			$scope.temp=angular.copy($scope.incentive[a])

			$("#myModal").modal("show");

}


$scope.sendIt=function(){
	console.log($scope.temp)
				$http.post("/role1/editSalonIncentive",{id:$scope.temp._id,levels:$scope.temp.levels}).success(function(res){
					console.log(res)
									$scope.getData();
									$("#myModal").modal("hide");
				})
}


})