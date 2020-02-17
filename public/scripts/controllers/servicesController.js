'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('ServicesCtrl', function($scope,$position, $http, $state) {
    $scope.categories = [];
    $scope.supercategories = [];
    $http.post("/role1/categoryList").success(function(response, status){
        console.log(response);
        $scope.categories = response.data;
    });
    $http.post("/role1/getSubCategory").success(function(response, status){
        console.log(response);
        $scope.subcategories = response.data;
    });

    $http.get("/role1/supercategory").success(function(response, status){
        $scope.supercategories = response.data;
        console.log($scope.supercategories);
    });

    $scope.addCategory = function(){
        $http.post("/role1/createCategory", $scope.data).success(function(response, status){
            $scope.categories.push(response.data);
            $scope.data  = {};
            $('#addCategory').modal('hide');
        });
    };

    $scope.addSuperCategory = function(){
        console.log($scope.s);
        $http.post("/role1/createSuperCategory", $scope.s).success(function(response, status){
            $scope.supercategories.push($scope.s.name);
            $http.get("/role1/supercategory").success(function(response, status){
                $scope.supercategories = response.data;
                console.log($scope.supercategories);
            });
            $scope.s  = {};
            $('#addSuperCategory').modal('hide');
        });
    }
    $scope.editDepartment = function(){
        console.log($scope.dep);
        $http.put("/role1/superCategory", $scope.dep).success(function(response, status){
            $('#editSuperCategory').modal('hide');
        });
    }

    $scope.gotoServices = function(categoryId, name, superCategory, sort, maleImage, femaleImage){
          $state.go('dashboard.add-service', {categoryId: categoryId, categoryName : name, superCategory : superCategory, sort : sort, maleImage : maleImage, femaleImage : femaleImage});
    };
    $scope.openEditPopup=function(index){
        $scope.dep=$scope.supercategories[index];
        $('#editSuperCategory').modal('show');
        console.log(dep);
        
        
    }
    $scope.addSubCategory=function(){
        console.log("here")
        console.log($scope.sub);
        $http.post("/role1/createSubCategory", $scope.sub).success(function(response, status){
            $('#addSubCategory').modal('hide');
            $scope.subcategories.push($scope.sub);
        });
    }
  });
