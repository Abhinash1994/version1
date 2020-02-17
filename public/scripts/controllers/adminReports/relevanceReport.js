'use strict';

angular.module('sbAdminApp', ['ui.calendar','ui.bootstrap','daterangepicker','ngSanitize','ngTable'])
.controller('relevanceReportCtrl', function($scope,$http,$timeout) {
    $scope.selectedCity=4
    $scope.category=5;
     var today=new Date();
        $scope.dateRangeSelected = {startDate: moment().startOf('month'), endDate: moment()};
        // console.log($scope.dateRangeSelected.startDate)
          
    $http.get("/role1/relevanceReport").success(function(response, status) {
    $scope.data = response;
     // console.log(response);

});


  $scope.buttonclick=function() {
    console.log("url","/role1/relevanceReport?startDate="+$scope.dateRangeSelected.startDate._d,
                    'endDate='+$scope.dateRangeSelected.endDate._d )
    $http.post('/role1/relevanceReport',{'startDate':$scope.dateRangeSelected.startDate._d,'endDate':$scope.dateRangeSelected.endDate._d}).success(function(response, status) {
      $scope.data = response;
      $scope.originalData = response;
       console.log("final",response);
  
  });
  }
  $scope.cityChanged=function(city){
    console.log("salon changed",city)
    var temp=angular.copy($scope.originalData);
    if(city!=4){
      var res=temp.filter(function(sal){return sal.cityId==city});
      $scope.data=res;
      console.log("final data",$scope.data)
    }
  }
  $scope.selectedCategory=function(category){
    console.log("category changed",category)
    var temp=angular.copy($scope.originalData)
    if(category==4){
      var res=temp.filter(function(sal){return sal.parlorType==4});
      
    }else if(category==1){
      var res= temp.filter(function(sal){return (sal.parlorType==0 || sal.parlorType==1 || sal.parlorType==2)})
    }
    $scope.data=res;
    console.log("final data",$scope.data);

  }
  $scope.selectorChanged=function(city,category){
    var temp=angular.copy($scope.originalData)
    console.log("salon changed",city,category);
    var res=angular.copy($scope.originalData)
    if(category==4){
       res=temp.filter(function(sal){return sal.parlorType==4});
      temp=res
      
    }else if(category==1){
       res= temp.filter(function(sal){return (sal.parlorType==0 || sal.parlorType==1 || sal.parlorType==2)});
       temp=res
    }
    if(city!=4){
       res=temp.filter(function(sal){return sal.cityId==city});
      
      console.log("final data",$scope.data)

    }
    $scope.data=res;
    console.log("final data",$scope.data);
  }



});
