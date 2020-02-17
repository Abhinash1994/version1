'use strict';

angular.module('sbAdminApp')
    .controller('recommendation',['$scope','$http', function($scope, $http) {
        // console.log('Recomdation controller');
        $scope.data = {};
        $scope.dat= {};
        $scope.show = true;
        $scope.shwTable = true;
        $scope.index = 0;
        $scope.serviceCode = [];

         $scope.serviceDetails1=[];
        $scope.data.serviceIds = [];
    
        
         $scope.submitService= function(){
            $scope.shwTable = false;

            // console.log("you called services");
             
                if($scope.dat.service != ""){
            $http.get("/api/serviceName?serviceCode="+ $scope.dat.service ).success(function(response, status){
                $scope.serviceDetails  = response.data; 
                // console.log(response)
                //   console.log($scope.serviceDetails);
                  $scope.serviceDetails.forEach(function(dat){
                        $scope.serviceDetails1.push(dat)
                         $scope.dat.service = '';
                  })
                
            });
        }
        }
        
        $scope.sendRecommendation= function(){

                 $scope.serviceDetails1.forEach(function(servid){
                   $scope.data.serviceIds.push({"Code":servid.serviceCode, "id":servid._id});
                    $scope.serviceCode = [];
                    })

            // console.log($scope.data );
              $http.post("/role1/createRecommendation", $scope.data).success(function(response){
                        // console.log(response);
                     
                        alert("Successfully Submited");
                        $scope.data = {};
                        $scope.serviceDetails1=[];
                    });
            
            }
      

    }]);
