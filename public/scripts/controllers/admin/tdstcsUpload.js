angular.module('sbAdminApp', ['ngCsvImport'])
.controller('tdstcsUpload',function($scope, $http) {

    $scope.seperator=","
    $scope.uploadData=function(data){
        console.log("data",data);
        var finalData=[];
        data.forEach(function(element) {
            finalData.push({parlorId:element[0],tds:element[1],tcs:element[2]})
        }, this);
        console.log("final data",finalData);
        $http.post('/role1/updateTDSTCS',{data:finalData}).success(function(response){
            alert("Updated Successfully")
        })
    }
});