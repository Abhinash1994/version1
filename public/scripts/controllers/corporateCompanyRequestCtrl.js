angular.module('sbAdminApp',['ngTable']).controller('corporateCompanyRequestCtrl',function($scope,$http,NgTableParams){
$scope.data=[]

$http.post('/role1/corporateRequests').success(function(res){
				console.log(res)
				$scope.data=res.data;
				$scope.tableParams = new NgTableParams({count:10 }, {counts:[], dataset: $scope.data});
})



})
