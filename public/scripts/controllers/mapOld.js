'use strict';

angular.module('sbAdminApp', ['isteven-multi-select','ui.bootstrap','daterangepicker','ngMap','ngSanitize','ngTable'])

.controller('map',
    function($scope,$http, $window,NgMap,NgTableParams) {
// $scope.a=["jkfsjdkj","hsjdhjsbd"]
      $scope.travellerlist=[];
      $scope.selectedTravellerlist=[];
      $scope.travellerlistToBeSent=[];
      $scope.parlorMarkerProperties=  {
                  url: 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1504787297/Webp.net-resizeimage_qydcqj.png',
                  size: [20, 32],
                  origin: [0,0],
                  anchor: [0, 32]
                };
      $scope.endPathMarkerProperties=  {
                  url: 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1504879985/Webp.net-resizeimage_4_lzppgo.png',
                  size: [20, 32],
                  origin: [0,0],
                  anchor: [0, 32]
                }
      $scope.pathMarkerProperties={
                  url: 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1504881221/oie_IUo7Lx2z0egx_1_guagxs.png',
                  size: [20, 32],
                  origin: [0,0],
                  anchor: [0, 32]
      };
      $scope.dateRangeSelected='';
      $scope.dateRangeSelected = {startDate: moment().startOf('month'), endDate: moment()};
      $scope.tableData=[];
      $scope.center="28.6814284, 77.2226866";
      $scope.calculateCenter=function () {
        if($scope.mapDataMultiple.length==1){
          $scope.center=""+$scope.mapDataMultiple[0].path[0].toString();
        }
        else{
          $scope.center="28.6814284, 77.2226866";
        }
      }
      $http.get("/beuApp/getTravelingOps").success(function(response){
          console.log(response);
          $scope.travellerlist=response.data;
          for (var i = 0; i < $scope.travellerlist.length; i++) {

            if($scope.travellerlist[i].lastName==null){
              $scope.travellerlist[i].travellerName=$scope.travellerlist[i].firstName;
            }
            else {
              $scope.travellerlist[i].travellerName=$scope.travellerlist[i].firstName+" "+$scope.travellerlist[i].lastName;
            }


          }
            // console.log("userid",$scope.userId);
            $scope.selectEmployee=function () {
              $scope.travellerlistToBeSent=[];
              for (var i = 0; i < $scope.selectedTravellerlist.length; i++) {
                $scope.travellerlistToBeSent.push($scope.selectedTravellerlist[i]._id);
                }
              console.log($scope.travellerlistToBeSent);
              console.log($scope.dateRangeSelected.startDate._d);
              console.log($scope.dateRangeSelected.endDate._d);
              $http.post("/beuApp/plotMapFull",{userIds:$scope.travellerlistToBeSent,startTime:$scope.dateRangeSelected.startDate._d,endTime:$scope.dateRangeSelected.endDate._d}).success(function(response){

                $scope.mapDataMultiple=response.data;
                $scope.parlorMarkers=response.parlors;
                console.log("single  ",$scope.mapDataMultiple[0].path[0].toString());
                // $scope.abs=$scope.mapDataMultiple[0].opsActivity.toString();
                  // $scope.tName=response.data[];
                  // $scope.mapData=response.data.path;
                  // $scope.mapData=response.data.userId;
                  console.log(response);
                  console.log("mapDataMultiple",$scope.mapDataMultiple);
                  $scope.calculateCenter();
                  // console.log($scope.mapDataMultiple[0].opsActivity.toString());
                  console.log($scope.parlorMarkers,"parlor loc");
                  $scope.pathColorGeneratorfunction=function () {
                  $scope.pathColorGenerator='#00'+Math.random().toString(16).slice(-4);
                  // console.log($scope.pathColorGenerator);
                  };


                });

                $http.post("/beuApp/mapTable",{userIds:$scope.travellerlistToBeSent,startTime:$scope.dateRangeSelected.startDate._d,endTime:$scope.dateRangeSelected.endDate._d}).success(function(response){
                    console.log("table data",response);
                    $scope.tableData=response.data;
                    $scope.tableParams = new NgTableParams({}, { dataset: $scope.tableData});
                    // $scope.tableParams = new NgTableParams({},{ dataset:$scope.tableData});
                    // $scope.tableParams = new NgTableParams({}, { dataset: $scope.tableData});

                    // for (var i = 0; i < $scope.tableData.length; i++) {
                    //   if($scope.tableData[i].lastName==null)
                    //   {
                    //     $scope.tableData[i].name=$scope.tableData[i].firstName+"";
                    //   }
                    //   else {
                    //     $scope.tableData[i].name=$scope.tableData[i].firstName+" "+$scope.tableData[i].lastname;
                    //   }
                    // }
                  });

            };


        });
        // $http.post("/beuApp/plotMap").success(function(response){
        //
        //   });




    });
