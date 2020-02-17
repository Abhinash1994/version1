angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','isteven-multi-select','daterangepicker','ngSanitize', 'ngCsv'])
    .controller('OnlineAppointmentPattern', function($scope, $http,$timeout) {
    // console.log("coupan code");
      $scope.today = function() {
    $scope.dt = new Date();
  };

  $scope.b=[""]
  $scope.today();
   $scope.popup1 = {
    opened: false
  };

     $scope.formats = ['EEEE,d,MMMM,yy'];
     $scope.format = $scope.formats[0];

    $scope.open1 = function() {
    $scope.popup1.opened = true;
  };
$scope.buttonclick=function() {

  // console.log($scope.dt);
  $http.post("/beuApp/onlineAppointmentPattern",{date:$scope.dt}).success(function(response){
  // console.log(response);

  $scope.weekData=response.data;
  });
}


})
