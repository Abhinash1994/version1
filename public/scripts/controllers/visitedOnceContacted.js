'use strict';

angular.module('sbAdminApp', ['ui.calendar','ui.bootstrap','ngTable','daterangepicker'])
.controller('visitedOnceContacted', function($scope,$http,$timeout,$state,$stateParams) {
  $scope.initialiseIt={}
  $scope.medium=["Three Months","Coupon"];
  $scope.selectedMedium=$scope.medium[0];
  $scope.fromWhere=0;
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
  // $scope.selectedCallStatus="---Select---";
  var d = new Date();
  $scope.limitDate=d;
  $scope.today = function() {
    $scope.dt ="";
  };

  $scope.b=[""];
  $scope.today();

  $scope.popup1 = {
    opened: false
  };

  $scope.open1 = function(index) {
    $scope.popup1.opened = true;
  };

  $scope.submitButton=function() {
    $scope.getData(1);

    }

  //to get logged in customer care
  $http.get("/beuApp/loggedInCustomerCare").success(function(response) {
    $scope.customerCareId=response.data.userId;
    $scope.customerCareName=response.data.userName;
  });
//  to get the selected medium
$scope.mediumSelectedFun=function() {
console.log($scope.selectedMedium);

  if($scope.selectedMedium=="Three Months"){
    $scope.fromWhere=0;
    $scope.getData($scope.page);
  }
  if($scope.selectedMedium=="Coupon"){
    $scope.fromWhere=1;
    $scope.getData($scope.page);
  }
}
//to get the initial page data
	$scope.getData = function(page){

      var query = {};
      query.page = page;
      query.fromWhere=$scope.fromWhere;
      if(Object.keys($scope.dateRangeSelected).length != 0){
        query.startDate = $scope.dateRangeSelected.startDate._d;
        console.log(query.startDate+"startDate"+query.endDate);
        query.endDate = $scope.dateRangeSelected.endDate._d;
      }

      if($scope.selectedCallStatus != "---Select---"){
        query.callStatus = $scope.selectedCallStatus;
      }

      console.log(query);

      $http.post("/beuApp/contactedClients",query).success(function(response){
        $scope.users = response.data.clients;
        $scope.total_count = response.data.total_count;
        console.log("contacted ppl",response);
        if($scope.users.length==0){
          $scope.noData=true;
        }else {
          $scope.noData=false;
        }
      });

	};

	$scope.getData($scope.page);


//to edit the rows of clients
  $scope.editButton=function(index) {
    $scope.editRow=$scope.users[index];
      $scope.disabled=false;
  }

  // to save the rows
  $scope.saveButton=function(index) {
        if($scope.remark==""){
          alert("Please add a remark");
          return false;
        }
        if($scope.selected==undefined){
          alert("Please Select Call Status");
          return false;
        }

        $http.post("/beuApp/contactClient",{
          customerCareId:$scope.customerCareId,
          customerCareName:$scope.customerCareName,
          remark:$scope.remark,
          callStatus:$scope.selected,
          clientId:$scope.editRow.clientId,
          clientPhoneNumber:$scope.editRow.phoneNumber,
          lastVisited:$scope.editRow.lastVisited,
          expectedOn:$scope.dt
        }).success(function(response){
          console.log(response);
          $scope.res=response;
          $scope.disabled=false;
          $scope.editRow="";
          $scope.selectedCallStatus="";
          $scope.dt="";
          $scope.remark="";
          $scope.getData($scope.page);
          $scope.disabled=true;

          alert($scope.res.data);
    });

  }
     $('.fade').click(function(){
       $scope.servicesRow="";
     });

     $scope.closeFunction=function (toClose) {

         if(toClose == "history"){
           console.log("historyclose");
         }
         if(toClose == "services"){
           console.log("serviceclose");
         }
         if(toClose == "edit"){
           console.log("editclose");
         }

     }


//to view contact history
  $scope.history=function(index) {
    $scope.historyRow=$scope.users[index];
  }

  $scope.services=function (index) {
      $scope.clientName=$scope.users[index].clientName;
      $scope.clientPhoneNumber=$scope.users[index].clientPhoneNumber;
      $scope.lastVisited=$scope.users[index].lastVisited;
      $scope.lastVisitedParlorName=$scope.users[index].lastVisitedParlorName;
      $http.post("/beuApp/getServices",{clientId:$scope.users[index].clientId}).success(function(response) {
          $scope.servicesRow=response.data[0].services;
      });
  }

});
