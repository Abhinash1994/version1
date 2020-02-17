angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','isteven-multi-select'])

    .controller('updatedealprice', function ($scope,$rootScope, $compile, $http, $timeout, $window, $log,NgTableParams,Excel, $timeout) {
        
          
            $scope.selectedParlor ={};
             $scope.male="male";
             $scope.female="female";

            $scope.priceType=[{name:'p1',value:0},{name:'p2',value:1},{name:'p3',value:2},{name:'p4',value:3},{name:'p5',value:4},
            {name:'p6',value:5},{name:'p7',value:6},{name:'p8',value:7},{name:'p9',value:8}]  
            $scope.itemList = [];
           
             $http.post("/role1/parlorList").success(function(response, status) {
                         $scope.parlors = response.data;
                         
                })
            
                $scope.submitdeal=function(selectedParlor){

                    $http.get("/role1/getP1P2?parlorId="+$scope.selectedParlor.selectedParlor).success(function(res){  
                            $scope.dealData=res;
                           
                         })
                }


                $scope.changeByMale=function(categoryId,item){

                var obj={"parlorId":$scope.selectedParlor.selectedParlor,"categoryId":categoryId,"priceType":$scope.itemList.push(item.value),"gender":$scope.male};
                    console.log("final",obj)
                // console.log("final",$scope.genders)
                     // $http.post("/role1/updateDealPriceByP1P2").success(function(res){  
                            
                     //     })
                }

                  $scope.changeByFemale=function(categoryId,item){

                var obj={"parlorId":$scope.selectedParlor.selectedParlor,"categoryId":categoryId,"priceType":$scope.itemList.push(item.value),"gender":$scope.female};
                    console.log("final",obj)
                // console.log("final",$scope.genders)
                     // $http.post("/role1/updateDealPriceByP1P2").success(function(res){  
                            
                     //     })
                }
      

    });

