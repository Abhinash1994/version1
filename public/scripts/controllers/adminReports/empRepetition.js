angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','isteven-multi-select','daterangepicker','ngSanitize', 'ngCsv'])
    .controller('empReptCtrl', function($scope, $compile, $http, $timeout, $window, $log,NgTableParams,Excel, $timeout) {
    // console.log("Emp rept ");
    
        $scope.selectedParlor=[];
    $scope.parlorIdsToBeSent=[];
    $http.post("/role1/allParlors").success(function(response, status){
    $scope.parlors = response.data;
        // console.log($scope.parlors);
    });
    
    $scope.changeParlor=function(){
           //console.log($scope.selectedParlor);
    $scope.parlorIdsToBeSent=[];
        for(var i=0;i<$scope.selectedParlor.length;i++){
            $scope.parlorIdsToBeSent.push($scope.selectedParlor[i].parlorId);
            }
            //console.log( $scope.parlorIdsToBeSent);
            }
    
    var today=new Date();
    
    $scope.dateRangeSelected={
            startDate:{'_d':new Date(today.getFullYear(),today.getMonth(),1)},
            endDate:{'_d':new Date().toJSON()}
        }

            // console.log( $scope.dateRangeSelected);
    
     $http.post("/role1/report/empRepetitionReport",{"startDate":$scope.dateRangeSelected.startDate._d,"endDate":$scope.dateRangeSelected.endDate._d}).success(function(response){
         // console.log(response);
        $scope.datas = response;
        
    });
    
     $scope.applyFilter=function(){
            // console.log("Change function called");
            // console.log($scope.parlorIdsToBeSent);
            // console.log($scope.dateRangeSelected.startDate._d);
            // console.log($scope.dateRangeSelected.endDate._d);
         
           $http({
                    method: 'POST',
                    url: '/role1/report/empRepetitionReport',
                    data:{
                        'selectedParlor':   $scope.parlorIdsToBeSent,
                        'startDate':   $scope.dateRangeSelected.startDate._d,
                        'endDate':  $scope.dateRangeSelected.endDate._d
                    }   
                    }).success(function(response){
                        // console.log(response);
                        $scope.datas = response;
                    }); 
      
     }
    
})