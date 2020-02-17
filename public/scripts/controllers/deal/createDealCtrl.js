'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp', ['ui.bootstrap','isteven-multi-select','ngAnimate','ngSanitize'])
    .controller('CreateDealCtrl',['$scope','$http','NgTableParams','$stateParams', '$state', function($scope, $http, NgTableParams,$stateParams, $state) {
        $scope.offerTypes=[{"key":"Fixed","value":"fixed"},{"key":"Percentage","value":"per"}];
		$scope.offerMethods=[{"key":"Cash","value":"cash"},{"key":"Loyalty point","value":"lp"}];
		$scope.offerType="fixed";
		$scope.offer={};
		// console.log($scope.offer);
		$scope.categories=services;
		
	   $scope.locations=[{"key":"Delhi","value":"delhi"},{"key":"Gurgaon","value":"gurgaon"}];
	   $scope.days=[{"key":"Monday","value":"1"},{"key":"Tuesday","value":"2"}, {"key":"Wednesday","value":"3"}, {"key":"Thrusday","value":"4"}, {"key":"Friday","value":"5"}, {"key":"Saturday","value":"6"}, {"key":"Sunday","value":"7"}];
		$scope.serv=function(){
			$scope.subServices=[];
			// console.log($scope.offer.cat);
			for(var i=0;i<$scope.offer.cat.length;i++){
				for(var j=0;j<$scope.offer.cat[i].services.length;j++){
				$scope.subServices.push($scope.offer.cat[i].services[j]);
				}
			}
		};

		  
		  $scope.selectParlorId = "";
		  $scope.selectedParlorId = "";

	/*$http.post("/role1/allParlors").success(function(response, status){
        $scope.parlors = response.data;
      });*/

      var idx = 0;
      $scope.openDealDetail = function(index){
      		var deal = $scope.deals[index];
      		idx = index;
      		$scope.activeDeal = angular.copy(deal);
              $('#editDeal').modal('show');
      };

      $scope.editDeal = function(id){ 
          $state.go('dashboard.editDeal', {dealIdParlor:id});
      }
      $scope.checkAllDeals=function(){
      	// console.log('inside checkAllDeals');
      	$http.post('/role1/runCheckOnAllDeals').success(function(response,status){
      		// console.log(response);
      		refreshDeals();
      	})
      }
      function refreshDeals(){
      	$http.get("/role1/deals").success(function(response, status){
			$scope.deals = response.data;
			// console.log(response);
	    });
      }
	
      refreshDeals();
	$scope.parlorChanged = function(){
		$scope.selectParlorId = $scope.selectedParlorId;
        // console.log($scope.selectedParlorId);
	};

		$scope.sub=function(){
			// console.log($scope.offer);
			var newServices = [];
			$scope.offer.services.forEach(function(s){
				newServices.push({
					name : s.name,
					gender : s.gender,
					categoryId : s.categoryId,
					serviceId : s.serviceId
				});
			});
			$scope.offer.services = newServices;
			$http.post("/role2/offers", $scope.offer).success(function(response, status){
				$scope.offer = {};
				$scope.message = response.data;
        	});
		};


		$scope.changeMessage = function(){
			$scope.message = "";
		};
		
$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
$scope.format = $scope.formats[0];
$scope.altInputFormats = ['M!/d!/yyyy'];


		$scope.popup1={"opened":false};
		$scope.open1 = function() {
			$scope.popup1.opened = true;
		};
		$scope.popup2={"opened":false};
		$scope.open2 = function() {
			$scope.popup2.opened = true;
		};
		
		$scope.ismeridian = true;
		$scope.hstep = 1;
		$scope.mstep = 30;
		var d = new Date();
		d.setMinutes( 0 );
		$scope.startTime=new Date();
		$scope.startTime.setHours(9);
		$scope.startTime.setMinutes(0);
		$scope.endTime=new Date();
		$scope.endTime.setHours(20);
		$scope.endTime.setMinutes(0);
		$scope.timeChanged = function () {
		// console.log($scope.startTime);
		// console.log($scope.endTime);
		};




		}]);
