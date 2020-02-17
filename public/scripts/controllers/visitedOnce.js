'use strict';

angular.module('sbAdminApp', ['ui.calendar','ui.bootstrap','ngTable','daterangepicker'])
.controller('visitedOnce', function($scope,$http,$timeout,$state,$stateParams) {
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

  $scope.formats = ['EEEE,d,MMMM,yy'];
  $scope.format = $scope.formats[0];
  $scope.users = [];
  $scope.parlors=[];
  $scope.page = 1;
  $scope.total_count = 0;
  $scope.itemsPerPage = 20;
  $scope.parlorList={};
  $scope.dateRangeSelected='';
  $scope.dateRangeSelected = {};
  $scope.remark="";
  $scope.selected="";
  $scope.lastTotal={};
  $scope.showPrice=null;

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
  d.setDate(d.getDate() - 90);
  $scope.limitDate=d;

  $http.get("/beuApp/getAllParlors").success(function(response) {
    var allObj={
        _id:"all",
        name:"All"
      }
    response.data.unshift(allObj);
    $scope.parlors=response.data;
    $scope.parlorList.selected=allObj;
  });

  $http.get("/beuApp/loggedInCustomerCare").success(function(response) {
    $scope.customerCareId=response.data.userId;
    $scope.customerCareName=response.data.userName;
  });

  $http.post("/beuApp/notVisitedFromThreeMonths",{page:1,parlorId:"all"}).success(function(response){
    $scope.users = response.data.notVisitedFromThreeMonths;
    $scope.total_count = response.data.total_count;
  });

  $scope.lastServiceTotal=function(index) {
      $scope.lastTotal=$scope.users[index];
      console.log($scope.lastTotal);
      $http.post("/beuApp/lastServiceTotal",{clientId:$scope.lastTotal.clientId}).success(function(response) {
        console.log(response);
        $scope.users[index].showPrice=true;
        $scope.users[index].serviceTotal = response.data;
      })
  }

  $scope.submitButton=function() {
    $scope.getData(1);
      if($scope.users.length==0){
        $scope.noData=true;
      }else {
        $scope.noData=false;
      }
    }

  $scope.getData=function(page) {

    if(Object.keys($scope.dateRangeSelected).length == 0){
      var query = {page:page ,parlorId:$scope.parlorList.selected._id};
    }else{
      var query = {page:page,startDate:$scope.dateRangeSelected.startDate._d,endDate:$scope.dateRangeSelected.endDate._d,parlorId:$scope.parlorList.selected._id};
    }

    $http.post("/beuApp/notVisitedFromThreeMonths", query).success(function(response){
      $scope.users = response.data.notVisitedFromThreeMonths;
      console.log("response",$scope.users);
      if($scope.users.length==0){
        $scope.noData=true;
      }
      else {
        $scope.noData=false;
      }
      $scope.total_count = response.data.total_count;
    });
  }

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
            lastVisitedParlorId:$scope.editRow.lastVisitedParlorId,
            lastVisited:$scope.editRow.lastVisited,
            expectedOn:$scope.dt,
            clientName:$scope.editRow.clientName,
            lastVisitedParlorName:$scope.editRow.parlorName
          }).success(function(response){
            for (var i = 0; i < $scope.users.length; i++) {
              if($scope.users[i]._id==$scope.editRow._id){
                $scope.users.splice(i,1);
              }
              $scope.disabled=false;
              $scope.editRow="";
              $scope.selected="";
              $scope.dt="";
              $scope.remark="";
            }
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

  $scope.services=function(index) {
    console.log("user",$scope.users[index]);
    $scope.clientName=$scope.users[index].clientName;
    $scope.clientPhoneNumber=$scope.users[index].phoneNumber;
    $scope.lastVisited=$scope.users[index].lastVisited;
    $scope.lastVisitedParlorName=$scope.users[index].parlorName;
    $http.post("/beuApp/getServices",{clientId:$scope.users[index].clientId}).success(function(response) {
        $scope.servicesRow=response.data[0].services;
    });
  }

});
