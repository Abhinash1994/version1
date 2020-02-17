angular.module("sbAdminApp")
       .controller("sellerItemsCtrl",function($scope,$http,Excel,$timeout){
    $scope.sellerData=[];
    $scope.parlor={}
    
        $http.get("/role1/getSellersList").success(function(res){
            $scope.sellerData=res.data;
            console.log(res)
        })
    
    $scope.getItems=function(){
            $http.get("/role1/getSellersItemsData?id="+$scope.parlor.selected).success(function(res){
                $scope.seller=res.data;
    })
    
    }
    
     $scope.exportToExcel = function (tableId) {


         var exportHref = Excel.tableToExcel(tableId, 'WireWorkbenchDataExport');
          $timeout(function () {
              location.href = exportHref;
          }, 100); // trigger download

       
      }
    
   
    
    
    
})