
'use strict';

angular.module('sbAdminApp', ['ui.calendar','ui.bootstrap','ngTable','daterangepicker'])
.controller('subscriptionQueries', function($scope,$http,$timeout,$state,$stateParams) {
  $scope.name="",
  $scope.phoneNumber="";
  $scope.email="";
  $scope.remarks="";

  $scope.page = 1;
  $scope.total_count = 0;
  $scope.itemsPerPage = 20;
  $scope.initialiseIt={};

  $scope.contacted=["Contacted","Converted"];
  $scope.selectedContacted="Contacted";

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
      $state.go('dashboard.subscriptionQueriess');
    }
    else {
      $state.go('dashboard.razorPayNonSubscriber');
    }
  }
  $http.get("/beuApp/loggedInCustomerCare").success(function(response) {
    $scope.customerCareId=response.data.userId;
    $scope.customerCareName=response.data.userName;
  });
  $http.post("/beuApp/getSubscriptionQueries",{page:1}).success(function(response) {
      console.log(response);
      $scope.subscriptionQuery=response.data.clients;
      console.log($scope.subscriptionQuery);
        $scope.total_count =response.data.total_count;
  });
  $scope.conversionSelection=function() {

    console.log($scope.selectedContacted);
    if($scope.selectedContacted=='Contacted'){
      $scope.subscriptionQuery={};
      $scope.initialiseIt={};

      $http.post("/beuApp/getSubscriptionQueries",{page:1}).success(function(response) {
          console.log(response);
          $scope.subscriptionQuery=response.data.clients;
          console.log($scope.subscriptionQuery);
            $scope.total_count =response.data.total_count;
            $scope.getData(1);
      });
      }
    if($scope.selectedContacted=='Converted'){
      $scope.initialiseIt={};
      $scope.subscriptionQuery={};
      $http.post("/beuApp/subscriptionConverted",{page:1}).success(function(response) {
          console.log(response);
          $scope.subscriptionQuery=response.data.clients;
          $scope.total_count = response.data.total_count;
          $scope.getData(1);

      })
    }

  }
  $scope.submit=function(){
      var query={
        name: $scope.name,
        phoneNumber:$scope.phoneNumber,
        email:$scope.email,
        queryText:$scope.remarks,
        queryType:1,
        customerCareName:$scope.customerCareName,
        customerCareId:$scope.customerCareId
      }
      console.log(query);
      $http.post("/beuApp/websiteQuery",query).success(function(response) {
        alert(response.data);

      })
      $http.post("/beuApp/getSubscriptionQueries",{page:1}).success(function(response) {
          console.log(response);
          $scope.subscriptionQuery=response.data.clients;
          console.log($scope.subscriptionQuery);
            $scope.total_count =response.data.total_count;
      });
  }
  $scope.getData=function(page) {
    console.log(page);
    if($scope.selectedContacted=='Contacted'){
      $scope.initialiseIt={};
      $scope.subscriptionQuery={};
      $http.post("/beuApp/getSubscriptionQueries",{page:page}).success(function(response){
        console.log("gedData",response);
        $scope.subscriptionQuery=response.data.clients;
        $scope.total_count=response.data.total_count;

      });
    }
    if($scope.selectedContacted=='Converted'){
      $scope.subscriptionQuery={};
      $scope.initialiseIt={};
      $http.post("/beuApp/subscriptionConverted",{page:page}).success(function(response) {
          console.log(response);
          $scope.subscriptionQuery=response.data.clients;
          $scope.total_count = response.data.total_count;
      })
    }
  }

})
