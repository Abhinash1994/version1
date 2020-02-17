angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','isteven-multi-select','daterangepicker','ngSanitize', 'ngCsv'])
    
.controller('OpsVisitCtrl', function($scope, $http) { 
        // console.log("Ops visit");
        $scope.popup1 = {
            opened: false
        };
        $scope.parlorsSelected=[];
        $scope.popup2 = {
            opened: false
        };
    
        $scope.open1 = function() {
            $scope.popup1.opened = true;
        };
    
        $scope.open2 = function() {
            $scope.popup2.opened = true;
        };
        var today = new Date();
        $scope.dts = new Date(today.getFullYear(),today.getMonth(),1);
        // console.log($scope.dts);
        $scope.dte = new Date();

        $http({
            method: 'POST',
            url: '/role1/allParlors',
        }).success(function(response){
            // console.log(response);
            $scope.parlorList=response.data;
            $scope.parlorsSelected=$scope.parlorList[0];
            
        });
        
        $scope.incentiveModelSelected=1;
        $scope.changeIncentiveModel=function(){
          //  console.log($scope.incentiveModelSelected);
        }
        $scope.changeParlor=function(){
            // console.log($scope.parlorsSelected)
            $scope.parlorsListToBeSent=[];

            for(i=0;i<$scope.parlorsSelected.length;i++){
                $scope.parlorsListToBeSent.push($scope.parlorsSelected[i].parlorId);
            }
            var x= {
                startDate:$scope.dts.toJSON(),
                endDate:$scope.dte.toJSON(),
                parlorIds:$scope.parlorsListToBeSent
            }  
            // console.log(x);
            $http({
                                   method: 'POST',
                                   url: '/employeeApp/getVisitsInParlor',
                                   data:{
                                       startDate:$scope.dts.toJSON(),
                                       endDate:$scope.dte.toJSON(),
                                       parlorIds:$scope.parlorsListToBeSent
                                   }   
                                   })
                             .success(function(response, status){
                       $scope.parlorsData = response.data.data;
                       // console.log(response);
                       // console.log($scope.parlorsData);
                       $scope.header= response.data.weeks;
                   });
        };
        $scope.changeParlor();
        $scope.cellContent=function(salon,week){
            // console.log("salon",salon,week);
            $scope.weekData= salon.filter(s => s._id ==week)[0];
            var text='';
            // console.log($scope.weekData);
            if($scope.weekData){
                $scope.weekData.checkIn.forEach(function(element) {
                    text+=element.user + " checked in for "+ element.checkin/60 +"hours \n " 
                }, this);
             }   
            return text;


        };

    })