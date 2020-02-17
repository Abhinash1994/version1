'use strict';

angular.module('sbAdminApp', ['isteven-multi-select','ui.bootstrap','daterangepicker','ngMap','ngSanitize','ngTable','uiGmapgoogle-maps'])
.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        libraries: 'geometry,visualization'
    });
  })
.controller('map', function($scope,$http,$state, uiGmapGoogleMapApi,NgTableParams) {
        $scope.asd="sdjedj";
       $scope.map = {center: {latitude: 28.6814284, longitude: 77.2226866 }, zoom: 12, bounds: {}};
       $scope.pathColorGenerator='#00'+Math.random().toString(16).slice(-4);
       $scope.stroke={color: $scope.pathColorGenerator}
       $scope.travellerlist=[];
       $scope.selectedTravellerlist=[];
       $scope.travellerlistToBeSent=[];
       $scope.dateRangeSelected='';
       $scope.dateRangeSelected = {startDate: moment().startOf('month'), endDate: moment()};
       $scope.tableData=[];
       $scope.map = {center: {latitude: 28.6814284, longitude: 77.2226866 }, zoom: 12, bounds: {}};
       $scope.pathIcon={
               icons: [{
                   icon: {
                       path: google.maps.SymbolPath.FORWARD_OPEN_ARROW
                   },
                   offset: '25px',
                   repeat: '50px'
               }]

       };

      $scope.pathColorGeneratorfunction=function () {

        for (var i = 0; i < $scope.mapData.length; i++) {
          $scope.pathColorGenerator='#00'+Math.random().toString(16).slice(-4);
          $scope.poly=[{
            stroke:
              {
                color:$scope.pathColorGenerator,
                weight:2
              }


          }];
          $scope.mapData[i].stroke=$scope.poly[0].stroke;

        }
      //   $scope.mapData[0].stroke=$scope.poly[0].stroke;
      //   console.log(  $scope.mapData);
      //
      // console.log($scope.poly);
      };
      $http.get("/beuApp/getTravelingOps").success(function(response){

        $scope.travellerlist=response.data;
        console.log("travellerlist ",$scope.travellerlist);
        for (var i = 0; i < $scope.travellerlist.length; i++) {

          if($scope.travellerlist[i].lastName==null){
            $scope.travellerlist[i].travellerName=$scope.travellerlist[i].firstName;
          }
          else {
            $scope.travellerlist[i].travellerName=$scope.travellerlist[i].firstName+" "+$scope.travellerlist[i].lastName;
          }
        }

        $scope.selectEmployee=function() {
          $scope.travellerlistToBeSent=[];
          for (var i = 0; i < $scope.selectedTravellerlist.length; i++) {
            $scope.travellerlistToBeSent.push($scope.selectedTravellerlist[i]._id);
            }
            $http.post("/beuApp/plotMapFull",{userIds:$scope.travellerlistToBeSent,startTime:$scope.dateRangeSelected.startDate._d,endTime:$scope.dateRangeSelected.endDate._d}).success(function(response) {
              console.log(response);
              $scope.mapData=response.data;
              console.log("mapdata",  $scope.mapData);
              for (var i = 0; i < $scope.mapData.length; i++) {

                if($scope.mapData[i].lastName==null)
                {
                  $scope.mapData[i].name=$scope.mapData[i].firstName;
                }
                else {
                  $scope.mapData[i].name=$scope.mapData[i].firstName+ " "+$scope.mapData[i].lastName;
                }

              }
              $scope.mapParlors=response.parlors;

            });

            var giveUniqueCount = function(parlorVisited){
              var uniqueArray = [];
              for(var i = 0; i < parlorVisited.length; i++){
                if(uniqueArray.indexOf(parlorVisited[i]) > -1){
                }else{
                  uniqueArray.push(parlorVisited[i]);
                }
              }
              return uniqueArray.length;
            }

            $http.post("/beuApp/mapTable",{userIds:$scope.travellerlistToBeSent,startTime:$scope.dateRangeSelected.startDate._d,endTime:$scope.dateRangeSelected.endDate._d}).success(function(response){
                $scope.tableData = response.data;

                console.log(response)

                for (var i = 0; i < $scope.tableData.length; i++) {
                  for (var j = 0; j < $scope.tableData[i].visitData.length; j++) {
                    var parlorsVisited = [];
                      for(var k = 0; k < $scope.tableData[i].visitData[j].travelData.length; k++){
                        parlorsVisited.push($scope.tableData[i].visitData[j].travelData[k].parlorId);
                      }//3rd
                    $scope.tableData[i].visitData[j].parlorsVisited = giveUniqueCount(parlorsVisited);
                    parlorsVisited = [];
                  }//2nd
                }//1st

                $scope.tableParams = new NgTableParams({}, { dataset: $scope.tableData});
                $scope.viewForm=function(parent,index) {
                  console.log($scope.tableData[parent].visitData[index].formId);
                  $state.go('dashboard.viewOpsFormDetails',{formId:$scope.tableData[parent].visitData[index].formId});
                  // $http.post("/beuApp/getform",{formId:$scope.tableData[parent].visitData[index].formId}).success(function(response) {
                  //   console.log(response,"new data");
                  // })
                }
              });

        }

      });

      //  uiGmapGoogleMapApi.then(function(){
       //
       //
      //  });

   });
