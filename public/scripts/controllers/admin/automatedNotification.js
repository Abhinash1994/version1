'use strict';
/**\
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # LeaveController
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp',['nvd3','ui.bootstrap','isteven-multi-select','daterangepicker', 'ngAnimate','ngSanitize'])
    
  .controller('automatedNotificationCtrl',['$scope','NgTableParams','$log','$http', function($scope, NgTableParams,$log,$http) {
	

		  $scope.dataArray=[];
                

		
			$http.get("/role1/deals").success(function(response, status){
						$scope.deals = response.data;
					// console.log($scope.deals)
		
      });
            
            $scope.insert=function(gender){
            
            	// console.log($scope.deals);
                $scope.dataArray.push($scope.add);
                // console.log($scope.add);
               
                $http.post('/role1/createDailyOffers',$scope.add).success(function (data) {

                			alert(JSON.stringify(data.data));
                			 $scope.add={};

              
            });
                            
            }
            	$scope.editObject={};
    			var mainIndex='';
           		 $scope.edit=function(index){
                mainIndex=index;
                $scope.editObject=$scope.dataArray[index];

            }
            
         $scope.makeChanges=function()
         {
                $scope.dataArray[mainIndex]=$scope.editObject;
         }

             
        
		
  }]);


  

