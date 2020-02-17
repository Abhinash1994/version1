'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # LeaveController
 * Controller of the sbAdminApp
 */

angular.module('sbAdminApp')
    .controller('adminAdhar',['$scope','$http','Upload','NgTableParams','$timeout','pdfDelegate',function($scope, $http,Upload,NgTableParams,$timeout,pdfDelegate) {
        $scope.flag=false;
            $scope.submitFlag=false;
            $scope.sendOtpFlag=false;
            $scope.verifyOtpFlag=false;
            $scope.pdfFile={"file":null};
            $scope.parlors=null;
            $scope.selectedParlor=null;
            $scope.pdfFilePath=null;
            $scope.aadhaarCard={};
            $http.get('/role1/getParlorList')
            .then(function(response){

                $scope.parlors=response.data.data
                    // console.log(response.data.data)


            });

      $scope.parlorChange=function(){
          $scope.flag=false;
      }
    
    $scope.uploadPdf = function(file) {


        // console.log(file)
      $scope.upload = Upload.upload({
      url: '/role1/uploadPdf',
      data: {
          parlorId: $scope.aadhaarCard.parlorId,

         file: $scope.pdfFile.file
    },
    });
     $scope.upload.then(function (response) {
         // console.log(response);
        if(response.data.success==true){
            $scope.submitFlag=true
            $scope.sendOtpFlag=true;

            // console.log($scope.aadhaarCard.path);
            $scope.flag=true;
            $scope.aadhaarCard.parlorId="";
            $scope.pdfFile={};



        }
                // console.log(response)

    });

}
   $scope.sendOTPFun=function(){

     
     $http.post('/role1/aadhharSendOtp',{uid:$scope.aadhaarCard.uid})
            .then(function(response){
               // console.log(response)
               $scope.sendOtpFlag=false;
               $scope.verifyOtpFlag=true;

            });
   }
   $scope.sendVerifyFun=function(){
     
      $http.post('/role1/aadhaarVerifyOtp',$scope.aadhaarCard)
            .then(function(response){
               // console.log(response)
               $scope.sendOtpFlag=false;
                 $scope.verifyOtpFlag=false;
                 $scope.submitFlag=false;

            });
     // console.log($scope.aadhaarCard)

   }

    }]);
