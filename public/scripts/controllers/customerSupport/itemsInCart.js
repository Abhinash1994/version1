'use strict';

angular.module('sbAdminApp', ['ui.calendar','ui.bootstrap','ngTable','daterangepicker'])
.controller('itemsInCart', function($scope,$http,$timeout,$state,$stateParams) {
$scope.initialiseIt={}
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
  else if (categoryName=='itemsInCart'){
    $state.go('dashboard.itemsInCart');
  }
  else {
    $state.go('dashboard.razorPayNonSubscriber');
  }

}

  $scope.callStatus={
    "1":"Easy Convert Customers",
    "2":"Interested with free service",
    "3":"Interested without free service",
    "4":"Not Interested",
    "5":"Frustated",
    "6":"Switch Off / Ringing",
    "7":"Out of Service / Not Reachable",
    "8":"Call Disconnected",
    "9":"Call Back",
    "10":"Salon Shifted",
    "11":"Do Not Call Back"
  };


  $http.get("/role1/servicesInCart").success(function(response) {
    // console.log(response);
    $scope.users=response.data;
    // console.log("yo")
  });



  $scope.submitButton=function() {
     // console.log("hello")
    }


});
