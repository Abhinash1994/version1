'use strict';

angular.module('sbAdminApp', ['isteven-multi-select','ui.bootstrap','daterangepicker','ngMap','ngSanitize','ngTable'])


.controller('opsFormDetails',
    function($scope,$http, $window,$state,NgMap,NgTableParams) {
      $scope.dateRangeSelected='';
      $scope.dateRangeSelected = {startDate: moment().startOf('month'), endDate: moment()};
      $scope.opsList=[];
      $scope.selectedOpsList=[];
      $scope.opsListToBeSent=[];
      $scope.parlorList=[];
      $scope.selectedParlorList=[];
      $scope.parlorListToBeSent=[];
        $http.get("/beuApp/getOps").success(function(response){
            console.log("Ops list",response);
            $scope.opsList=response.data;
            for (var i = 0; i < $scope.opsList.length; i++) {

              if($scope.opsList[i].lastName==null){
                $scope.opsList[i].opsName=$scope.opsList[i].firstName;
              }
              else {
                $scope.opsList[i].opsName=$scope.opsList[i].firstName+" "+$scope.opsList[i].lastName;
              }


            }
        });
        $http.get("/beuApp/getParlors").success(function(response){
            // console.log("Parlors list",response);
            $scope.parlorList=response.data;
            console.log( $scope.parlorList);
            for (var i = 0; i < $scope.parlorList.length; i++) {
              $scope.parlorList[i].parlorList=$scope.parlorList[i].name;
            }

            $scope.selectEmployee=function(){
              $scope.opsListToBeSent=[];
              $scope.parlorListToBeSent=[];
              for (var i = 0; i < $scope.selectedOpsList.length; i++) {
                $scope.opsListToBeSent.push($scope.selectedOpsList[i]._id);
              }
              for (var i = 0; i < $scope.selectedParlorList.length; i++) {
                $scope.parlorListToBeSent.push($scope.selectedParlorList[i]._id);
              }
              console.log("opsids",$scope.opsListToBeSent);
              console.log("parlorListToBeSent",$scope.parlorListToBeSent);

              $http.post("/beuApp/getFormDetails",{userIds:$scope.opsListToBeSent,parlorIds:$scope.parlorListToBeSent,startTime:$scope.dateRangeSelected.startDate._d,endTime:$scope.dateRangeSelected.endDate._d}).success(function(response){
                  console.log("Ops list",response);
                  $scope.tableData=response.data;
                  // console.log($scope.opsListToBeSent,"$scope.opsListToBeSent");
                  // console.log($scope.parlorListToBeSent,"$scope.parlorListToBeSent");
                    $scope.tableParams = new NgTableParams({}, { dataset: $scope.tableData});

                $scope.viewForm=function(index) {

                  $scope.ownerData={};
                  // $('#viewFormModal').modal('show');
                  console.log("index",index.formId);
                  $scope.formId=index.formId;
                  $state.go('dashboard.viewOpsFormDetails',{formId:$scope.formId});
                }

              });
            };
        });



    });
