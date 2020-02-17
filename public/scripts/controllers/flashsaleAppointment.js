'use strict';

angular.module('sbAdminApp', ['isteven-multi-select','ui.bootstrap','daterangepicker','ngMap','ngSanitize','ngTable','uiGmapgoogle-maps'])
.controller('flashsaleAppointmentCtrl', function($scope,$http,$timeout,Excel) {

    console.log("hello flash");

      $http.post('/role1/editFlashCoupon').then(function(response){

        console.log(response)
  
        $scope.flashSales=response.data.data

    });

    $scope.parlorName1=""
    $scope.changeParlor=function(){
    			console.log($scope.parlorName1);
    			$scope.flashId=[];
    			$scope.parlorName1.forEach(function(e){
    			
    			console.log(e._id)
    			$scope.flashId.push(e._id)
    			console.log($scope.flashId)
    		
    		})	
			   $http.post("/role1/getFlashSaleAppointments",{flashIds:$scope.flashId}).then(function(res){
			        console.log(res);
			     	$scope.flashSaleAppointment=res.data;
			        console.log($scope.flashSaleAppointment)
			        
			        
			    })
    		
		console.log("changes")    	
    }


 
});
