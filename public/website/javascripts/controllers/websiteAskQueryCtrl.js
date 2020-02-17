app.controller("websiteAskQuery",function($scope,$http){
  console.log("this is query pages")
   
  $scope.formData={};
   $scope.submitData=function(){

    console.log($scope.formData);
    if ($scope.userForm.$valid) {
        
    $http.post("/api/beuappointmentquery",$scope.formData).success(function(res){

        console.log(res.data);
        alert(res.data);
    })
     $scope.formData={}
     }
   }

})