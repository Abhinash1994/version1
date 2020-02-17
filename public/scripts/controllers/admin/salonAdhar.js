'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # LeaveController
 * Controller of the sbAdminApp
 */

angular.module('sbAdminApp')
    .controller('salonAdhar',['$scope','$http','Upload','NgTableParams','$timeout','pdfDelegate',function($scope, $http,Upload,NgTableParams,$timeout,pdfDelegate) {
        $scope.pdfFile=null;
        $scope.flag=false;
        $scope.parlors=null;
        $scope.selectedParlor={ id:null};
        $scope.sendOtpFlag=true;
        $scope.verifyOtpFlag=false;
        $scope.show=false;
        $scope.viewData=[];
        $scope.aadhaarCard={};
        $http.get('/role1/getParlorList').then(function(response){
          $scope.parlors=response.data.data
            // console.log(response.data.data)
          });
        $http.get('/role3/getUnsignedParlorMous').then(function(response){
          // console.log(response);
          $scope.pdfUrl=(response.data.data);
          // console.log($scope.pdfUrl);
          $scope.show=true;
        });
        $scope.loadData=function(parlor){
          // console.log(parlor)
          
          }
        $scope.sendOTPFun=function(){
            $scope.flag=false;
          // console.log($scope.aadhaarCard)
          $http.post('/role3/aadhharSendOtp',{uid:$scope.aadhaarCard.uid}).then(function(response){
             // console.log(response)
             $scope.sendOtpFlag=false;
             $scope.verifyOtpFlag=true;
          });
        }
        $scope.sendVerifyFun=function(){
          // console.log($scope.aadhaarCard);
          $scope.aadhaarCard.path=$scope.pdfUrl;
          $http.post('/role3/aadhaarVerifyOtp',$scope.aadhaarCard).then(function(response){
            // console.log(response)
            $scope.aadhaarCard={};
            $scope.sendOtpFlag=true;
            $scope.verifyOtpFlag=false;
            $scope.flag=true;

              $http.get('/role3/getUnsignedParlorMous').then(function(response){
                  // console.log(response);
                  $scope.pdfUrl=(response.data.data);
                  // console.log($scope.pdfUrl);
                  $scope.show=false;
              });
          });
        }
         /*$scope.pdfUrl = 'https://persist.signzy.tech/api/files/479068/download/VEFLX4wtBpJgTwWIA3Anxa467GxcyM09sBRsEOOeiK3tphKg99.pdf';*/
    }]);
