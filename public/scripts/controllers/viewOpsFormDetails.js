'use strict';
angular.module('sbAdminApp',[])
.controller('viewOpsFormDetails', function($scope,$state,$stateParams,$http) {

      $scope.formId=$stateParams.formId;
      console.log("mshfjhsanj",$scope.formId);
      $http.post("/beuApp/getForm",{formId:$scope.formId}).success(function(response) {
        $scope.formJSON=response.data;
        console.log(response);
        console.log($scope.formJSON);
        $scope.categoryButton=function(categoryName,index) {
          console.log(categoryName,index);
            $scope.categoryValue={};
            $scope.hasSubcat=false;
            // $scope.hasSubcat=false;
          $scope.color_slider_bar = {
            value: 5,

            options: {
              showSelectionBar: true,
              readOnly:true,
              getSelectionBarColor: function(value) {
                if (value <= 2)
                  return '#c0392b';
                if (value <= 3)
                  return '#d35400';
                if (value <= 5)
                  return '#16a085';
                return '#2AE02A';
              }
            }
          };
          $scope.categoryName=categoryName;
          $scope.categoryValue=$scope.formJSON.questionsData[index];
          if($scope.categoryValue.hasOwnProperty('subCategoryData')){
            $scope.subcategory=$scope.categoryValue.subCategoryData;
            $scope.hasSubcat=true;
            console.log("has subact,$scope.subcategory",$scope.subcategory);
          }
          else{
            $scope.subcategory=$scope.categoryValue;
              $scope.hasSubcat=false;
            console.log("without subcat,$scope.subcategory",$scope.subcategory);
          }
          $scope.subCatTab=function(index) {
            $scope.showData=true;
            $scope.showDataOfEmployee=$scope.subcategory[index] ;
            console.log("$scope.showDataOfEmployee",$scope.showDataOfEmployee);
          };

        }

      });


});
