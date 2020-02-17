'use strict';
/**\
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # LeaveController
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp',[])
    
  .controller('FacebookCtrl',['$scope', '$http', function($scope, $http) {
	 
	 $scope.logginRequired = true;
	 $scope.pages = angular.copy(pages);
	 $scope.selectedPage = {};
	 $scope.content = {};


	$http.get('/role2/facebook/checkLoggedin').success(function(response, status){
		$scope.logginRequired = response.success;
		console.log(response);
	});

	$scope.redirectToLoginPage = function(){
		window.location = '/role2/facebook/consent';
	};

	$scope.pageSelected = function(){
		$http.post('/role2/facebook/pageDetails', JSON.parse($scope.selectedPage.page)).success(function(response, status){
				console.log(response);
				$scope.logginRequired = false;
				pages = [];
				$scope.pages = [];
		});
	};

	$scope.postContent  = function(){
			$http.post('/role2/facebook/postContent', { content : $scope.content.message }).success(function(response, status){
				console.log(response);
				$scope.message = response.message;
				$scope.content = {};
			});
	};
		
  }]);
