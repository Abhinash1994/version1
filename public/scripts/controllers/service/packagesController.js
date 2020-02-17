'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # LeaveController
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp',['nvd3','ui.bootstrap','isteven-multi-select'])
  .controller('PackageCtrl',['$scope','$http','NgTableParams', function($scope, $http,NgTableParams) {

    init();
    var index = 0;

    $scope.updateTotalPrice = function(){
        var price = 0;
        $scope.categories.forEach(function(cat){
            cat.services.forEach(function(s){
              if(s.isSelected) price += s.prices[0].price;
            });
        });
        $scope.newPackageTotalPrice = price;
    };
	
	$scope.category=[];
	$scope.cate=function(){	
		$scope.ser=[];
		$scope.category.forEach(function(cat){
            cat.services.forEach(function(s){
              $scope.ser.push(s);
            });
        });
	};
	

    $scope.openUpdatePackage = function(idx){
		
        $scope.categories = angular.copy(services);
		// console.log($scope.categories);
        $scope.addDialog = false;
        index = idx;
        var packageToEdit = $scope.packages[index];
        $scope.categories.forEach(function(cat){
            cat.services.forEach(function(service){
                packageToEdit.services.forEach(function(s){
                    if(service.serviceId == s.serviceId) {service.isSelected = true;cat.isSelected= true}
                });
            });
        });
		
        $('#addNewPackage').modal('show');
		
        $scope.newPackagePrice = packageToEdit.price;
        $scope.newPackageName = packageToEdit.name;
        $scope.updateTotalPrice();
		$scope.cate();
    };

    $scope.getServiceInText = function(services){
        var text = "";
        services.forEach(function(s){
            text += s.name + ", ";
        });
        return text;
    };

    $scope.addPackage = function(){
        var newPackage = {services : [], price : $scope.newPackagePrice, name : $scope.newPackageName };
        $scope.categories.forEach(function(cat){
            cat.services.forEach(function(s){
              if(s.isSelected) newPackage.services.push(s.serviceId);
            });
        });
        if($scope.addDialog){
          $http.post("/role2/package", {package : newPackage}).success(function(response, status){
              packages.push(response.data);
              $scope.packages = packages;
              initAddPackage();
              $('#addNewPackage').modal('hide');
            });
        }else{
          $http.put("/role2/package", {package : newPackage, packageId : $scope.packages[index].packageId}).success(function(response, status){
            // console.log(response.data);
              packages[index] = response.data;
              $scope.packages = packages;
              $('#addNewPackage').modal('hide');
            });
        }

    };

    $scope.openAddPackage = function(){
        initAddPackage();
        $('#addNewPackage').modal('show');
    };

    function init(){
      initAddPackage();
      $scope.packages = packages;
    }

    function initAddPackage(){
        $scope.categories = angular.copy(services);
        $scope.newPackageTotalPrice = 0;
        $scope.addDialog = true;
        $scope.newPackageName = "";
        $scope.newPackagePrice = "";
    }

  }]);
