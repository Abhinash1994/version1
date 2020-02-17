'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # LeaveController
 * Controller of the sbAdminApp
 */

angular.module('sbAdminApp')
    .controller('notifcationCtrl',['$scope','$http','NgTableParams', function($scope, $http, NgTableParams) {
        // console.log('notifications controller');
        
          $scope.categories = [{'name': 'Recommendation', 'val':'recommendation'},
        {'name': 'Offer', 'val':'offer'},
        {'name': 'Login Based', 'val':'loginBased'},
        {'name': 'Add to Cart ', 'val':'cartBased'},
        {'name': 'Review', 'val':'review'},
        {'name': 'Freebie', 'val':'freebie'},
        {'name': 'Profile', 'val':'profile'},
        {'name': 'Update', 'val':'update'},
        {'name': 'Subscription', 'val':'subscription'},
        {'name': 'Preference', 'val':'preference'},
        {'name': 'Coupon', 'val':'coupon'},
        ]
        $scope.sendNotification=function(){
            
            // console.log("submit notification");
            // console.log($scope.not);
            if($scope.not.simage == null){
                $scope.not.simage=' ';
            }
            if($scope.not.limage == null){
                $scope.not.limage=' ';
            }
            
            $http.post("/role1/notificationChanges", {title :$scope.not.title,type:$scope.not.type, text : $scope.not.androidText, text1 :$scope.not.iosText, sImage : $scope.not.simage, lImage:$scope.not.limage ,testingNumber:$scope.not.testingPhoneNumber}).success(function(response){
                    // console.log(response);
                    alert(response);
                })
        }

    }]);
