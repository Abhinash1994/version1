angular.module('sbAdminApp',['ngTable']).controller('corporateCompanyCtrl',function($scope,NgTableParams,Upload,$timeout,$http){
  $scope.data={};

  $scope.call=function(){
    // console.log($scope.data)
    $http.post('/role1/createCompanies',$scope.data).success(function(res){
            // console.log(res)
    })
  }
  // $scope.$watch('data.extension', function(newValue, oldValue) {
    
  //     if(newValue==''){
  //       $scope.data.extension='@';
  //     }
  // });
$scope.edit=function(a){
$http.post("/role1/listEditCompanies",{id:a._id}).success(function(res){
$scope.getData();
})


}


$scope.getData=function(){
  $http.post("/role1/listEditCompanies").success(function(res){
// console.log(res)
$scope.tableData=[];
$scope.tableData=res.data;
  $scope.tableParams = new NgTableParams({page: 1, count: 10}, {dataset: $scope.tableData});
})
}

$scope.getData();

  $scope.uploadPic = function(file) {
  file.upload = Upload.upload({
    url: '/role1/uploadCompanies',
    data: {username: $scope.username, file: file},
  });

  file.upload.then(function (response) {
    $timeout(function () {
      file.result = response.data;
    });
  }, function (response) {
    if (response.status > 0)
      $scope.errorMsg = response.status + ': ' + response.data;
  }, function (evt) {
    // Math.min is to fix IE which reports 200% sometimes
    file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
  });
  }


})
