'use strict';
/**\
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # LeaveController
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
    
  .controller('servicePercentCtrl',['$scope','NgTableParams','$log','$http', function($scope, NgTableParams,$log,$http) {
	  
	$http.post("/role1/parlorList").success(function(response, status){
        $scope.parlors = response.data;
      });
	  
	$scope.parlorChanged=function(parlorId){
		console.log(parlorId);
		$http.get("/role1/serviceByParlorId?parlorId=" + parlorId).success(function(response, status){
        	console.log(response.data);
			$scope.services=response.data;
      });
	};
	$scope.additions=function(stylist){
		$scope.addition=[];
		if(stylist.additions[0].name!="Thickness"){
			$scope.addition=stylist.additions[0].types;
		}
		else{
			for(var i=1;i<stylist.additions.length;i++){
				stylist.additions[i].types.forEach(function(element) {
				$scope.addition.push(element);
				});
				
			}
		}
	};
	$scope.stylistPer=function(stylist,base){
		stylist.price=nearest(stylist.percentageDifference*base/100+base,50);
	};
	function nearest(n,v){
		 n = n / v;
		n = Math.round(n) * v;
		return n;
	}
	$scope.additionPer=function(stylist,addition,base,type){
		if(addition!="Thickness"){
		stylist.additions[0].types[type].addition=nearest(stylist.additions[0].types[type].percentageDifference*stylist.price/100,50);
		}
		else{
			if(type>4){
			stylist.additions[2].types[type].addition=nearest(stylist.additions[2].types[type].percentageDifference*stylist.price/100,50);	
			}
			else{
			stylist.additions[1].types[type].addition=nearest(stylist.additions[1].types[type].percentageDifference*stylist.price/100,50);
			}
			
		}
	};
	$scope.iniPer=function(stylist,addition,syI,tyI){
		if(addition!="Thickness"){
		$scope.index=tyI;
		$scope.aindex=0;
		}
		else{
			if(tyI>4){
			$scope.index=tyI-5;
			$scope.aindex=2;
			}
			else{
			$scope.index=tyI;
			$scope.aindex=1;
			}
			
		}
	};	
		
  }]);
