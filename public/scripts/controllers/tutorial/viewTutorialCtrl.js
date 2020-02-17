angular.module('sbAdminApp')
    .controller('viewTutorialCtrl', function($scope,$position, $http, $state,NgTableParams,$stateParams,$sanitize) {
    
    $scope.categoryId=$stateParams.chapterId;
    // console.log($scope.categoryId);
    
    $http({
        url:"/role3/chapterTabs", 
        method: "GET",
        params: {chapterId:$scope.categoryId}
    }).success(function (result) {
        // console.log(result);
        $scope.tabs=result.data;
        $http({
            url:"/role3/tabContent", 
            method: "GET",
            params: {tabId:$scope.tabs[0].tabId}
        }).success(function (result) {
            $scope.htmlVariable=result.data.content;
            // console.log(result);
        });
    });
    
    $scope.tabSelected=function(tabId){
        // console.log(tabId);
        $http({
            url:"/role3/tabContent", 
            method: "GET",
            params: {tabId:tabId}
        }).success(function (result) {
            $scope.htmlVariable=result.data.content;
            // console.log(result);
        });
    }
    
    
    
    
});