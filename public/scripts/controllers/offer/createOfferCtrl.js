'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp', ['ui.bootstrap','isteven-multi-select','ngAnimate','ngSanitize'])
       .controller('CreateOfferCtrl',['$scope','$http','NgTableParams', function($scope, $http, NgTableParams) {
        $scope.offerTypes=[{"key":"Fixed","value":"fixed"},{"key":"Percentage","value":"per"}];
		$scope.offerMethods=[{"key":"Cash","value":"cash"},{"key":"Loyalty point","value":"lp"}];
		$scope.offerType="fixed";
		$scope.offer={};
		$scope.tempoffer = {};
		// console.log($scope.offer);
		$scope.departments=services;
		$scope.finalServiceIds=[];
		$scope.finalServices=[];
		$scope.selectedDepartments=[];
		$scope.selectedCats=[];
		$scope.shortServices=[];
	   $scope.locations=[{"key":"Delhi","value":"delhi"},{"key":"Gurgaon","value":"gurgaon"}];
	   $scope.days=[{"key":"Monday","value":"1"},{"key":"Tuesday","value":"2"}, {"key":"Wednesday","value":"3"}, {"key":"Thrusday","value":"4"}, {"key":"Friday","value":"5"}, {"key":"Saturday","value":"6"}, {"key":"Sunday","value":"7"}];
		$scope.serv=function(){
			$scope.cat=[];
			// console.log($scope.selectedDepartments);
			// console.log($scope.departments);
			for(var i=0;i<$scope.selectedDepartments.length;i++){
				for(var j=0;j<$scope.selectedDepartments[i].categories.length;j++){
				$scope.cat.push($scope.selectedDepartments[i].categories[j]);
				}
			}
		};
		$scope.serv1=function(){
			$scope.services=[];
			// console.log($scope.selectedCats);
			for(var i=0;i<$scope.selectedCats.length;i++){
				for(var j=0;j<$scope.selectedCats[i].services.length;j++){
				$scope.services.push($scope.selectedCats[i].selectedCats[j]);
				}
			}
		};
		$scope.serv2=function(){
			// console.log($scope.shortServices);
			$scope.shortServices.forEach(function(element) {
				if(finalServiceIds.indexOf(element.serviceId>-1)){
					$scope.finalServices.push(element);
				}
			});
			
		};
		$scope.sub=function(){
			/*console.log($scope.offer);
			var newServices = [];
			$scope.offer.services.forEach(function(s){
				newServices.push({
					name : s.name,
					categoryId : s.categoryId,
					serviceId : s.serviceId
				});
			});*/
			// $scope.offer.services = newServices;
			$http.post("/role2/offers", $scope.tempoffer).success(function(response, status){
				$scope.offer = {};
				//console.log(response);
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





		}]);
