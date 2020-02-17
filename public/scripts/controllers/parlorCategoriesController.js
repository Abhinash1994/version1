'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp',['ui.bootstrap','isteven-multi-select'])
  .controller('ParlorCategoriesCtrl', ['$scope', '$position', '$http', '$state','$log','NgTableParams', function($scope,$position, $http, $state, $log, NgTableParams) {
	  
    //var vm = this;
    $scope.isTableVisible = false;
    initVariables();
    getServiceCategories();
    $scope.getServicesById = getServicesById;
	$scope.eop=[1,2,3,4];
	$scope.e=1;
	$scope.activeSuperCategory=0;
    function initVariables(){
        $scope.data = {};
        $scope.role = role;
    }
    var parameters = {
            page : 1
        };

    var settings = {
		sorting: { name: "asc" },
        counts : [],
        dataset: $scope.categories
    };

    $scope.tableParams = new NgTableParams(parameters, settings);
	$scope.inventory = [];
	for(var inv in inventoryItems ){
		$scope.inventory.push(inv.name);
	};
    function getServiceCategories(){
        $scope.categories = [];
        if(role == 2 || role == 7){
            $http.post("/role2/categoryListBySuperCategory").success(function(response, status){
                console.log(response.data)
                $scope.supercategories = response.data;
                $scope.activeSuperCategory = 0;
            });
        }/*else{
            $scope.categories = services.map(function(service){ return {categoryId: service.categoryId, categoryName : service.categoryName};});
        }*/
    }

    $scope.valuechangeed = function(){
        console.log($scope.activeSuperCategory);
    }

    function getServicesById(categoryId, categoryName){
        $scope.isTableVisible = true;
        $scope.services = [];
        $scope.categoryName = categoryName;
        if(role == 2 || role == 7){
            $http.post("/role2/serviceList", {categoryId : categoryId}).success(function(response, status){
                response.data.forEach(function(s){
                    populateEmployees(s.prices);
                });
                $scope.services = response.data;
                console.log($scope.services);
                $log.debug(response.data);
              });
        }
        else{
            log.debug("role 3");
        }
    }
    
    //parlor service ctrl

    function populateEmployees(prices){
      prices.forEach(function(price){
        employees.forEach(function(e){
          var found = false;
          price.employees.forEach(function(emp){
              if(emp.userId == e.userId){
                  found = true;
                  emp.isSelected = true;
              }

          });
          if(!found)price.employees.push(getEmpObj(e));
        });
      });
    }

    function getEmpObj(e){
        return {
            userId : e.userId,
            name : e.name + " - " + e.category,
            isSelected : false,
            commission : 0,
            isSpecialist : true,
        };
    };

    $scope.openUpdateServiceModal = function(service, index){
        $scope.service = angular.copy(service);
		console.log($scope.service);
        $scope.index = index;
        $scope.data.delete = false;
		//$scope.addA=[$scope.service.colorLength,$scope.service.shampooLength,$scope.service.upstyling];
        $scope.data.serviceId = service.serviceId;
        $("#updateServiceModal").modal('show');
		console.log($scope.addA);
    };

    $scope.update = function(){
        postData();
    };

    $scope.remove = function(){
        $scope.data.delete = true;
        postData();
    };
	$scope.ecategory="";
	$scope.employ=employees;
	console.log($scope.employ);
    function postData(){
        $scope.data.prices = [];
        $scope.service.prices.forEach(function(p){
            if(p.price && p.estimatedTime){
                var newP = {priceId : p.priceId, price : p.price, name : p.name, commission : p.commission ,estimatedTime : p.estimatedTime, employees : []};
                p.employees.forEach(function(emp){
                    if(emp.isSelected){
                        newP.employees.push({userId : emp.userId});
                    }
                });
                p.employees = newP.employees;
            }
        });
        $scope.data.prices = $scope.service.prices;
		/*$scope.filteredInventory=function(){
			for(var i=0;i<p.products.length;i++){
				var a = $scope.inventory.indexOf(p.products.name);
			}
		};*/
        console.log($scope.data);
         $http.post("/role2/updateService", $scope.data).success(function(response, status){
             if(!response.error) {
                $scope.data.delete = false;
                 populateEmployees(response.data.prices);
                 console.log(response.data);
                 $scope.services[$scope.index] =  response.data ;
                 initVariables();
                  $http.post("/role3/services").success(function(response, status){
                        services = response.data;
               $('#updateServiceModal').modal('hide');
                        
                    });
             }
         });
		}
		
	$scope.addProduct = function(){
		console.log("drop down");
    };

    $scope.cancel = function(){
        $scope.service = {};
        $scope.data = {};
    };

    $scope.gotoServices = function gotoServices(categoryId, name){
        $state.go('dashboard.parlor-services-by-category', {categoryId: categoryId, categoryName : name});
    }

  }]);
