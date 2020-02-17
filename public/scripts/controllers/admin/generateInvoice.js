angular.module('sbAdminApp',['isteven-multi-select'])
.controller('generateInvoiceCtrl',function($scope, $http, $window) {

		
              $http.post("/role1/allParlors").success(function(response, status) {
                         $scope.parlorList=response.data;
                          console.log("parlorId",$scope.parlorList)
                         
                })  


			$scope.generateSettlement=function(){
                 var parlorIds = [];
            angular.forEach($scope.selectedParlor,function (parlor) {
                parlorIds.push(parlor.parlorId)
            }, this);
				var obj={"startDate":$scope.startDate,"endDate":$scope.endDate,"period":$scope.period,'parlorIds': parlorIds};
				console.log(obj)

				// $http.post("/role1/generateReportApi ").success(function(response, status) {
    //                      console.log(response)
                         
    //             })

			}



			 $scope.ShowConfirm = function () {
                if ($window.confirm("Are you sure ?")) {
                    $scope.Message = "You clicked YES.";
                } else {
                    $scope.Message = "You clicked NO.";
                }
            }
   
});