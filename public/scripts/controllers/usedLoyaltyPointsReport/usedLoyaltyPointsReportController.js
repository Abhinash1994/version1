/**
 * Created by Manisha on 7/22/2017.
 */
/**
 * Created by Manisha on 7/21/2017.
 */
/**
 * Created by Manisha on 7/21/2017.
 */
angular.module('sbAdminApp', ["ngJsonExportExcel",
    'ui.bootstrap', 'ngDragDrop',
    'isteven-multi-select',
    'daterangepicker','nvd3'
]).controller("usedLoyaltyPointsCtrl",function($scope,$http,Excel,$timeout) {
$scope.data=[];
$scope.data1=[];
$scope.loyaltyUsedFirst=[];

    $scope.f=[];


    $http.post("/role1/loyaltyUsed").success(function(data){
        // console.log(data)
        data.data.forEach(function(m,i){

                if(m._id=="Above 5000"){
                    $scope.data[4]=m
                }

                else {

                    $scope.f = []

                    $scope.f.push(parseInt(m._id.split('-')));
                    if ($scope.f[0] == 0) {
                        $scope.data[0] = m;
                    }
                    else if ($scope.f[0] == 500) {
                        $scope.data[1] = m;
                    }

                    else if ($scope.f[0] == 1000) {
                        $scope.data[2] = m;
                    }
                    else if ($scope.f[0] == 2000) {
                        $scope.data[3] = m;
                    }


                }
            // console.log($scope.f);
        })
        // console.log($scope.f);

    })

    $scope.data=[]

    $http.post("/role1/loyaltyUsedSecond").success(function(data){

        // console.log(data)
        data.data.forEach(function(m,i){

            $scope.data1.push(m);

        })



    })

$http.post("/role1/loyaltyUsedFirst").success(function(data){
        // console.log(data);

    data.data.forEach(function(a){
                $scope.loyaltyUsedFirst.push(a);
    })
        
    
    })





})