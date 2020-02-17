'use strict';

angular.module('sbAdminApp', ['ui.calendar','ui.bootstrap','daterangepicker'])
.controller('websiteQueries', function($scope,$http,$timeout,$state,$stateParams) {

    $scope.page = 1;
    $scope.total_count = 0;
    $scope.itemsPerPage = 20;
    $scope.hideTextarea=null;

  $http.post("/beuApp/getWebsiteQueries",{page:1}).success(function(response) {
      console.log(response);
      $scope.customerQuery=response.data.queries;
      console.log($scope.customerQuery);
        $scope.total_count =response.data.total_count;
  });
  $scope.categoryButton=function(categoryName) {
    if(categoryName=='Not Contacted'){
      $state.go('dashboard.visitedOnce');
    }else if (categoryName=='Contacted') {
      $state.go('dashboard.visitedOnceContacted');
    }else if (categoryName=='Converted'){
      $state.go('dashboard.visitedOnceConverted');
    }
    else if (categoryName=='Reports'){
      $state.go('dashboard.visitedOnceReports');
    }
    else if (categoryName=='divasAndMachosCustomers'){
      $state.go('dashboard.divasAndMachosCustomers');
    }
    else if (categoryName=='afterThreeMonths'){
      $state.go('dashboard.afterThreeMonths');
    }

    else if (categoryName=='Website Queries'){
      $state.go('dashboard.websiteQueries');
    }
    else if (categoryName=='Subscription Queries'){
      $state.go('dashboard.subscriptionQueries');
    }
    else {
      $state.go('dashboard.razorPayNonSubscriber');
    }

  }
  $scope.getData=function(page) {
    console.log(page);
    $http.post("/beuApp/getWebsiteQueries",{page:page}).success(function(response){
      console.log(response);
      $scope.customerQuery=response.data.queries;
      $scope.count=response.data.total_count;

    });
    $scope.total_count =$scope.count;
  }
  $scope.edit=function(index) {
    $scope.hideTextarea=index;
    $scope.editRow=$scope.customerQuery[index];
    console.log($scope.editRow);
  }
  $scope.save=function(index) {
    $scope.hideTextarea=null;
    console.log($scope.editRow.agentResponse);
    $http.post('/beuApp/websiteQueryResponse',{queryId:$scope.editRow._id,agentResponse:$scope.editRow.agentResponse}).success(function(res){
        console.log(res);
    })
  }
});
