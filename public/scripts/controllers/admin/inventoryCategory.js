
angular.module('sbAdminApp')
  .controller('inventoryCatCtrl', ['$scope', '$http', function($scope, $http) {
      $scope.cat ={};
      $scope.filledData =[];
      // console.log("Inventory catog");
      $scope.refresh = function(){
          $http.get("/role1/getCategories").success(function(response, status){
           $scope.filledData = response.data;
            // console.log(response);
            });
        }
      $scope.refresh();
      
        $scope.addNewCategory = function(){
        $http.post("/role1/addCategories", $scope.cat).success(function(response, status){
            $scope.cat.name='';
            $('#addCategory').modal('hide');
             $scope.refresh();
            // console.log(response);
            
            });
       
        }
        
        $scope.removeCategory = function(i){
            $scope.myData={Id:i}
            // console.log($scope.myData={Id:i})
            $http.post("/role1/deleteCategories",  $scope.myData).success(function(response, status){
            $scope.refresh();
            // console.log(response);
            }); 
            
        }
      
  }]);