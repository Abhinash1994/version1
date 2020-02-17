angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','isteven-multi-select'])

    .controller('Salon-support-reportCtrl', function ($scope,$rootScope, $compile, $http, $timeout, $window, $log,NgTableParams,Excel, $timeout) {
           // console.log($rootScope.parlorId)
             $scope.parlorId=$rootScope.parlorId;
            // console.log($scope.parlorId);
         

            // console.log("this is saolons report")
            $scope.selectedParlor ={};

                // $scope.changeParlor = function(selectedParlor){
                //     $scope.selectedParlor = selectedParlor;
                //     console.log( $scope.selectedParlor)
                // }
            $scope.userType=userType;
                var id= $rootScope.parlorId;
           
            // console.log(id)
            // console.log($scope.userType)
            $scope.month=[{"name":"January","value":0},
                    {"name":"February","value":1},
                    {"name":"March","value":2},
                    {"name":"April","value":3},
                    {"name":"May","value":4},
                    {"name":"June","value":5},
                    {"name":"July","value":6},
                    {"name":"August","value":7},
                    {"name":"September","value":8},
                    {"name":"October","value":9},
                    {"name":"November","value":10},
                    {"name":"December","value":11}]
            $scope.year=['2017','2018','2019','2020','2021','2022','2023','2024','2025'];
            $scope.item1=$scope.year[0];
            $scope.shortOrExcess=function(amount,usage){
                if(usage>amount){
                    return "Excess"
                }else if(usage<amount){
                    return "Short"
                }else{
                    return "-"
                }
            }

            // $scope.item1=$scope.year[1]
         
             $http.post("/role1/parlorList").success(function(response, status) {

                        // console.log(response);
                         $scope.parlors = response.data;
                })
            
                $scope.parlorChanged=function(selectedParlor){

                // console.log($scope.item)
              
                // $scope.item=$scope.month[3];
                var month=[];
                 $scope.selectedMonth.forEach(function(m){
                        month.push(m.value)
                 })
                 // console.log("auto save  chala")
                 // console.log("selected month is",month);
            

                console.log("obj",{'parlorId':$scope.selectedParlor.selectedParlor,'month':month,'year':Number($scope.item1)})

             // $http.post("/role1/salonSupportReport",{'parlorId':$scope.selectedParlor.selectedParlor,'month':month,'year':Number($scope.item1)}).success(function(response) {

             //            console.log(response);
             //            $scope.parlorsdata=response.data;
             //            $scope.d1=response.data.supportTypes[0];
             //            $scope.d2=response.data.supportTypes[1];
             //            $scope.d3=response.data.supportTypes[2];

             //            console.log($scope.d1);
             //            console.log($scope.d2);
             //            console.log($scope.d3);
                        

             // })
             var url=''
              // console.log($scope.userType);
             if($scope.userType==1){
          
               url='/role1/salonSupportReport?parlorId='+$scope.selectedParlor.selectedParlor+'&month='+month +'&year='+Number($scope.item1)
              // console.log(url);
             }
             else{
               url='/role3/salonSupportReport?parlorId='+$scope.parlorId+'&month='+month +'&year='+Number($scope.item1)
                    // console.log(url);
             }

                 $http.get(url).success(function(response) {

                        // console.log(response);


                        $scope.parlorsdata=response.data;
                        $scope.d1=response.data.supportTypes[0];
                        $scope.d2=response.data.supportTypes[1];
                        $scope.d3=response.data.supportTypes[2];

                        // console.log($scope.d1);
                        // console.log($scope.d2);
                        // console.log($scope.d3);

                        var salonDriven=$scope.parlorsdata.supportTypes[1].usageThisMonth-$scope.parlorsdata.supportTypes[1].totalUsageAllowed
                        var beuDriven=$scope.parlorsdata.supportTypes[2].usageThisMonth-$scope.parlorsdata.supportTypes[2].totalUsageAllowed+$scope.parlorsdata.supportTypes[0].usageThisMonth-$scope.parlorsdata.supportTypes[0].totalUsageAllowed
                        var salon=Math.max(salonDriven,0);
                        $scope.balance=beuDriven+salon;
                        if($scope.balance>0){
                        $scope.finalBalanceText="Payable"
                        }else if($scope.balance<0){
                            $scope.finalBalanceText="Receivable"
                        }
                        

             })
         }
      

    });

