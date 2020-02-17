'use strict';

angular.module('sbAdminApp', ['ui.calendar','ui.bootstrap','ngTable','daterangepicker'])
.controller('visitedOnceConverted', function($scope,$http,$timeout,$state,$stateParams) {

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
  $scope.callStatus={
    "0":"---Select---",
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

  $scope.users = [];
  $scope.page = 1;
  $scope.total_count = 0;
  $scope.itemsPerPage = 20;
  $scope.formats = ['EEEE,d,MMMM,yy'];
  $scope.format = $scope.formats[0];
  $scope.dateRangeSelected='';
  $scope.dateRangeSelected = {};
  $scope.remark="";
  $scope.selected="";
  $scope.parlorListPrevious={};
  $scope.parlorListLast={};
  var allObj={
      _id:"all",
      name:"All"
    }
  $scope.medium=["Three Months","Coupon","Website Query"];
  $scope.selectedMedium=$scope.medium[0];
  $scope.parlorListPrevious.selected=allObj;
  $scope.parlorListLast.selected=allObj;
  $scope.fromWhere=0;
  $http.get("/beuApp/getAllParlors").success(function(response) {
    response.data.unshift(allObj);
    $scope.parlors=response.data;
  });

  //to get logged in customer care
  $http.get("/beuApp/loggedInCustomerCare").success(function(response) {
    $scope.customerCareId=response.data.userId;
    $scope.customerCareName=response.data.userName;
  });

//to get the initial page data
  $scope.getData = function(page){

    if($scope.fromWhere!=undefined){
      console.log($scope.fromWhere);
    $scope.page=page;
    var query = {
      page : $scope.page,
      fromWhere : $scope.fromWhere,
      previousParlorId : $scope.parlorListPrevious.selected._id,
      lastParlorId : $scope.parlorListLast.selected._id
    }

    $http.post("/beuApp/convertedClients",query).success(function(response){
      console.log(response);
      $scope.users = response.data.clients;
      $scope.total_count = response.data.total_count;
      if($scope.users.length==0){
        $scope.noData=true;
      }else {
        $scope.noData=false;
      }
    });
}
    if($scope.fromWhere==undefined){
      console.log($scope.fromWhere);
      $http.post("/beuApp/websiteQueryConverts").success(function(response) {
        $scope.users = response.data.clients;
        console.log($scope.users);
        $scope.total_count = response.data.total_count;
        if($scope.users.length==0){
          $scope.noData=true;
        }else {
          $scope.noData=false;
        }
      })
    }

  };

// function on changing parlorSelection
$scope.parlorSelection=function() {
  $scope.getData($scope.page);
}

// Get all parlors for select option
$scope.mediumSelectedFun=function() {
console.log($scope.selectedMedium);

  if($scope.selectedMedium=="Three Months"){
    $scope.fromWhere=0;
    $scope.users = [];
    $scope.total_count=0;
    $scope.getData($scope.page);
  }
  if($scope.selectedMedium=="Coupon"){
    $scope.users = [];
    $scope.fromWhere=1;
    $scope.total_count=0;
    $scope.getData($scope.page);
  }
  if($scope.selectedMedium=="Website Query"){
    $scope.users = [];
    $scope.total_count=0;
    $scope.fromWhere=undefined;
    $scope.getData($scope.page);

  }
}

  $scope.getData($scope.page);

//to edit the rows of clients
  $scope.editButton=function(index) {
    $scope.editRow=$scope.users[index];
    $scope.saveButton=function(index) {

          $http.post("/beuApp/contactClient",{
            customerCareId:$scope.customerCareId,
            customerCareName:$scope.customerCareName,
            remark:$scope.remark,
            callStatus:$scope.selected,
            clientId:$scope.editRow._id,
            clientPhoneNumber:$scope.editRow.phoneNumber,
            lastVisited:$scope.editRow.lastVisited,
            expectedOn:$scope.dt
          }).success(function(response){
            console.log(response);
            $scope.disabled=false;
            $scope.editRow="";
            $scope.selected="";
            $scope.dt="";
            $scope.remark="";
            $scope.getData($scope.page);
      });

     $('.closeButton').click();
    }

  }

  $('.fade').click(function(){
    $scope.servicesRow="";
  });

  $('.closeButton').click(function(){
    $scope.servicesRow="";
  });
//to view contact history
  $scope.history=function(index) {
    $scope.historyRow=$scope.users[index];
  }

//to view services used by client
  $scope.services=function (index) {
      console.log($scope.users[index].clientId);
      $scope.clientName=$scope.users[index].clientName;
      $scope.clientPhoneNumber=$scope.users[index].clientPhoneNumber;
      $scope.lastVisited=$scope.users[index].lastVisited;
      $scope.lastVisitedParlorName=$scope.users[index].lastVisitedParlorName;
      $http.post("/beuApp/getServices",{clientId:$scope.users[index].clientId}).success(function(response) {
          $scope.servicesRow=response.data[0].services;
          console.log(response);
      });
  }

});
