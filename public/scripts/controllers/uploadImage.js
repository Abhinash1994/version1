'use strict';

angular.module('sbAdminApp', ['ui.calendar','ui.bootstrap','ngTable','daterangepicker','ngFileUpload'])
.controller('uploadImage', function($scope,$http, Upload, $timeout,$state){
  $scope.images=[];
  $scope.image=[];
  $scope.$watch('files', function () {
      $scope.upload($scope.files);

  });

  $scope.upload = function (files) {
    console.log("working");
    if (files && files.length) {
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            Upload.upload({
                url: 'https://api.cloudinary.com/v1_1/dyqcevdpm/upload',
                fields: {
                    'upload_preset':"l0p6bvst",
                    'tags':'browser_upload'
                },
                file: file
            }).progress(function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                $scope.log = 'progress: ' + progressPercentage + '% ' +
                            evt.config.file.name + '\n' + $scope.log;
            }).success(function (data, status, headers, config) {
                console.log(data)
                $scope.cloudinaryRes={};
                $scope.cloudinaryRes=data;
                $scope.image.push({
                  "appImageUrl":$scope.cloudinaryRes.secure_url,
                  "imageUrl":""
                })
                  $scope.log = 'file: ' + config.file.name + ', Response: ' + JSON.stringify(data) + '\n' + $scope.log;
                  $http.post("role3/parlorImages",{appImageUrl:$scope.cloudinaryRes.secure_url}).success(function(response) {
                    console.log(response);
                    $scope.addImageToObj($scope.image);
              })
            });

        }

    }
};
  $scope.addImageToObj=function(imageUrl) {

    $scope.images=imageUrl;
  }
});
