'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp',['textAngular'])
    .controller('uploadTutorialCtrl', function($scope,$position, $http, $state,NgTableParams) {

// console.log("chal gaya");
    $scope.dat={};
    $scope.dat.selectedChapter="";
$http.get("/role1/chapters").success(function(response, status){
    $scope.chapters=response.data;
    // console.log("get api chali")
    // console.log($scope.chapters)
});

    $scope.chapterChanged=function(){
        // console.log("funtion chala");
        // console.log($scope.dat.selectedChapter);
        $http({
            url:"/role1/chapterTabs", 
            method: "GET",
            params: {chapterId:$scope.dat.selectedChapter}
        }).success(function (result) {
            // console.log(result);
            $scope.tabs=result.data;
            $scope.dat.selectedTab=result.data[0].tabId;
            $http({
                url:"/role1/tabContent", 
                method: "GET",
                params: {tabId:$scope.dat.selectedTab}
            }).success(function (result) {
                // console.log(result);
                $scope.htmlVariable=result.data.content;
                 console.log(result.data.content);
            });
            
        });
        
    }
    $scope.addTab = function(){
        
        $('#addTab').modal('show');
        
    };
    $scope.submitTab=function(){
        var data ={
            chapterId: $scope.tabInNewChapter,
            title:$scope.newChapterName
        };
        // console.log(data);
        $http.post('/role1/chapterTab', data)
            .success(function (data, status, headers) {
            // console.log("sdas");
            $('#addTab').modal('hide');
            $http({
                url:"/role1/chapterTabs", 
                method: "GET",
                params: {chapterId:$scope.dat.selectedChapter}
            }).success(function (result) {
                // console.log(result);
                $scope.tabs=result.data;
            });
            
        });
    }
    $scope.tabChanged=function(){
        console.log($scope.dat.selectedTab);
        $http({
            url:"/role1/tabContent", 
            method: "GET",
            params: {tabId:$scope.dat.selectedTab}
        }).success(function (result) {
            $scope.htmlVariable=result.data.content;
            console.log(result);
        });
    };
    
    $scope.submit=function(){
        console.log($scope.htmlVariable);
        
        var data ={
            content: $scope.htmlVariable,
            tabId:$scope.dat.selectedTab
        };

        $http.put('/role1/tabContent', data)
            .success(function (data, status, headers) {
            // console.log("sdas");
        });
          
    }
    
    
    
});
