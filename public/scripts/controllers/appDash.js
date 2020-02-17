angular.module('sbAdminApp',['ui.calendar', 'ui.bootstrap','isteven-multi-select','daterangepicker','ngSanitize', 'ngCsv'])
    .controller('appDashCtrl', function($scope, $http) {
    
    console.log("Download Dashboard");
    

    var thisWeekMon = new Date();
    var day = thisWeekMon.getDay() || 7; 
    if( day !== 1 )               
    thisWeekMon.setHours(-24 * (day - 1));   
                                             
 
    var lastWeekMon = new Date();
    var preday = lastWeekMon.getDay() || 7; 
       lastWeekMon.setHours(-24 * (preday + 6))
      
        
    console.log(new Date().setHours(-24 * (preday + 6)));
    $scope.dateRangeSelected = {startDate: moment(lastWeekMon), endDate: moment(thisWeekMon)};
   
        console.log("last-Week-Mon", $scope.dateRangeSelected.startDate._d);
        console.log("this-Week-Mon", $scope.dateRangeSelected.endDate._d);
        $http.post("/role1/downloadDashboard",{"startDate":$scope.dateRangeSelected.startDate._d,"endDate":$scope.dateRangeSelected.endDate._d}).success(function(response){
            $scope.datas = response.data;
            console.log($scope.datas);
            $scope.show =true;
        });
      $scope.applyFilter=function(){
            console.log("Change function called");
            console.log( $scope.dateRangeSelected);
             //$scope.showText =true;
        $http.post("/role1/downloadDashboard",{"startDate":$scope.dateRangeSelected.startDate._d,"endDate":$scope.dateRangeSelected.endDate._d}).success(function(response){
            $scope.datas = response.data;
            console.log($scope.datas);
             $scope.show =true;
        });

    }
      
      
 });