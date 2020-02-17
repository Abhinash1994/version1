angular.module('sbAdminApp',['ui.bootstrap']).controller('subscribersAttendance',function($scope,$http,$timeout){
    // console.log("Subscriotn reports");
        $http.get("/role1/report/lowSubscribersAttendanceUsers").success(function(response, status){
            // console.log(response);
            $scope.report1=response;
            $scope.totalSalonSubscribers=0;
        });
    
})