angular.module('sbAdminApp')
    .controller('gstDetails',['$scope','$http','Upload','NgTableParams','$timeout',function($scope, $http,Upload,NgTableParams,$timeout) {
            

$scope.data={};
        $scope.details={
            }
        // console.log($scope.details)
        $scope.flag=false
        $scope.init=function(){

            $http.get('/role2/getParlorGst').then(function(response){
            // console.log("running",response.data.data)
            $scope.details.wifiName=response.data.data[0].wifiName
            $scope.details.gstNumber=response.data.data[0].gstNumber
            $scope.details.wifiPassword=response.data.data[0].wifiPassword


          })

        }
              $scope.init()
              $scope.sendData=function(){
              // console.log($scope.details)
              $http.post('/role2/createGst',$scope.details).then(function(response){
                  
                  if($scope.flag){
                    $scope.flag=false; 
                      // console.log("this is true")
                  }
                  else{
                      $scope.flag=true;
                        // console.log("this is false")
                  }

                  // console.log('Hi',response)
                  $scope.init()

          })
      }
              
              $scope.edit=function(){
                  $scope.flag=true;
              }
            


}]);