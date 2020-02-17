angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','isteven-multi-select','daterangepicker','ngSanitize', 'ngCsv'])
.controller('apptsOfRelevance', function($scope, $http, Excel, $timeout) { 
var today=new Date();
$scope.freeHairCutFlag=1;
  $scope.today = function() {
  $scope.dt = new Date();
};

  $scope.b=[]
  var today=new Date();
  $scope.dateRangeSelected = {startDate: moment().startOf('month'), endDate: moment()};
  // console.log($scope.dateRangeSelected.startDate)
$http.get("/beuApp/getParlors")
.success(function(res){
            // console.log(res);
            $scope.parlors=res.data;
            $scope.selectedSalon=$scope.parlors[0]._id
})

$scope.callApi=function(){
    var query={parlorId:$scope.selectedSalon,'startDate':$scope.dateRangeSelected.startDate._d,'endDate':$scope.dateRangeSelected.endDate._d}
    $http.post("/role1/relevanceReportSalonWise", query).success(function(response, status) {
        $scope.data = response;
        // console.log(response);
        $scope.appointments = response[0].distanceApps;
    });
}
});