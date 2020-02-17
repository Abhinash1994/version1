angular.module('sbAdminApp', ['ngCsvImport'])
.controller('uploadpreviousdue',function($scope, $http) {

    $scope.seperator=","
	$http.post('/role1/editRoyalityAmount').success(function(response){
        $scope.salonData=response;
        // console.log("parlors", response)
    })
    $scope.uploadData=function(data){
        console.log("data",data);
        var finalData=[];
        data.forEach(function(element) {
            finalData.push({parlorId:element[0],previousDue:parseInt(element[1])})
        }, this);
        console.log("final data",finalData);
        $http.post('/role1/updatePreviousDue',{data:finalData}).success(function(response){
            alert("Updated Successfully")
        })
    }
});