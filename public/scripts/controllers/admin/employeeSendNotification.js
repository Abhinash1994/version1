'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # LeaveController
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
    .controller('employeeNotifcationCtrl',['$scope','$http','NgTableParams', function($scope, $http, NgTableParams) {
        // console.log('notifications controller');
        $scope.not={};
        $scope.categories = [
            {'name': 'Lucky Draw', 'val':'luckyDraw'}

        ];

        $scope.not.type= $scope.categories[0].val;

        $scope.sendNotification=function(){

            // console.log("submit notification");
            // console.log($scope.not);
            if($scope.not.simage == null){
                $scope.not.simage=' ';
            }
            if($scope.not.limage == null){
                $scope.not.limage=' ';
            }

            $scope.sendMe={

                tittle:$scope.not.title,
                message:$scope.not.androidText
            }

            $http.post('/employee/sendNotification',$scope.sendMe)
                .success(function (response) {

                    alert("Notification Sent")

                    // console.log(response)

                })
        }

    }]);
