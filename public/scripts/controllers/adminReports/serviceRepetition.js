angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','isteven-multi-select','daterangepicker','ngSanitize', 'ngCsv'])
    .controller('servReptCtrl', function($scope, $compile, $http, $timeout, $window, $log,NgTableParams,Excel, $timeout) {
    
    // console.log("serv rept");
    
        $scope.selectedParlor=[];
    $scope.parlorIdsToBeSent=[];
    $http.post("/role1/allParlors").success(function(response, status){
    $scope.parlors = response.data;
        // console.log($scope.parlors);
    });
    
    $http.post("/role1/report/serviceRepetitionReport").success(function(response){
         // console.log(response);
    //$scope.datas = response.data;
        
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
    
    $scope.dateRangeSelected = {startDate: moment().startOf('month'), endDate: moment()};

            // console.log( $scope.dateRangeSelected);
    

    
    
    
     $scope.applyFilter=function(){
            // console.log("Change function called");
            // console.log($scope.parlorIdsToBeSent);
            // console.log($scope.dateRangeSelected.startDate._d);
            // console.log($scope.dateRangeSelected.endDate._d);
         
          $http({
                    method: 'POST',
                    url: '/role1/report/serviceRepetitionReport',
                    data:{
                        'selectedParlor':   $scope.parlorIdsToBeSent,
                        'startDate':   $scope.dateRangeSelected.startDate._d,
                        'endDate':  $scope.dateRangeSelected.endDate._d
                    }   
                    }).success(function(response){
                        // console.log(response);
                    }); 
      
     }
    
})