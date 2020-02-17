
'use strict';

angular.module('sbAdminApp', ['ui.calendar','ui.bootstrap','ngTable','daterangepicker'])
.controller('razorPayNonSubscriber', function($scope,$http,$timeout,$state,$stateParams) {

  $scope.remark='';
  $scope.disableSave=false;
  $scope.page = 1;
  $scope.total_count = 0;
  $scope.itemsPerPage = 20;
  $scope.initialiseIt ={};
  $scope.selected="";
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
  // date range

  $scope.formats = ['EEEE,d,MMMM,yy'];
  $scope.format = $scope.formats[0];
$scope.dateRangeSelected={};
  $scope.today = function() {
    $scope.dt ="";

  };
  $scope.b=[""]
  $scope.today();
  $scope.popup1 = {
    opened: false
  };
  $scope.open1 = function(index) {
    $scope.popup1.opened = true;
  };

  var d = new Date();
  d.setDate(d.getDate());
  $scope.limitDate=d;

  // date range

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

  //to get logged in customer care
  $http.get("/beuApp/loggedInCustomerCare").success(function(response) {
    $scope.customerCareId=response.data.userId;
    $scope.customerCareName=response.data.userName;
  });


  $scope.editButton=function(index) {
    $scope.editRow=$scope.nonSubscribers[index];
    console.log($scope.editRow);
    $scope.disableSave=false;
  }
  $scope.dateSelected=function(){
    console.log($scope.dateRangeSelected.startDate._d);
    console.log($scope.dateRangeSelected.endDate._d);
    $http.post("/beuApp/razorPayNoSubscription",{page:1,startDate:$scope.dateRangeSelected.startDate._d,endDate:$scope.dateRangeSelected.endDate._d}).success(function(response) {
      console.log(response);
      $scope.nonSubscribers=response.data.clients;
      $scope.total_count =response.data.total_count;
    })
  }
  $scope.saveButton=function(){
    var query={
      "clientId":$scope.editRow.userId,
      "clientPhoneNumber:":$scope.editRow.phoneNumber,
      "clientName": $scope.editRow.name,
      "customerCareId": $scope.customerCareId,
      "customerCareName": $scope.customerCareName,
      "remark": $scope.remark,
      "callStatus": $scope.selected,
      "expectedOn": $scope.dt
    }
    console.log(query);
    $scope.disableSave=true;
    $http.post("/beuApp/razorPayNoSusbriptionContact",query).success(function(response){
      console.log(response);
      $scope.remark="";
      $scope.dt="";
      $scope.selected="";
      alert(response.data);

    })
  }

  //to get the initial page data
  	$scope.getData = function(page){
      $http.post("/beuApp/razorPayNoSubscription",{page:page,startDate:$scope.dateRangeSelected.startDate._d,endDate:$scope.dateRangeSelected.endDate._d}).success(function(response) {
        console.log(response);
        $scope.nonSubscribers=response.data.clients;
        $scope.total_count =response.data.total_count;
      })
  	};

});
