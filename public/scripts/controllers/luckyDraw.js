'use strict';


angular.module('sbAdminApp', ['ui.bootstrap','isteven-multi-select'])

    .controller('luckyDraw',['$scope','$http',
        function($scope,$http, $stateParams, $window,NgTableParams) {
            $scope.selectedParlor='';
            $scope.selectedWeek='';
            $scope.employee=[];
            $scope.selectedEmployee=[];
            $scope.parlorData={};
            $scope.finalData=[];
            $scope.addFlag=false;
            console.log("working");
            $http.post("/employee/getParlorAndWeek").success(function(response, status){
                console.log("get",response.data);
                $scope.initData=response.data;
                $scope.initData.weekweekData.name1=new Date($scope.initData.weekweekData.name.firstDate).toDateString()+"-"+new Date($scope.initData.weekweekData.name.lastDate).toDateString();

            });
            $http.post("/employee/getWeeks").success(function(response, status){

                console.log(response);
                $scope.week = response.data;

                            });


                $scope.getEmployee=function(){
                    $scope.addFlag=true;
                    $scope.send={"pId":$scope.selectedParlor};
                    console.log($scope.send);
                    $http.post("/employee/getEmployees",$scope.send).success(function(response, status){
                    var temp=[];
                        response.data.forEach(function (o) {

                            temp.push({name:o.firstName,lastName:o.lastName,eId:o._id});



                        });

                        console.log(temp);

                    $scope.employee=temp;

                   
          });

        };
                $scope.changeParlor=function () {
                    console.log($scope.selectedEmployee);

                };
                    $scope.add=function () {
                        if ( $scope.selectedParlor == '' || $scope.selectedEmployee== '' ) {
                        alert("select options")
                    }else{

                        $scope.parlorName = '';
                        $scope.initData.parlorList.forEach(function (m) {
                            if (m._id == $scope.selectedParlor) {
                            $scope.parlorName = {name:m.name,pId:m._id};
                        }

                    });
                    $scope.parlorData["weekNumber"] = $scope.initData.weekweekData.weekNumber;
                    $scope.parlorData["weekDate"] = $scope.initData.weekDate;
                    $scope.parlorData["parlorId"] = $scope.parlorName.pId;
                    $scope.parlorData["parlorName"] = $scope.parlorName.name;
                    $scope.parlorData["employees"] = $scope.selectedEmployee;
                    $scope.parlorData["amount"] = $scope.amount;
                    $scope.finalData.push($scope.parlorData);
                    $scope.parlorData = {};
                    console.log($scope.finalData);
                    $scope.addFlag=false;
                    }


                }
                $scope.submit=function () {
                    console.log("sumbit",$scope.finalData);
                    $http.post("/employee/saveLuckyDraw1",  $scope.finalData).success(function(response, status){


                            $scope.finalData=[];
                            $scope.parlorData = {};
                            $scope.amount='';
                            $scope.employee=[];
                        $scope.initData=[];
                        $http.post("/employee/getParlorAndWeek").success(function(response, status){

                            console.log("get",response.data);

                            $scope.initData=response.data;
                            $scope.initData.weekweekData.name1=new Date($scope.initData.weekweekData.name.firstDate).toDateString()+"-"+new Date($scope.initData.weekweekData.name.lastDate).toDateString();

                        });


                        $http.post("/employee/getWeeks").success(function(response, status){

                            console.log(response);
                            $scope.week = response.data;
                            console.log($scope.week);

                        });

                    })
                }


}]);


