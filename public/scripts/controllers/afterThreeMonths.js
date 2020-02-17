'use strict';

angular.module('sbAdminApp', ['ui.calendar','ui.bootstrap','ngTable','daterangepicker'])
.controller('afterThreeMonths', function($scope,$http,$timeout,$state,$stateParams) {
  $scope.noData=false;

  $scope.page = 1;
  $scope.total_count = 0;
  $scope.itemsPerPage = 20;
  $scope.parlorListPrevious={};
  $scope.parlorListLast={};
  $scope.initialiseIt ={};
  
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
  $scope.dateOptions = {
         datepickerMode: "'month'",
         minMode: 'month'
     };

  $scope.today = function() {
  $scope.dt = new Date();
  console.log($scope.dt);
};

  $scope.b=[""]
  $scope.today();
  $scope.popup1 = {
  opened: false
  };

  $scope.formats = ['MMMM,yy'];
  $scope.format = $scope.formats[0];

   $scope.open1 = function() {
   $scope.popup1.opened = true;
  };
  $scope.currentMonth = $scope.dt.getMonth();
  console.log($scope.currentMonth);
  $scope.currentYear = $scope.dt.getFullYear();
  console.log($scope.currentYear);

  $scope.buttonclick=function() {
    $scope.currentMonth = $scope.dt.getMonth();
    console.log($scope.currentMonth);
    $scope.currentYear = $scope.dt.getFullYear();
    console.log($scope.currentYear);
    $scope.getData($scope.page);

  }

  $http.get("/beuApp/getAllParlors").success(function(response) {
    var allObj={
        _id:"all",
        name:"All"
      }
    response.data.unshift(allObj);
    $scope.parlors=response.data;
    $scope.parlorListPrevious.selected=$scope.parlors[0];
    $scope.parlorListLast.selected=$scope.parlors[0];
    console.log($scope.parlorListPrevious.selected);
    console.log("all parlors",$scope.parlors);
  });
$http.post("/beuApp/randomConversion",{page:1,previousParlorId:"all",lastParlorId:"all",month:$scope.currentMonth,year:$scope.currentYear}).success(function(response){
  console.log(response);
  $scope.conversionData=response.data.clients;
  if ($scope.conversionData.length==0) {
    $scope.noData=true;
  }
  else {
    $scope.noData=false;

  }
  $scope.total_count=response.data.total_count;
})

$scope.parlorSelection=function() {
  console.log("last",$scope.parlorListLast.selected);
  console.log("prev",$scope.parlorListPrevious.selected);

  $scope.getData($scope.page);

}

$scope.getData=function(page) {
  console.log(page);
  $scope.page=page;
  var query={
    page:page,
    lastParlorId:$scope.parlorListLast.selected._id,
    previousParlorId:$scope.parlorListPrevious.selected._id,
    month:$scope.currentMonth,
    year:$scope.currentYear
  }
  console.log(query);

  $http.post("/beuApp/randomConversion",query).success(function(response){

    console.log(response);
    $scope.conversionData=response.data.clients;
    if ($scope.conversionData.length==0) {
      $scope.noData=true;
    }
    else {
      $scope.noData=false;

    }
    $scope.count=response.data.total_count;
    $scope.total_count =$scope.count;
  });
  // $scope.total_count =$scope.count;
}


});
