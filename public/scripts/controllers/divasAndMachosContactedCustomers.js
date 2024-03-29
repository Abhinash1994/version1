'use strict';

angular.module('sbAdminApp', ['ui.calendar','ui.bootstrap','ngTable','daterangepicker'])
.controller('divasAndMachosContactedCustomers', function($scope,$http,$timeout,$state,$stateParams) {

      $scope.page = 1;
      $scope.total_count = 0;
      $scope.itemsPerPage = 20;
      $scope.initialiseIt={};

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

      $scope.categoryButton=function(categoryName) {
        if(categoryName=='Not Contacted'){
          $state.go('dashboard.visitedOnce');
        }else if (categoryName=='Contacted') {
          $state.go('dashboard.visitedOnceContacted');
        }else if (categoryName=='Converted'){
          $state.go('dashboard.visitedOnceConverted');
        }
        else{
          $state.go('dashboard.visitedOnceReports');
        }
      }

      $http.get("/beuApp/loggedInCustomerCare").success(function(response) {
        $scope.customerCareId=response.data.userId;
        $scope.customerCareName=response.data.userName;
      });

      $http.post("/beuApp/dmCustomers",{page:1}).success(function(response){
        console.log(response);
        $scope.dmData=response.data.clients;
        $scope.total_count = response.data.total_count;

          // $scope.getData(1);
      });
      $scope.getData=function(page) {
        console.log(page);
        $http.post("/beuApp/dmCustomers",{page:page}).success(function(response){
          console.log(response);
          $scope.dmData=response.data.clients;
          $scope.count=response.data.total_count;

        });
        $scope.total_count =$scope.count;
      }
      $scope.services=function(index) {
        console.log("user",$scope.dmData[index]);
        $scope.clientId=$scope.dmData[index].clientId
        console.log($scope.clientId);
        $scope.clientName=$scope.dmData[index].name;
        $scope.clientPhoneNumber=$scope.dmData[index].phoneNumber;
        $scope.lastVisited=$scope.dmData[index].lastVisited;
        $scope.lastVisitedParlorName=$scope.dmData[index].parlorName;
        $http.post("/beuApp/getServices",{clientId:$scope.clientId}).success(function(response) {
            console.log(response);
            $scope.servicesRow=response.data[0].services;
        });
          $scope.servicesRow="";
      }
      $scope.editButton=function(index) {
        $scope.editRow=$scope.dmData[index];
        $scope.clientId=  $scope.editRow.clientId;
        if($scope.editRow.clientId==undefined){
          $scope.phoneNumber=$scope.editRow.phoneNumber;
        }
        console.log($scope.editRow);

      }
      $scope.saveButton=function($index){
        if($scope.editRow.clientId==undefined){
          var tempObj = {customerCareId:$scope.customerCareId,phoneNumber:$scope.phoneNumber,customerCareName:$scope.customerCareName,remark:$scope.remark,callStatus:$scope.selected,expectedOn:$scope.dt}


        }else{
          var tempObj = {customerCareId:$scope.customerCareId,clientId:$scope.clientId,customerCareName:$scope.customerCareName,remark:$scope.remark,callStatus:$scope.selected,expectedOn:$scope.dt}
        }

        $http.post("/beuApp/dmContactClient",tempObj).success(function(response) {
          console.log(response);
          alert(response.data);
        });

      }
});
