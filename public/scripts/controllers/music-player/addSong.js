'use strict';

angular.module('sbAdminApp', ['ui.calendar','ui.bootstrap'])
.controller('addSong', function($scope,$http,$timeout,$state){
  $scope.hideTextarea=null;
  $scope.imageUrl="";
  $scope.editImageUrl={};
  $scope.editSongUrl={};
  $http.get("/mp3/songs").success(function(response){
    // console.log(response);
    $scope.submittedSongs=response.data.songs;
    // console.log("$scope.submittedSongs",$scope.submittedSongs);
  });

  $scope.submitSong=function() {
    var query={
      name:$scope.songName,description:$scope.songDescription,imageUrl:$scope.songImage,songUrl:$scope.songUrl
    }
    $http.post("/mp3/addSong",query).success(function(response) {
      // console.log(response);
      alert("Successfully Updated");
      $http.get("/mp3/songs").success(function(response){
        // console.log(response);
        $scope.submittedSongs=response.data.songs;
       // console.log("$scope.submittedSongs",$scope.submittedSongs);
        $scope.songName="";
        $scope.songDescription="";
        $scope.songImage="";
      });
    })
  }
  $scope.edit=function(index) {
    $scope.hideTextarea=index;
    $scope.editRow=$scope.submittedSongs[index];
    // console.log($scope.editRow);
    $scope.editImageUrl.val=$scope.editRow.imageUrl;
  }

  $scope.save=function(index) {
    // console.log($scope.editRow.songId);
    // console.log($scope.editImageUrl);
    // console.log($scope.editSongUrl)
    var query={
      _id:$scope.editRow._id,
      imageUrl:$scope.editImageUrl.val,songUrl:$scope.editSongUrl.val
    }
    // console.log(query);
    $scope.hideTextarea=null;
    $http.post('/mp3/editSong',query).success(function(res){
       // console.log(res);
        alert(res.data);
        $scope.editImageUrl={};
        $http.get("/mp3/songs").success(function(response){
          $scope.submittedSongs=response.data.songs;
        //  console.log("$scope.submittedSongs Aftr edit",$scope.submittedSongs);
          $scope.editImageUrl={};
        });

    })

  }


});
